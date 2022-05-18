/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  SpenderSecurity,
  SpenderSecurityInterface,
} from "../../../../contracts/legacy/v1.1/SpenderSecurity";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
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
    name: "SPENDER",
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
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "validateTokenTransfer",
    outputs: [],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b5061001c60003361004b565b6100467fa2cac083293772ca6820c9740cb63f055c62ed365baba8fc5026f75b1d6bc37a3361004b565b6100ea565b6000828152602081815260408083206001600160a01b038516845290915290205460ff166100e6576000828152602081815260408083206001600160a01b03851684529091529020805460ff191660011790556100a53390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45b5050565b6108cc806100f96000396000f3fe608060405234801561001057600080fd5b50600436106100935760003560e01c80635e1e08c5116100665780635e1e08c51461011957806391d148541461012c578063a217fddf1461013f578063bc17c29014610147578063d547741f1461016e57600080fd5b806301ffc9a714610098578063248a9ca3146100c05780632f2ff15d146100f157806336568abe14610106575b600080fd5b6100ab6100a636600461065c565b610181565b60405190151581526020015b60405180910390f35b6100e36100ce366004610686565b60009081526020819052604090206001015490565b6040519081526020016100b7565b6101046100ff3660046106bb565b6101b8565b005b6101046101143660046106bb565b6101e3565b6101046101273660046106e7565b610266565b6100ab61013a3660046106bb565b61031d565b6100e3600081565b6100e37fa2cac083293772ca6820c9740cb63f055c62ed365baba8fc5026f75b1d6bc37a81565b61010461017c3660046106bb565b610346565b60006001600160e01b03198216637965db0b60e01b14806101b257506301ffc9a760e01b6001600160e01b03198316145b92915050565b6000828152602081905260409020600101546101d4813361036c565b6101de83836103d0565b505050565b6001600160a01b03811633146102585760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b60648201526084015b60405180910390fd5b6102628282610454565b5050565b6102907fa2cac083293772ca6820c9740cb63f055c62ed365baba8fc5026f75b1d6bc37a8561036c565b826001600160a01b0316846001600160a01b0316146103175760405162461bcd60e51b815260206004820152603860248201527f5370656e64657253656375726974793a2063616e6e6f74206d6f766520746f6b60448201527f656e732066726f6d20616e6f74686572206163636f756e740000000000000000606482015260840161024f565b50505050565b6000918252602082815260408084206001600160a01b0393909316845291905290205460ff1690565b600082815260208190526040902060010154610362813361036c565b6101de8383610454565b610376828261031d565b6102625761038e816001600160a01b031660146104b9565b6103998360206104b9565b6040516020016103aa92919061075e565b60408051601f198184030181529082905262461bcd60e51b825261024f916004016107d3565b6103da828261031d565b610262576000828152602081815260408083206001600160a01b03851684529091529020805460ff191660011790556104103390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b61045e828261031d565b15610262576000828152602081815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b606060006104c883600261081c565b6104d390600261083b565b67ffffffffffffffff8111156104eb576104eb610853565b6040519080825280601f01601f191660200182016040528015610515576020820181803683370190505b509050600360fc1b8160008151811061053057610530610869565b60200101906001600160f81b031916908160001a905350600f60fb1b8160018151811061055f5761055f610869565b60200101906001600160f81b031916908160001a905350600061058384600261081c565b61058e90600161083b565b90505b6001811115610606576f181899199a1a9b1b9c1cb0b131b232b360811b85600f16601081106105c2576105c2610869565b1a60f81b8282815181106105d8576105d8610869565b60200101906001600160f81b031916908160001a90535060049490941c936105ff8161087f565b9050610591565b5083156106555760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e74604482015260640161024f565b9392505050565b60006020828403121561066e57600080fd5b81356001600160e01b03198116811461065557600080fd5b60006020828403121561069857600080fd5b5035919050565b80356001600160a01b03811681146106b657600080fd5b919050565b600080604083850312156106ce57600080fd5b823591506106de6020840161069f565b90509250929050565b600080600080608085870312156106fd57600080fd5b6107068561069f565b93506107146020860161069f565b92506107226040860161069f565b9396929550929360600135925050565b60005b8381101561074d578181015183820152602001610735565b838111156103175750506000910152565b7f416363657373436f6e74726f6c3a206163636f756e7420000000000000000000815260008351610796816017850160208801610732565b7001034b99036b4b9b9b4b733903937b6329607d1b60179184019182015283516107c7816028840160208801610732565b01602801949350505050565b60208152600082518060208401526107f2816040850160208701610732565b601f01601f19169190910160400192915050565b634e487b7160e01b600052601160045260246000fd5b600081600019048311821515161561083657610836610806565b500290565b6000821982111561084e5761084e610806565b500190565b634e487b7160e01b600052604160045260246000fd5b634e487b7160e01b600052603260045260246000fd5b60008161088e5761088e610806565b50600019019056fea2646970667358221220bddc61314a3055c6599f8642efa13f8c86699b6a8ea496ec52df86bb52f6b7d764736f6c63430008090033";

type SpenderSecurityConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: SpenderSecurityConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class SpenderSecurity__factory extends ContractFactory {
  constructor(...args: SpenderSecurityConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<SpenderSecurity> {
    return super.deploy(overrides || {}) as Promise<SpenderSecurity>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): SpenderSecurity {
    return super.attach(address) as SpenderSecurity;
  }
  override connect(signer: Signer): SpenderSecurity__factory {
    return super.connect(signer) as SpenderSecurity__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): SpenderSecurityInterface {
    return new utils.Interface(_abi) as SpenderSecurityInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): SpenderSecurity {
    return new Contract(address, _abi, signerOrProvider) as SpenderSecurity;
  }
}
