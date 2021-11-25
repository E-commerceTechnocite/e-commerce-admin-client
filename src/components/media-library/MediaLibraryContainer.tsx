import { PaginationModel } from '../../models/pagination/pagination.model'
import { PictureModel } from '../../models/files/picture.model'
import PaginationMini from '../pagination/PaginationMini'
import { sendRequest } from '../../util/helpers/refresh'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { useQuery } from '../../util/hook/useQuery'
import Pagination from '../pagination/Pagination'
import { auth } from '../../util/helpers/auth'
import Skeleton from './skeleton/Skeleton'
import { useHistory } from 'react-router'
import Uri from '../../util/helpers/Uri'
import { motion, AnimatePresence } from 'framer-motion'
import { http } from '../../util/http'
import './MediaLibraryContainer.scss'
import { config } from '../../index'
import Granted from '../Granted'

interface MediaLibraryContainerPropsInterface {
  numberOfImages?: number
  upperPagination?: boolean
  mini?: boolean
  libraryToParent?: (data) => void
}

const MediaLibraryContainer: FC<MediaLibraryContainerPropsInterface> = ({
  numberOfImages = 120,
  upperPagination = true,
  mini = false,
  libraryToParent,
}) => {
  const [pictures, setPictures] = useState<PaginationModel<PictureModel>>(null)
  const [filesSelected, setFilesSelected] = useState<PictureModel[]>([])
  const [errorFile, setErrorFile] = useState<boolean>(false)
  const [imagePending, setImagePending] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const inputEl = useRef<HTMLInputElement>()
  const path = window.location.pathname
  const [page, setPage] = useState(1)
  const history = useHistory()
  const query = useQuery()

  /**
   * Returns post request of multiple files
   * @returns request
   */
  const request = () => {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('files', file)
    })
    return http.post(`${config.api}/v1/file/upload-bunch`, formData, {
      headers: { ...auth.headers },
    })
  }

  /**
   * Submits post request of multiple files
   */
  const sendFiles = async () => {
    setImagePending(true)
    let { error } = await sendRequest(request)
    if (error) {
      if (error.statusCode === 400) {
        setImagePending(false)
        setErrorFile(true)
        return
      }
      history.push('/login')
    }
    setImagePending(false)
  }

  /**
   * Returns request files list with page number
   * @returns request
   */
  const imagesRequest = () => {
    const url = new Uri('/v1/file')
    url
      .setQuery(
        'page',
        path === '/admin/medias' ? query.get('page') : page.toString()
      )
      .setQuery('limit', numberOfImages.toString())

    return http.get<PaginationModel<PictureModel>>(url.href, {
      headers: { ...auth.headers },
    })
  }

  /**
   * Submits request files list with page number
   * @returns
   */
  const fetchImages = useCallback(async () => {
    const { data, error } = await sendRequest(imagesRequest)
    if (error) {
      history.push('/login')
    }
    setPictures(data)
  }, [pictures])

  /**
   * Pass selected files to parent component
   */
  const sendData = () => {
    filesSelected.map((file) => libraryToParent(file))
    setFilesSelected([])
  }

  // Verify if file is unique and push it
  /**
   * Push file in array. Verify if is currently in array or not
   * @param pic
   */
  const pushFile = (pic: PictureModel) => {
    const currentFileInArray = filesSelected.find(
      (currentFile) => currentFile.id === pic.id
    )
    if (filesSelected.length) {
      if (currentFileInArray === undefined) {
        setFilesSelected([...filesSelected, pic])
      } else if (currentFileInArray) {
        const indexFile = filesSelected.findIndex(
          (currentFile) => currentFile.id === pic.id
        )
        const newFilesSelected = [...filesSelected]
        newFilesSelected.splice(indexFile, 1)
        setFilesSelected(newFilesSelected)
      }
    } else {
      setFilesSelected((file) => [...file, pic])
    }
  }

  /**
   * Check if image is selected
   * @param id
   * @returns boolean
   */
  const isSelected = (id: string) => {
    if (filesSelected.find((currentFile) => currentFile.id === id)) {
      return true
    } else if (
      filesSelected.find((currentFile) => currentFile.id !== id) === undefined
    ) {
      return false
    }
  }

  // Close the error modal after 4 sec
  useEffect(() => {
    if (errorFile) {
      setTimeout(() => {
        setErrorFile(false)
      }, 4000)
    }
  }, [errorFile])

  // Upload files when new ones uploaded
  useEffect(() => {
    if (files.length) sendFiles().then()
  }, [files])

  // Fetch files on component load
  useEffect(() => {
    if (!query.get('page')) {
      if (path === '/admin/medias') {
        history.push('/medias?page=1&s=u')
        return
      }
      if (query.get('s')) window.scrollTo(0, 0)
    }
    fetchImages().then()
  }, [page, query.get('page'), imagePending])

  return (
    <>
      <div className="media-library-container-component">
        <AnimatePresence
          initial={false}
          exitBeforeEnter={true}
          onExitComplete={() => null}
        >
          {errorFile && (
            <motion.div
              initial={{ opacity: 0, top: '-6%' }}
              animate={{ opacity: 1, top: '-4%' }}
              exit={{ opacity: 0, top: '-2%' }}
              className="error-modal"
            >
              <div className="error-content">
                Error: Wrong file type
                <i
                  className="fas fa-times close"
                  onClick={() => setErrorFile(false)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="top">
          <div className="search">
            <i className="fas fa-search" />
            <input type="text" placeholder="Search..." />
          </div>
          <div className="button-group">
            <Granted permissions={['c:file']}>
              <label
                htmlFor="myFile"
                className="action"
                style={!mini ? { borderRadius: '4px' } : {}}
              >
                Add
                <input
                  type="file"
                  id="myFile"
                  name="filename"
                  style={{ display: 'none' }}
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
            {pictures && upperPagination && path !== '/admin/medias' && (
              <PaginationMini meta={pictures.meta} pageSetter={setPage} />
            )}
            {pictures && path === '/admin/medias' && (
              <Pagination meta={pictures.meta} uri={'/medias?page='} />
            )}
            <ul>
              {pictures &&
                pictures.data.map((pic) => {
                  return (
                    <li
                      key={pic.id}
                      className={`${isSelected(pic.id) ? 'selected' : ''}`}
                    >
                      <motion.picture
                        whileTap={{
                          scale: 0.95,
                          transition: { duration: 0.1 },
                        }}
                      >
                        <img
                          src={
                            pic.uri.startsWith('http')
                              ? pic.uri
                              : `${config.api}` + pic.uri
                          }
                          alt={pic.caption}
                          id={pic.id}
                          onClick={() => {
                            pushFile(pic)
                          }}
                        />
                      </motion.picture>
                    </li>
                  )
                })}
            </ul>
            {pictures && path !== '/admin/medias' && (
              <PaginationMini meta={pictures.meta} pageSetter={setPage} />
            )}
            {pictures && path === '/admin/medias' && (
              <Pagination meta={pictures.meta} uri={'/medias?page='} />
            )}
          </>
        )}
      </div>
    </>
  )
}

export default MediaLibraryContainer
