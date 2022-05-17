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
import type { Sale, SaleInterface } from "../../contracts/Sale";

const _abi = [
  {
    inputs: [
      {
        internalType: "contract IERC20Metadata",
        name: "_DPS",
        type: "address",
      },
      {
        internalType: "contract IERC20Metadata",
        name: "_STC",
        type: "address",
      },
      {
        internalType: "contract Eligibility",
        name: "_eligibility",
        type: "address",
      },
      {
        internalType: "contract AggregatorV3Interface",
        name: "_aggregator",
        type: "address",
      },
      {
        internalType: "uint8",
        name: "_rate",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "_minimumPurchaseSTC",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_initialSold",
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
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "investor",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountDPS",
        type: "uint256",
      },
    ],
    name: "Purchase",
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
    name: "STC",
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
    name: "aggregator",
    outputs: [
      {
        internalType: "contract AggregatorV3Interface",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "close",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amountAVAX",
        type: "uint256",
      },
    ],
    name: "convertAVAXtoSTC",
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
        internalType: "uint256",
        name: "amountDPS",
        type: "uint256",
      },
    ],
    name: "convertDPStoSTC",
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
        internalType: "uint256",
        name: "amountSTC",
        type: "uint256",
      },
    ],
    name: "convertSTCtoDPS",
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
        internalType: "uint256",
        name: "amountSTC",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "deliverDPS",
    outputs: [],
    stateMutability: "nonpayable",
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
    name: "minimumPurchaseSTC",
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
    name: "purchaseDPSWithAVAX",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amountSTC",
        type: "uint256",
      },
    ],
    name: "purchaseDPSWithSTC",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "raised",
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
    name: "rate",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "remaining",
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
        internalType: "contract AggregatorV3Interface",
        name: "newAggregator",
        type: "address",
      },
    ],
    name: "setAggregator",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "sold",
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
  "0x6101206040523480156200001257600080fd5b5060405162001ac238038062001ac28339810160408190526200003591620002ad565b620000403362000244565b6001600160a01b0387166200009c5760405162461bcd60e51b815260206004820152601360248201527f53616c653a20746f6b656e206973207a65726f0000000000000000000000000060448201526064015b60405180910390fd5b6001600160a01b038616620000f45760405162461bcd60e51b815260206004820152601860248201527f53616c653a20737461626c65636f696e206973207a65726f0000000000000000604482015260640162000093565b6001600160a01b0385166200014c5760405162461bcd60e51b815260206004820152601960248201527f53616c653a20656c69676962696c697479206973207a65726f00000000000000604482015260640162000093565b6001600160a01b038416620001a45760405162461bcd60e51b815260206004820152601860248201527f53616c653a2061676772656761746f72206973207a65726f0000000000000000604482015260640162000093565b60008360ff1611620001f95760405162461bcd60e51b815260206004820152601a60248201527f53616c653a2072617465206973206e6f7420706f736974697665000000000000604482015260640162000093565b6001600160a01b0396871660805294861660a05292851660c052600180546001600160a01b031916929095169190911790935560ff90921660e0526101009190915260025562000345565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6001600160a01b0381168114620002aa57600080fd5b50565b600080600080600080600060e0888a031215620002c957600080fd5b8751620002d68162000294565b6020890151909750620002e98162000294565b6040890151909650620002fc8162000294565b60608901519095506200030f8162000294565b608089015190945060ff811681146200032757600080fd5b8093505060a0880151915060c0880151905092959891949750929550565b60805160a05160c05160e051610100516116c16200040160003960008181610344015281816104490152610c0b01526000818161020d01528181610785015261092a01526000818161015f0152610eca015260008181610268015281816104c7015281816106f80152818161094e01528181610b4c0152611032015260008181610380015281816105e20152818161067c015281816107a90152818161089b01528181610fb50152818161114c015261124d01526116c16000f3fe60806040526004361061011f5760003560e01c8063715018a6116100a0578063cdc8886611610064578063cdc8886614610366578063ef4e06ec1461036e578063f0ea4bfc146103a2578063f2fde38b146103b7578063f9120af6146103d757600080fd5b8063715018a6146102bf5780638da5cb5b146102d457806398a8f503146102f2578063c672714914610312578063cc2d9e181461033257600080fd5b80632c4e722e116100e75780632c4e722e146101fb57806343d726d614610241578063542e898e1461025657806355234ec01461028a57806355468cc01461029f57600080fd5b806302c7e7af146101245780630dc140001461014d5780631dc4b1f314610199578063245a7bfc146101bb57806324e53901146101db575b600080fd5b34801561013057600080fd5b5061013a60025481565b6040519081526020015b60405180910390f35b34801561015957600080fd5b506101817f000000000000000000000000000000000000000000000000000000000000000081565b6040516001600160a01b039091168152602001610144565b3480156101a557600080fd5b506101b96101b4366004611367565b6103f7565b005b3480156101c757600080fd5b50600154610181906001600160a01b031681565b3480156101e757600080fd5b506101b96101f6366004611397565b610447565b34801561020757600080fd5b5061022f7f000000000000000000000000000000000000000000000000000000000000000081565b60405160ff9091168152602001610144565b34801561024d57600080fd5b506101b961058e565b34801561026257600080fd5b506101817f000000000000000000000000000000000000000000000000000000000000000081565b34801561029657600080fd5b5061013a610664565b3480156102ab57600080fd5b5061013a6102ba366004611397565b6106f4565b3480156102cb57600080fd5b506101b9610863565b3480156102e057600080fd5b506000546001600160a01b0316610181565b3480156102fe57600080fd5b5061013a61030d366004611397565b610897565b34801561031e57600080fd5b5061013a61032d366004611397565b6109ed565b34801561033e57600080fd5b5061013a7f000000000000000000000000000000000000000000000000000000000000000081565b6101b9610bfc565b34801561037a57600080fd5b506101817f000000000000000000000000000000000000000000000000000000000000000081565b3480156103ae57600080fd5b5061013a610d45565b3480156103c357600080fd5b506101b96103d23660046113b0565b610d52565b3480156103e357600080fd5b506101b96103f23660046113b0565b610ded565b6000546001600160a01b0316331461042a5760405162461bcd60e51b8152600401610421906113cd565b60405180910390fd5b60006104368284610e39565b90506104428282611210565b505050565b7f00000000000000000000000000000000000000000000000000000000000000008110156104b75760405162461bcd60e51b815260206004820152601f60248201527f53616c653a20616d6f756e74206c6f776572207468616e206d696e696d756d006044820152606401610421565b60006104c33383610e39565b90507f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03166323b872dd336105076000546001600160a01b031690565b6040516001600160e01b031960e085901b1681526001600160a01b03928316600482015291166024820152604481018590526064016020604051808303816000875af115801561055b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061057f9190611402565b5061058a3382611210565b5050565b6000546001600160a01b031633146105b85760405162461bcd60e51b8152600401610421906113cd565b61065a6105cd6000546001600160a01b031690565b6040516370a0823160e01b81523060048201527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316906370a0823190602401602060405180830381865afa158015610631573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106559190611424565b611210565b610662610863565b565b6040516370a0823160e01b81523060048201526000907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316906370a0823190602401602060405180830381865afa1580156106cb573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106ef9190611424565b905090565b60007f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa158015610754573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107789190611453565b61078390600a611568565b7f000000000000000000000000000000000000000000000000000000000000000060ff167f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa158015610805573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108299190611453565b61083490600a611568565b61083e9085611577565b610849906064611577565b6108539190611596565b61085d9190611596565b92915050565b6000546001600160a01b0316331461088d5760405162461bcd60e51b8152600401610421906113cd565b6106626000611302565b60007f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa1580156108f7573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061091b9190611453565b61092690600a611568565b60647f000000000000000000000000000000000000000000000000000000000000000060ff167f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa1580156109aa573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906109ce9190611453565b6109d990600a611568565b6109e39086611577565b6108499190611577565b600080600160009054906101000a90046001600160a01b03166001600160a01b031663feaf968c6040518163ffffffff1660e01b815260040160a060405180830381865afa158015610a43573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a6791906115d2565b50505091505060008113610abd5760405162461bcd60e51b815260206004820152601f60248201527f53616c653a20616e737765722063616e6e6f74206265206e65676174697665006044820152606401610421565b600160009054906101000a90046001600160a01b03166001600160a01b031663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa158015610b10573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610b349190611453565b610b3f906012611622565b610b4a90600a611568565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa158015610ba8573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610bcc9190611453565b610bd790600a611568565b610be18386611577565b610beb9190611577565b610bf59190611596565b9392505050565b6000610c07346109ed565b90507f0000000000000000000000000000000000000000000000000000000000000000811015610c795760405162461bcd60e51b815260206004820152601f60248201527f53616c653a20616d6f756e74206c6f776572207468616e206d696e696d756d006044820152606401610421565b6000610c853383610e39565b90506000610c9b6000546001600160a01b031690565b6001600160a01b03163460405160006040518083038185875af1925050503d8060008114610ce5576040519150601f19603f3d011682016040523d82523d6000602084013e610cea565b606091505b5050905080610d3b5760405162461bcd60e51b815260206004820152601c60248201527f53616c653a206661696c656420746f20666f72776172642041564158000000006044820152606401610421565b6104423383611210565b60006106ef600254610897565b6000546001600160a01b03163314610d7c5760405162461bcd60e51b8152600401610421906113cd565b6001600160a01b038116610de15760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b6064820152608401610421565b610dea81611302565b50565b6000546001600160a01b03163314610e175760405162461bcd60e51b8152600401610421906113cd565b600180546001600160a01b0319166001600160a01b0392909216919091179055565b600080546001600160a01b03166001600160a01b0316836001600160a01b031603610ea65760405162461bcd60e51b815260206004820181905260248201527f53616c653a20696e766573746f72206973207468652073616c65206f776e65726044820152606401610421565b604051636a5b5aed60e11b81526001600160a01b03848116600483015260009182917f0000000000000000000000000000000000000000000000000000000000000000169063d4b6b5da9060240160408051808303816000875af1158015610f12573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610f369190611647565b9150915060008260ff1611610f8d5760405162461bcd60e51b815260206004820152601d60248201527f53616c653a206163636f756e74206973206e6f7420656c696769626c650000006044820152606401610421565b6040516370a0823160e01b81526001600160a01b0386811660048301526000918691611022917f0000000000000000000000000000000000000000000000000000000000000000909116906370a0823190602401602060405180830381865afa158015610ffe573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061030d9190611424565b61102c9190611673565b905060007f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa15801561108e573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906110b29190611453565b6110bd90600a611568565b6110c79084611577565b9050801561111f578082111561111f5760405162461bcd60e51b815260206004820152601860248201527f53616c653a20657863656564732074696572206c696d697400000000000000006044820152606401610421565b600061112a876106f4565b6040516370a0823160e01b815230600482015290915081906001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016906370a0823190602401602060405180830381865afa158015611193573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906111b79190611424565b10156112055760405162461bcd60e51b815260206004820181905260248201527f53616c653a206e6f20656e6f75676820746f6b656e732072656d61696e696e676044820152606401610421565b979650505050505050565b80600260008282546112229190611673565b909155505060405163a9059cbb60e01b81526001600160a01b038381166004830152602482018390527f0000000000000000000000000000000000000000000000000000000000000000169063a9059cbb906044016020604051808303816000875af1158015611296573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906112ba9190611402565b50816001600160a01b03167f2499a5330ab0979cc612135e7883ebc3cd5c9f7a8508f042540c34723348f632826040516112f691815260200190565b60405180910390a25050565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6001600160a01b0381168114610dea57600080fd5b6000806040838503121561137a57600080fd5b82359150602083013561138c81611352565b809150509250929050565b6000602082840312156113a957600080fd5b5035919050565b6000602082840312156113c257600080fd5b8135610bf581611352565b6020808252818101527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604082015260600190565b60006020828403121561141457600080fd5b81518015158114610bf557600080fd5b60006020828403121561143657600080fd5b5051919050565b805160ff8116811461144e57600080fd5b919050565b60006020828403121561146557600080fd5b610bf58261143d565b634e487b7160e01b600052601160045260246000fd5b600181815b808511156114bf5781600019048211156114a5576114a561146e565b808516156114b257918102915b93841c9390800290611489565b509250929050565b6000826114d65750600161085d565b816114e35750600061085d565b81600181146114f957600281146115035761151f565b600191505061085d565b60ff8411156115145761151461146e565b50506001821b61085d565b5060208310610133831016604e8410600b8410161715611542575081810a61085d565b61154c8383611484565b80600019048211156115605761156061146e565b029392505050565b6000610bf560ff8416836114c7565b60008160001904831182151516156115915761159161146e565b500290565b6000826115b357634e487b7160e01b600052601260045260246000fd5b500490565b805169ffffffffffffffffffff8116811461144e57600080fd5b600080600080600060a086880312156115ea57600080fd5b6115f3866115b8565b9450602086015193506040860151925060608601519150611616608087016115b8565b90509295509295909350565b600060ff821660ff84168060ff0382111561163f5761163f61146e565b019392505050565b6000806040838503121561165a57600080fd5b6116638361143d565b9150602083015190509250929050565b600082198211156116865761168661146e565b50019056fea2646970667358221220aebe54d83ea739b347570a7232a9ea49a426ab76e920515e13b11dbb7fa400d364736f6c634300080d0033";

type SaleConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: SaleConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Sale__factory extends ContractFactory {
  constructor(...args: SaleConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _DPS: string,
    _STC: string,
    _eligibility: string,
    _aggregator: string,
    _rate: BigNumberish,
    _minimumPurchaseSTC: BigNumberish,
    _initialSold: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<Sale> {
    return super.deploy(
      _DPS,
      _STC,
      _eligibility,
      _aggregator,
      _rate,
      _minimumPurchaseSTC,
      _initialSold,
      overrides || {}
    ) as Promise<Sale>;
  }
  override getDeployTransaction(
    _DPS: string,
    _STC: string,
    _eligibility: string,
    _aggregator: string,
    _rate: BigNumberish,
    _minimumPurchaseSTC: BigNumberish,
    _initialSold: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      _DPS,
      _STC,
      _eligibility,
      _aggregator,
      _rate,
      _minimumPurchaseSTC,
      _initialSold,
      overrides || {}
    );
  }
  override attach(address: string): Sale {
    return super.attach(address) as Sale;
  }
  override connect(signer: Signer): Sale__factory {
    return super.connect(signer) as Sale__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): SaleInterface {
    return new utils.Interface(_abi) as SaleInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): Sale {
    return new Contract(address, _abi, signerOrProvider) as Sale;
  }
}
