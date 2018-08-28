import {BigNumber} from 'bignumber.js'

export const ROUND_PRECISION = 4
export const MAX_PRECISION = 18

export const formatWei = (value) => new BigNumber(value).div(1e18).toFormat(ROUND_PRECISION, BigNumber.ROUND_HALF_UP)
export const formatEther = (value) => new BigNumber(value).toFormat(ROUND_PRECISION, BigNumber.ROUND_HALF_UP)

export const nameToSymbol = (name) => {
  const words = name.trim(' ').split(/\s+/)
  if (words.length === 1) {
    return words[0].substr(0, 3).toUpperCase()
  } else if (words.length === 2) {
    return (words[0].substr(0, 2) + words[1].charAt(0)).toUpperCase()
  } else if (words.length === 3) {
    return (words[0].charAt(0) + words[1].charAt(0) + words[2].charAt(0)).toUpperCase()
  } else if (words.length >= 4) {
    return (words[0].charAt(0) + words[1].charAt(0) + words[2].charAt(0) + words[3].charAt(0)).toUpperCase()
  }
}
