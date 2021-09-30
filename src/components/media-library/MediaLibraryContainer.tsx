import { FC, useEffect, useState } from "react"
import Pagination from "../pagination/Pagination"
import * as React from "react"
import { PaginationModel } from "../../models/pagination/pagination.model"
import { PictureModel } from "../../models/files/picture.model"
import { useHistory } from "react-router"
import { http } from "../../util/http"
import { domain } from "../../util/environnement"
import { sendRequest } from "../../util/helpers/refresh"
import "./MediaLibraryContainer.scss"

interface MediaLibraryContainerPropsInterface {
  numberOfImages?: number
  upperPagination?: boolean
}

const MediaLibraryContainer: FC<MediaLibraryContainerPropsInterface> = ({
  numberOfImages = 5,
  upperPagination = true,
}) => {
  const [pictures, setPictures] = useState<PaginationModel<PictureModel>>(null)
  const [page, setPage] = useState(1)
  const history = useHistory()

  const imagesRequest = () =>
    http.get<PaginationModel<PictureModel>>(
      `${domain}/v1/file?mimetype=image&page=${page}&limit=${numberOfImages}`,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    )

  const fetchImages = async () => {
    const { data, error } = await sendRequest(imagesRequest)
    if (error) {
      return history.push("/login")
    }
    console.log(data)
    setPictures(data)
  }

  useEffect(() => {
    fetchImages().then()
  }, [page])

  return (
    <>
      <div className="media-library-container-component">
        <div>
          <div>
            <i className="fas fa-search" />
            <input type="text" placeholder="Search..." />
          </div>

          <div className="button-group">
            <button className="action">Add</button>
            <button className="action">Select</button>
          </div>
        </div>
        {pictures && upperPagination && (
          <Pagination meta={pictures.meta} pageSetter={setPage} />
        )}
        <ul>
          {pictures &&
            pictures.data.map((pic) => (
              <li key={pic.id}>
                <picture>
                  <img src={pic.uri} alt={pic.caption} />
                </picture>
              </li>
            ))}
        </ul>
        {pictures && <Pagination meta={pictures.meta} pageSetter={setPage} />}
      </div>
    </>
  )
}

export default MediaLibraryContainer
