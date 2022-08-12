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
  CommunityDev,
  CommunityDevInterface,
} from "../../contracts/CommunityDev";

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
        internalType: "uint8",
        name: "_rate",
        type: "uint8",
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
    name: "TransferEvent",
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
    name: "close",
    outputs: [],
    stateMutability: "nonpayable",
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
        name: "amountDPS",
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
  "0x6101006040523480156200001257600080fd5b506040516200104f3803806200104f833981016040819052620000359162000239565b838383836200004433620001d0565b6001600160a01b038416620000a05760405162461bcd60e51b815260206004820152601360248201527f53616c653a20746f6b656e206973207a65726f0000000000000000000000000060448201526064015b60405180910390fd5b6001600160a01b038316620000f85760405162461bcd60e51b815260206004820152601860248201527f53616c653a20737461626c65636f696e206973207a65726f0000000000000000604482015260640162000097565b6001600160a01b038216620001505760405162461bcd60e51b815260206004820152601960248201527f53616c653a20656c69676962696c697479206973207a65726f00000000000000604482015260640162000097565b60008160ff1611620001a55760405162461bcd60e51b815260206004820152601a60248201527f53616c653a2072617465206973206e6f7420706f736974697665000000000000604482015260640162000097565b6001600160a01b0393841660805291831660a05290911660c05260ff1660e05250620002a692505050565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6001600160a01b03811681146200023657600080fd5b50565b600080600080608085870312156200025057600080fd5b84516200025d8162000220565b6020860151909450620002708162000220565b6040860151909350620002838162000220565b606086015190925060ff811681146200029b57600080fd5b939692955090935050565b60805160a05160c05160e051610d316200031e6000396000818161010101526103c001526000818160a801526106bc015260008181610142015281816103e4015261082e0152600081816101a30152818161027701528181610331015281816105cb015281816107b101526109490152610d316000f3fe608060405234801561001057600080fd5b506004361061009e5760003560e01c8063715018a611610066578063715018a6146101645780638da5cb5b1461016c57806398a8f5031461017d578063ef4e06ec1461019e578063f2fde38b146101c557600080fd5b80630dc14000146100a35780631dc4b1f3146100e75780632c4e722e146100fc57806343d726d614610135578063542e898e1461013d575b600080fd5b6100ca7f000000000000000000000000000000000000000000000000000000000000000081565b6040516001600160a01b0390911681526020015b60405180910390f35b6100fa6100f5366004610a6a565b6101d8565b005b6101237f000000000000000000000000000000000000000000000000000000000000000081565b60405160ff90911681526020016100de565b6100fa610223565b6100ca7f000000000000000000000000000000000000000000000000000000000000000081565b6100fa6102f9565b6000546001600160a01b03166100ca565b61019061018b366004610a96565b61032d565b6040519081526020016100de565b6100ca7f000000000000000000000000000000000000000000000000000000000000000081565b6100fa6101d3366004610aaf565b61049d565b6000546001600160a01b0316331461020b5760405162461bcd60e51b815260040161020290610ad1565b60405180910390fd5b6102158183610538565b61021f8183610923565b5050565b6000546001600160a01b0316331461024d5760405162461bcd60e51b815260040161020290610ad1565b6102ef6102626000546001600160a01b031690565b6040516370a0823160e01b81523060048201527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316906370a0823190602401602060405180830381865afa1580156102c6573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102ea9190610b06565b610923565b6102f76102f9565b565b6000546001600160a01b031633146103235760405162461bcd60e51b815260040161020290610ad1565b6102f760006109fe565b60007f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa15801561038d573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103b19190610b30565b6103bc90600a610c45565b60647f000000000000000000000000000000000000000000000000000000000000000060ff167f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa158015610440573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104649190610b30565b61046f90600a610c45565b6104799086610c54565b6104839190610c54565b61048d9190610c73565b6104979190610c73565b92915050565b6000546001600160a01b031633146104c75760405162461bcd60e51b815260040161020290610ad1565b6001600160a01b03811661052c5760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b6064820152608401610202565b610535816109fe565b50565b6000546001600160a01b03166001600160a01b0316826001600160a01b0316036105b45760405162461bcd60e51b815260206004820152602760248201527f5472616e736665723a2062656e6566696369617279206973207468652073616c604482015266329037bbb732b960c91b6064820152608401610202565b6040516370a0823160e01b815230600482015281907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316906370a0823190602401602060405180830381865afa15801561061a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061063e9190610b06565b10156106985760405162461bcd60e51b8152602060048201526024808201527f5472616e736665723a206e6f20656e6f75676820746f6b656e732072656d61696044820152636e696e6760e01b6064820152608401610202565b604051636a5b5aed60e11b81526001600160a01b03838116600483015260009182917f0000000000000000000000000000000000000000000000000000000000000000169063d4b6b5da9060240160408051808303816000875af1158015610704573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107289190610c95565b9150915060008260ff16116107895760405162461bcd60e51b815260206004820152602160248201527f5472616e736665723a206163636f756e74206973206e6f7420656c696769626c6044820152606560f81b6064820152608401610202565b6040516370a0823160e01b81526001600160a01b0385811660048301526000916108289186917f0000000000000000000000000000000000000000000000000000000000000000909116906370a0823190602401602060405180830381865afa1580156107fa573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061081e9190610b06565b61018b9190610cc1565b905060007f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa15801561088a573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108ae9190610b30565b6108b990600a610c45565b6108c39084610c54565b9050801561091b578082111561091b5760405162461bcd60e51b815260206004820152601c60248201527f5472616e736665723a20657863656564732074696572206c696d6974000000006044820152606401610202565b505050505050565b60405163a9059cbb60e01b81526001600160a01b038381166004830152602482018390527f0000000000000000000000000000000000000000000000000000000000000000169063a9059cbb906044016020604051808303816000875af1158015610992573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906109b69190610cd9565b50816001600160a01b03167fb98a26c1d0427d0e3492e749861c7795bed8f6e7599a65143b5903942e611bb0826040516109f291815260200190565b60405180910390a25050565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b80356001600160a01b0381168114610a6557600080fd5b919050565b60008060408385031215610a7d57600080fd5b82359150610a8d60208401610a4e565b90509250929050565b600060208284031215610aa857600080fd5b5035919050565b600060208284031215610ac157600080fd5b610aca82610a4e565b9392505050565b6020808252818101527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604082015260600190565b600060208284031215610b1857600080fd5b5051919050565b805160ff81168114610a6557600080fd5b600060208284031215610b4257600080fd5b610aca82610b1f565b634e487b7160e01b600052601160045260246000fd5b600181815b80851115610b9c578160001904821115610b8257610b82610b4b565b80851615610b8f57918102915b93841c9390800290610b66565b509250929050565b600082610bb357506001610497565b81610bc057506000610497565b8160018114610bd65760028114610be057610bfc565b6001915050610497565b60ff841115610bf157610bf1610b4b565b50506001821b610497565b5060208310610133831016604e8410600b8410161715610c1f575081810a610497565b610c298383610b61565b8060001904821115610c3d57610c3d610b4b565b029392505050565b6000610aca60ff841683610ba4565b6000816000190483118215151615610c6e57610c6e610b4b565b500290565b600082610c9057634e487b7160e01b600052601260045260246000fd5b500490565b60008060408385031215610ca857600080fd5b610cb183610b1f565b9150602083015190509250929050565b60008219821115610cd457610cd4610b4b565b500190565b600060208284031215610ceb57600080fd5b81518015158114610aca57600080fdfea2646970667358221220bafb9572e98a928bd8c23f7d0034caed11e6b111cc9450c142092f217c26dc9b64736f6c634300080d0033";

type CommunityDevConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: CommunityDevConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class CommunityDev__factory extends ContractFactory {
  constructor(...args: CommunityDevConstructorParams) {
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
    _rate: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<CommunityDev> {
    return super.deploy(
      _DPS,
      _STC,
      _eligibility,
      _rate,
      overrides || {}
    ) as Promise<CommunityDev>;
  }
  override getDeployTransaction(
    _DPS: string,
    _STC: string,
    _eligibility: string,
    _rate: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      _DPS,
      _STC,
      _eligibility,
      _rate,
      overrides || {}
    );
  }
  override attach(address: string): CommunityDev {
    return super.attach(address) as CommunityDev;
  }
  override connect(signer: Signer): CommunityDev__factory {
    return super.connect(signer) as CommunityDev__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): CommunityDevInterface {
    return new utils.Interface(_abi) as CommunityDevInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): CommunityDev {
    return new Contract(address, _abi, signerOrProvider) as CommunityDev;
  }
}
