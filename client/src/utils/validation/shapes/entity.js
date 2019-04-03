import { object, string } from 'yup'

export default object().noUnknown(false).shape({
  name: string().normalize().label('Name').required(),
  address: string().normalize().required().max(90),
  email: string().email().required(),
  phone: string().normalize(),
  websiteUrl: string().normalize().url(),
  description: string().normalize().label('Description').max(490),
  businessType: string().normalize(),
  account: string().normalize(),
  selectedBusinessType: object().shape({
    label: string().normalize(),
    value: string().normalize()
  })
})
