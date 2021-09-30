import { FC, useEffect, useState } from "react";
import Pagination from "../pagination/Pagination";
import * as React from "react";
import { PaginationModel } from "../../models/pagination/pagination.model";
import { PictureModel } from "../../models/files/picture.model";
import { useHistory } from "react-router";
import { http } from "../../util/http";
import { domain } from "../../util/environnement";
import { sendRequest } from "../../util/helpers/refresh";
import "./MediaLibraryContainer.scss";
import {
  Button,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";

interface MediaLibraryContainerPropsInterface {
  numberOfImages?: number;
}

const MediaLibraryContainer: FC<MediaLibraryContainerPropsInterface> = ({
  numberOfImages = 30,
}) => {
  const [pictures, setPictures] = useState<PaginationModel<PictureModel>>(null);
  const [page, setPage] = useState(1);
  const history = useHistory();

  const imagesRequest = () =>
    http.get<PaginationModel<PictureModel>>(
      `${domain}/v1/file?mimetype=image&page=${page}&limit=${numberOfImages}`,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );

  const fetchImages = async () => {
    const { data, error } = await sendRequest(imagesRequest);
    if (error) {
      return history.push("/login");
    }
    console.log(data);
    setPictures(data);
  };

  useEffect(() => {
    fetchImages().then();
  }, [page]);

  return (
    <>
      <div className="media-library-container-component">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <InputGroup size="md" width="40%">
            <InputLeftElement
              pointerEvents="none"
              children={<i className="fas fa-search" />}
            />
            <Input type="text" placeholder="Search..." />
          </InputGroup>
          <div>
            <Button colorScheme="blue">ADD</Button>
            <Button colorScheme="blue" style={{ margin: "0 30px" }}>
              SELECT
            </Button>
          </div>
        </div>
        {pictures && <Pagination meta={pictures.meta} pageSetter={setPage} />}
        <ul>
          {pictures &&
            pictures.data.map((pic) => (
              <li key={pic.id}>
                <picture>
                  <Image src={pic.uri} alt={pic.caption} />
                </picture>
              </li>
            ))}
        </ul>
        {pictures && <Pagination meta={pictures.meta} pageSetter={setPage} />}
      </div>
    </>
  );
};

export default MediaLibraryContainer;
