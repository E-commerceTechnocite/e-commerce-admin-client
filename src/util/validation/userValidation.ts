import * as yup from "yup"

export const userSchema = yup.object().shape({
  email: yup.string().email('Must be an email.').required("Required."),
  username: yup.string().required("Required."),
  roleId: yup.string().required("Required.")
})