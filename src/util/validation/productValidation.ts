import * as yup from "yup"

export const productSchema = yup.object().shape({
  title: yup.string().required("Required"),
  reference: yup.string().required("Required"),
  description: yup
    .string()
    .required("Description must be at least 10 characters")
    .min(50, "Description must be at least 10 characters"),
  price: yup
    .number()
    .positive()
    .min(1, "Must be a positive number")
    .required("Required"),
  quantity: yup
    .number()
    .positive()
    .min(1, "Must be a positive number")
    .required("Required"),
  categoryId: yup.string().required(),
  taxRuleGroupId: yup.string().required(),
  picturesId: yup.array().of(yup.string()).required(),
  thumbnailId: yup.string().required("Thumbnail required"),
})

export const imagesSchema = yup.object().shape({})
