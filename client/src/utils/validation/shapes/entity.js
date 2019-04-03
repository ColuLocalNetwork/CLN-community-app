import { object, string } from 'yup'

export default object().noUnknown(false).shape({
  name: string().normalize().label('Name').required(),
  address: string().normalize().required().max(90),
  email: string().email().required(),
  phone: string().normalize().required(),
  websiteUrl: string().normalize().url().required(),
  description: string().normalize().label('Description').required().max(490),
  type: string().normalize().required(),
  account: string().normalize().required(),
  selectedType: object().shape({
    label: string().normalize(),
    value: string().normalize()
  })
})
