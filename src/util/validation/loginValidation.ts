import * as yup from "yup";

export const adminLoginSchema = yup.object().shape({
 email: yup.string().email('Must be valid email.').required("Required."),
 password: yup.string().required("Required."),
});
