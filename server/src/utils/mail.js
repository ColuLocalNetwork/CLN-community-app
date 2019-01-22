const client = require('@services/mail')
const config = require('config')

const mailConfig = config.get('mail')

const createMailRequest = ({to, from, subject, templateId, templateData}) => {
  return {
    method: 'POST',
    url: '/v3/mail/send',
    body: {
      'personalizations': [
        {
          'to': [
            {
              'email': to
            }
          ],
          'dynamic_template_data': templateData,
          'subject': subject
        }
      ],
      'from': {
        'email': from
      },
      'template_id': templateId
    }
  }
}

const sendWelcomeMail = (user) => {
  const from = mailConfig.supportAddress
  const to = user.email
  const subject = 'Welcome to Fuse!'
  const templateData = {
    name: user.fullName
  }
  const templateId = config.get('mail.templates.welcome')
  const request = createMailRequest({to, from, subject, templateId, templateData})

  client.request(request).then(() => {
    console.log(`Sent welcoming mail to address ${to}`)
  })
}

const subscribeUser = (user) => {
  const firstName = user.fullName.split(' ')[0]
  const lastName = user.fullName.split(' ')[1]

  const request = {
    method: 'POST',
    url: '/v3/contactdb/recipients',
    body: [{
      'email': user.email,
      'first_name': firstName,
      'last_name': lastName
    }]
  }
  console.log(request.body)
  client.request(request).then(() => {
    console.log(`User ${user.email} added`)
  }).catch(console.log)
}

module.exports = {
  sendWelcomeMail,
  subscribeUser
}
