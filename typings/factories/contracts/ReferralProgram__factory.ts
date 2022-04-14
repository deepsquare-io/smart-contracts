/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Signer,
  utils,
  Contract,
  ContractFactory,
  BigNumberish,
  Overrides,
} from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  ReferralProgram,
  ReferralProgramInterface,
} from "../../contracts/ReferralProgram";

const _abi = [
  {
    inputs: [
      {
        internalType: "contract IERC20Metadata",
        name: "_DPS",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_limit",
        type: "uint256",
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
    inputs: [
      {
        internalType: "address[]",
        name: "referrers",
        type: "address[]",
      },
      {
        internalType: "address[][]",
        name: "referees",
        type: "address[][]",
      },
    ],
    name: "deliver",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "destruct",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "limit",
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
  "0x608060405234801561001057600080fd5b50604051610c3e380380610c3e83398101604081905261002f91610176565b61003833610126565b6001600160a01b0382166100935760405162461bcd60e51b815260206004820152601f60248201527f526566657272616c50726f6772616d3a20746f6b656e206973207a65726f2e0060448201526064015b60405180910390fd5b600081116100fd5760405162461bcd60e51b815260206004820152603160248201527f526566657272616c50726f6772616d3a204c696d6974206973206c6f7765722060448201527037b91032b8bab0b6103a37903d32b9379760791b606482015260840161008a565b600180546001600160a01b0319166001600160a01b0393909316929092179091556002556101b0565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6000806040838503121561018957600080fd5b82516001600160a01b03811681146101a057600080fd5b6020939093015192949293505050565b610a7f806101bf6000396000f3fe608060405234801561001057600080fd5b506004361061007d5760003560e01c8063a4d66daf1161005b578063a4d66daf146100be578063ea7ae477146100d5578063ef4e06ec146100e8578063f2fde38b146100fb57600080fd5b80632b68b9c614610082578063715018a61461008c5780638da5cb5b14610094575b600080fd5b61008a61010e565b005b61008a610267565b6000546001600160a01b03165b6040516001600160a01b0390911681526020015b60405180910390f35b6100c760025481565b6040519081526020016100b5565b61008a6100e3366004610842565b61029d565b6001546100a1906001600160a01b031681565b61008a610109366004610917565b61065e565b6000546001600160a01b031633146101415760405162461bcd60e51b815260040161013890610939565b60405180910390fd5b600080546001600160a01b03166001546040516370a0823160e01b81523060048201529192506001600160a01b03169063a9059cbb90839083906370a082319060240160206040518083038186803b15801561019c57600080fd5b505afa1580156101b0573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906101d4919061096e565b6040516001600160e01b031960e085901b1681526001600160a01b0390921660048301526024820152604401602060405180830381600087803b15801561021a57600080fd5b505af115801561022e573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102529190610987565b5061025b610267565b806001600160a01b0316ff5b6000546001600160a01b031633146102915760405162461bcd60e51b815260040161013890610939565b61029b60006106f9565b565b6000546001600160a01b031633146102c75760405162461bcd60e51b815260040161013890610939565b805182511461034c5760405162461bcd60e51b815260206004820152604560248201527f526566657272616c50726f6772616d3a2072656665727265727320616e64207260448201527f65666572656573206c69737473206861766520646966666572656e74206c656e60648201526433ba34399760d91b608482015260a401610138565b60005b825181101561065957600083828151811061036c5761036c6109a9565b60209081029190910101516002546001546040516370a0823160e01b81526001600160a01b038085166004830152939450919216906370a082319060240160206040518083038186803b1580156103c257600080fd5b505afa1580156103d6573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103fa919061096e565b10156104675760405162461bcd60e51b815260206004820152603660248201527f526566657272616c50726f6772616d3a2072656665727265722062616c616e63604482015275329034b9903637bbb2b9103a3430b7103634b6b4ba1760511b6064820152608401610138565b600083838151811061047b5761047b6109a9565b6020026020010151511115610646576000805b8484815181106104a0576104a06109a9565b6020026020010151518110156105935760015485516001600160a01b03909116906370a08231908790879081106104d9576104d96109a9565b602002602001015183815181106104f2576104f26109a9565b60200260200101516040518263ffffffff1660e01b815260040161052591906001600160a01b0391909116815260200190565b60206040518083038186803b15801561053d57600080fd5b505afa158015610551573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610575919061096e565b61057f90836109d5565b91508061058b816109ed565b91505061048e565b506001546001600160a01b031663a9059cbb8360646105b385600c610a08565b6105bd9190610a27565b6040516001600160e01b031960e085901b1681526001600160a01b0390921660048301526024820152604401602060405180830381600087803b15801561060357600080fd5b505af1158015610617573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061063b9190610987565b61064457600080fd5b505b5080610651816109ed565b91505061034f565b505050565b6000546001600160a01b031633146106885760405162461bcd60e51b815260040161013890610939565b6001600160a01b0381166106ed5760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b6064820152608401610138565b6106f6816106f9565b50565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b634e487b7160e01b600052604160045260246000fd5b604051601f8201601f1916810167ffffffffffffffff8111828210171561078857610788610749565b604052919050565b600067ffffffffffffffff8211156107aa576107aa610749565b5060051b60200190565b80356001600160a01b03811681146107cb57600080fd5b919050565b600082601f8301126107e157600080fd5b813560206107f66107f183610790565b61075f565b82815260059290921b8401810191818101908684111561081557600080fd5b8286015b848110156108375761082a816107b4565b8352918301918301610819565b509695505050505050565b6000806040838503121561085557600080fd5b823567ffffffffffffffff8082111561086d57600080fd5b610879868387016107d0565b935060209150818501358181111561089057600080fd5b8501601f810187136108a157600080fd5b80356108af6107f182610790565b81815260059190911b820184019084810190898311156108ce57600080fd5b8584015b83811015610906578035868111156108ea5760008081fd5b6108f88c89838901016107d0565b8452509186019186016108d2565b508096505050505050509250929050565b60006020828403121561092957600080fd5b610932826107b4565b9392505050565b6020808252818101527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604082015260600190565b60006020828403121561098057600080fd5b5051919050565b60006020828403121561099957600080fd5b8151801515811461093257600080fd5b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b600082198211156109e8576109e86109bf565b500190565b6000600019821415610a0157610a016109bf565b5060010190565b6000816000190483118215151615610a2257610a226109bf565b500290565b600082610a4457634e487b7160e01b600052601260045260246000fd5b50049056fea2646970667358221220edf1c08e8d5eceb1b7015380e12f38a8373c3abb91045ae1bb92597597e2207a64736f6c63430008090033";

type ReferralProgramConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ReferralProgramConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ReferralProgram__factory extends ContractFactory {
  constructor(...args: ReferralProgramConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _DPS: string,
    _limit: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ReferralProgram> {
    return super.deploy(
      _DPS,
      _limit,
      overrides || {}
    ) as Promise<ReferralProgram>;
  }
  override getDeployTransaction(
    _DPS: string,
    _limit: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_DPS, _limit, overrides || {});
  }
  override attach(address: string): ReferralProgram {
    return super.attach(address) as ReferralProgram;
  }
  override connect(signer: Signer): ReferralProgram__factory {
    return super.connect(signer) as ReferralProgram__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ReferralProgramInterface {
    return new utils.Interface(_abi) as ReferralProgramInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ReferralProgram {
    return new Contract(address, _abi, signerOrProvider) as ReferralProgram;
  }
}
