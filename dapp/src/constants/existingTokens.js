import DaiLogo from 'images/DAI_logo.svg'

export const existingTokens = () => ([
  {
    label: 'DAI',
    value: '0x7d5E6A841Ec195F30911074d920EEc665A973A2D',
    isDisabled: false,
    icon: DaiLogo
  },
  {
    label: 'More token soon!',
    value: undefined,
    isDisabled: true
  }
])

export const checkImportedToken = (token) => {
  return existingTokens().find(({ value, label }) => value === token.address && token.symbol === label)
}
