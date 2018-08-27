import { all, call, put, select } from 'redux-saga/effects'
import {BigNumber} from 'bignumber.js'
import { contract } from 'osseus-wallet'

import * as actions from 'actions/marketMaker'
import {fetchGasPrices} from 'actions/network'
import {getClnToken, getCommunity} from 'selectors/communities'
import web3 from 'services/web3'
import {tryTakeEvery, tryTakeLatestWithDebounce} from './utils'

const reversePrice = (price) => new BigNumber(1e18).div(price)

const getReservesAndSupplies = (clnToken, ccToken, isBuy) => isBuy
  ? {
    r1: ccToken.ccReserve,
    r2: ccToken.clnReserve,
    s1: ccToken.totalSupply,
    s2: clnToken.totalSupply
  } : {
    r1: ccToken.clnReserve,
    r2: ccToken.ccReserve,
    s1: clnToken.totalSupply,
    s2: ccToken.totalSupply
  }

function * getChangeParameters (tokenAddress, isBuy) {
  const clnToken = yield select(getClnToken)
  const token = yield select(getCommunity, tokenAddress)
  const fromTokenAddress = isBuy ? clnToken.address : tokenAddress
  const toTokenAddress = isBuy ? tokenAddress : clnToken.address

  return {
    token,
    fromTokenAddress,
    toTokenAddress
  }
}

const computePrice = (isBuy, inAmount, outAmount) => {
  if (isBuy) {
    return inAmount.div(outAmount)
  } else {
    return outAmount.div(inAmount)
  }
}

export function * quote ({tokenAddress, amount, isBuy}) {
  const {token, fromTokenAddress, toTokenAddress} = yield getChangeParameters(tokenAddress, isBuy)

  const EllipseMarketMakerContract = contract.getContract({abiName: 'EllipseMarketMaker', address: token.mmAddress})
  let outAmount = new BigNumber(
    yield call(EllipseMarketMakerContract.methods.quote(fromTokenAddress, amount, toTokenAddress).call))

  const price = computePrice(isBuy, amount, outAmount)
  const slippage = calcSlippage(token.currentPrice, price)

  const quotePair = {
    tokenAddress,
    inAmount: amount,
    outAmount,
    price,
    slippage,
    isBuy
  }

  yield put({type: isBuy ? actions.BUY_QUOTE.SUCCESS : actions.SELL_QUOTE.SUCCESS,
    address: token.address,
    response: {
      isFetching: false,
      quotePair
    }})
  return quotePair
}

export function * invertQuote ({tokenAddress, amount, isBuy}) {
  const clnToken = yield select(getClnToken)
  const token = yield select(getCommunity, tokenAddress)

  if (amount.isZero()) {
    return yield put({type: isBuy ? actions.INVERT_BUY_QUOTE.SUCCESS : actions.INVERT_SELL_QUOTE.SUCCESS,
      address: token.address,
      response: {
        isFetching: false,
        quotePair: undefined
      }})
  }
  const EllipseMarketMakerContract = contract.getContract({abiName: 'EllipseMarketMaker', address: token.mmAddress})

  const {r1, r2, s1, s2} = getReservesAndSupplies(clnToken, token, isBuy)

  const updatedR1 = new BigNumber(r1).minus(amount)
  const updatedR2 = yield call(EllipseMarketMakerContract.methods.calcReserve(
    updatedR1, s1, s2).call)
  const inAmount = new BigNumber(updatedR2).minus(r2)

  const price = computePrice(isBuy, inAmount, new BigNumber(amount))
  const slippage = calcSlippage(token.currentPrice, price)

  const quotePair = {
    tokenAddress,
    inAmount,
    outAmount: amount,
    price,
    slippage,
    isBuy
  }

  yield put({type: isBuy ? actions.INVERT_BUY_QUOTE.SUCCESS : actions.INVERT_SELL_QUOTE.SUCCESS,
    address: token.address,
    response: {
      isFetching: false,
      quotePair
    }})

  return quotePair
}

const calcSlippage = (expectedPrice, actualPrice) =>
  expectedPrice.minus(actualPrice).div(expectedPrice).abs()

function * createChangeData ({toTokenAddress, amount, minReturn, isBuy, mmAddress}) {
  const EllipseMarketMakerContract = contract.getContract({abiName: 'EllipseMarketMaker', address: mmAddress})

  if (minReturn) {
    return EllipseMarketMakerContract.methods.change(toTokenAddress, minReturn).encodeABI()
  } else {
    return EllipseMarketMakerContract.methods.change(toTokenAddress).encodeABI()
  }
}

