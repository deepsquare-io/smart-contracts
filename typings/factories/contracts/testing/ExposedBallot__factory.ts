/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  ExposedBallot,
  ExposedBallotInterface,
} from "../../../contracts/testing/ExposedBallot";

const _abi = [
  {
    inputs: [
      {
        internalType: "contract IERC20Metadata",
        name: "_DPS",
        type: "address",
      },
      {
        internalType: "contract VotingDelegation",
        name: "_proxy",
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
    name: "_results",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "voter",
            type: "address",
          },
          {
            components: [
              {
                internalType: "uint32",
                name: "choiceIndex",
                type: "uint32",
              },
              {
                internalType: "bool",
                name: "hasVoted",
                type: "bool",
              },
            ],
            internalType: "struct Ballot.Vote",
            name: "vote",
            type: "tuple",
          },
        ],
        internalType: "struct ExposedBallot.ResultSample[]",
        name: "",
        type: "tuple[]",
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
    name: "choices",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
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
    inputs: [],
    name: "closed",
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
    name: "factory",
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
    inputs: [],
    name: "getChoices",
    outputs: [
      {
        internalType: "string[]",
        name: "",
        type: "string[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getResults",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IERC20Metadata",
        name: "_DPS",
        type: "address",
      },
      {
        internalType: "contract VotingDelegation",
        name: "_proxy",
        type: "address",
      },
      {
        internalType: "contract BallotFactory",
        name: "_factory",
        type: "address",
      },
      {
        internalType: "string",
        name: "_subject",
        type: "string",
      },
      {
        internalType: "string",
        name: "_topic",
        type: "string",
      },
      {
        internalType: "string[]",
        name: "_choices",
        type: "string[]",
      },
    ],
    name: "init",
    outputs: [],
    stateMutability: "nonpayable",
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
    name: "proxy",
    outputs: [
      {
        internalType: "contract VotingDelegation",
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
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "resultStorage",
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
    name: "subject",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "topic",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
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
  {
    inputs: [
      {
        internalType: "uint32",
        name: "choiceIndex",
        type: "uint32",
      },
    ],
    name: "vote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60a060405269054b40b1f852bda000006080523480156200001f57600080fd5b506040516200184538038062001845833981016040819052620000429162000148565b81816200004f33620000df565b6001600160a01b038216620000aa5760405162461bcd60e51b815260206004820152601a60248201527f566f74653a204450532061646472657373206973207a65726f2e000000000000604482015260640160405180910390fd5b600180546001600160a01b039384166001600160a01b0319918216179091556002805492909316911617905550620001879050565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6001600160a01b03811681146200014557600080fd5b50565b600080604083850312156200015c57600080fd5b825162000169816200012f565b60208401519092506200017c816200012f565b809150509250929050565b6080516116a2620001a36000396000610b7701526116a26000f3fe608060405234801561001057600080fd5b506004361061010b5760003560e01c80638da5cb5b116100a2578063c45a015511610071578063c45a015514610210578063ec55688914610223578063ef4e06ec14610236578063f2fde38b14610249578063f6fd7fde1461025c57600080fd5b80638da5cb5b146101bb5780639094c763146101e057806398c81bbf146101f3578063bf63a5771461020857600080fd5b80634717f97c116100de5780634717f97c1461016057806359037b8914610175578063597e1fb514610196578063715018a6146101b357600080fd5b80630a59a98c146101105780631917d6c01461012e57806327454ea81461014357806343d726d614610158575b600080fd5b61011861026f565b6040516101259190611130565b60405180910390f35b61014161013c366004611216565b6102fd565b005b61014b6104b1565b604051610125919061135a565b610141610604565b6101686108fc565b60405161012591906113c5565b610188610183366004611409565b610954565b604051908152602001610125565b6005546101a39060ff1681565b6040519015158152602001610125565b610141610975565b6000546001600160a01b03165b6040516001600160a01b039091168152602001610125565b6101416101ee366004611422565b6109db565b6101fb610cf2565b6040516101259190611448565b610118610dcb565b6003546101c8906001600160a01b031681565b6002546101c8906001600160a01b031681565b6001546101c8906001600160a01b031681565b6101416102573660046114aa565b610dd8565b61011861026a366004611409565b610ea0565b6004805461027c906114c7565b80601f01602080910402602001604051908101604052809291908181526020018280546102a8906114c7565b80156102f55780601f106102ca576101008083540402835291602001916102f5565b820191906000526020600020905b8154815290600101906020018083116102d857829003601f168201915b505050505081565b600054600160a81b900460ff1661032157600054600160a01b900460ff1615610325565b303b155b61038d5760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b60648201526084015b60405180910390fd5b600054600160a81b900460ff161580156103b7576000805461ffff60a01b191661010160a01b1790555b83516103ca906004906020870190610f1b565b5082516103de906006906020860190610f1b565b506005805460ff1916905581516103fc906007906020850190610f9f565b5060075467ffffffffffffffff8111156104185761041861115f565b604051908082528060200260200182016040528015610441578160200160208202803683370190505b50805161045691600891602090910190610ff8565b50600180546001600160a01b03808a166001600160a01b03199283161790925560028054898416908316179055600380549288169290911691909117905580156104a8576000805460ff60a81b191690555b50505050505050565b60095460609060009067ffffffffffffffff8111156104d2576104d261115f565b60405190808252806020026020018201604052801561050b57816020015b6104f8611032565b8152602001906001900390816104f05790505b50905060005b6009548110156105fe57604051806040016040528060098381548110610539576105396114fc565b9060005260206000200160009054906101000a90046001600160a01b03166001600160a01b03168152602001600a60006009858154811061057c5761057c6114fc565b60009182526020808320909101546001600160a01b03168352828101939093526040918201902081518083019092525463ffffffff8116825260ff64010000000090910416151591810191909152905282518390839081106105e0576105e06114fc565b602002602001018190525080806105f690611528565b915050610511565b50919050565b600360009054906101000a90046001600160a01b03166001600160a01b0316638da5cb5b6040518163ffffffff1660e01b815260040160206040518083038186803b15801561065257600080fd5b505afa158015610666573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061068a9190611543565b6001600160a01b0316336001600160a01b0316146106f65760405162461bcd60e51b8152602060048201526024808201527f566f74696e673a205265737472696374656420746f20666163746f7279206f776044820152633732b91760e11b6064820152608401610384565b60055460ff16156107495760405162461bcd60e51b815260206004820152601e60248201527f566f74696e673a2042616c6c6f7420616c726561647920636c6f7365642e00006044820152606401610384565b6005805460ff1916600117905560005b6009548110156108f957600060098281548110610778576107786114fc565b6000918252602090912001546002546040516302fbd00360e21b81526001600160a01b039283169350911690630bef400c906107bb908490600690600401611560565b60206040518083038186803b1580156107d357600080fd5b505afa1580156107e7573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061080b9190611619565b6001546040516370a0823160e01b81526001600160a01b038481166004830152909116906370a082319060240160206040518083038186803b15801561085057600080fd5b505afa158015610864573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108889190611619565b6108929190611632565b6001600160a01b0382166000908152600a602052604090205460088054909163ffffffff169081106108c6576108c66114fc565b9060005260206000200160008282546108df9190611632565b909155508291506108f1905081611528565b915050610759565b50565b6060600880548060200260200160405190810160405280929190818152602001828054801561094a57602002820191906000526020600020905b815481526020019060010190808311610936575b5050505050905090565b6008818154811061096457600080fd5b600091825260209091200154905081565b6000546001600160a01b031633146109cf5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610384565b6109d96000610ecb565b565b60055460ff1615610a2e5760405162461bcd60e51b815260206004820152601960248201527f566f74696e673a2042616c6c6f7420697320636c6f7365642e000000000000006044820152606401610384565b60075463ffffffff821610610a8f5760405162461bcd60e51b815260206004820152602160248201527f566f74696e673a2043686f69636520696e64657820697320746f6f20686967686044820152601760f91b6064820152608401610384565b60025460405163442f655160e01b81526001600160a01b039091169063442f655190610ac2903390600690600401611560565b60206040518083038186803b158015610ada57600080fd5b505afa158015610aee573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610b12919061164a565b15610b5f5760405162461bcd60e51b815260206004820152601a60248201527f566f74696e673a20566f74652069732064656c6567617465642e0000000000006044820152606401610384565b6001546040516370a0823160e01b81523360048201527f0000000000000000000000000000000000000000000000000000000000000000916001600160a01b0316906370a082319060240160206040518083038186803b158015610bc257600080fd5b505afa158015610bd6573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610bfa9190611619565b1015610c485760405162461bcd60e51b815260206004820152601f60248201527f566f74696e673a204e6f7420656e6f7567682044505320746f20766f74652e006044820152606401610384565b336000908152600a6020526040902054640100000000900460ff16610cc957336000818152600a60205260408120805464ff0000000019166401000000001790556009805460018101825591527f6e1540171b6c0c960b71a7020d9f60077f6af931a8bbf590da0223dacf75c7af0180546001600160a01b03191690911790555b336000908152600a60205260409020805463ffffffff191663ffffffff92909216919091179055565b60606007805480602002602001604051908101604052809291908181526020016000905b82821015610dc2578382906000526020600020018054610d35906114c7565b80601f0160208091040260200160405190810160405280929190818152602001828054610d61906114c7565b8015610dae5780601f10610d8357610100808354040283529160200191610dae565b820191906000526020600020905b815481529060010190602001808311610d9157829003601f168201915b505050505081526020019060010190610d16565b50505050905090565b6006805461027c906114c7565b6000546001600160a01b03163314610e325760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610384565b6001600160a01b038116610e975760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b6064820152608401610384565b6108f981610ecb565b60078181548110610eb057600080fd5b90600052602060002001600091509050805461027c906114c7565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b828054610f27906114c7565b90600052602060002090601f016020900481019282610f495760008555610f8f565b82601f10610f6257805160ff1916838001178555610f8f565b82800160010185558215610f8f579182015b82811115610f8f578251825591602001919060010190610f74565b50610f9b929150611077565b5090565b828054828255906000526020600020908101928215610fec579160200282015b82811115610fec5782518051610fdc918491602090910190610f1b565b5091602001919060010190610fbf565b50610f9b92915061108c565b828054828255906000526020600020908101928215610f8f5791602002820182811115610f8f578251825591602001919060010190610f74565b604051806040016040528060006001600160a01b031681526020016110726040518060400160405280600063ffffffff1681526020016000151581525090565b905290565b5b80821115610f9b5760008155600101611078565b80821115610f9b5760006110a082826110a9565b5060010161108c565b5080546110b5906114c7565b6000825580601f106110c5575050565b601f0160209004906000526020600020908101906108f99190611077565b6000815180845260005b81811015611109576020818501810151868301820152016110ed565b8181111561111b576000602083870101525b50601f01601f19169290920160200192915050565b60208152600061114360208301846110e3565b9392505050565b6001600160a01b03811681146108f957600080fd5b634e487b7160e01b600052604160045260246000fd5b604051601f8201601f1916810167ffffffffffffffff8111828210171561119e5761119e61115f565b604052919050565b600082601f8301126111b757600080fd5b813567ffffffffffffffff8111156111d1576111d161115f565b6111e4601f8201601f1916602001611175565b8181528460208386010111156111f957600080fd5b816020850160208301376000918101602001919091529392505050565b60008060008060008060c0878903121561122f57600080fd5b611239873561114a565b8635955060208088013561124c8161114a565b9550604088013561125c8161114a565b9450606088013567ffffffffffffffff8082111561127957600080fd5b6112858b838c016111a6565b955060808a013591508082111561129b57600080fd5b6112a78b838c016111a6565b945060a08a01359150808211156112bd57600080fd5b818a0191508a601f8301126112d157600080fd5b8135818111156112e3576112e361115f565b8060051b6112f2858201611175565b918252838101850191858101908e84111561130c57600080fd5b86860192505b8383101561134657848335111561132857600080fd5b6113378f8885358901016111a6565b82529186019190860190611312565b809750505050505050509295509295509295565b602080825282518282018190526000919060409081850190868401855b828110156113b857815180516001600160a01b03168552860151805163ffffffff168786015286015115158585015260609093019290850190600101611377565b5091979650505050505050565b6020808252825182820181905260009190848201906040850190845b818110156113fd578351835292840192918401916001016113e1565b50909695505050505050565b60006020828403121561141b57600080fd5b5035919050565b60006020828403121561143457600080fd5b813563ffffffff8116811461114357600080fd5b6000602080830181845280855180835260408601915060408160051b870101925083870160005b8281101561149d57603f1988860301845261148b8583516110e3565b9450928501929085019060010161146f565b5092979650505050505050565b6000602082840312156114bc57600080fd5b81356111438161114a565b600181811c908216806114db57607f821691505b602082108114156105fe57634e487b7160e01b600052602260045260246000fd5b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b600060001982141561153c5761153c611512565b5060010190565b60006020828403121561155557600080fd5b81516111438161114a565b60018060a01b0383168152600060206040818401526000845481600182811c91508083168061159057607f831692505b8583108114156115ae57634e487b7160e01b85526022600452602485fd5b60408801839052606088018180156115cd57600181146115de57611609565b60ff19861682528782019650611609565b60008b81526020902060005b86811015611603578154848201529085019089016115ea565b83019750505b50949a9950505050505050505050565b60006020828403121561162b57600080fd5b5051919050565b6000821982111561164557611645611512565b500190565b60006020828403121561165c57600080fd5b8151801515811461114357600080fdfea2646970667358221220d99d59966bcdc357425331a44e10aac185bb3b9b1004c4ec1b5a9c8998c7295564736f6c63430008090033";

type ExposedBallotConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ExposedBallotConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ExposedBallot__factory extends ContractFactory {
  constructor(...args: ExposedBallotConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _DPS: string,
    _proxy: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ExposedBallot> {
    return super.deploy(
      _DPS,
      _proxy,
      overrides || {}
    ) as Promise<ExposedBallot>;
  }
  override getDeployTransaction(
    _DPS: string,
    _proxy: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_DPS, _proxy, overrides || {});
  }
  override attach(address: string): ExposedBallot {
    return super.attach(address) as ExposedBallot;
  }
  override connect(signer: Signer): ExposedBallot__factory {
    return super.connect(signer) as ExposedBallot__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ExposedBallotInterface {
    return new utils.Interface(_abi) as ExposedBallotInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ExposedBallot {
    return new Contract(address, _abi, signerOrProvider) as ExposedBallot;
  }
}