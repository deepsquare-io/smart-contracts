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
    name: "isPaused",
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
    inputs: [
      {
        internalType: "bool",
        name: "_isPaused",
        type: "bool",
      },
    ],
    name: "setPause",
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
  "0x6101006040523480156200001257600080fd5b506040516200192738038062001927833981016040819052620000359162000258565b6200004033620001ef565b6001600160a01b0386166200009c5760405162461bcd60e51b815260206004820152601360248201527f53616c653a20746f6b656e206973207a65726f0000000000000000000000000060448201526064015b60405180910390fd5b6001600160a01b038516620000f45760405162461bcd60e51b815260206004820152601860248201527f53616c653a20737461626c65636f696e206973207a65726f0000000000000000604482015260640162000093565b6001600160a01b0384166200014c5760405162461bcd60e51b815260206004820152601860248201527f53616c653a2061676772656761746f72206973207a65726f0000000000000000604482015260640162000093565b60008360ff1611620001a15760405162461bcd60e51b815260206004820152601a60248201527f53616c653a2072617465206973206e6f7420706f736974697665000000000000604482015260640162000093565b6001600160a01b0395861660805293851660a052600180546001600160a01b031916939095169290921790935560ff90921660c05260e0919091526002556003805460ff19169055620002d9565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6001600160a01b03811681146200025557600080fd5b50565b60008060008060008060c087890312156200027257600080fd5b86516200027f816200023f565b602088015190965062000292816200023f565b6040880151909550620002a5816200023f565b606088015190945060ff81168114620002bd57600080fd5b809350506080870151915060a087015190509295509295509295565b60805160a05160c05160e0516115ab6200037c60003960008181610365015281816104ae0152610d880152600081816101e4015281816108810152610a2601526000818161023f0152818161052c015281816107f401528181610a4a0152610c850152600081816103a10152818161061f0152818161067301528181610778015281816108a50152818161099701528181611050015261114601526115ab6000f3fe60806040526004361061012a5760003560e01c80638da5cb5b116100ab578063cc2d9e181161006f578063cc2d9e1814610353578063cdc8886614610387578063ef4e06ec1461038f578063f0ea4bfc146103c3578063f2fde38b146103d8578063f9120af6146103f857600080fd5b80638da5cb5b146102ab57806398a8f503146102c9578063b187bd26146102e9578063bedb86fb14610313578063c67271491461033357600080fd5b806343d726d6116100f257806343d726d614610218578063542e898e1461022d57806355234ec01461026157806355468cc014610276578063715018a61461029657600080fd5b806302c7e7af1461012f5780631dc4b1f314610158578063245a7bfc1461017a57806324e53901146101b25780632c4e722e146101d2575b600080fd5b34801561013b57600080fd5b5061014560025481565b6040519081526020015b60405180910390f35b34801561016457600080fd5b50610178610173366004611260565b610418565b005b34801561018657600080fd5b5060015461019a906001600160a01b031681565b6040516001600160a01b03909116815260200161014f565b3480156101be57600080fd5b506101786101cd366004611290565b610468565b3480156101de57600080fd5b506102067f000000000000000000000000000000000000000000000000000000000000000081565b60405160ff909116815260200161014f565b34801561022457600080fd5b506101786105f3565b34801561023957600080fd5b5061019a7f000000000000000000000000000000000000000000000000000000000000000081565b34801561026d57600080fd5b50610145610760565b34801561028257600080fd5b50610145610291366004611290565b6107f0565b3480156102a257600080fd5b5061017861095f565b3480156102b757600080fd5b506000546001600160a01b031661019a565b3480156102d557600080fd5b506101456102e4366004611290565b610993565b3480156102f557600080fd5b506003546103039060ff1681565b604051901515815260200161014f565b34801561031f57600080fd5b5061017861032e3660046112b7565b610ae9565b34801561033f57600080fd5b5061014561034e366004611290565b610b26565b34801561035f57600080fd5b506101457f000000000000000000000000000000000000000000000000000000000000000081565b610178610d35565b34801561039b57600080fd5b5061019a7f000000000000000000000000000000000000000000000000000000000000000081565b3480156103cf57600080fd5b50610145610ec2565b3480156103e457600080fd5b506101786103f33660046112d4565b610ecf565b34801561040457600080fd5b506101786104133660046112d4565b610f6a565b6000546001600160a01b0316331461044b5760405162461bcd60e51b8152600401610442906112f1565b60405180910390fd5b60006104578284610fb6565b90506104638282611109565b505050565b60035460ff16156104ac5760405162461bcd60e51b815260206004820152600e60248201526d14d85b19481a5cc81c185d5cd95960921b6044820152606401610442565b7f000000000000000000000000000000000000000000000000000000000000000081101561051c5760405162461bcd60e51b815260206004820152601f60248201527f53616c653a20616d6f756e74206c6f776572207468616e206d696e696d756d006044820152606401610442565b60006105283383610fb6565b90507f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03166323b872dd3361056c6000546001600160a01b031690565b6040516001600160e01b031960e085901b1681526001600160a01b03928316600482015291166024820152604481018590526064016020604051808303816000875af11580156105c0573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105e49190611326565b506105ef3382611109565b5050565b6000546001600160a01b0316331461061d5760405162461bcd60e51b8152600401610442906112f1565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663a9059cbb61065e6000546001600160a01b031690565b6040516370a0823160e01b81523060048201527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316906370a0823190602401602060405180830381865afa1580156106c2573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106e69190611343565b6040516001600160e01b031960e085901b1681526001600160a01b03909216600483015260248201526044016020604051808303816000875af1158015610731573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107559190611326565b5061075e61095f565b565b6040516370a0823160e01b81523060048201526000907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316906370a0823190602401602060405180830381865afa1580156107c7573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107eb9190611343565b905090565b60007f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa158015610850573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610874919061135c565b61087f90600a611479565b7f000000000000000000000000000000000000000000000000000000000000000060ff167f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa158015610901573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610925919061135c565b61093090600a611479565b61093a9085611488565b610945906064611488565b61094f91906114a7565b61095991906114a7565b92915050565b6000546001600160a01b031633146109895760405162461bcd60e51b8152600401610442906112f1565b61075e60006111fb565b60007f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa1580156109f3573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a17919061135c565b610a2290600a611479565b60647f000000000000000000000000000000000000000000000000000000000000000060ff167f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa158015610aa6573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610aca919061135c565b610ad590600a611479565b610adf9086611488565b6109459190611488565b6000546001600160a01b03163314610b135760405162461bcd60e51b8152600401610442906112f1565b6003805460ff1916911515919091179055565b600080600160009054906101000a90046001600160a01b03166001600160a01b031663feaf968c6040518163ffffffff1660e01b815260040160a060405180830381865afa158015610b7c573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610ba091906114e8565b50505091505060008113610bf65760405162461bcd60e51b815260206004820152601f60248201527f53616c653a20616e737765722063616e6e6f74206265206e65676174697665006044820152606401610442565b600160009054906101000a90046001600160a01b03166001600160a01b031663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa158015610c49573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c6d919061135c565b610c78906012611538565b610c8390600a611479565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa158015610ce1573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610d05919061135c565b610d1090600a611479565b610d1a8386611488565b610d249190611488565b610d2e91906114a7565b9392505050565b60035460ff1615610d795760405162461bcd60e51b815260206004820152600e60248201526d14d85b19481a5cc81c185d5cd95960921b6044820152606401610442565b6000610d8434610b26565b90507f0000000000000000000000000000000000000000000000000000000000000000811015610df65760405162461bcd60e51b815260206004820152601f60248201527f53616c653a20616d6f756e74206c6f776572207468616e206d696e696d756d006044820152606401610442565b6000610e023383610fb6565b90506000610e186000546001600160a01b031690565b6001600160a01b03163460405160006040518083038185875af1925050503d8060008114610e62576040519150601f19603f3d011682016040523d82523d6000602084013e610e67565b606091505b5050905080610eb85760405162461bcd60e51b815260206004820152601c60248201527f53616c653a206661696c656420746f20666f72776172642041564158000000006044820152606401610442565b6104633383611109565b60006107eb600254610993565b6000546001600160a01b03163314610ef95760405162461bcd60e51b8152600401610442906112f1565b6001600160a01b038116610f5e5760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b6064820152608401610442565b610f67816111fb565b50565b6000546001600160a01b03163314610f945760405162461bcd60e51b8152600401610442906112f1565b600180546001600160a01b0319166001600160a01b0392909216919091179055565b600080546001600160a01b03166001600160a01b0316836001600160a01b0316036110235760405162461bcd60e51b815260206004820181905260248201527f53616c653a20696e766573746f72206973207468652073616c65206f776e65726044820152606401610442565b600061102e836107f0565b6040516370a0823160e01b815230600482015290915081906001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016906370a0823190602401602060405180830381865afa158015611097573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906110bb9190611343565b1015610d2e5760405162461bcd60e51b815260206004820181905260248201527f53616c653a206e6f20656e6f75676820746f6b656e732072656d61696e696e676044820152606401610442565b806002600082825461111b919061155d565b909155505060405163a9059cbb60e01b81526001600160a01b038381166004830152602482018390527f0000000000000000000000000000000000000000000000000000000000000000169063a9059cbb906044016020604051808303816000875af115801561118f573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906111b39190611326565b50816001600160a01b03167f2499a5330ab0979cc612135e7883ebc3cd5c9f7a8508f042540c34723348f632826040516111ef91815260200190565b60405180910390a25050565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6001600160a01b0381168114610f6757600080fd5b6000806040838503121561127357600080fd5b8235915060208301356112858161124b565b809150509250929050565b6000602082840312156112a257600080fd5b5035919050565b8015158114610f6757600080fd5b6000602082840312156112c957600080fd5b8135610d2e816112a9565b6000602082840312156112e657600080fd5b8135610d2e8161124b565b6020808252818101527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604082015260600190565b60006020828403121561133857600080fd5b8151610d2e816112a9565b60006020828403121561135557600080fd5b5051919050565b60006020828403121561136e57600080fd5b815160ff81168114610d2e57600080fd5b634e487b7160e01b600052601160045260246000fd5b600181815b808511156113d05781600019048211156113b6576113b661137f565b808516156113c357918102915b93841c939080029061139a565b509250929050565b6000826113e757506001610959565b816113f457506000610959565b816001811461140a576002811461141457611430565b6001915050610959565b60ff8411156114255761142561137f565b50506001821b610959565b5060208310610133831016604e8410600b8410161715611453575081810a610959565b61145d8383611395565b80600019048211156114715761147161137f565b029392505050565b6000610d2e60ff8416836113d8565b60008160001904831182151516156114a2576114a261137f565b500290565b6000826114c457634e487b7160e01b600052601260045260246000fd5b500490565b805169ffffffffffffffffffff811681146114e357600080fd5b919050565b600080600080600060a0868803121561150057600080fd5b611509866114c9565b945060208601519350604086015192506060860151915061152c608087016114c9565b90509295509295909350565b600060ff821660ff84168060ff038211156115555761155561137f565b019392505050565b600082198211156115705761157061137f565b50019056fea26469706673582212208a6e138e9f5af051151383b5bde05f55c5058dd0e42e68bccbe74509a0eba4d264736f6c634300080d0033";

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
    _aggregator: string,
    _rate: BigNumberish,
    _minimumPurchaseSTC: BigNumberish,
    _initialSold: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<Sale> {
    return super.deploy(
      _DPS,
      _STC,
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
    _aggregator: string,
    _rate: BigNumberish,
    _minimumPurchaseSTC: BigNumberish,
    _initialSold: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      _DPS,
      _STC,
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
