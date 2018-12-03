import { all, call, put, select, takeEvery } from 'redux-saga/effects'
import {BigNumber} from 'bignumber.js'
import { contract } from 'osseus-wallet'

import * as actions from 'actions/marketMaker'
import {fetchGasPrices} from 'actions/network'
import {balanceOfCln} from 'actions/accounts'
import {getClnToken, getCommunity} from 'selectors/communities'
import {tryTakeEvery, tryTakeLatestWithDebounce, apiCall} from './utils'
import {getAccountAddress} from 'selectors/accounts'
import {predictClnReserves} from 'utils/calculator'
import {getCurrencyFactoryAddress} from 'selectors/network'
import {transactionPending, transactionFailed, transactionSucceeded} from 'actions/utils'
import {processReceipt} from 'services/api'

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

function * quote ({tokenAddress, amount, isBuy}) {
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

function * predictClnPrices ({tokenAddress, initialClnReserve,
  amountOfTransactions, averageTransactionInUsd, gainRatio, iterations}) {
  const clnPrice = yield select(state => state.fiat.USD.price)
  const clnReserves = predictClnReserves({initialClnReserve,
    amountOfTransactions,
    averageTransactionInUsd,
    clnPrice,
    gainRatio,
    iterations})
  const clnReservesInWei = clnReserves.map(reserve => new BigNumber(reserve.toString()).multipliedBy(1e18))
  const clnToken = yield select(getClnToken)
  const token = yield select(getCommunity, tokenAddress)
  const s1 = clnToken.totalSupply
  const s2 = token.totalSupply
  const prices = []
  const EllipseMarketMakerContract = contract.getContract({abiName: 'EllipseMarketMaker', address: token.mmAddress})

  const tokenReserveRequests = clnReservesInWei.map(r1 => call(EllipseMarketMakerContract.methods.calcReserve(
    r1, s1, s2).call))

  const tokenReserves = yield all(tokenReserveRequests)

  const pricesClnInCcRequests = tokenReserves.map((r2, key) => {
    const r1 = clnReservesInWei[key]
    return call(EllipseMarketMakerContract.methods.getPrice(r1, r2, s1, s2).call)
  })
  const pricesClnInCc = yield all(pricesClnInCcRequests)

  for (let priceClnInCc of pricesClnInCc) {
    const priceCcInCln = reversePrice(priceClnInCc)
    const priceCcInUSD = priceCcInCln.multipliedBy(clnPrice)
    const price = {
      cln: priceCcInCln.toString(),
      usd: priceCcInUSD.toString()
    }
    prices.push(price)
  }

  yield put({type: actions.PREDICT_CLN_PRICES.SUCCESS,
    tokenAddress,
    response: {
      prices
    }
  })
}

function * invertQuote ({tokenAddress, amount, isBuy}) {
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

function * createChangeData ({token, ...rest}) {
  if (token.isOpenForPublic) {
    return yield createChangeDataForMarketMaker({token, ...rest})
  } else {
    return yield createChangeDataForCurrencyFactory({token, ...rest})
  }
}

function * createChangeDataForMarketMaker ({toTokenAddress, amount, minReturn, token}) {
  const EllipseMarketMakerContract = contract.getContract({abiName: 'EllipseMarketMaker', address: token.mmAddress})

  if (minReturn) {
    return EllipseMarketMakerContract.methods.change(toTokenAddress, minReturn).encodeABI()
  } else {
    return EllipseMarketMakerContract.methods.change(toTokenAddress).encodeABI()
  }
}

function * createChangeDataForCurrencyFactory ({toTokenAddress, amount, isBuy}) {
  const currencyFactoryAddress = yield select(getCurrencyFactoryAddress)

  const CurrencyFactoryContract = contract.getContract({abiName: 'CurrencyFactory', address: currencyFactoryAddress})

  if (isBuy) {
    return CurrencyFactoryContract.methods.insertCLNtoMarketMaker(toTokenAddress).encodeABI()
  } else {
    return CurrencyFactoryContract.methods.extractCLNfromMarketMaker(toTokenAddress).encodeABI()
  }
}

function * change ({tokenAddress, amount, minReturn, isBuy, options}) {
  const {token, fromTokenAddress, toTokenAddress} = yield getChangeParameters(tokenAddress, isBuy)
  const data = yield createChangeData({toTokenAddress, amount, minReturn, isBuy, token})

  const ColuLocalCurrency = contract.getContract({abiName: 'ColuLocalCurrency',
    address: fromTokenAddress})

  const accountAddress = yield select(getAccountAddress)

  const callAddress = token.isOpenForPublic ? token.mmAddress : yield select(getCurrencyFactoryAddress)
  const sendPromise = ColuLocalCurrency.methods.transferAndCall(callAddress, amount, data).send({
    from: accountAddress,
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

  yield put(transactionPending(actions.CHANGE, transactionHash))

  const receipt = yield sendPromise

  if (!Number(receipt.status)) {
    yield put(transactionFailed(actions.CHANGE, receipt))
    return receipt
  }

  yield put({...transactionSucceeded(actions.CHANGE, receipt), tokenAddress, accountAddress})

  return receipt
}

function * estimageChange ({tokenAddress, amount, minReturn, isBuy}) {
  const {token, fromTokenAddress, toTokenAddress} = yield getChangeParameters(tokenAddress, isBuy)

  const data = yield createChangeDataForMarketMaker({toTokenAddress, amount, minReturn, isBuy, token})

  const ColuLocalCurrency = contract.getContract({abiName: 'ColuLocalCurrency',
    address: fromTokenAddress})

  const accountAddress = yield select(getAccountAddress)

  return yield ColuLocalCurrency.methods.transferAndCall(token.mmAddress, amount, data).estimateGas(
    {from: accountAddress})
}

function * buyQuote ({tokenAddress, clnAmount}) {
  yield call(quote, {
    tokenAddress,
    amount: clnAmount,
    isBuy: true
  })
}

function * sellQuote ({tokenAddress, ccAmount}) {
  yield call(quote, {
    tokenAddress,
    amount: ccAmount,
    isBuy: false
  })
}

function * invertBuyQuote ({tokenAddress, ccAmount}) {
  yield call(invertQuote, {
    tokenAddress,
    amount: ccAmount,
    isBuy: true
  })
}

function * invertSellQuote ({tokenAddress, clnAmount}) {
  yield call(invertQuote, {
    tokenAddress,
    amount: clnAmount,
    isBuy: false
  })
}

function * buyCc ({amount, tokenAddress, minReturn, options}) {
  yield call(change, {
    tokenAddress,
    amount,
    isBuy: true,
    minReturn,
    options
  })
}

function * sellCc ({amount, tokenAddress, minReturn, options}) {
  yield call(change, {
    tokenAddress,
    amount,
    isBuy: false,
    minReturn,
    options
  })
}

function * estimateGasBuyCc ({amount, tokenAddress, minReturn}) {
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

function * getCurrentPrice (contract, blockNumber) {
  try {
    const currentPrice = yield contract.methods.getCurrentPrice().call(null, blockNumber) // eslint-disable-line no-useless-call
    return reversePrice(currentPrice)
  } catch (e) {
    console.log(e)
    return new BigNumber(0)
  }
}

function * fetchMarketMakerData ({tokenAddress, mmAddress, blockNumber}) {
  const EllipseMarketMakerContract = contract.getContract({abiName: 'EllipseMarketMaker', address: mmAddress})

  const calls = {
    currentPrice: call(getCurrentPrice, EllipseMarketMakerContract, blockNumber),
    clnReserve: call(EllipseMarketMakerContract.methods.R1().call, null, blockNumber),
    ccReserve: call(EllipseMarketMakerContract.methods.R2().call, null, blockNumber),
    isOpenForPublic: call(EllipseMarketMakerContract.methods.openForPublic().call, null, blockNumber)
  }

  const response = yield all(calls)

  response.clnReserve = new BigNumber(response.clnReserve)
  response.ccReserve = new BigNumber(response.ccReserve)
  response.isMarketMakerLoaded = true

  yield put({type: actions.FETCH_MARKET_MAKER_DATA.SUCCESS,
    tokenAddress,
    response
  })
}

function * openMarket ({tokenAddress}) {
  const accountAddress = yield select(getAccountAddress)
  const currencyFactoryAddress = yield select(getCurrencyFactoryAddress)

  const CurrencyFactoryContract = contract.getContract({abiName: 'CurrencyFactory',
    address: currencyFactoryAddress
  })

  const receipt = yield CurrencyFactoryContract.methods.openMarket(
    tokenAddress
  ).send({
    from: accountAddress
  })

  if (!Number(receipt.status)) {
    yield put(transactionFailed(actions.OPEN_MARKET, receipt))
    return receipt
  }

  yield put({...transactionSucceeded(actions.OPEN_MARKET, receipt), tokenAddress})

  yield apiCall(processReceipt, receipt)

  return receipt
}

function * handleSuccessfulChange ({tokenAddress, accountAddress}) {
  const token = yield select(getCommunity, tokenAddress)
  yield put(actions.fetchMarketMakerData(tokenAddress, token.mmAddress))
  yield put(balanceOfCln(accountAddress))
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
    tryTakeEvery(actions.FETCH_MARKET_MAKER_DATA, fetchMarketMakerData),
    tryTakeEvery(actions.PREDICT_CLN_PRICES, predictClnPrices, 1),
    tryTakeEvery(actions.OPEN_MARKET, openMarket, 1),
    takeEvery(actions.CHANGE.SUCCESS, handleSuccessfulChange)
  ])
}
