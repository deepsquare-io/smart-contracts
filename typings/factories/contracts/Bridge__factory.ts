/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { Bridge, BridgeInterface } from "../../contracts/Bridge";

const _abi = [
  {
    inputs: [
      {
        internalType: "contract DeepSquare",
        name: "_DPS",
        type: "address",
      },
      {
        internalType: "contract Square",
        name: "_SQR",
        type: "address",
      },
      {
        internalType: "contract IEligibility",
        name: "_eligibility",
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
        internalType: "contract DeepSquare",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "SQR",
    outputs: [
      {
        internalType: "contract Square",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "eligibility",
    outputs: [
      {
        internalType: "contract IEligibility",
        name: "",
        type: "address",
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
        internalType: "contract IEligibility",
        name: "newEligibility",
        type: "address",
      },
    ],
    name: "setEligibility",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "swapDPStoSQR",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "swapSQRtoDPS",
    outputs: [],
    stateMutability: "nonpayable",
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
  "0x608060405269054b40b1f852bda0000060045534801561001e57600080fd5b506040516109d93803806109d983398101604081905261003d916100f0565b61004633610088565b600180546001600160a01b039485166001600160a01b03199182161790915560028054938516938216939093179092556003805491909316911617905561013d565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6001600160a01b03811681146100ed57600080fd5b50565b60008060006060848603121561010557600080fd5b8351610110816100d8565b6020850151909350610121816100d8565b6040850151909250610132816100d8565b809150509250925092565b61088d8061014c6000396000f3fe608060405234801561001057600080fd5b50600436106100935760003560e01c80638da5cb5b116100665780638da5cb5b146100f7578063b1b8bf1714610108578063eb10d3011461011b578063ef4e06ec1461012e578063f2fde38b1461014157600080fd5b806303208aeb146100985780630dc14000146100c75780636f0ffb9f146100da578063715018a6146100ef575b600080fd5b6002546100ab906001600160a01b031681565b6040516001600160a01b03909116815260200160405180910390f35b6003546100ab906001600160a01b031681565b6100ed6100e8366004610750565b610154565b005b6100ed6101a9565b6000546001600160a01b03166100ab565b6100ed610116366004610774565b6101df565b6100ed610129366004610774565b6102f2565b6001546100ab906001600160a01b031681565b6100ed61014f366004610750565b610650565b6000546001600160a01b031633146101875760405162461bcd60e51b815260040161017e9061078d565b60405180910390fd5b600380546001600160a01b0319166001600160a01b0392909216919091179055565b6000546001600160a01b031633146101d35760405162461bcd60e51b815260040161017e9061078d565b6101dd60006106eb565b565b6001546040516323b872dd60e01b8152336004820152306024820152604481018390526001600160a01b03909116906323b872dd90606401602060405180830381600087803b15801561023157600080fd5b505af1158015610245573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061026991906107c2565b5060025460405163a9059cbb60e01b8152336004820152602481018390526001600160a01b039091169063a9059cbb90604401602060405180830381600087803b1580156102b657600080fd5b505af11580156102ca573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102ee91906107c2565b5050565b600480546002546040516370a0823160e01b8152339381019390935290916001600160a01b03909116906370a082319060240160206040518083038186803b15801561033d57600080fd5b505afa158015610351573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061037591906107e4565b6001546040516370a0823160e01b81523360048201526001600160a01b03909116906370a082319060240160206040518083038186803b1580156103b857600080fd5b505afa1580156103cc573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103f091906107e4565b6103fa91906107fd565b101561045d5760405162461bcd60e51b815260206004820152602c60248201527f4272696467653a20746f74616c2062616c616e63657320617265206e6f74206260448201526b656c6f77206d696e696d756d60a01b606482015260840161017e565b600354604051636a5b5aed60e11b81523360048201526000916001600160a01b03169063d4b6b5da906024016040805180830381600087803b1580156104a257600080fd5b505af11580156104b6573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104da9190610823565b9150508082111561053c5760405162461bcd60e51b815260206004820152602660248201527f4272696467653a20616d6f756e742065786365656473207065726d6974746564604482015265081b1a5b5a5d60d21b606482015260840161017e565b6002546040516323b872dd60e01b8152336004820152306024820152604481018490526001600160a01b03909116906323b872dd90606401602060405180830381600087803b15801561058e57600080fd5b505af11580156105a2573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105c691906107c2565b5060015460405163a9059cbb60e01b8152336004820152602481018490526001600160a01b039091169063a9059cbb90604401602060405180830381600087803b15801561061357600080fd5b505af1158015610627573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061064b91906107c2565b505050565b6000546001600160a01b0316331461067a5760405162461bcd60e51b815260040161017e9061078d565b6001600160a01b0381166106df5760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b606482015260840161017e565b6106e8816106eb565b50565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6001600160a01b03811681146106e857600080fd5b60006020828403121561076257600080fd5b813561076d8161073b565b9392505050565b60006020828403121561078657600080fd5b5035919050565b6020808252818101527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604082015260600190565b6000602082840312156107d457600080fd5b8151801515811461076d57600080fd5b6000602082840312156107f657600080fd5b5051919050565b6000821982111561081e57634e487b7160e01b600052601160045260246000fd5b500190565b6000806040838503121561083657600080fd5b825160ff8116811461084757600080fd5b602093909301519294929350505056fea2646970667358221220092916695a0033380adc62d50bc2aef99cfaa1483ffec7e680acd3584664a81a64736f6c63430008090033";

type BridgeConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: BridgeConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Bridge__factory extends ContractFactory {
  constructor(...args: BridgeConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _DPS: string,
    _SQR: string,
    _eligibility: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<Bridge> {
    return super.deploy(
      _DPS,
      _SQR,
      _eligibility,
      overrides || {}
    ) as Promise<Bridge>;
  }
  override getDeployTransaction(
    _DPS: string,
    _SQR: string,
    _eligibility: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      _DPS,
      _SQR,
      _eligibility,
      overrides || {}
    );
  }
  override attach(address: string): Bridge {
    return super.attach(address) as Bridge;
  }
  override connect(signer: Signer): Bridge__factory {
    return super.connect(signer) as Bridge__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): BridgeInterface {
    return new utils.Interface(_abi) as BridgeInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): Bridge {
    return new Contract(address, _abi, signerOrProvider) as Bridge;
  }
}
