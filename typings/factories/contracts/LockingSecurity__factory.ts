/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  LockingSecurity,
  LockingSecurityInterface,
} from "../../contracts/LockingSecurity";

const _abi = [
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "_token",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "previousAdminRole",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "newAdminRole",
        type: "bytes32",
      },
    ],
    name: "RoleAdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleGranted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleRevoked",
    type: "event",
  },
  {
    inputs: [],
    name: "DEFAULT_ADMIN_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "DPS",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "SALE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "currentDate",
        type: "uint256",
      },
    ],
    name: "available",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "bridge",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
    ],
    name: "getRoleAdmin",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "grantRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "hasRole",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "investor",
        type: "address",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "release",
            type: "uint256",
          },
        ],
        internalType: "struct LockingSecurity.Lock",
        name: "details",
        type: "tuple",
      },
    ],
    name: "lock",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "investors",
        type: "address[]",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "release",
            type: "uint256",
          },
        ],
        internalType: "struct LockingSecurity.Lock[]",
        name: "details",
        type: "tuple[]",
      },
    ],
    name: "lockBatch",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "currentDate",
        type: "uint256",
      },
    ],
    name: "locked",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "investor",
        type: "address",
      },
    ],
    name: "locks",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "release",
            type: "uint256",
          },
        ],
        internalType: "struct LockingSecurity.Lock[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "renounceRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "revokeRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "currentDate",
        type: "uint256",
      },
    ],
    name: "schedule",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "release",
            type: "uint256",
          },
        ],
        internalType: "struct LockingSecurity.Lock[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newBridge",
        type: "address",
      },
    ],
    name: "upgradeBridge",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "validateTokenTransfer",
    outputs: [],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "investor",
        type: "address",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "release",
            type: "uint256",
          },
        ],
        internalType: "struct LockingSecurity.Lock",
        name: "details",
        type: "tuple",
      },
    ],
    name: "vest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "investors",
        type: "address[]",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "release",
            type: "uint256",
          },
        ],
        internalType: "struct LockingSecurity.Lock[]",
        name: "details",
        type: "tuple[]",
      },
    ],
    name: "vestBatch",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b506040516200177b3803806200177b833981016040819052620000349162000161565b6200003f336200006e565b600280546001600160a01b0319166001600160a01b03831617905562000067600033620000c0565b5062000193565b600180546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b6000828152602081815260408083206001600160a01b038516845290915290205460ff166200015d576000828152602081815260408083206001600160a01b03851684529091529020805460ff191660011790556200011c3390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45b5050565b6000602082840312156200017457600080fd5b81516001600160a01b03811681146200018c57600080fd5b9392505050565b6115d880620001a36000396000f3fe608060405234801561001057600080fd5b506004361061014d5760003560e01c8063715018a6116100c3578063d547741f1161007c578063d547741f146102e7578063e78cea92146102fa578063ef4e06ec1461030d578063f0d4af1a14610320578063f2fde38b14610333578063f8724aba1461034657600080fd5b8063715018a6146102795780638da5cb5b1461028157806391d14854146102a6578063a217fddf146102b9578063b84c8ce5146102c1578063bf7bab73146102d457600080fd5b80632f2ff15d116101155780632f2ff15d146101e657806336568abe146101f95780633c82b5791461020c5780634db08aea1461021f5780635de9a137146102465780635e1e08c51461026657600080fd5b806301ffc9a714610152578063054f5b6a1461017a578063082d78b81461018f578063109d010d146101a2578063248a9ca3146101b5575b600080fd5b610165610160366004611071565b610359565b60405190151581526020015b60405180910390f35b61018d6101883660046110b7565b610390565b005b61018d61019d366004611168565b6103bf565b61018d6101b0366004611229565b61048c565b6101d86101c33660046112e9565b60009081526020819052604090206001015490565b604051908152602001610171565b61018d6101f4366004611302565b61055a565b61018d610207366004611302565b610585565b61018d61021a366004611168565b610603565b6101d87f9f566e66e3fe95040f2178cc6bf558ca13dd7af2eac028523bbf86acda6b390f81565b6102596102543660046110b7565b61064e565b6040516101719190611325565b61018d610274366004611374565b6106d7565b61018d61081f565b6001546001600160a01b03165b6040516001600160a01b039091168152602001610171565b6101656102b4366004611302565b610885565b6101d8600081565b6102596102cf3660046113bf565b6108ae565b6101d86102e23660046113bf565b610a6e565b61018d6102f5366004611302565b610ad0565b60035461028e906001600160a01b031681565b60025461028e906001600160a01b031681565b61018d61032e366004611229565b610af6565b61018d6103413660046110b7565b610bbf565b6101d86103543660046113bf565b610c8a565b60006001600160e01b03198216637965db0b60e01b148061038a57506301ffc9a760e01b6001600160e01b03198316145b92915050565b600061039c8133610d2f565b50600380546001600160a01b0319166001600160a01b0392909216919091179055565b60006103cb8133610d2f565b6001600160a01b0383811660008181526004602081815260408084208054600180820183559186529483902089516002968702909101818155938a01519390910192909255925492516323b872dd60e01b8152339281019290925260248201939093526044810192909252909116906323b872dd906064016020604051808303816000875af1158015610462573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061048691906113e9565b50505050565b60006104988133610d2f565b81518351146105005760405162461bcd60e51b815260206004820152602960248201527f4c6f636b696e6753656375726974793a206c6f636b2062617463682073697a65604482015268040dad2e6dac2e8c6d60bb1b60648201526084015b60405180910390fd5b60005b8351811015610486576105488482815181106105215761052161140b565b602002602001015184838151811061053b5761053b61140b565b6020026020010151610603565b8061055281611437565b915050610503565b6000828152602081905260409020600101546105768133610d2f565b6105808383610d93565b505050565b6001600160a01b03811633146105f55760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b60648201526084016104f7565b6105ff8282610e17565b5050565b600061060f8133610d2f565b506001600160a01b0390911660009081526004602090815260408220805460018181018355918452928290208451600290940201928355920151910155565b6001600160a01b0381166000908152600460209081526040808320805482518185028101850190935280835260609492939192909184015b828210156106cc57838290600052602060002090600202016040518060400160405290816000820154815260200160018201548152505081526020019060010190610686565b505050509050919050565b6003546001600160a01b03858116911614806106f957506106f9600085610885565b8061072957506107297f9f566e66e3fe95040f2178cc6bf558ca13dd7af2eac028523bbf86acda6b390f85610885565b610486576003546001600160a01b038381169116146107a15760405162461bcd60e51b815260206004820152602e60248201527f4c6f636b696e6753656375726974793a2064657374696e6174696f6e2069732060448201526d6e6f74207468652062726964676560901b60648201526084016104f7565b6107ab8342610c8a565b81106104865760405162461bcd60e51b815260206004820152603960248201527f4c6f636b696e6753656375726974793a207472616e7366657220616d6f756e7460448201527f206578636565647320617661696c61626c6520746f6b656e730000000000000060648201526084016104f7565b6001546001600160a01b031633146108795760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064016104f7565b6108836000610e7c565b565b6000918252602082815260408084206001600160a01b0393909316845291905290205460ff1690565b606060006108bb8461064e565b90506000815167ffffffffffffffff8111156108d9576108d96110d2565b60405190808252806020026020018201604052801561091e57816020015b60408051808201909152600080825260208201528152602001906001900390816108f75790505b5090506000805b83518110156109aa57858482815181106109415761094161140b565b60200260200101516020015110610998578381815181106109645761096461140b565b602002602001015183838151811061097e5761097e61140b565b6020026020010181905250818061099490611437565b9250505b806109a281611437565b915050610925565b5060008167ffffffffffffffff8111156109c6576109c66110d2565b604051908082528060200260200182016040528015610a0b57816020015b60408051808201909152600080825260208201528152602001906001900390816109e45790505b50905060005b82811015610a6357838181518110610a2b57610a2b61140b565b6020026020010151828281518110610a4557610a4561140b565b60200260200101819052508080610a5b90611437565b915050610a11565b509695505050505050565b600080610a7b84846108ae565b90506000805b8251811015610ac757828181518110610a9c57610a9c61140b565b60200260200101516000015182610ab39190611450565b915080610abf81611437565b915050610a81565b50949350505050565b600082815260208190526040902060010154610aec8133610d2f565b6105808383610e17565b6000610b028133610d2f565b8151835114610b655760405162461bcd60e51b815260206004820152602960248201527f4c6f636b696e6753656375726974793a20766573742062617463682073697a65604482015268040dad2e6dac2e8c6d60bb1b60648201526084016104f7565b60005b835181101561048657610bad848281518110610b8657610b8661140b565b6020026020010151848381518110610ba057610ba061140b565b60200260200101516103bf565b80610bb781611437565b915050610b68565b6001546001600160a01b03163314610c195760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064016104f7565b6001600160a01b038116610c7e5760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b60648201526084016104f7565b610c8781610e7c565b50565b6002546040516370a0823160e01b81526001600160a01b03848116600483015260009283929116906370a0823190602401602060405180830381865afa158015610cd8573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610cfc9190611468565b90506000610d0a8585610a6e565b905080821115610d2357610d1e8183611481565b610d26565b60005b95945050505050565b610d398282610885565b6105ff57610d51816001600160a01b03166014610ece565b610d5c836020610ece565b604051602001610d6d9291906114c4565b60408051601f198184030181529082905262461bcd60e51b82526104f791600401611539565b610d9d8282610885565b6105ff576000828152602081815260408083206001600160a01b03851684529091529020805460ff19166001179055610dd33390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b610e218282610885565b156105ff576000828152602081815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b600180546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b60606000610edd83600261156c565b610ee8906002611450565b67ffffffffffffffff811115610f0057610f006110d2565b6040519080825280601f01601f191660200182016040528015610f2a576020820181803683370190505b509050600360fc1b81600081518110610f4557610f4561140b565b60200101906001600160f81b031916908160001a905350600f60fb1b81600181518110610f7457610f7461140b565b60200101906001600160f81b031916908160001a9053506000610f9884600261156c565b610fa3906001611450565b90505b600181111561101b576f181899199a1a9b1b9c1cb0b131b232b360811b85600f1660108110610fd757610fd761140b565b1a60f81b828281518110610fed57610fed61140b565b60200101906001600160f81b031916908160001a90535060049490941c936110148161158b565b9050610fa6565b50831561106a5760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e7460448201526064016104f7565b9392505050565b60006020828403121561108357600080fd5b81356001600160e01b03198116811461106a57600080fd5b80356001600160a01b03811681146110b257600080fd5b919050565b6000602082840312156110c957600080fd5b61106a8261109b565b634e487b7160e01b600052604160045260246000fd5b604051601f8201601f1916810167ffffffffffffffff81118282101715611111576111116110d2565b604052919050565b60006040828403121561112b57600080fd5b6040516040810181811067ffffffffffffffff8211171561114e5761114e6110d2565b604052823581526020928301359281019290925250919050565b6000806060838503121561117b57600080fd5b6111848361109b565b91506111938460208501611119565b90509250929050565b600067ffffffffffffffff8211156111b6576111b66110d2565b5060051b60200190565b600082601f8301126111d157600080fd5b813560206111e66111e18361119c565b6110e8565b82815260069290921b8401810191818101908684111561120557600080fd5b8286015b84811015610a635761121b8882611119565b835291830191604001611209565b6000806040838503121561123c57600080fd5b823567ffffffffffffffff8082111561125457600080fd5b818501915085601f83011261126857600080fd5b813560206112786111e18361119c565b82815260059290921b8401810191818101908984111561129757600080fd5b948201945b838610156112bc576112ad8661109b565b8252948201949082019061129c565b965050860135925050808211156112d257600080fd5b506112df858286016111c0565b9150509250929050565b6000602082840312156112fb57600080fd5b5035919050565b6000806040838503121561131557600080fd5b823591506111936020840161109b565b602080825282518282018190526000919060409081850190868401855b8281101561136757815180518552860151868501529284019290850190600101611342565b5091979650505050505050565b6000806000806080858703121561138a57600080fd5b6113938561109b565b93506113a16020860161109b565b92506113af6040860161109b565b9396929550929360600135925050565b600080604083850312156113d257600080fd5b6113db8361109b565b946020939093013593505050565b6000602082840312156113fb57600080fd5b8151801515811461106a57600080fd5b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b60006001820161144957611449611421565b5060010190565b6000821982111561146357611463611421565b500190565b60006020828403121561147a57600080fd5b5051919050565b60008282101561149357611493611421565b500390565b60005b838110156114b357818101518382015260200161149b565b838111156104865750506000910152565b7f416363657373436f6e74726f6c3a206163636f756e74200000000000000000008152600083516114fc816017850160208801611498565b7001034b99036b4b9b9b4b733903937b6329607d1b601791840191820152835161152d816028840160208801611498565b01602801949350505050565b6020815260008251806020840152611558816040850160208701611498565b601f01601f19169190910160400192915050565b600081600019048311821515161561158657611586611421565b500290565b60008161159a5761159a611421565b50600019019056fea2646970667358221220a38bce21f10c317cba75a7e984fd0814bfbbc2eee277dba202301ae854acfa7264736f6c634300080d0033";

type LockingSecurityConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: LockingSecurityConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class LockingSecurity__factory extends ContractFactory {
  constructor(...args: LockingSecurityConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _token: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<LockingSecurity> {
    return super.deploy(_token, overrides || {}) as Promise<LockingSecurity>;
  }
  override getDeployTransaction(
    _token: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_token, overrides || {});
  }
  override attach(address: string): LockingSecurity {
    return super.attach(address) as LockingSecurity;
  }
  override connect(signer: Signer): LockingSecurity__factory {
    return super.connect(signer) as LockingSecurity__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): LockingSecurityInterface {
    return new utils.Interface(_abi) as LockingSecurityInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): LockingSecurity {
    return new Contract(address, _abi, signerOrProvider) as LockingSecurity;
  }
}
