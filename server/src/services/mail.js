const client = require('@sendgrid/client')
const config = require('config')

const mailConfig = config.get('mail')
client.setApiKey(mailConfig.apiKey)

module.exports = client
