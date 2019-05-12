const extractFromContract = require('./extract')

const relPath = process.argv[2]

extractFromContract(relPath, 'abi')
