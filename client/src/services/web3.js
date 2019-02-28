import {init, get} from 'osseus-wallet'
import Web3 from 'web3'
import abi from 'constants/abi'

const config = {
  osseus_wallet: {
    abi,
    ...CONFIG.web3
  }
}

const web3 = new Web3(Web3.givenProvider || CONFIG.web3.provider)


export const getWeb3 = (network) => {
  return !network ? givenWeb3 : null
}

export const givenWeb3 = new Web3(Web3.givenProvider || CONFIG.web3.provider)
export const homeWeb3 = new Web3(CONFIG.web3.fuseProvider)
export const foreignWeb3 = new Web3(CONFIG.web3.provider)

init({config})

export default get()