export function * change ({tokenAddress, amount, minReturn, isBuy, options}) {
  const {token, fromTokenAddress, toTokenAddress} = yield getChangeParameters(tokenAddress, isBuy)

  const data = yield createChangeData({toTokenAddress, amount, minReturn, isBuy, mmAddress: token.mmAddress})

  const ColuLocalCurrency = contract.getContract({abiName: 'ColuLocalCurrency',
    address: fromTokenAddress})

  const sendPromise = ColuLocalCurrency.methods.transferAndCall(token.mmAddress, amount, data).send({
    from: web3.eth.defaultAccount,
    ...options
  })

  const transactionHash = yield new Promise((resolve, reject) => {
    sendPromise.on('transactionHash', (transactionHash) =>
      resolve(transactionHash)
    )
    sendPromise.on('error', (error) =>
      reject(error)
    )
  })

  yield put({type: actions.CHANGE.PENDING,
    tokenAddress: token.address,
    accountAddress: web3.eth.defaultAccount,
    response: {
      transactionHash
    }
  })

  const receipt = yield sendPromise
  if (!Number(receipt.status)) {
    yield put({
      type: actions.CHANGE.FAILURE,
      tokenAddress: token.address,
      accountAddress: web3.eth.defaultAccount,
      response: {receipt}
    })
    return receipt
  }

  yield put({type: actions.CHANGE.SUCCESS,
    tokenAddress: token.address,
    accountAddress: web3.eth.defaultAccount,
    response: {
      receipt
    }
  })

  return receipt
}

export function * estimageChange ({tokenAddress, amount, minReturn, isBuy}) {
  const {token, fromTokenAddress, toTokenAddress} = yield getChangeParameters(tokenAddress, isBuy)

  const data = yield createChangeData({toTokenAddress, amount, minReturn, isBuy, mmAddress: token.mmAddress})

  const ColuLocalCurrency = contract.getContract({abiName: 'ColuLocalCurrency',
    address: fromTokenAddress})

  return yield ColuLocalCurrency.methods.transferAndCall(token.mmAddress, amount, data).estimateGas(
    {from: web3.eth.defaultAccount})
}

export function * buyQuote ({tokenAddress, clnAmount}) {
  yield call(quote, {
    tokenAddress,
    amount: clnAmount,
    isBuy: true
  })
}

export function * sellQuote ({tokenAddress, ccAmount}) {
  yield call(quote, {
    tokenAddress,
    amount: ccAmount,
    isBuy: false
  })
}

export function * invertBuyQuote ({tokenAddress, ccAmount}) {
  yield call(invertQuote, {
    tokenAddress,
    amount: ccAmount,
    isBuy: true
  })
}

export function * invertSellQuote ({tokenAddress, clnAmount}) {
  yield call(invertQuote, {
    tokenAddress,
    amount: clnAmount,
    isBuy: false
  })
}

export function * buyCc ({amount, tokenAddress, minReturn, options}) {
  yield call(change, {
    tokenAddress,
    amount,
    isBuy: true,
    minReturn,
    options
  })
}

export function * sellCc ({amount, tokenAddress, minReturn, options}) {
  yield call(change, {
    tokenAddress,
    amount,
    isBuy: false,
    minReturn,
    options
  })
}

export function * estimateGasBuyCc ({amount, tokenAddress, minReturn}) {
  const estimatedGas = yield call(estimageChange, {
    tokenAddress,
    amount,
    isBuy: true,
    minReturn
  })

  yield put(fetchGasPrices())

  yield put({type: actions.ESTIMATE_GAS_BUY_CC.SUCCESS,
    address: tokenAddress,
    response: {
      estimatedGas
    }})
}

function * estimateGasSellCc ({amount, tokenAddress, minReturn}) {
  const estimatedGas = yield call(estimageChange, {
    tokenAddress,
    amount,
    isBuy: false,
    minReturn
  })

  yield put(fetchGasPrices())

  yield put({type: actions.ESTIMATE_GAS_SELL_CC.SUCCESS,
    address: tokenAddress,
    response: {
      estimatedGas
    }})
}

export function * fetchMarketMakerData ({tokenAddress, mmAddress, blockNumber}) {
  const EllipseMarketMakerContract = contract.getContract({abiName: 'EllipseMarketMaker', address: mmAddress})

  const calls = {
    currentPrice: call(EllipseMarketMakerContract.methods.getCurrentPrice().call, null, blockNumber),
    clnReserve: call(EllipseMarketMakerContract.methods.R1().call, null, blockNumber),
    ccReserve: call(EllipseMarketMakerContract.methods.R2().call, null, blockNumber),
    isOpenForPublic: call(EllipseMarketMakerContract.methods.openForPublic().call, null, blockNumber)
  }

  const response = yield all(calls)

  response.currentPrice = reversePrice(response.currentPrice)
  response.isMarketMakerLoaded = true
  yield put({type: actions.FETCH_MARKET_MAKER_DATA.SUCCESS,
    tokenAddress,
    response
  })
}

export default function * marketMakerSaga () {
  yield all([
    tryTakeEvery(actions.QUOTE, quote),
    tryTakeLatestWithDebounce(actions.BUY_QUOTE, buyQuote),
    tryTakeLatestWithDebounce(actions.SELL_QUOTE, sellQuote),
    tryTakeLatestWithDebounce(actions.INVERT_BUY_QUOTE, invertBuyQuote),
    tryTakeLatestWithDebounce(actions.INVERT_SELL_QUOTE, invertSellQuote),
    tryTakeEvery(actions.CHANGE, change, 1),
    tryTakeEvery(actions.BUY_CC, buyCc, 1),
    tryTakeEvery(actions.SELL_CC, sellCc, 1),
    tryTakeEvery(actions.ESTIMATE_GAS_BUY_CC, estimateGasBuyCc),
    tryTakeEvery(actions.ESTIMATE_GAS_SELL_CC, estimateGasSellCc),
    tryTakeEvery(actions.FETCH_MARKET_MAKER_DATA, fetchMarketMakerData)
  ])
}
