import * as React from "react"
import { useState } from "react"
import { EditorState, convertToRaw, ContentState } from "draft-js"
import { Editor } from "react-draft-wysiwyg"
import draftToHtml from "draftjs-to-html"
import htmlToDraft from "html-to-draftjs"
import { ErrorMessage, useField } from "formik"

interface IDrafTextEditorProps {
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void
  setFieldTouched: (field: string, isTouched?: boolean, shouldValidate?: boolean) => void
  value: string,
  field: {
    name: string
    value: string
  }
  meta: any
}
const DrafTextEditor: React.FunctionComponent<IDrafTextEditorProps> = ( {
  setFieldValue,
  setFieldTouched,
  value,
}) => {
  const [field, meta] = useField("description")
  const prepareDraft = (value) => {
    const draft = htmlToDraft(value)
    const contentState = ContentState.createFromBlockArray(draft.contentBlocks)
    const editorState = EditorState.createWithContent(contentState)
    return editorState
  }

  const [editorState, setEditorState] = useState(
    value ? prepareDraft(value) : EditorState.createEmpty()
  )
  const onEditorStateChange = (editorState) => {
    const forFormik = draftToHtml(convertToRaw(editorState.getCurrentContent()))
    setFieldValue("description", forFormik)
    setFieldTouched("description", true)
    setEditorState(editorState)
    console.log(meta)
  }

  const toolbar = {
    inline: { inDropdown: true },
    list: { inDropdown: true },
    textAlign: { inDropdown: true },
    link: { inDropdown: true },
    history: { inDropdown: true },
  }

  return (
    <div className="draft-text-editor">
      <Editor
        editorState={editorState}
        wrapperClassName="wrapper"
        toolbarClassName="toolbar"
        editorClassName="editor"
        toolbar={toolbar}
        onEditorStateChange={onEditorStateChange}
      />
      {/* {meta.touched && meta.error &&<p>{meta.error}</p>} */}
      <p className="error">
        <ErrorMessage name={field.name} />
      </p>
    </div>
  )
}

export default DrafTextEditor
