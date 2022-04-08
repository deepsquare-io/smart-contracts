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
  "0x6101206040523480156200001257600080fd5b5060405162001c7f38038062001c7f8339810160408190526200003591620002ad565b620000403362000244565b6001600160a01b0387166200009c5760405162461bcd60e51b815260206004820152601360248201527f53616c653a20746f6b656e206973207a65726f0000000000000000000000000060448201526064015b60405180910390fd5b6001600160a01b038616620000f45760405162461bcd60e51b815260206004820152601860248201527f53616c653a20737461626c65636f696e206973207a65726f0000000000000000604482015260640162000093565b6001600160a01b0385166200014c5760405162461bcd60e51b815260206004820152601960248201527f53616c653a20656c69676962696c697479206973207a65726f00000000000000604482015260640162000093565b6001600160a01b038416620001a45760405162461bcd60e51b815260206004820152601860248201527f53616c653a2061676772656761746f72206973207a65726f0000000000000000604482015260640162000093565b60008360ff1611620001f95760405162461bcd60e51b815260206004820152601a60248201527f53616c653a2072617465206973206e6f7420706f736974697665000000000000604482015260640162000093565b6001600160a01b0396871660805294861660a05292851660c052600180546001600160a01b031916929095169190911790935560ff90921660e0526101009190915260025562000345565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6001600160a01b0381168114620002aa57600080fd5b50565b600080600080600080600060e0888a031215620002c957600080fd5b8751620002d68162000294565b6020890151909750620002e98162000294565b6040890151909650620002fc8162000294565b60608901519095506200030f8162000294565b608089015190945060ff811681146200032757600080fd5b8093505060a0880151915060c0880151905092959891949750929550565b60805160a05160c05160e051610100516118776200040860003960008181610344015281816104490152610da001526000818161020d015281816108be0152610a8301526000818161015f0152610fdd015260008181610268015281816104c70152818161082201528181610aa701528181610cd2015261116301526000818161038001528181610600015281816106f801528181610797015281816108e2015281816109e5015281816110d70152818161128c015261139c01526118776000f3fe60806040526004361061011f5760003560e01c8063715018a6116100a0578063cdc8886611610064578063cdc8886614610366578063ef4e06ec1461036e578063f0ea4bfc146103a2578063f2fde38b146103b7578063f9120af6146103d757600080fd5b8063715018a6146102bf5780638da5cb5b146102d457806398a8f503146102f2578063c672714914610312578063cc2d9e181461033257600080fd5b80632c4e722e116100e75780632c4e722e146101fb57806343d726d614610241578063542e898e1461025657806355234ec01461028a57806355468cc01461029f57600080fd5b806302c7e7af146101245780630dc140001461014d5780631dc4b1f314610199578063245a7bfc146101bb57806324e53901146101db575b600080fd5b34801561013057600080fd5b5061013a60025481565b6040519081526020015b60405180910390f35b34801561015957600080fd5b506101817f000000000000000000000000000000000000000000000000000000000000000081565b6040516001600160a01b039091168152602001610144565b3480156101a557600080fd5b506101b96101b43660046114c5565b6103f7565b005b3480156101c757600080fd5b50600154610181906001600160a01b031681565b3480156101e757600080fd5b506101b96101f63660046114f5565b610447565b34801561020757600080fd5b5061022f7f000000000000000000000000000000000000000000000000000000000000000081565b60405160ff9091168152602001610144565b34801561024d57600080fd5b506101b961059d565b34801561026257600080fd5b506101817f000000000000000000000000000000000000000000000000000000000000000081565b34801561029657600080fd5b5061013a61077f565b3480156102ab57600080fd5b5061013a6102ba3660046114f5565b61081e565b3480156102cb57600080fd5b506101b96109ab565b3480156102e057600080fd5b506000546001600160a01b0316610181565b3480156102fe57600080fd5b5061013a61030d3660046114f5565b6109e1565b34801561031e57600080fd5b5061013a61032d3660046114f5565b610b55565b34801561033e57600080fd5b5061013a7f000000000000000000000000000000000000000000000000000000000000000081565b6101b9610d91565b34801561037a57600080fd5b506101817f000000000000000000000000000000000000000000000000000000000000000081565b3480156103ae57600080fd5b5061013a610e66565b3480156103c357600080fd5b506101b96103d236600461150e565b610e73565b3480156103e357600080fd5b506101b96103f236600461150e565b610f0e565b6000546001600160a01b0316331461042a5760405162461bcd60e51b81526004016104219061152b565b60405180910390fd5b60006104368284610f5a565b9050610442828261135f565b505050565b7f00000000000000000000000000000000000000000000000000000000000000008110156104b75760405162461bcd60e51b815260206004820152601f60248201527f53616c653a20616d6f756e74206c6f776572207468616e206d696e696d756d006044820152606401610421565b60006104c33383610f5a565b90507f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03166323b872dd336105076000546001600160a01b031690565b6040516001600160e01b031960e085901b1681526001600160a01b0392831660048201529116602482015260448101859052606401602060405180830381600087803b15801561055657600080fd5b505af115801561056a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061058e9190611560565b50610599338261135f565b5050565b6000546001600160a01b031633146105c75760405162461bcd60e51b81526004016104219061152b565b60408051600481526024810182526020810180516001600160e01b0316638da5cb5b60e01b179052905160009182916001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000169161062a91611582565b600060405180830381855afa9150503d8060008114610665576040519150601f19603f3d011682016040523d82523d6000602084013e61066a565b606091505b5091509150816106bc5760405162461bcd60e51b815260206004820152601f60248201527f53616c653a20756e61626c6520746f2064657465726d696e65206f776e6572006044820152606401610421565b6000818060200190518101906106d291906115bd565b6040516370a0823160e01b81523060048201529091506107779082906001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016906370a082319060240160206040518083038186803b15801561073a57600080fd5b505afa15801561074e573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061077291906115da565b61135f565b6104426109ab565b6040516370a0823160e01b81523060048201526000907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316906370a082319060240160206040518083038186803b1580156107e157600080fd5b505afa1580156107f5573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061081991906115da565b905090565b60007f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663313ce5676040518163ffffffff1660e01b815260040160206040518083038186803b15801561087957600080fd5b505afa15801561088d573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108b19190611609565b6108bc90600a61171e565b7f000000000000000000000000000000000000000000000000000000000000000060ff167f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663313ce5676040518163ffffffff1660e01b815260040160206040518083038186803b15801561093957600080fd5b505afa15801561094d573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906109719190611609565b61097c90600a61171e565b610986908561172d565b61099190606461172d565b61099b919061174c565b6109a5919061174c565b92915050565b6000546001600160a01b031633146109d55760405162461bcd60e51b81526004016104219061152b565b6109df6000611460565b565b60007f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663313ce5676040518163ffffffff1660e01b815260040160206040518083038186803b158015610a3c57600080fd5b505afa158015610a50573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a749190611609565b610a7f90600a61171e565b60647f000000000000000000000000000000000000000000000000000000000000000060ff167f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663313ce5676040518163ffffffff1660e01b815260040160206040518083038186803b158015610afe57600080fd5b505afa158015610b12573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610b369190611609565b610b4190600a61171e565b610b4b908661172d565b610991919061172d565b600080600160009054906101000a90046001600160a01b03166001600160a01b031663feaf968c6040518163ffffffff1660e01b815260040160a06040518083038186803b158015610ba657600080fd5b505afa158015610bba573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610bde9190611788565b50505091505060008113610c345760405162461bcd60e51b815260206004820152601f60248201527f53616c653a20616e737765722063616e6e6f74206265206e65676174697665006044820152606401610421565b600160009054906101000a90046001600160a01b03166001600160a01b031663313ce5676040518163ffffffff1660e01b815260040160206040518083038186803b158015610c8257600080fd5b505afa158015610c96573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610cba9190611609565b610cc59060126117d8565b610cd090600a61171e565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663313ce5676040518163ffffffff1660e01b815260040160206040518083038186803b158015610d2957600080fd5b505afa158015610d3d573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610d619190611609565b610d6c90600a61171e565b610d76838661172d565b610d80919061172d565b610d8a919061174c565b9392505050565b6000610d9c34610b55565b90507f0000000000000000000000000000000000000000000000000000000000000000811015610e0e5760405162461bcd60e51b815260206004820152601f60248201527f53616c653a20616d6f756e74206c6f776572207468616e206d696e696d756d006044820152606401610421565b6000610e1a3383610f5a565b9050610e2e6000546001600160a01b031690565b6001600160a01b03166108fc349081150290604051600060405180830381858888f1935050505015801561058e573d6000803e3d6000fd5b60006108196002546109e1565b6000546001600160a01b03163314610e9d5760405162461bcd60e51b81526004016104219061152b565b6001600160a01b038116610f025760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b6064820152608401610421565b610f0b81611460565b50565b6000546001600160a01b03163314610f385760405162461bcd60e51b81526004016104219061152b565b600180546001600160a01b0319166001600160a01b0392909216919091179055565b600080546001600160a01b0384811691161415610fb95760405162461bcd60e51b815260206004820181905260248201527f53616c653a20696e766573746f72206973207468652073616c65206f776e65726044820152606401610421565b604051636a5b5aed60e11b81526001600160a01b03848116600483015260009182917f0000000000000000000000000000000000000000000000000000000000000000169063d4b6b5da906024016040805180830381600087803b15801561102057600080fd5b505af1158015611034573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061105891906117fd565b9150915060008260ff16116110af5760405162461bcd60e51b815260206004820152601d60248201527f53616c653a206163636f756e74206973206e6f7420656c696769626c650000006044820152606401610421565b6040516370a0823160e01b81526001600160a01b0386811660048301526000918691611153917f0000000000000000000000000000000000000000000000000000000000000000909116906370a082319060240160206040518083038186803b15801561111b57600080fd5b505afa15801561112f573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061030d91906115da565b61115d9190611829565b905060007f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663313ce5676040518163ffffffff1660e01b815260040160206040518083038186803b1580156111ba57600080fd5b505afa1580156111ce573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906111f29190611609565b6111fd90600a61171e565b611207908461172d565b9050801561125f578082111561125f5760405162461bcd60e51b815260206004820152601860248201527f53616c653a20657863656564732074696572206c696d697400000000000000006044820152606401610421565b600061126a8761081e565b6040516370a0823160e01b815230600482015290915081906001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016906370a082319060240160206040518083038186803b1580156112ce57600080fd5b505afa1580156112e2573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061130691906115da565b10156113545760405162461bcd60e51b815260206004820181905260248201527f53616c653a206e6f20656e6f75676820746f6b656e732072656d61696e696e676044820152606401610421565b979650505050505050565b80600260008282546113719190611829565b909155505060405163a9059cbb60e01b81526001600160a01b038381166004830152602482018390527f0000000000000000000000000000000000000000000000000000000000000000169063a9059cbb90604401602060405180830381600087803b1580156113e057600080fd5b505af11580156113f4573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906114189190611560565b50816001600160a01b03167f2499a5330ab0979cc612135e7883ebc3cd5c9f7a8508f042540c34723348f6328260405161145491815260200190565b60405180910390a25050565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6001600160a01b0381168114610f0b57600080fd5b600080604083850312156114d857600080fd5b8235915060208301356114ea816114b0565b809150509250929050565b60006020828403121561150757600080fd5b5035919050565b60006020828403121561152057600080fd5b8135610d8a816114b0565b6020808252818101527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604082015260600190565b60006020828403121561157257600080fd5b81518015158114610d8a57600080fd5b6000825160005b818110156115a35760208186018101518583015201611589565b818111156115b2576000828501525b509190910192915050565b6000602082840312156115cf57600080fd5b8151610d8a816114b0565b6000602082840312156115ec57600080fd5b5051919050565b805160ff8116811461160457600080fd5b919050565b60006020828403121561161b57600080fd5b610d8a826115f3565b634e487b7160e01b600052601160045260246000fd5b600181815b8085111561167557816000190482111561165b5761165b611624565b8085161561166857918102915b93841c939080029061163f565b509250929050565b60008261168c575060016109a5565b81611699575060006109a5565b81600181146116af57600281146116b9576116d5565b60019150506109a5565b60ff8411156116ca576116ca611624565b50506001821b6109a5565b5060208310610133831016604e8410600b84101617156116f8575081810a6109a5565b611702838361163a565b806000190482111561171657611716611624565b029392505050565b6000610d8a60ff84168361167d565b600081600019048311821515161561174757611747611624565b500290565b60008261176957634e487b7160e01b600052601260045260246000fd5b500490565b805169ffffffffffffffffffff8116811461160457600080fd5b600080600080600060a086880312156117a057600080fd5b6117a98661176e565b94506020860151935060408601519250606086015191506117cc6080870161176e565b90509295509295909350565b600060ff821660ff84168060ff038211156117f5576117f5611624565b019392505050565b6000806040838503121561181057600080fd5b611819836115f3565b9150602083015190509250929050565b6000821982111561183c5761183c611624565b50019056fea26469706673582212201e54c40665c5b6d113af24f44a72fb861df00550d15bf6e20939729beb3fe57864736f6c63430008090033";

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
