/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  BallotFactory,
  BallotFactoryInterface,
} from "../../../contracts/factories/BallotFactory";

const _abi = [
  {
    inputs: [
      {
        internalType: "contract IERC20Metadata",
        name: "_DPS",
        type: "address",
      },
      {
        internalType: "address",
        name: "_implementationAddress",
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
        indexed: false,
        internalType: "address",
        name: "ballotAddress",
        type: "address",
      },
    ],
    name: "BallotCreated",
    type: "event",
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
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "ballotAddresses",
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
        internalType: "string",
        name: "subject",
        type: "string",
      },
      {
        internalType: "string",
        name: "topic",
        type: "string",
      },
      {
        internalType: "string[]",
        name: "_choices",
        type: "string[]",
      },
    ],
    name: "createBallot",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getBallots",
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
    inputs: [],
    name: "implementationAddress",
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
        name: "newAddress",
        type: "address",
      },
    ],
    name: "setImplementationAddress",
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
  "0x608060405234801561001057600080fd5b50604051610c77380380610c7783398101604081905261002f9161018a565b61003833610122565b6001600160a01b038216610097576040805162461bcd60e51b8152602060048201526024810191909152600080516020610c378339815191526044820152600080516020610c5783398151915260648201526084015b60405180910390fd5b6001600160a01b0381166100f1576040805162461bcd60e51b8152602060048201526024810191909152600080516020610c378339815191526044820152600080516020610c57833981519152606482015260840161008e565b600180546001600160a01b039384166001600160a01b031991821617909155600380549290931691161790556101c4565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6001600160a01b038116811461018757600080fd5b50565b6000806040838503121561019d57600080fd5b82516101a881610172565b60208401519092506101b981610172565b809150509250929050565b610a64806101d36000396000f3fe608060405234801561001057600080fd5b50600436106100935760003560e01c8063d62d808911610066578063d62d8089146100f2578063eb87c6dc14610105578063ecade2f01461011a578063ef4e06ec1461012d578063f2fde38b1461014057600080fd5b8063715018a6146100985780638da5cb5b146100a2578063a7a98453146100cc578063b97a2319146100df575b600080fd5b6100a0610153565b005b6000546001600160a01b03165b6040516001600160a01b0390911681526020015b60405180910390f35b6100af6100da366004610684565b610192565b6003546100af906001600160a01b031681565b6100a0610100366004610754565b6101bc565b61010d6103d0565b6040516100c3919061085e565b6100a06101283660046108c0565b610432565b6001546100af906001600160a01b031681565b6100a061014e3660046108c0565b6104fc565b6000546001600160a01b031633146101865760405162461bcd60e51b815260040161017d906108e4565b60405180910390fd5b6101906000610597565b565b600281815481106101a257600080fd5b6000918252602090912001546001600160a01b0316905081565b6000546001600160a01b031633146101e65760405162461bcd60e51b815260040161017d906108e4565b6003546001600160a01b031660006101fd826105e7565b9050806001600160a01b0316631917d6c0836001600160a01b031663ef4e06ec6040518163ffffffff1660e01b815260040160206040518083038186803b15801561024757600080fd5b505afa15801561025b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061027f9190610919565b846001600160a01b031663ec5568896040518163ffffffff1660e01b815260040160206040518083038186803b1580156102b857600080fd5b505afa1580156102cc573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102f09190610919565b308989896040518763ffffffff1660e01b815260040161031596959493929190610983565b600060405180830381600087803b15801561032f57600080fd5b505af1158015610343573d6000803e3d6000fd5b5050600280546001810182556000919091527f405787fa12a823e0f2b7631cc41b3ba8828b3321ca811111fa75cd3aa3bb5ace0180546001600160a01b0319166001600160a01b0385169081179091556040519081527f165f4a0bebf649c196135ba0519a9a51da33d33a9e4d096b71050c2c97ec670f9250602001905060405180910390a15050505050565b6060600280548060200260200160405190810160405280929190818152602001828054801561042857602002820191906000526020600020905b81546001600160a01b0316815260019091019060200180831161040a575b5050505050905090565b6000546001600160a01b0316331461045c5760405162461bcd60e51b815260040161017d906108e4565b6001600160a01b0381166104da576040805162461bcd60e51b81526020600482015260248101919091527f42616c6c6f74466163746f72793a20496d706c656d656e746174696f6e20616460448201527f64726573732073686f756c64206e6f74206265207a65726f2061646472657373606482015260840161017d565b600380546001600160a01b0319166001600160a01b0392909216919091179055565b6000546001600160a01b031633146105265760405162461bcd60e51b815260040161017d906108e4565b6001600160a01b03811661058b5760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b606482015260840161017d565b61059481610597565b50565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6000604051733d602d80600a3d3981f3363d3d373d3d3d363d7360601b81528260601b60148201526e5af43d82803e903d91602b57fd5bf360881b60288201526037816000f09150506001600160a01b03811661067f5760405162461bcd60e51b8152602060048201526016602482015275115490cc4c4d8dce8818dc99585d194819985a5b195960521b604482015260640161017d565b919050565b60006020828403121561069657600080fd5b5035919050565b634e487b7160e01b600052604160045260246000fd5b604051601f8201601f1916810167ffffffffffffffff811182821017156106dc576106dc61069d565b604052919050565b600082601f8301126106f557600080fd5b813567ffffffffffffffff81111561070f5761070f61069d565b610722601f8201601f19166020016106b3565b81815284602083860101111561073757600080fd5b816020850160208301376000918101602001919091529392505050565b60008060006060848603121561076957600080fd5b833567ffffffffffffffff8082111561078157600080fd5b61078d878388016106e4565b94506020915081860135818111156107a457600080fd5b6107b0888289016106e4565b9450506040860135818111156107c557600080fd5b8601601f810188136107d657600080fd5b8035828111156107e8576107e861069d565b8060051b6107f78582016106b3565b918252828101850191858101908b84111561081157600080fd5b86850192505b8383101561084d5782358681111561082f5760008081fd5b61083d8d89838901016106e4565b8352509186019190860190610817565b809750505050505050509250925092565b6020808252825182820181905260009190848201906040850190845b8181101561089f5783516001600160a01b03168352928401929184019160010161087a565b50909695505050505050565b6001600160a01b038116811461059457600080fd5b6000602082840312156108d257600080fd5b81356108dd816108ab565b9392505050565b6020808252818101527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604082015260600190565b60006020828403121561092b57600080fd5b81516108dd816108ab565b6000815180845260005b8181101561095c57602081850181015186830182015201610940565b8181111561096e576000602083870101525b50601f01601f19169290920160200192915050565b600060018060a01b038089168352602081891681850152818816604085015260c060608501526109b660c0850188610936565b915083820360808501526109ca8287610936565b915083820360a08501528185518084528284019150828160051b85010183880160005b83811015610a1b57601f19878403018552610a09838351610936565b948601949250908501906001016109ed565b50909d9c5050505050505050505050505056fea26469706673582212209fa97be4d676d82d8d133bf31943116c33dbd47dee236341399a12510816e63d64736f6c6343000809003342616c6c6f74466163746f72793a20496d706c656d656e746174696f6e20616464726573732073686f756c64206e6f74206265207a65726f2061646472657373";

type BallotFactoryConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: BallotFactoryConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class BallotFactory__factory extends ContractFactory {
  constructor(...args: BallotFactoryConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _DPS: string,
    _implementationAddress: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<BallotFactory> {
    return super.deploy(
      _DPS,
      _implementationAddress,
      overrides || {}
    ) as Promise<BallotFactory>;
  }
  override getDeployTransaction(
    _DPS: string,
    _implementationAddress: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      _DPS,
      _implementationAddress,
      overrides || {}
    );
  }
  override attach(address: string): BallotFactory {
    return super.attach(address) as BallotFactory;
  }
  override connect(signer: Signer): BallotFactory__factory {
    return super.connect(signer) as BallotFactory__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): BallotFactoryInterface {
    return new utils.Interface(_abi) as BallotFactoryInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): BallotFactory {
    return new Contract(address, _abi, signerOrProvider) as BallotFactory;
  }
}
