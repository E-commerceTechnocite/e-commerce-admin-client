import * as yup from "yup"

export const taxRuleSchema = yup.object().shape({
  taxRuleGroupId: yup.string().required("Required"),
  taxId: yup.string().required("Required"),
  countryId: yup.string().required("Required"),
  zipCode: yup.string().required("Required"),
  behavior: yup.number().required("Required"),
  description: yup
    .string()
    .min(2, "Description must contain between 2 and 10 characters")
    .max(10, "Description must contain between 2 and 10 characters")
    .required("Description must contain between 2 and 10 characters"),
})
