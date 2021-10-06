import * as yup from 'yup'

export const productSchema = yup.object().shape({
    title: yup.string().required('Title missing').typeError('lolololo'),
    reference: yup.string().required('Reference missing'),
    description: yup.string().min(10),
    price: yup.number().positive().min(1, 'Must be a positive number').required('Price missing'),
    quantity: yup.number().positive().min(1, 'Must be a positive number').required('Quantity missing'),
    categoryId: yup.string().required(),
    taxRuleGroupId: yup.string().required(),
    picturesId: yup.array().of(yup.string()).required(),
    thumbnailId: yup.string().required('Thumbnail missing'),

})