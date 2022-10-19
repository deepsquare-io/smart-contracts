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
  SaleV1,
  SaleV1Interface,
} from "../../../../contracts/legacy/v1.0/SaleV1";

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
    inputs: [
      {
        internalType: "uint256",
        name: "amountSTC",
        type: "uint256",
      },
    ],
    name: "purchaseDPS",
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
  "0x6101206040523480156200001257600080fd5b50604051620026bb380380620026bb8339818101604052810190620000389190620004c5565b620000586200004c620002bd60201b60201c565b620002c560201b60201c565b600073ffffffffffffffffffffffffffffffffffffffff168673ffffffffffffffffffffffffffffffffffffffff1603620000ca576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620000c190620005c2565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff16036200013c576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620001339062000634565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff1603620001ae576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620001a590620006a6565b60405180910390fd5b60008360ff1611620001f7576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620001ee9062000718565b60405180910390fd5b8573ffffffffffffffffffffffffffffffffffffffff1660808173ffffffffffffffffffffffffffffffffffffffff16815250508473ffffffffffffffffffffffffffffffffffffffff1660a08173ffffffffffffffffffffffffffffffffffffffff16815250508373ffffffffffffffffffffffffffffffffffffffff1660c08173ffffffffffffffffffffffffffffffffffffffff16815250508260ff1660e08160ff1681525050816101008181525050806001819055505050505050506200073a565b600033905090565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000620003bb826200038e565b9050919050565b6000620003cf82620003ae565b9050919050565b620003e181620003c2565b8114620003ed57600080fd5b50565b6000815190506200040181620003d6565b92915050565b60006200041482620003ae565b9050919050565b620004268162000407565b81146200043257600080fd5b50565b60008151905062000446816200041b565b92915050565b600060ff82169050919050565b62000464816200044c565b81146200047057600080fd5b50565b600081519050620004848162000459565b92915050565b6000819050919050565b6200049f816200048a565b8114620004ab57600080fd5b50565b600081519050620004bf8162000494565b92915050565b60008060008060008060c08789031215620004e557620004e462000389565b5b6000620004f589828a01620003f0565b96505060206200050889828a01620003f0565b95505060406200051b89828a0162000435565b94505060606200052e89828a0162000473565b93505060806200054189828a01620004ae565b92505060a06200055489828a01620004ae565b9150509295509295509295565b600082825260208201905092915050565b7f53616c653a20746f6b656e206973207a65726f00000000000000000000000000600082015250565b6000620005aa60138362000561565b9150620005b78262000572565b602082019050919050565b60006020820190508181036000830152620005dd816200059b565b9050919050565b7f53616c653a20737461626c65636f696e206973207a65726f0000000000000000600082015250565b60006200061c60188362000561565b91506200062982620005e4565b602082019050919050565b600060208201905081810360008301526200064f816200060d565b9050919050565b7f53616c653a20656c69676962696c697479206973207a65726f00000000000000600082015250565b60006200068e60198362000561565b91506200069b8262000656565b602082019050919050565b60006020820190508181036000830152620006c1816200067f565b9050919050565b7f53616c653a2072617465206973206e6f7420706f736974697665000000000000600082015250565b600062000700601a8362000561565b91506200070d82620006c8565b602082019050919050565b600060208201905081810360008301526200073381620006f1565b9050919050565b60805160a05160c05160e05161010051611ecc620007ef600039600081816109320152610c100152600081816103a0015281816107b90152610b210152600081816102e30152610de30152600081816106570152818161071e015281816109a301528181610b450152610f7b015260008181610443015281816105ab0152818161067d015281816107df01528181610a8401528181610c3401528181610ece0152818161107d015261117f0152611ecc6000f3fe608060405234801561001057600080fd5b50600436106101005760003560e01c8063715018a611610097578063cc2d9e1811610066578063cc2d9e1814610265578063ef4e06ec14610283578063f0ea4bfc146102a1578063f2fde38b146102bf57610100565b8063715018a6146101f15780637f984660146101fb5780638da5cb5b1461021757806398a8f5031461023557610100565b806343d726d6116100d357806343d726d61461017b578063542e898e1461018557806355234ec0146101a357806355468cc0146101c157610100565b806302c7e7af146101055780630dc14000146101235780631dc4b1f3146101415780632c4e722e1461015d575b600080fd5b61010d6102db565b60405161011a919061134b565b60405180910390f35b61012b6102e1565b60405161013891906113e5565b60405180910390f35b61015b6004803603810190610156919061146f565b610305565b005b61016561039e565b60405161017291906114cb565b60405180910390f35b6101836103c2565b005b61018d610655565b60405161019a9190611507565b60405180910390f35b6101ab610679565b6040516101b8919061134b565b60405180910390f35b6101db60048036038101906101d69190611522565b61071a565b6040516101e8919061134b565b60405180910390f35b6101f96108a8565b005b61021560048036038101906102109190611522565b610930565b005b61021f610a57565b60405161022c919061155e565b60405180910390f35b61024f600480360381019061024a9190611522565b610a80565b60405161025c919061134b565b60405180910390f35b61026d610c0e565b60405161027a919061134b565b60405180910390f35b61028b610c32565b6040516102989190611507565b60405180910390f35b6102a9610c56565b6040516102b6919061134b565b60405180910390f35b6102d960048036038101906102d49190611579565b610c68565b005b60015481565b7f000000000000000000000000000000000000000000000000000000000000000081565b61030d610d5f565b73ffffffffffffffffffffffffffffffffffffffff1661032b610a57565b73ffffffffffffffffffffffffffffffffffffffff1614610381576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161037890611603565b60405180910390fd5b600061038d8284610d67565b90506103998282611164565b505050565b7f000000000000000000000000000000000000000000000000000000000000000081565b6103ca610d5f565b73ffffffffffffffffffffffffffffffffffffffff166103e8610a57565b73ffffffffffffffffffffffffffffffffffffffff161461043e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161043590611603565b60405180910390fd5b6000807f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff166040516024016040516020818303038152906040527f8da5cb5b000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff8381831617835250505050604051610508919061169d565b600060405180830381855afa9150503d8060008114610543576040519150601f19603f3d011682016040523d82523d6000602084013e610548565b606091505b50915091508161058d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161058490611700565b60405180910390fd5b6000818060200190518101906105a3919061175e565b9050610648817f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff166370a08231306040518263ffffffff1660e01b8152600401610602919061155e565b602060405180830381865afa15801561061f573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061064391906117a0565b611164565b6106506108a8565b505050565b7f000000000000000000000000000000000000000000000000000000000000000081565b60007f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff166370a08231306040518263ffffffff1660e01b81526004016106d4919061155e565b602060405180830381865afa1580156106f1573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061071591906117a0565b905090565b60007f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa158015610787573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107ab91906117f9565b600a6107b79190611988565b7f000000000000000000000000000000000000000000000000000000000000000060ff1660647f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa158015610848573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061086c91906117f9565b600a6108789190611988565b8561088391906119d3565b61088d91906119d3565b6108979190611a5c565b6108a19190611a5c565b9050919050565b6108b0610d5f565b73ffffffffffffffffffffffffffffffffffffffff166108ce610a57565b73ffffffffffffffffffffffffffffffffffffffff1614610924576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161091b90611603565b60405180910390fd5b61092e600061126e565b565b7f0000000000000000000000000000000000000000000000000000000000000000811015610993576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161098a90611ad9565b60405180910390fd5b600061099f3383610d67565b90507f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff166323b872dd336109e6610a57565b856040518463ffffffff1660e01b8152600401610a0593929190611af9565b6020604051808303816000875af1158015610a24573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a489190611b68565b50610a533382611164565b5050565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b60007f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa158015610aed573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610b1191906117f9565b600a610b1d9190611988565b60647f000000000000000000000000000000000000000000000000000000000000000060ff167f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa158015610bae573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610bd291906117f9565b600a610bde9190611988565b85610be991906119d3565b610bf391906119d3565b610bfd9190611a5c565b610c079190611a5c565b9050919050565b7f000000000000000000000000000000000000000000000000000000000000000081565b7f000000000000000000000000000000000000000000000000000000000000000081565b6000610c63600154610a80565b905090565b610c70610d5f565b73ffffffffffffffffffffffffffffffffffffffff16610c8e610a57565b73ffffffffffffffffffffffffffffffffffffffff1614610ce4576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610cdb90611603565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603610d53576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610d4a90611c07565b60405180910390fd5b610d5c8161126e565b50565b600033905090565b6000610d71610a57565b73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610dde576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610dd590611c73565b60405180910390fd5b6000807f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1663d4b6b5da866040518263ffffffff1660e01b8152600401610e3a919061155e565b60408051808303816000875af1158015610e58573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610e7c9190611c93565b9150915060008260ff1611610ec6576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610ebd90611d1f565b60405180910390fd5b600084610f6b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff166370a08231896040518263ffffffff1660e01b8152600401610f25919061155e565b602060405180830381865afa158015610f42573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610f6691906117a0565b610a80565b610f759190611d3f565b905060007f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa158015610fe4573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061100891906117f9565b600a6110149190611988565b8361101f91906119d3565b90506000811461106d578082111561106c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161106390611de1565b60405180910390fd5b5b60006110788761071a565b9050807f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff166370a08231306040518263ffffffff1660e01b81526004016110d4919061155e565b602060405180830381865afa1580156110f1573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061111591906117a0565b1015611156576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161114d90611e4d565b60405180910390fd5b809550505050505092915050565b80600160008282546111769190611d3f565b925050819055507f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1663a9059cbb83836040518363ffffffff1660e01b81526004016111d8929190611e6d565b6020604051808303816000875af11580156111f7573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061121b9190611b68565b508173ffffffffffffffffffffffffffffffffffffffff167f2499a5330ab0979cc612135e7883ebc3cd5c9f7a8508f042540c34723348f63282604051611262919061134b565b60405180910390a25050565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b6000819050919050565b61134581611332565b82525050565b6000602082019050611360600083018461133c565b92915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b60006113ab6113a66113a184611366565b611386565b611366565b9050919050565b60006113bd82611390565b9050919050565b60006113cf826113b2565b9050919050565b6113df816113c4565b82525050565b60006020820190506113fa60008301846113d6565b92915050565b600080fd5b61140e81611332565b811461141957600080fd5b50565b60008135905061142b81611405565b92915050565b600061143c82611366565b9050919050565b61144c81611431565b811461145757600080fd5b50565b60008135905061146981611443565b92915050565b6000806040838503121561148657611485611400565b5b60006114948582860161141c565b92505060206114a58582860161145a565b9150509250929050565b600060ff82169050919050565b6114c5816114af565b82525050565b60006020820190506114e060008301846114bc565b92915050565b60006114f1826113b2565b9050919050565b611501816114e6565b82525050565b600060208201905061151c60008301846114f8565b92915050565b60006020828403121561153857611537611400565b5b60006115468482850161141c565b91505092915050565b61155881611431565b82525050565b6000602082019050611573600083018461154f565b92915050565b60006020828403121561158f5761158e611400565b5b600061159d8482850161145a565b91505092915050565b600082825260208201905092915050565b7f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572600082015250565b60006115ed6020836115a6565b91506115f8826115b7565b602082019050919050565b6000602082019050818103600083015261161c816115e0565b9050919050565b600081519050919050565b600081905092915050565b60005b8381101561165757808201518184015260208101905061163c565b83811115611666576000848401525b50505050565b600061167782611623565b611681818561162e565b9350611691818560208601611639565b80840191505092915050565b60006116a9828461166c565b915081905092915050565b7f53616c653a20756e61626c6520746f2064657465726d696e65206f776e657200600082015250565b60006116ea601f836115a6565b91506116f5826116b4565b602082019050919050565b60006020820190508181036000830152611719816116dd565b9050919050565b600061172b82611366565b9050919050565b61173b81611720565b811461174657600080fd5b50565b60008151905061175881611732565b92915050565b60006020828403121561177457611773611400565b5b600061178284828501611749565b91505092915050565b60008151905061179a81611405565b92915050565b6000602082840312156117b6576117b5611400565b5b60006117c48482850161178b565b91505092915050565b6117d6816114af565b81146117e157600080fd5b50565b6000815190506117f3816117cd565b92915050565b60006020828403121561180f5761180e611400565b5b600061181d848285016117e4565b91505092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60008160011c9050919050565b6000808291508390505b60018511156118ac5780860481111561188857611887611826565b5b60018516156118975780820291505b80810290506118a585611855565b945061186c565b94509492505050565b6000826118c55760019050611981565b816118d35760009050611981565b81600181146118e957600281146118f357611922565b6001915050611981565b60ff84111561190557611904611826565b5b8360020a91508482111561191c5761191b611826565b5b50611981565b5060208310610133831016604e8410600b84101617156119575782820a90508381111561195257611951611826565b5b611981565b6119648484846001611862565b9250905081840481111561197b5761197a611826565b5b81810290505b9392505050565b600061199382611332565b915061199e836114af565b92506119cb7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff84846118b5565b905092915050565b60006119de82611332565b91506119e983611332565b9250817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0483118215151615611a2257611a21611826565b5b828202905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b6000611a6782611332565b9150611a7283611332565b925082611a8257611a81611a2d565b5b828204905092915050565b7f53616c653a20616d6f756e74206c6f776572207468616e206d696e696d756d00600082015250565b6000611ac3601f836115a6565b9150611ace82611a8d565b602082019050919050565b60006020820190508181036000830152611af281611ab6565b9050919050565b6000606082019050611b0e600083018661154f565b611b1b602083018561154f565b611b28604083018461133c565b949350505050565b60008115159050919050565b611b4581611b30565b8114611b5057600080fd5b50565b600081519050611b6281611b3c565b92915050565b600060208284031215611b7e57611b7d611400565b5b6000611b8c84828501611b53565b91505092915050565b7f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160008201527f6464726573730000000000000000000000000000000000000000000000000000602082015250565b6000611bf16026836115a6565b9150611bfc82611b95565b604082019050919050565b60006020820190508181036000830152611c2081611be4565b9050919050565b7f53616c653a20696e766573746f72206973207468652073616c65206f776e6572600082015250565b6000611c5d6020836115a6565b9150611c6882611c27565b602082019050919050565b60006020820190508181036000830152611c8c81611c50565b9050919050565b60008060408385031215611caa57611ca9611400565b5b6000611cb8858286016117e4565b9250506020611cc98582860161178b565b9150509250929050565b7f53616c653a206163636f756e74206973206e6f7420656c696769626c65000000600082015250565b6000611d09601d836115a6565b9150611d1482611cd3565b602082019050919050565b60006020820190508181036000830152611d3881611cfc565b9050919050565b6000611d4a82611332565b9150611d5583611332565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff03821115611d8a57611d89611826565b5b828201905092915050565b7f53616c653a20657863656564732074696572206c696d69740000000000000000600082015250565b6000611dcb6018836115a6565b9150611dd682611d95565b602082019050919050565b60006020820190508181036000830152611dfa81611dbe565b9050919050565b7f53616c653a206e6f20656e6f75676820746f6b656e732072656d61696e696e67600082015250565b6000611e376020836115a6565b9150611e4282611e01565b602082019050919050565b60006020820190508181036000830152611e6681611e2a565b9050919050565b6000604082019050611e82600083018561154f565b611e8f602083018461133c565b939250505056fea264697066735822122034e8f20f9e234b152bcde5c02907ed96e9b7f95826a592fec445f4fa5bd27e5664736f6c634300080d0033";

type SaleV1ConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: SaleV1ConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class SaleV1__factory extends ContractFactory {
  constructor(...args: SaleV1ConstructorParams) {
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
    _minimumPurchaseSTC: BigNumberish,
    _initialSold: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<SaleV1> {
    return super.deploy(
      _DPS,
      _STC,
      _eligibility,
      _rate,
      _minimumPurchaseSTC,
      _initialSold,
      overrides || {}
    ) as Promise<SaleV1>;
  }
  override getDeployTransaction(
    _DPS: string,
    _STC: string,
    _eligibility: string,
    _rate: BigNumberish,
    _minimumPurchaseSTC: BigNumberish,
    _initialSold: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      _DPS,
      _STC,
      _eligibility,
      _rate,
      _minimumPurchaseSTC,
      _initialSold,
      overrides || {}
    );
  }
  override attach(address: string): SaleV1 {
    return super.attach(address) as SaleV1;
  }
  override connect(signer: Signer): SaleV1__factory {
    return super.connect(signer) as SaleV1__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): SaleV1Interface {
    return new utils.Interface(_abi) as SaleV1Interface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): SaleV1 {
    return new Contract(address, _abi, signerOrProvider) as SaleV1;
  }
}
