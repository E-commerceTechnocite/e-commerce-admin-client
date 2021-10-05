import * as yup from 'yup'

export const productSchema = yup.object().shape({
    title: yup.string().required(),
    reference: yup.string().required(),
    description: yup.string().min(10),
    price: yup.number().required(),
    quantity: yup.number().required(),
    categoryId: yup.string().required(),
    taxRuleGroupId: yup.string().required(),
    picturesId: yup.array().of(yup.string()).required(),
    thumbnailId: yup.string().required(),

})