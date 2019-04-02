import { object, string } from 'yup'

export default object().noUnknown(false).shape({
  name: string().trim().ensure().label('Name').required(),
  address: string().trim().ensure().length(90),
  email: string().email().required(),
  phone: string(),
  link: string().url(),
  description: string().trim().ensure().label('Description').length(490).required(),
  businessType: string().trim().ensure(),
  businessAccount: string().trim().ensure(),
  selectedBusinessType: object().shape({
    label: string().trim().ensure(),
    value: string().trim().ensure()
  })
})
