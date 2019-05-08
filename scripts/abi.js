const fs = require('fs')
var path = require('path')

const relPath = process.argv[2]
const buildPath = path.join(relPath, './build/contracts')
const abiPath = path.join(relPath, './build/abi')

try {
  fs.mkdirSync(abiPath, { recursive: true })
} catch (err) {
  if (err.code !== 'EEXIST') {
    console.error(err.code)
    throw err
  }
}

fs.readdir(buildPath, (err, files) => {
  if (err) {
    console.error('Could not list the directory.', err)
    process.exit(1)
  }

  files.forEach((file) => {
    const filePath = path.join(buildPath, file)
    const contract = require(filePath)
    // console.log(contract.abi)
    fs.writeFile(path.join(abiPath, file), JSON.stringify(contract.abi, null, 4), (err) => {
      if (err) {
        console.error(err)
      }
    })
    // require()
  })
})
