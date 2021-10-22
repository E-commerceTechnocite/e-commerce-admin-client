import * as React from "react";
import { FC, useEffect, useRef, useState } from "react";
import Pagination from "../pagination/Pagination";
import { PaginationModel } from "../../models/pagination/pagination.model";
import { PictureModel } from "../../models/files/picture.model";
import { useHistory } from "react-router";
import { http } from "../../util/http";
import { config } from "../../index";
import { sendRequest } from "../../util/helpers/refresh";
import "./MediaLibraryContainer.scss";
import Skeleton from "./skeleton/Skeleton";
import { auth } from "../../util/helpers/auth";
import Granted from "../Granted";

interface MediaLibraryContainerPropsInterface {
  numberOfImages?: number;
  upperPagination?: boolean;
  mini?: boolean;
  libraryToParent?: (data) => void;
}

const MediaLibraryContainer: FC<MediaLibraryContainerPropsInterface> = ({
  numberOfImages = 120,
  upperPagination = true,
  mini = false,
  libraryToParent,
}) => {
  const [pictures, setPictures] = useState<PaginationModel<PictureModel>>(null);
  const [page, setPage] = useState(1);
  const [files, setFiles] = useState<File[]>([]);
  const [filesSelected, setFilesSelected] = useState<PictureModel[]>([]);
  const [imagePending, setImagePending] = useState(false);
  const inputEl = useRef<HTMLInputElement>();
  const history = useHistory();

  /**
   * Returns post request of multiple files
   * @returns request
   */
  const request = () => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    return http.post(`${config.api}/v1/file/upload-bunch`, formData, {
      headers: { ...auth.headers },
    });
  };

  /**
   * Submits post request of multiple files
   */
  const sendFiles = async () => {
    setImagePending(true);
    let { error } = await sendRequest(request);
    if (error) {
      history.push("/login");
    }
    setImagePending(false);
  };

  /**
   * Returns request files list with page number
   * @returns request
   */
  const imagesRequest = () =>
    http.get<PaginationModel<PictureModel>>(
      `${config.api}/v1/file?mimetype=image&page=${page}&limit=${numberOfImages}`,
      {
        headers: { ...auth.headers },
      }
    );

  /**
   * Submits request files list with page number
   * @returns 
   */
  const fetchImages = async () => {
    const { data, error } = await sendRequest(imagesRequest);
    if (error) {
      history.push("/login");
    }
    setPictures(data);
  };

  /**
   * Pass selected files to parent component
   */
  const sendData = () => {
    filesSelected.map((file) => libraryToParent(file));
    setFilesSelected([]);
  };

  // Verify if file is unique and push it
  /**
   * Push file in array. Verify if is currently in array or not
   * @param pic 
   */
  const pushFile = (pic: PictureModel) => {
    const currentFileInArray = filesSelected.find(
      (currentFile) => currentFile.id === pic.id
    );
    if (filesSelected.length) {
      if (currentFileInArray === undefined) {
        setFilesSelected([...filesSelected, pic]);
      } else if (currentFileInArray) {
        const indexFile = filesSelected.findIndex(
          (currentFile) => currentFile.id === pic.id
        );
        const newFilesSelected = [...filesSelected];
        newFilesSelected.splice(indexFile, 1);
        setFilesSelected(newFilesSelected);
      }
    } else {
      setFilesSelected((file) => [...file, pic]);
    }
  };

  useEffect(() => {
    console.log(filesSelected);
  }, [filesSelected]);

  /**
   * Check if image is selected
   * @param id 
   * @returns boolean
   */
  const isSelected = (id: string) => {
    if (filesSelected.find((currentFile) => currentFile.id === id)) {
      return true;
    } else if (
      filesSelected.find((currentFile) => currentFile.id !== id) === undefined
    ) {
      return false;
    }
  };

  // Upload files when new ones uploaded
  useEffect(() => {
    if (files.length) sendFiles().then();
  }, [files]);

  // Fetch files on component load
  useEffect(() => {
    fetchImages().then();
  }, [page, imagePending]);

  return (
    <>
      <div className="media-library-container-component">
        <div className="top">
          <div className="search">
            <i className="fas fa-search" />
            <input type="text" placeholder="Search..." />
          </div>
          <div className="button-group">
            <Granted permissions={["c:file"]}>
              <label
                htmlFor="myFile"
                className="action"
                style={!mini ? { borderRadius: "4px" } : {}}
              >
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
            </Granted>
            {mini && (
              <button type="button" className="action" onClick={sendData}>
                Select
              </button>
            )}
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
                    <li
                      key={pic.id}
                      className={`${isSelected(pic.id) ? "selected" : ""}`}
                    >
                      <picture>
                        <img
                          src={`${config.api}` + pic.uri}
                          alt={pic.caption}
                          id={pic.id}
                          onClick={() => {
                            pushFile(pic);
                          }}
                        />
                      </picture>
                    </li>
                  );
                })}
            </ul>
            {pictures && (
              <Pagination meta={pictures.meta} pageSetter={setPage} />
            )}
          </>
        )}
      </div>
    </>
  );
};

export default MediaLibraryContainer;
