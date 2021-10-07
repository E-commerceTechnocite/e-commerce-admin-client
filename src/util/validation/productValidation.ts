import * as yup from "yup"

export const productSchema = yup.object().shape({
  title: yup.string().required("Title missing").typeError("lolololo"),
  reference: yup.string().required("Reference missing"),
  description: yup.string().min(17, 'Description must be at least 10 characters'),
  price: yup
    .number()
    .positive()
    .min(1, "Must be a positive number")
    .required("Price missing"),
  quantity: yup
    .number()
    .positive()
    .min(1, "Must be a positive number")
    .required("Quantity missing"),
  categoryId: yup.string().required(),
  taxRuleGroupId: yup.string().required(),
})

export const imagesSchema = yup.object().shape({
  picturesId: yup.array().of(yup.string()).required(),
  thumbnailId: yup.string().required("Thumbnail missing"),
})
