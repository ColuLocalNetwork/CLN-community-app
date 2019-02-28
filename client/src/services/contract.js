import abis from 'constants/abi'
// import web3 from 'services/web3'

const contracts = {
  // main: {},
  // ropsten: {},
  // fuse: {}
}

export const getContract = ({web3, address, abiName}) => {
  // const networkContracts = contracts[network]
  if (address && contracts.hasOwnProperty(address)) {
    return contracts[address]
  }

  const abi = abis[abiName]
  const contract = new web3.eth.Contract(abi, address)
  contracts[address] = contract

  return contract
}
