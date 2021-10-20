import Previous from "../previous/Previous";
import { Field, Formik } from "formik";
import {
  imagesSchema,
  productSchema,
} from "../../util/validation/productValidation";
import TextInput from "../inputs/TextInput";
import Select from "../inputs/Select";
import NumberInput from "../inputs/NumberInput";
import { config } from "../../index";
import Slider from "react-slick";
import MediaLibraryContainer from "../media-library/MediaLibraryContainer";
import DraftTestEditor from "../inputs/DraftTextEditor";
import * as React from "react";
import { http } from "../../util/http";
import { TaxRuleGroup } from "../../models/addProduct/add-product.model";
import { sendRequest } from "../../util/helpers/refresh";
import { useState, FC, useEffect } from "react";
import { PaginationModel } from "../../models/pagination/pagination.model";
import { ProductCategoryModel } from "../../models/product/product-category.model";
import { PictureModel } from "../../models/files/picture.model";
import { useHistory, useParams } from "react-router";
import { ProductModel } from "../../models/product/product.model";
import Loading from "../loading/Loading";

interface FormValuesInterface {
  title: string;
  reference: string;
  quantity: number | string;
  stock?: {
    physical: number;
    pending: number;
    incoming: number;
  };
  price: number | string;
  description: string;
  categoryId: string;
  taxRuleGroupId: string;
}

interface ProductFormPropsInterface {
  productId?: string;
  submitButtonContent?: string;
}

