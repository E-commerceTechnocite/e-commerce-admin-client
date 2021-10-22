import * as yup from "yup"

export const productSchema = yup.object().shape({
  title: yup.string().required("Required."),
  reference: yup.string().required("Required."),
  description: yup
    .string()
    .required("Description must be at least 10 characters.")
    .min(17, "Description must be at least 10 characters."),
  price: yup
    .number()
    .typeError('Number required.')
    .positive()
    .min(1, "Must be a positive number.")
    .required("Required."),
  stock: yup.object().shape({
    physical: yup
    .number()
    .typeError('Number required.')
    .positive()
    .min(1, "Must be a positive number.")
    .required("Required."),
    pending: yup
    .number()
    .typeError('Number required.')
    .positive()
    .min(0, "Must be a positive number.")
    .required("Required."),
    incoming: yup
    .number()
    .typeError('Number required.')
    .positive()
    .min(0, "Must be a positive number.")
    .required("Required."),

  }),
  categoryId: yup.string().required("Required."),
  taxRuleGroupId: yup.string().required("Required."),
})

export const imagesSchema = yup.object().shape({
  picturesId: yup.array().of(yup.string()).required(),
  thumbnailId: yup.string().required("Thumbnail required."),
})
