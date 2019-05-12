
const fs = require('fs')
var path = require('path')

const filterEvents = (abi) => abi.filter(({ type }) => type === 'event')

const extendWithEvents = (contractToExtend, ...contracts) => {
  const abiPath = path.join(__dirname, '../build/abi')
  let abiToExtend = require(path.join(abiPath, contractToExtend))
  for (let contract of contracts) {
    const abi = require(path.join(abiPath, contract))
    const events = filterEvents(abi)
    abiToExtend = [...abi, ...events]
  }
  fs.writeFileSync(path.join(abiPath, contractToExtend + 'WithEvents.json'), JSON.stringify(abiToExtend, null, 4))
}

extendWithEvents('Community', 'EntitiesList')
