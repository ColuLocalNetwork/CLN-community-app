const ContractsType = [
  {
    label: 'Brige to fuze',
    value: true,
    text: `A bridge is being used to transfer ERC-20 assets between Ethereum's mainnet and the Fuse sidechain. This action will add your token to the list of assets the bridge support.`,
    key: 'bridge',
    readOnly: true
  },
  {
    label: 'Members list',
    value: false,
    text: `A list that holds the members of the community and allows managing apporved users, add merchants and manage permissions. Managing the list trough a smart contract allows greater flexibility and provides security and transparency out of the box.`,
    key: 'membersList'
  },
  {
    label: 'Community contract | coming soon!',
    value: false,
    text: `More contracts and features coming soon!`,
    key: null
  }
]

export default ContractsType
