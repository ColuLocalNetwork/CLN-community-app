import request from 'superagent'

export const API_ROOT = CONFIG.api.url

export const fetchMetadata = (protocol, hash) =>
  request.get(`${API_ROOT}/metadata/${protocol}/${hash}`)
    .then(response => response.body)

export const createMetadata = (metadata) =>
  request.post(`${API_ROOT}/metadata`)
    .send({metadata})
    .then(response => response.body)

export const addCommunity = (community) =>
  request.post(`${API_ROOT}/communities`).send({community}).then(response => response.body)

export const sendContactUs = (formData) => request.post(`${API_ROOT}/mails`)
  .send({formData})
  .then(response => response.body)

export const subcribeToMailingList = (formData) => request.post(`${API_ROOT}/subscriptions`)
  .send({formData})
  .then(response => response.body)
