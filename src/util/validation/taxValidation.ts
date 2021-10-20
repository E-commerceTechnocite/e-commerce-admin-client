import * as yup from "yup"

export const taxRuleSchema = yup.object().shape({
  taxRuleGroupId: yup.string().required("Required."),
  taxId: yup.string().required("Required."),
  countryId: yup.string().required("Required."),
  zipCode: yup
    .string()
    .min(2, "Must contain between 2 and 10 characters.")
    .max(10, "Must contain between 2 and 10 characters.")
    .required("Must contain between 2 and 10 characters."),
  behavior: yup.number().required("Required"),
  description: yup
    .string()
    .min(2, "Must contain between 2 and 10 characters.")
    .max(10, "Must contain between 2 and 10 characters.")
    .required("Must contain between 2 and 10 characters."),
})


export const taxGroupSchema = yup.object().shape({
  name: yup.string().required("Required.")
})