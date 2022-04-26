/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  VotingDelegation,
  VotingDelegationInterface,
} from "../../contracts/VotingDelegation";

const _abi = [
  {
    inputs: [
      {
        internalType: "contract IERC20Metadata",
        name: "_DPS",
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
    inputs: [],
    name: "DPS",
    outputs: [
      {
        internalType: "contract IERC20Metadata",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "ballotFactory",
    outputs: [
      {
        internalType: "contract BallotFactory",
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
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "string",
        name: "topic",
        type: "string",
      },
    ],
    name: "delegate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "voter",
        type: "address",
      },
      {
        internalType: "string",
        name: "topic",
        type: "string",
      },
    ],
    name: "delegationAmount",
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
        name: "to",
        type: "address",
      },
      {
        internalType: "string",
        name: "topic",
        type: "string",
      },
    ],
    name: "delegators",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "voter",
        type: "address",
      },
      {
        internalType: "string",
        name: "topic",
        type: "string",
      },
    ],
    name: "hasDelegated",
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
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "string",
        name: "topic",
        type: "string",
      },
    ],
    name: "representative",
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
];

const _bytecode =
  "0x60c060405269054b40b1f852bda0000060a05234801561001e57600080fd5b50604051610d07380380610d0783398101604081905261003d91610110565b610046336100c0565b6001600160a01b0381166100af5760405162461bcd60e51b815260206004820152602660248201527f566f74696e6744656c65676174696f6e3a204450532061646472657373206973604482015265103d32b9379760d11b606482015260840160405180910390fd5b6001600160a01b0316608052610140565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b60006020828403121561012257600080fd5b81516001600160a01b038116811461013957600080fd5b9392505050565b60805160a051610b9461017360003960006103910152600081816101930152818161024a01526103b30152610b946000f3fe608060405234801561001057600080fd5b506004361061009e5760003560e01c80638da5cb5b116100665780638da5cb5b14610156578063ceb0b9351461017b578063ef4e06ec1461018e578063f2fde38b146101b5578063fc196713146101c857600080fd5b80630bef400c146100a3578063442f6551146100c95780635e12967914610119578063694ec60e1461012e578063715018a61461014e575b600080fd5b6100b66100b136600461097f565b610206565b6040519081526020015b60405180910390f35b6101096100d736600461097f565b6001600160a01b0391821660009081526003602090815260408083208451948301949094208352929052205416151590565b60405190151581526020016100c0565b61012c61012736600461097f565b610372565b005b61014161013c36600461097f565b610676565b6040516100c09190610a41565b61012c6107cc565b6000546001600160a01b03165b6040516001600160a01b0390911681526020016100c0565b600154610163906001600160a01b031681565b6101637f000000000000000000000000000000000000000000000000000000000000000081565b61012c6101c3366004610a8e565b610832565b6101636101d636600461097f565b6001600160a01b039182166000908152600360209081526040808320845194830194909420835292905220541690565b805160208201206000908190815b6001600160a01b038616600090815260026020908152604080832085845290915290206001015463ffffffff82161015610368577f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03166370a0823160026000896001600160a01b03166001600160a01b0316815260200190815260200160002060008581526020019081526020016000206001018363ffffffff16815481106102c7576102c7610ab0565b60009182526020909120015460405160e083901b6001600160e01b03191681526001600160a01b03909116600482015260240160206040518083038186803b15801561031257600080fd5b505afa158015610326573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061034a9190610ac6565b6103549084610af5565b92508061036081610b0d565b915050610214565b5090949350505050565b6040516370a0823160e01b81526001600160a01b0383811660048301527f0000000000000000000000000000000000000000000000000000000000000000917f0000000000000000000000000000000000000000000000000000000000000000909116906370a082319060240160206040518083038186803b1580156103f757600080fd5b505afa15801561040b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061042f9190610ac6565b10158061044357506001600160a01b038216155b6104a85760405162461bcd60e51b815260206004820152602b60248201527f566f74696e6744656c65676174696f6e3a2050726f787920686173206e6f742060448201526a32b737bab3b4102228299760a91b60648201526084015b60405180910390fd5b805160208083019190912033600090815260038352604080822083835290935291909120546001600160a01b0316156105df573360008181526003602090815260408083208584528252808320546001600160a01b031683526002825280832085845282528083209383529083905290205460018281018054909161052c91610b31565b8154811061053c5761053c610ab0565b6000918252602090912001546001830180546001600160a01b03909216918390811061056a5761056a610ab0565b9060005260206000200160006101000a8154816001600160a01b0302191690836001600160a01b03160217905550816001018054806105ab576105ab610b48565b60008281526020808220830160001990810180546001600160a01b0319169055909201909255338252929092525060408120555b336000908152600360209081526040808320848452909152902080546001600160a01b0319166001600160a01b03851690811790915515610671576001600160a01b038316600090815260026020908152604080832084845282528083206001808201805433808852938652938620849055908301815584529190922090910180546001600160a01b03191690911790555b505050565b80516020808301919091206001600160a01b0384166000908152600283526040808220838352909352918220600101546060929067ffffffffffffffff8111156106c2576106c2610969565b6040519080825280602002602001820160405280156106eb578160200160208202803683370190505b50905060005b6001600160a01b038616600090815260026020908152604080832086845290915290206001015463ffffffff821610156107c3576001600160a01b03861660009081526002602090815260408083208684529091529020600101805463ffffffff831690811061076357610763610ab0565b9060005260206000200160009054906101000a90046001600160a01b0316828263ffffffff168151811061079957610799610ab0565b6001600160a01b0390921660209283029190910190910152806107bb81610b0d565b9150506106f1565b50949350505050565b6000546001600160a01b031633146108265760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015260640161049f565b61083060006108fd565b565b6000546001600160a01b0316331461088c5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015260640161049f565b6001600160a01b0381166108f15760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b606482015260840161049f565b6108fa816108fd565b50565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b80356001600160a01b038116811461096457600080fd5b919050565b634e487b7160e01b600052604160045260246000fd5b6000806040838503121561099257600080fd5b61099b8361094d565b9150602083013567ffffffffffffffff808211156109b857600080fd5b818501915085601f8301126109cc57600080fd5b8135818111156109de576109de610969565b604051601f8201601f19908116603f01168101908382118183101715610a0657610a06610969565b81604052828152886020848701011115610a1f57600080fd5b8260208601602083013760006020848301015280955050505050509250929050565b6020808252825182820181905260009190848201906040850190845b81811015610a825783516001600160a01b031683529284019291840191600101610a5d565b50909695505050505050565b600060208284031215610aa057600080fd5b610aa98261094d565b9392505050565b634e487b7160e01b600052603260045260246000fd5b600060208284031215610ad857600080fd5b5051919050565b634e487b7160e01b600052601160045260246000fd5b60008219821115610b0857610b08610adf565b500190565b600063ffffffff80831681811415610b2757610b27610adf565b6001019392505050565b600082821015610b4357610b43610adf565b500390565b634e487b7160e01b600052603160045260246000fdfea2646970667358221220de3dd9ab89334784668138d7f747b8ed6b497a1b8260ea6ff6be6a94ae78d8a964736f6c63430008090033";

type VotingDelegationConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: VotingDelegationConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class VotingDelegation__factory extends ContractFactory {
  constructor(...args: VotingDelegationConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _DPS: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<VotingDelegation> {
    return super.deploy(_DPS, overrides || {}) as Promise<VotingDelegation>;
  }
  override getDeployTransaction(
    _DPS: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_DPS, overrides || {});
  }
  override attach(address: string): VotingDelegation {
    return super.attach(address) as VotingDelegation;
  }
  override connect(signer: Signer): VotingDelegation__factory {
    return super.connect(signer) as VotingDelegation__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): VotingDelegationInterface {
    return new utils.Interface(_abi) as VotingDelegationInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): VotingDelegation {
    return new Contract(address, _abi, signerOrProvider) as VotingDelegation;
  }
}