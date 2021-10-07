import * as React from "react"
import { FC, useEffect, useRef, useState } from "react"
import Pagination from "../pagination/Pagination"
import { PaginationModel } from "../../models/pagination/pagination.model"
import { PictureModel } from "../../models/files/picture.model"
import { useHistory } from "react-router"
import { http } from "../../util/http"
import { domain } from "../../util/environnement"
import { sendRequest } from "../../util/helpers/refresh"
import "./MediaLibraryContainer.scss"
import Skeleton from "./skeleton/Skeleton"

interface MediaLibraryContainerPropsInterface {
  numberOfImages?: number
  upperPagination?: boolean
  libraryToParent?: (data) => void
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
  const inputEl = useRef<HTMLInputElement>()
  const history = useHistory()

  // Preparing post request for upload of new files in media library
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

  // Calling Post request for file upload media library and verifiy user
  const sendFiles = async () => {
    setImagePending(true)
    let { error } = await sendRequest(request)
    if (error) {
      history.push("/login")
    }
    setImagePending(false)
  }

  // Preparing get request for media library files based on pages
  const imagesRequest = () =>
    http.get<PaginationModel<PictureModel>>(
      `${domain}/v1/file?mimetype=image&page=${page}&limit=${numberOfImages}`,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    )

  // Calling get request for media library files
  const fetchImages = async () => {
    const { data, error } = await sendRequest(imagesRequest)
    if (error) {
      return history.push("/login")
    }
    setPictures(data)
  }

  // pass to parent selected files
  const sendData = () => {
    libraryToParent(filesSelected)
    setFilesSelected([])
  }

  // Verify if file is unique and push it
  const pushFile = (pic) => {
    if (filesSelected.length) {
      filesSelected.forEach(() => {
        if (
          filesSelected.find((currentFile) => currentFile.id === pic.id) ===
          undefined
        ) {
          setFilesSelected([...filesSelected, pic])
        }
      })
    } else {
      setFilesSelected([...filesSelected, pic])
    }
  }

  // Upload files when new ones uploaded
  useEffect(() => {
    if (files.length) sendFiles().then()
  }, [files])

  // Fetch files on component load
  useEffect(() => {
    fetchImages().then()
  }, [page, imagePending])

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
                ref={inputEl}
                onClick={(e) => (e.currentTarget.value = null)}
                onChange={(e) => setFiles([].slice.call(e.target.files))}
              />
            </label>
            <button type="button" className="action" onClick={sendData}>
              Select
            </button>
          </div>
        </div>
        {imagePending && <Skeleton nbFrames={numberOfImages} />}
        {!imagePending && (
          <>
            {pictures && upperPagination && (
              <Pagination meta={pictures.meta} pageSetter={setPage} />
            )}
            <ul>
              {pictures &&
                pictures.data.map((pic) => {
                  return (
                    <li key={pic.id}>
                      <picture>
                        <img
                          src={`${domain}` + pic.uri}
                          alt={pic.caption}
                          id={pic.id}
                          onClick={() => {
                            pushFile(pic)
                          }}
                        />
                      </picture>
                    </li>
                  )
                })}
            </ul>
            {pictures && (
              <Pagination meta={pictures.meta} pageSetter={setPage} />
            )}
          </>
        )}
      </div>
    </>
  )
}

export default MediaLibraryContainer
