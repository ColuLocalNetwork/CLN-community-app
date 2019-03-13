module.exports = [
  {
    'type': 'function',
    'stateMutability': 'nonpayable',
    'payable': false,
    'outputs': [],
    'name': 'addBridgeMapping',
    'inputs': [
      {
        'type': 'address',
        'name': '_foreignToken'
      },
      {
        'type': 'address',
        'name': '_homeToken'
      },
      {
        'type': 'address',
        'name': '_foreignBridge'
      },
      {
        'type': 'address',
        'name': '_homeBridge'
      },
      {
        'type': 'uint256',
        'name': '_foreignStartBlock'
      },
      {
        'type': 'uint256',
        'name': '_homeStartBlock'
      }
    ],
    'constant': false
  },
  {
    'type': 'function',
    'stateMutability': 'pure',
    'payable': false,
    'outputs': [
      {
        'type': 'uint64',
        'name': 'major'
      },
      {
        'type': 'uint64',
        'name': 'minor'
      },
      {
        'type': 'uint64',
        'name': 'patch'
      }
    ],
    'name': 'getBridgeMapperVersion',
    'inputs': [],
    'constant': true
  },
  {
    'type': 'function',
    'stateMutability': 'view',
    'payable': false,
    'outputs': [
      {
        'type': 'address',
        'name': ''
      }
    ],
    'name': 'foreignBridgeByForeignToken',
    'inputs': [
      {
        'type': 'address',
        'name': '_foreignToken'
      }
    ],
    'constant': true
  },
  {
    'type': 'function',
    'stateMutability': 'view',
    'payable': false,
    'outputs': [
      {
        'type': 'uint256',
        'name': ''
      }
    ],
    'name': 'homeStartBlockByForeignToken',
    'inputs': [
      {
        'type': 'address',
        'name': '_foreignToken'
      }
    ],
    'constant': true
  },
  {
    'type': 'function',
    'stateMutability': 'view',
    'payable': false,
    'outputs': [
      {
        'type': 'address',
        'name': ''
      }
    ],
    'name': 'owner',
    'inputs': [],
    'constant': true
  },
  {
    'type': 'function',
    'stateMutability': 'view',
    'payable': false,
    'outputs': [
      {
        'type': 'uint256',
        'name': ''
      }
    ],
    'name': 'foreignStartBlockByForeignToken',
    'inputs': [
      {
        'type': 'address',
        'name': '_foreignToken'
      }
    ],
    'constant': true
  },
  {
    'type': 'function',
    'stateMutability': 'nonpayable',
    'payable': false,
    'outputs': [],
    'name': 'removeBridgeMapping',
    'inputs': [
      {
        'type': 'address',
        'name': '_foreignToken'
      }
    ],
    'constant': false
  },
  {
    'type': 'function',
    'stateMutability': 'nonpayable',
    'payable': false,
    'outputs': [],
    'name': 'initialize',
    'inputs': [
      {
        'type': 'address',
        'name': '_owner'
      }
    ],
    'constant': false
  },
  {
    'type': 'function',
    'stateMutability': 'view',
    'payable': false,
    'outputs': [
      {
        'type': 'address',
        'name': ''
      }
    ],
    'name': 'homeBridgeByForeignToken',
    'inputs': [
      {
        'type': 'address',
        'name': '_foreignToken'
      }
    ],
    'constant': true
  },
  {
    'type': 'function',
    'stateMutability': 'nonpayable',
    'payable': false,
    'outputs': [],
    'name': 'transferOwnership',
    'inputs': [
      {
        'type': 'address',
        'name': 'newOwner'
      }
    ],
    'constant': false
  },
  {
    'type': 'function',
    'stateMutability': 'view',
    'payable': false,
    'outputs': [
      {
        'type': 'address',
        'name': ''
      }
    ],
    'name': 'homeTokenByForeignToken',
    'inputs': [
      {
        'type': 'address',
        'name': '_foreignToken'
      }
    ],
    'constant': true
  },
  {
    'type': 'event',
    'name': 'BridgeMappingUpdated',
    'inputs': [
      {
        'type': 'address',
        'name': 'foreignToken',
        'indexed': true
      },
      {
        'type': 'address',
        'name': 'homeToken',
        'indexed': false
      },
      {
        'type': 'address',
        'name': 'foreignBridge',
        'indexed': false
      },
      {
        'type': 'address',
        'name': 'homeBridge',
        'indexed': false
      },
      {
        'type': 'uint256',
        'name': 'foreignStartBlock',
        'indexed': false
      },
      {
        'type': 'uint256',
        'name': 'homeStartBlock',
        'indexed': false
      }
    ],
    'anonymous': false
  },
  {
    'type': 'event',
    'name': 'BridgeMappingRemoved',
    'inputs': [
      {
        'type': 'address',
        'name': 'foreignToken',
        'indexed': true
      }
    ],
    'anonymous': false
  },
  {
    'type': 'event',
    'name': 'OwnershipTransferred',
    'inputs': [
      {
        'type': 'address',
        'name': 'previousOwner',
        'indexed': false
      },
      {
        'type': 'address',
        'name': 'newOwner',
        'indexed': false
      }
    ],
    'anonymous': false
  }
]
