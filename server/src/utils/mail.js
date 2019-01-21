const client = require('@services/mail')
const config = require('config')

const mailConfig = config.get('mail')

const createRequest = ({to, from, subject, templateId, templateData}) => {
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
  const request = createRequest({to, from, subject, templateId, templateData})

  client.request(request).then(() => {
    console.log(`Sent welcoming mail to address ${to}`)
  })
}

module.exports = {
  sendWelcomeMail
}
