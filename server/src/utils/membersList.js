const config = require('config')
const SimpleListFactoryABI = require('@constants/abi/SimpleListFactory.json')
const SimpleListABI = require('@constants/abi/SimpleList.json')
const homeAddresses = config.get('web3.addresses.fuse')
const mongoose = require('mongoose')
const Bridge = mongoose.model('Bridge')
const {handleReceipt} = require('@events/handlers')
const {web3, from} = require('@services/web3/home')

const deployMembersList = async (token) => {
  console.log('Deploying members list')
  const {homeTokenAddress} = await Bridge.findOne({foreignTokenAddress: token.address})

  const SimpleListFactoryContract = new web3.eth.Contract(SimpleListFactoryABI, homeAddresses.SimpleListFactory)

  const method = SimpleListFactoryContract.methods.createSimpleList(homeTokenAddress)
  const gas = await method.estimateGas({from})

  const receipt = await method.send({
    from,
    gas,
    gasPrice: '1000000000'
  })

  await handleReceipt(receipt)

  const listAddress = receipt.events.SimpleListCreated.returnValues.list

  console.log(`Deploying members list finished. list address ${listAddress}`)

  const simpleListContract = new web3.eth.Contract(SimpleListABI, listAddress)

  const addAdminMethod = simpleListContract.methods.addAdmin(token.owner)
  await addAdminMethod.send({
    from,
    gas: await addAdminMethod.estimateGas({from}),
    gasPrice: '1000000000'
  })
  console.log('new admin added')
  const removeAdminMethod = simpleListContract.methods.removeAdmin(from)
  await removeAdminMethod.send({
    from,
    gas: await removeAdminMethod.estimateGas({from}),
    gasPrice: '1000000000'
  })

  console.log(`${token.owner} Added as owner of the list`)
}

module.exports = {
  deployMembersList
}
