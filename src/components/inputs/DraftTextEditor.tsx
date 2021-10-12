import * as React from "react"
import { useState } from "react"
import { EditorState, convertToRaw, ContentState } from "draft-js"
import { Editor } from "react-draft-wysiwyg"
import draftToHtml from "draftjs-to-html"
import htmlToDraft from "html-to-draftjs"

interface IDrafTextEditorProps {
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void
  setFieldTouched: (field: string, isTouched?: boolean, shouldValidate?: boolean) => void
  value: string
}
const DrafTextEditor: React.FunctionComponent<IDrafTextEditorProps> = ({
  setFieldValue,
  setFieldTouched,
  value,
}) => {
  
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
    </div>
  )
}

export default DrafTextEditor
