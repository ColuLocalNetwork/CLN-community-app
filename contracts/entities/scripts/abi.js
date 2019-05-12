const path = require('path')
const { createAbiDir, extendAbiWithEvents } = require('@fuse/contract-utils')

const relPath = path.join(__dirname, '../')

async function init (relPath) {
  await createAbiDir(relPath)
  await extendAbiWithEvents(relPath, 'Community', 'EntitiesList')
}

init(relPath)
