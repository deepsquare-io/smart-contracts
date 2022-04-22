/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  ExposedVotingProxy,
  ExposedVotingProxyInterface,
} from "../../../contracts/testing/ExposedVotingProxy";

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
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint32",
        name: "tagIndex",
        type: "uint32",
      },
    ],
    name: "_delegates",
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
        name: "from",
        type: "address",
      },
      {
        internalType: "uint32",
        name: "tagIndex",
        type: "uint32",
      },
    ],
    name: "_proxyVoters",
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
        internalType: "uint32",
        name: "tagIndex",
        type: "uint32",
      },
    ],
    name: "grantProxy",
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
        internalType: "uint32",
        name: "tagIndex",
        type: "uint32",
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
    inputs: [
      {
        internalType: "address",
        name: "voter",
        type: "address",
      },
      {
        internalType: "uint32",
        name: "tagIndex",
        type: "uint32",
      },
    ],
    name: "proxyAmount",
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
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract BallotFactory",
        name: "_ballotFactory",
        type: "address",
      },
    ],
    name: "setBallotFactory",
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
  "0x60a060405234801561001057600080fd5b50604051610fd7380380610fd783398101604081905261002f916100ff565b80610039336100af565b6001600160a01b03811661009d5760405162461bcd60e51b815260206004820152602160248201527f566f74696e6750726f78793a204450532061646472657373206973207a65726f6044820152601760f91b606482015260840160405180910390fd5b6001600160a01b03166080525061012f565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b60006020828403121561011157600080fd5b81516001600160a01b038116811461012857600080fd5b9392505050565b608051610e7f610158600039600081816101f3015281816104b801526109410152610e7f6000f3fe608060405234801561001057600080fd5b50600436106100a95760003560e01c8063b75d466c11610071578063b75d466c1461012c578063c143c6db1461017c578063c43e163d1461019d578063ceb0b935146101db578063ef4e06ec146101ee578063f2fde38b1461021557600080fd5b80631d700c53146100ae57806336a7cf1f146100d7578063715018a6146100ec57806374773a45146100f45780638da5cb5b14610107575b600080fd5b6100c16100bc366004610adb565b610228565b6040516100ce9190610b1d565b60405180910390f35b6100ea6100e5366004610b6a565b61035e565b005b6100ea6103b3565b6100ea610102366004610adb565b6103e9565b6000546001600160a01b03165b6040516001600160a01b0390911681526020016100ce565b61016c61013a366004610adb565b6001600160a01b03918216600090815260036020908152604080832063ffffffff949094168352929052205416151590565b60405190151581526020016100ce565b61018f61018a366004610adb565b610803565b6040519081526020016100ce565b6101146101ab366004610adb565b6001600160a01b03918216600090815260036020908152604080832063ffffffff94909416835292905220541690565b600154610114906001600160a01b031681565b6101147f000000000000000000000000000000000000000000000000000000000000000081565b6100ea610223366004610b6a565b6109db565b6001600160a01b038216600090815260026020818152604080842063ffffffff80871686529252832090910154606092911667ffffffffffffffff81111561027257610272610b8e565b60405190808252806020026020018201604052801561029b578160200160208202803683370190505b50905060005b6001600160a01b038516600090815260026020818152604080842063ffffffff808a1686529252909220015481169082161015610356576001600160a01b03808616600090815260026020908152604080832063ffffffff808a1685529083528184209086168085526001909101909252909120548451921691849190811061032c5761032c610ba4565b6001600160a01b03909216602092830291909101909101528061034e81610bd0565b9150506102a1565b509392505050565b6000546001600160a01b031633146103915760405162461bcd60e51b815260040161038890610bf4565b60405180910390fd5b600180546001600160a01b0319166001600160a01b0392909216919091179055565b6000546001600160a01b031633146103dd5760405162461bcd60e51b815260040161038890610bf4565b6103e76000610a76565b565b6001546040805163995d9ab760e01b8152905163ffffffff8416926001600160a01b03169163995d9ab7916004808301926000929190829003018186803b15801561043357600080fd5b505afa158015610447573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f1916820160405261046f9190810190610c5a565b511161048d5760405162461bcd60e51b815260040161038890610d91565b6040516370a0823160e01b81526001600160a01b03838116600483015269054b40b1f852bda00000917f0000000000000000000000000000000000000000000000000000000000000000909116906370a082319060240160206040518083038186803b1580156104fc57600080fd5b505afa158015610510573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105349190610dd3565b10158061054857506001600160a01b038216155b6105a35760405162461bcd60e51b815260206004820152602660248201527f566f74696e6750726f78793a2050726f787920686173206e6f7420656e6f756760448201526534102228299760d11b6064820152608401610388565b33600090815260036020908152604080832063ffffffff851684529091529020546001600160a01b03161561071c5733600081815260036020908152604080832063ffffffff808716808652918452828520546001600160a01b0316855260028085528386209286529184528285209585529285905290832054908401549082169260018581019391926106379216610dec565b63ffffffff90811682526020808301939093526040918201600090812054858316825260018781019586905293822080546001600160a01b0319166001600160a01b03909216919091179055600286015490939284926106979216610dec565b63ffffffff90811682526020808301939093526040918201600090812080546001600160a01b0319166001600160a01b039690961695909517909455338452918590528220805463ffffffff19169055600284018054909116916106fa83610e11565b91906101000a81548163ffffffff021916908363ffffffff1602179055505050505b33600090815260036020908152604080832063ffffffff85168452909152902080546001600160a01b0319166001600160a01b038416908117909155156107ff576001600160a01b038216600090815260026020818152604080842063ffffffff8087168652908352818520938401805433808852868652848820805463ffffffff1916928516929092179091558154831687526001860190945291852080546001600160a01b0319169093179092558054929392909116916107de83610bd0565b91906101000a81548163ffffffff021916908363ffffffff16021790555050505b5050565b60008163ffffffff16600160009054906101000a90046001600160a01b03166001600160a01b031663995d9ab76040518163ffffffff1660e01b815260040160006040518083038186803b15801561085a57600080fd5b505afa15801561086e573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526108969190810190610c5a565b51116108b45760405162461bcd60e51b815260040161038890610d91565b6000805b6001600160a01b038516600090815260026020818152604080842063ffffffff808a1686529252909220015481169082161015610356576001600160a01b03858116600090815260026020908152604080832063ffffffff89811685529083528184209086168452600101909152908190205490516370a0823160e01b815290821660048201527f0000000000000000000000000000000000000000000000000000000000000000909116906370a082319060240160206040518083038186803b15801561098557600080fd5b505afa158015610999573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906109bd9190610dd3565b6109c79083610e31565b9150806109d381610bd0565b9150506108b8565b6000546001600160a01b03163314610a055760405162461bcd60e51b815260040161038890610bf4565b6001600160a01b038116610a6a5760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b6064820152608401610388565b610a7381610a76565b50565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6001600160a01b0381168114610a7357600080fd5b60008060408385031215610aee57600080fd5b8235610af981610ac6565b9150602083013563ffffffff81168114610b1257600080fd5b809150509250929050565b6020808252825182820181905260009190848201906040850190845b81811015610b5e5783516001600160a01b031683529284019291840191600101610b39565b50909695505050505050565b600060208284031215610b7c57600080fd5b8135610b8781610ac6565b9392505050565b634e487b7160e01b600052604160045260246000fd5b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b600063ffffffff80831681811415610bea57610bea610bba565b6001019392505050565b6020808252818101527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604082015260600190565b604051601f8201601f1916810167ffffffffffffffff81118282101715610c5257610c52610b8e565b604052919050565b60006020808385031215610c6d57600080fd5b825167ffffffffffffffff80821115610c8557600080fd5b8185019150601f8681840112610c9a57600080fd5b825182811115610cac57610cac610b8e565b8060051b610cbb868201610c29565b918252848101860191868101908a841115610cd557600080fd5b87870192505b83831015610d8357825186811115610cf35760008081fd5b8701603f81018c13610d055760008081fd5b8881015187811115610d1957610d19610b8e565b610d2a818801601f19168b01610c29565b81815260408e81848601011115610d415760008081fd5b60005b83811015610d5f578481018201518382018e01528c01610d44565b83811115610d705760008d85850101525b5050845250509187019190870190610cdb565b9a9950505050505050505050565b60208082526022908201527f566f74696e6750726f78793a2054616720696e64657820697320746f6f2068696040820152610ced60f31b606082015260800190565b600060208284031215610de557600080fd5b5051919050565b600063ffffffff83811690831681811015610e0957610e09610bba565b039392505050565b600063ffffffff821680610e2757610e27610bba565b6000190192915050565b60008219821115610e4457610e44610bba565b50019056fea26469706673582212208f718aedc886d19afb6b6f3213177c1e6607cabe669d31589d0e70a1c3cd8e0564736f6c63430008090033";

type ExposedVotingProxyConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ExposedVotingProxyConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ExposedVotingProxy__factory extends ContractFactory {
  constructor(...args: ExposedVotingProxyConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _DPS: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ExposedVotingProxy> {
    return super.deploy(_DPS, overrides || {}) as Promise<ExposedVotingProxy>;
  }
  override getDeployTransaction(
    _DPS: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_DPS, overrides || {});
  }
  override attach(address: string): ExposedVotingProxy {
    return super.attach(address) as ExposedVotingProxy;
  }
  override connect(signer: Signer): ExposedVotingProxy__factory {
    return super.connect(signer) as ExposedVotingProxy__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ExposedVotingProxyInterface {
    return new utils.Interface(_abi) as ExposedVotingProxyInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ExposedVotingProxy {
    return new Contract(address, _abi, signerOrProvider) as ExposedVotingProxy;
  }
}
