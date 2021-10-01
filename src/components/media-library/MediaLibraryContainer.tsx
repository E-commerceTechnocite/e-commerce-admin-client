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
  libraryToParent: (data) => void
}

const MediaLibraryContainer: FC<MediaLibraryContainerPropsInterface> = ({
  numberOfImages = 100,
  upperPagination = true,
  libraryToParent,
}) => {
  const [pictures, setPictures] = useState<PaginationModel<PictureModel>>(null)
  const [page, setPage] = useState(1)
  const [files, setFiles] = useState<File[]>([])
  const [filesSelected, setFilesSelected] = useState<PictureModel[]>([])
  const [imagePending, setImagePending] = useState(false)
  const history = useHistory()

  const request = () => {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append("files", file)
    })
    return http.post(`${domain}/v1/file/upload-bunch`, formData, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
  }

  const sendFiles = async () => {
    let { error } = await sendRequest(request)
    if (error) {
      history.push("/login")
    }
    setImagePending(!imagePending)
  }

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
    setPictures(data)
  }

  const sendData = () => {
    libraryToParent(filesSelected)
  }

  useEffect(() => {
    if (files.length) sendFiles().then()
    setImagePending(!imagePending)
  }, [files])

  useEffect(() => {
    fetchImages().then()
  }, [page, imagePending])

  useEffect(() => {}, [filesSelected])

  return (
    <>
      <div className="media-library-container-component">
        <div>
          <div>
            <i className="fas fa-search" />
            <input type="text" placeholder="Search..." />
          </div>
          <div className="button-group">
            <label htmlFor="myFile" className="action">
              Add
              <input
                type="file"
                id="myFile"
                name="filename"
                style={{ display: "none" }}
                multiple
                onChange={(e) => setFiles([].slice.call(e.target.files))}
              />
            </label>
            <button className="action" onClick={sendData}>
              Select
            </button>
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
                  <img
                    src={`${domain}` + pic.uri}
                    alt={pic.caption}
                    id={pic.id}
                    onClick={() => setFilesSelected([...filesSelected, pic])}
                  />
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
