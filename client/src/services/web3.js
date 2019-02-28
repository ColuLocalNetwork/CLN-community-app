import {init, get} from 'osseus-wallet'
import Web3 from 'web3'
import abi from 'constants/abi'

const config = {
  osseus_wallet: {
    abi,
    ...CONFIG.web3
  }
}

export const getWeb3 = ({networkBrigde} = {}) => {
  return !networkBrigde ? givenWeb3 : web3ByBridge[networkBrigde]
}

export const givenWeb3 = new Web3(Web3.givenProvider || CONFIG.web3.provider)
export const homeWeb3 = new Web3(CONFIG.web3.fuseProvider)
export const foreignWeb3 = new Web3(CONFIG.web3.provider)

const web3ByBridge = {
  home: homeWeb3,
  foreign: foreignWeb3
}

init({config})

export default get()