const ProductForm: FC<ProductFormPropsInterface> = ({
  productId = null,
  submitButtonContent = "Add product",
}) => {
  const [categoryId, setCategoryId] = useState<string>("");
  const [categoryOptions, setCategoryOptions] = useState<
    ProductCategoryModel[]
  >([]);
  const [taxRuleGroupId, setTaxRuleGroupId] = useState<string>("");
  const [taxOptions, setTaxOptions] = useState<TaxRuleGroup[]>([]);
  const [thumbnail, setThumbnail] = useState<PictureModel | null>(null);
  const [picturesId, setPicturesId] = useState<string[]>([]);
  const [fileError, setFileError] = useState<boolean>(false);
  const [libraryData, setLibraryData] = useState<PictureModel[]>([]);
  const [product, setProduct] = useState<ProductModel>();
  const params: { slug: string } = useParams();
  const history = useHistory();

  let [initialValues, setInitialValues] = useState<FormValuesInterface>({
    title: "",
    reference: "",
    quantity: "",
    price: "",
    description: "",
    categoryId: "",
    taxRuleGroupId: "",
  });

  // Check if image in slide is the thumb
  const isThumb = (thumbId: string, currentImage: string) => {
    if (thumbId === currentImage) return true;
  };

  // Send request data from formik form submit
  const productRequest = (data: { id: string; content: any }) => {
    const requestOptions = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    };
    return data.id
      ? http.patch(
          `${config.api}/v1/product/${data.id}`,
          data.content,
          requestOptions
        )
      : http.post(`${config.api}/v1/product`, data.content, requestOptions);
  };
  const submitProduct = async (data) => {
    const file = {
      picturesId,
      thumbnailId: thumbnail?.id,
    };
    try {
      const isValid = await imagesSchema.validate(file);
      if (isValid) {
        setFileError(false);
        data = { ...data, ...file };
        let { error } = await sendRequest(productRequest, {
          id: productId,
          content: data,
        });
        if (error) {
          console.error(error.message);
          history.push({
            pathname: "/login",
          });
        }
        history.push({
          pathname: "/products",
          state: { success: true },
        });
        history.push("/products");
      }
    } catch {
      setFileError(true);
    }
  };

  // Get request for tax rule group form select
  const requestTax = () => {
    return http.get<PaginationModel<TaxRuleGroup>>(
      `${config.api}/v1/tax-rule-group`,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
  };
  const getTaxRuleGroup = async () => {
    let { data, error } = await sendRequest(requestTax);
    if (error) {
      // TODO show error on client (does not have permission)
      history.push("/login");
    }
    setTaxRuleGroupId(data.data[0].id);
    setTaxOptions([...data.data]);
  };

  // Get request for category form select
  const requestCategory = () => {
    return http.get<PaginationModel<ProductCategoryModel>>(
      `${config.api}/v1/product-category`,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
  };
  const getCategoryGroup = async () => {
    let { data, error } = await sendRequest(requestCategory);
    if (error) {
      // TODO show error on client (does not have permission)
      history.push("/login");
    }
    setCategoryId(data.data[0].id);
    setCategoryOptions([...data.data]);
  };

  // Pass dataof images selected from MediaLibrary component to here
  const libraryToParent = (data: PictureModel) => {
    if (libraryData.find((file) => file.id === data.id) === undefined) {
      setPicturesId((ids) => [...ids, data.id]);
      setLibraryData((ids) => [...ids, data]);
    }
    if (picturesId.length < 1) setThumbnail(data);
  };

  // Remove image from slider
  const removeImage = (id) => {
    setLibraryData((lib) => lib.filter((item) => item.id !== id));
    setPicturesId((picIds) => picIds.filter((picId) => picId !== id));
    setThumbnail(null);
  };

  // Get request for category form select
  const requestProduct = () => {
    return http.get<ProductModel>(`${config.api}/v1/product/${params.slug}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
  };
  const getProduct = async () => {
    let { data, error } = await sendRequest(requestProduct);
    if (error) {
      history.push("/login");
    }
    setInitialValues({
      categoryId: data.category.id,
      taxRuleGroupId: data.taxRuleGroup.id,
      description: data.description,
      price: data.price,
      quantity: data.quantity,
      title: data.title,
      reference: data.reference,
    });
    data.pictures.map((file) => {
      setPicturesId((picture) => [...picture, file.id]);
    });
    setLibraryData((file) => [...file, ...data.pictures]);
    setThumbnail(data.thumbnail);
    setProduct(data);
  };

  // Slider settings
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    vertical: true,
    verticalSwiping: true,
  };

  useEffect(() => {
    getCategoryGroup().then();
    getTaxRuleGroup().then();
  }, []);

  useEffect(() => {}, [thumbnail]);

  // Get product information
  useEffect(() => {
    if (productId) {
      getProduct().then();
    } else {
      setProduct({});
    }
  }, [params.slug]);

  return (
    <>
      {productId && !product && <Loading />}
      {product && (
        <>
          <Previous />
          <div className="product-form">
            <Formik
              initialValues={initialValues}
              validationSchema={productSchema}
              onSubmit={async (data) => {
                await submitProduct(data);
              }}
            >
              {({ setFieldValue, setFieldTouched, handleSubmit, values }) => {
                return (
                  <form onSubmit={handleSubmit}>
                    <div className="top">
                      <div className="inputs">
                        <div className="product">
                          <TextInput name={"title"} label={"Title"} />
                          <TextInput name={"reference"} label={"Reference"} />
                          <Select
                            name={"categoryId"}
                            label={"Category"}
                            options={categoryOptions}
                          />
                        </div>
                        <div className="price">
                          <Select
                            name={"taxRuleGroupId"}
                            label={"Tax"}
                            options={taxOptions}
                          />
                          <NumberInput name={"quantity"} label={"Quantity"} />
                          <NumberInput name={"price"} label={"Price"} />
                        </div>
                      </div>
                      <div className="current-images">
                        <picture>
                          {!thumbnail && (
                            <div
                              className="placeholder"
                              onClick={() => console.log(thumbnail)}
                            >
                              Select an image to set the thumbnail
                            </div>
                          )}
                          {thumbnail && (
                            <div
                              className="placeholder"
                              onClick={() => console.log(thumbnail)}
                            >
                              <img
                                src={`${config.api + thumbnail.uri}`}
                                alt={thumbnail.title}
                              />
                            </div>
                          )}
                        </picture>
                        {!!libraryData.length && (
                          <Slider className="slider" {...settings}>
                            {libraryData.map((image) => (
                              <picture
                                className={`slide ${
                                  isThumb(thumbnail.id, image.id)
                                    ? "is-thumb"
                                    : ""
                                }`}
                                key={image.id}
                                onClick={() => setThumbnail(image)}
                              >
                                <div
                                  className="top-border"
                                  onClick={() => removeImage(image.id)}
                                >
                                  <i className="fas fa-window-close" />
                                </div>
                                <img
                                  src={config.api + image.uri}
                                  alt={image.caption}
                                />
                              </picture>
                            ))}
                          </Slider>
                        )}
                      </div>
                    </div>
                    <div className="pictures">
                      <MediaLibraryContainer
                        numberOfImages={38}
                        upperPagination={false}
                        mini={true}
                        libraryToParent={libraryToParent}
                      />
                      {fileError && <div className="error">Select a file</div>}
                    </div>
                    <div className="description">
                      <Field
                        value={values.description}
                        name="description"
                        component={DraftTestEditor}
                        setFieldValue={setFieldValue}
                        setFieldTouched={setFieldTouched}
                      />
                    </div>
                    <div className="buttons">
                      <button className="action" type="submit">
                        {submitButtonContent ?? "Add product"}
                      </button>
                    </div>
                  </form>
                );
              }}
            </Formik>
          </div>
        </>
      )}
    </>
  );
};

export default ProductForm;
