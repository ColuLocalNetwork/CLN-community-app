const { createPropertyDir, extendAbiWithEvents } = require('./utils')

module.exports = {
  createAbiDir: createPropertyDir.bind(null, 'abi'),
  extractBytecode: createPropertyDir.bind(null, 'bytecode'),
  extendAbiWithEvents
}
