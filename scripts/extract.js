const fs = require('fs')
var path = require('path')

const extractFromContract = (relPath, contractPart) => {
  const buildPath = path.join(relPath, './build/contracts')
  const destPath = path.join(relPath, `./build/${contractPart}`)

  try {
    fs.mkdirSync(destPath, { recursive: true })
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
      fs.writeFile(path.join(destPath, file), JSON.stringify(contract[contractPart], null, 4), (err) => {
        if (err) {
          console.error(err)
        }
      })
    })
  })
}

module.exports = extractFromContract
