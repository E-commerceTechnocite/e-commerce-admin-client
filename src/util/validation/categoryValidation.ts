import * as yup from "yup"

export const categorySchema = yup.object().shape({
  label: yup.string().required("Required")
})