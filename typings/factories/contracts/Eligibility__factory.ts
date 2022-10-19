/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  Eligibility,
  EligibilityInterface,
} from "../../contracts/Eligibility";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "previousAdminRole",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "newAdminRole",
        type: "bytes32",
      },
    ],
    name: "RoleAdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleGranted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleRevoked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        components: [
          {
            internalType: "uint8",
            name: "tier",
            type: "uint8",
          },
          {
            internalType: "string",
            name: "validator",
            type: "string",
          },
          {
            internalType: "string",
            name: "transactionId",
            type: "string",
          },
        ],
        indexed: false,
        internalType: "struct Result",
        name: "result",
        type: "tuple",
      },
    ],
    name: "Validation",
    type: "event",
  },
  {
    inputs: [],
    name: "DEFAULT_ADMIN_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "WRITER",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
    ],
    name: "getRoleAdmin",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "grantRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "hasRole",
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
    inputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    name: "limits",
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
        name: "account",
        type: "address",
      },
    ],
    name: "lookup",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
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
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "renounceRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "results",
    outputs: [
      {
        internalType: "uint8",
        name: "tier",
        type: "uint8",
      },
      {
        internalType: "string",
        name: "validator",
        type: "string",
      },
      {
        internalType: "string",
        name: "transactionId",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "revokeRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "tier",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "newLimit",
        type: "uint256",
      },
    ],
    name: "setLimit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        components: [
          {
            internalType: "uint8",
            name: "tier",
            type: "uint8",
          },
          {
            internalType: "string",
            name: "validator",
            type: "string",
          },
          {
            internalType: "string",
            name: "transactionId",
            type: "string",
          },
        ],
        internalType: "struct Result",
        name: "result",
        type: "tuple",
      },
    ],
    name: "setResult",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
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
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b50620000467f6c0a2ede610c8cd13d6ea5e2de2bfac34ec60053b0f2686bcb584dc075ec430960001b620002fb60201b60201c565b6200007a7f0b7a0076b0667e110a936da6da963fc5a741a4e5e29482202a137487833c07f660001b620002fb60201b60201c565b620000ae7f4621bacb35876b4c681940493dc40989c00306082327d02638452bb79d2ae43860001b620002fb60201b60201c565b620000e37f73a9985316cd4cbfd13dadcaa0e6f773c85e933a0d88efbe60e4dc49da9176a06000801b620002fe60201b60201c565b620001177fbea62de7d98db9749a5fdc9d4a8ba848cda8e9ce94eb2cb3ea677d51a005bec160001b620002fb60201b60201c565b6200014b7f6eb0406d90d617f990e092fb278c340a4312e12beff7c0e5c66266ce058d866560001b620002fb60201b60201c565b620001606000801b336200036160201b60201c565b620001947fe587419e44b0679996640a0cea1cb8783d08ccc9056df3e0e2cd8e2d95f5377d60001b620002fb60201b60201c565b620001c87f72f47028ed1ee3a7d0e97e0f5c759f2e0e9e2ecb7464b88032bec7570533eac960001b620002fb60201b60201c565b620001fa7f73a9985316cd4cbfd13dadcaa0e6f773c85e933a0d88efbe60e4dc49da9176a0336200036160201b60201c565b6200022e7fc9ae4e71d5707be09bd3f32254c306bc7b38c5a7c05c7d3ec28ea79390c9f2b260001b620002fb60201b60201c565b620002627f6d1a01ce255d47da9d7c3814cb454db59d33b115c4e8e20e84cd544079f9a58f60001b620002fb60201b60201c565b620002776001613a986200045260201b60201c565b620002ab7fca2c5cfd8d165ad982d5de8dda89eb35f6a7366115eb9fc78553e95203a4db0260001b620002fb60201b60201c565b620002df7fabdee95f58194c81a355d8f0c4a009815228555991453b133c1c58b75970afb460001b620002fb60201b60201c565b620002f56002620186a06200045260201b60201c565b62000cc7565b50565b600062000311836200053660201b60201c565b905081600080858152602001908152602001600020600101819055508181847fbd79b86ffe0ab8e8776151514217cd7cacd52c909f66475c3af44e129f0b00ff60405160405180910390a4505050565b6200037382826200055560201b60201c565b6200044e57600160008084815260200190815260200160002060000160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908315150217905550620003f3620005bf60201b60201c565b73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45b5050565b6000801b62000477816200046b620005bf60201b60201c565b620005c760201b60201c565b620004ab7f9621936552967aec6bfa6998e525b4d8687fa6f82de4bd5c183e4ce70a377fba60001b620002fb60201b60201c565b620004df7f45a7502a6973ab4248af31874a5be5a0f05d7c4fae92ce80f9cd3d78e74bd19660001b620002fb60201b60201c565b620005137f34bd3b2173e81dbec22f66be6856e56bf4424e91b52db5fb1257400172d1e9a460001b620002fb60201b60201c565b81600160008560ff1660ff16815260200190815260200160002081905550505050565b6000806000838152602001908152602001600020600101549050919050565b600080600084815260200190815260200160002060000160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16905092915050565b600033905090565b620005d982826200055560201b60201c565b62000687576200060c8173ffffffffffffffffffffffffffffffffffffffff1660146200068b60201b62000a251760201c565b620006278360001c60206200068b60201b62000a251760201c565b6040516020016200063a92919062000a09565b6040516020818303038152906040526040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016200067e919062000aae565b60405180910390fd5b5050565b606060006002836002620006a0919062000b0b565b620006ac919062000b6c565b67ffffffffffffffff811115620006c857620006c762000bc9565b5b6040519080825280601f01601f191660200182016040528015620006fb5781602001600182028036833780820191505090505b5090507f30000000000000000000000000000000000000000000000000000000000000008160008151811062000736576200073562000bf8565b5b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a9053507f7800000000000000000000000000000000000000000000000000000000000000816001815181106200079d576200079c62000bf8565b5b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a90535060006001846002620007df919062000b0b565b620007eb919062000b6c565b90505b600181111562000895577f3031323334353637383961626364656600000000000000000000000000000000600f86166010811062000831576200083062000bf8565b5b1a60f81b8282815181106200084b576200084a62000bf8565b5b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a905350600485901c9450806200088d9062000c27565b9050620007ee565b5060008414620008dc576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620008d39062000ca5565b60405180910390fd5b8091505092915050565b600081905092915050565b7f416363657373436f6e74726f6c3a206163636f756e7420000000000000000000600082015250565b600062000929601783620008e6565b91506200093682620008f1565b601782019050919050565b600081519050919050565b60005b838110156200096c5780820151818401526020810190506200094f565b838111156200097c576000848401525b50505050565b60006200098f8262000941565b6200099b8185620008e6565b9350620009ad8185602086016200094c565b80840191505092915050565b7f206973206d697373696e6720726f6c6520000000000000000000000000000000600082015250565b6000620009f1601183620008e6565b9150620009fe82620009b9565b601182019050919050565b600062000a16826200091a565b915062000a24828562000982565b915062000a3182620009e2565b915062000a3f828462000982565b91508190509392505050565b600082825260208201905092915050565b6000601f19601f8301169050919050565b600062000a7a8262000941565b62000a86818562000a4b565b935062000a988185602086016200094c565b62000aa38162000a5c565b840191505092915050565b6000602082019050818103600083015262000aca818462000a6d565b905092915050565b6000819050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600062000b188262000ad2565b915062000b258362000ad2565b9250817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff048311821515161562000b615762000b6062000adc565b5b828202905092915050565b600062000b798262000ad2565b915062000b868362000ad2565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0382111562000bbe5762000bbd62000adc565b5b828201905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b600062000c348262000ad2565b91506000820362000c4a5762000c4962000adc565b5b600182039050919050565b7f537472696e67733a20686578206c656e67746820696e73756666696369656e74600082015250565b600062000c8d60208362000a4b565b915062000c9a8262000c55565b602082019050919050565b6000602082019050818103600083015262000cc08162000c7e565b9050919050565b611b1e8062000cd76000396000f3fe608060405234801561001057600080fd5b50600436106100cf5760003560e01c80633aa38bb21161008c578063a9fab19411610066578063a9fab19414610224578063d4b6b5da14610240578063d547741f14610271578063ef378f621461028d576100cf565b80633aa38bb2146101b857806391d14854146101d6578063a217fddf14610206576100cf565b806301ffc9a7146100d457806303e67ff61461010457806314b3211214610120578063248a9ca3146101505780632f2ff15d1461018057806336568abe1461019c575b600080fd5b6100ee60048036038101906100e99190611043565b6102bf565b6040516100fb919061108b565b60405180910390f35b61011e60048036038101906101199190611329565b610339565b005b61013a60048036038101906101359190611385565b610538565b60405161014791906113cb565b60405180910390f35b61016a6004803603810190610165919061141c565b610550565b6040516101779190611458565b60405180910390f35b61019a60048036038101906101959190611473565b61056f565b005b6101b660048036038101906101b19190611473565b610598565b005b6101c061061b565b6040516101cd9190611458565b60405180910390f35b6101f060048036038101906101eb9190611473565b61063f565b6040516101fd919061108b565b60405180910390f35b61020e6106a9565b60405161021b9190611458565b60405180910390f35b61023e600480360381019061023991906114df565b6106b0565b005b61025a6004803603810190610255919061151f565b61076c565b60405161026892919061155b565b60405180910390f35b61028b60048036038101906102869190611473565b6108b5565b005b6102a760048036038101906102a2919061151f565b6108de565b6040516102b69392919061160c565b60405180910390f35b60007f7965db0b000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19161480610332575061033182610c61565b5b9050919050565b7f73a9985316cd4cbfd13dadcaa0e6f773c85e933a0d88efbe60e4dc49da9176a061036b81610366610ccb565b610cd3565b6103977fad8876ebfb1af8a609a169f3e6960aae8a1c30307a55ac131882396b8bbc086f60001b610d70565b6103c37f762e85c004c93330a1ec8204584f9e386eea8f97ee28d25440fec4c9aa74460f60001b610d70565b6103ef7f6bbd28fca0643ec6d10029a68502aceea3e4d87e594afcc223c285a5eb8a65a960001b610d70565b81600260008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008201518160000160006101000a81548160ff021916908360ff160217905550602082015181600101908051906020019061046c929190610f34565b506040820151816002019080519060200190610489929190610f34565b509050506104b97f82baa91d8bb65b3095753c1d9aac3314942dd43a6d8cf236d98925206a50df5160001b610d70565b6104e57f733e133e2a66bd3d8eb03a933de097c3d283341fb321afbed4401c90c30c660660001b610d70565b8273ffffffffffffffffffffffffffffffffffffffff167f8b4faffa3cd4072f19c0c2b76ba4b0b31b05732cabc4350065ea8c0871f4fb998360405161052b9190611701565b60405180910390a2505050565b60016020528060005260406000206000915090505481565b6000806000838152602001908152602001600020600101549050919050565b61057882610550565b61058981610584610ccb565b610cd3565b6105938383610d73565b505050565b6105a0610ccb565b73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161461060d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161060490611795565b60405180910390fd5b6106178282610e53565b5050565b7f73a9985316cd4cbfd13dadcaa0e6f773c85e933a0d88efbe60e4dc49da9176a081565b600080600084815260200190815260200160002060000160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16905092915050565b6000801b81565b6000801b6106c5816106c0610ccb565b610cd3565b6106f17f9621936552967aec6bfa6998e525b4d8687fa6f82de4bd5c183e4ce70a377fba60001b610d70565b61071d7f45a7502a6973ab4248af31874a5be5a0f05d7c4fae92ce80f9cd3d78e74bd19660001b610d70565b6107497f34bd3b2173e81dbec22f66be6856e56bf4424e91b52db5fb1257400172d1e9a460001b610d70565b81600160008560ff1660ff16815260200190815260200160002081905550505050565b60008061079b7fd5525a4ce2c34027f14554e209e3734967eb830c04a39315be21c9da532ec04660001b610d70565b6107c77f6c17808814b5da4b9b77c26657d300af5b90cfa452338c416a48353989e8f4f760001b610d70565b6107f37fad84d0f5510e2823484042522db55e605d4f90028d2af1d3cf3e4083ce98a1c760001b610d70565b600260008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160009054906101000a900460ff1660016000600260008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160009054906101000a900460ff1660ff1660ff1681526020019081526020016000205491509150915091565b6108be82610550565b6108cf816108ca610ccb565b610cd3565b6108d98383610e53565b505050565b60026020528060005260406000206000915090508060000160009054906101000a900460ff1690806001018054610914906117e4565b80601f0160208091040260200160405190810160405280929190818152602001828054610940906117e4565b801561098d5780601f106109625761010080835404028352916020019161098d565b820191906000526020600020905b81548152906001019060200180831161097057829003601f168201915b5050505050908060020180546109a2906117e4565b80601f01602080910402602001604051908101604052809291908181526020018280546109ce906117e4565b8015610a1b5780601f106109f057610100808354040283529160200191610a1b565b820191906000526020600020905b8154815290600101906020018083116109fe57829003601f168201915b5050505050905083565b606060006002836002610a389190611844565b610a42919061189e565b67ffffffffffffffff811115610a5b57610a5a61111a565b5b6040519080825280601f01601f191660200182016040528015610a8d5781602001600182028036833780820191505090505b5090507f300000000000000000000000000000000000000000000000000000000000000081600081518110610ac557610ac46118f4565b5b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a9053507f780000000000000000000000000000000000000000000000000000000000000081600181518110610b2957610b286118f4565b5b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a90535060006001846002610b699190611844565b610b73919061189e565b90505b6001811115610c13577f3031323334353637383961626364656600000000000000000000000000000000600f861660108110610bb557610bb46118f4565b5b1a60f81b828281518110610bcc57610bcb6118f4565b5b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a905350600485901c945080610c0c90611923565b9050610b76565b5060008414610c57576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610c4e90611998565b60405180910390fd5b8091505092915050565b60007f01ffc9a7000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916149050919050565b600033905090565b610cdd828261063f565b610d6c57610d028173ffffffffffffffffffffffffffffffffffffffff166014610a25565b610d108360001c6020610a25565b604051602001610d21929190611a8c565b6040516020818303038152906040526040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610d639190611ac6565b60405180910390fd5b5050565b50565b610d7d828261063f565b610e4f57600160008084815260200190815260200160002060000160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908315150217905550610df4610ccb565b73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45b5050565b610e5d828261063f565b15610f3057600080600084815260200190815260200160002060000160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908315150217905550610ed5610ccb565b73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16837ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b60405160405180910390a45b5050565b828054610f40906117e4565b90600052602060002090601f016020900481019282610f625760008555610fa9565b82601f10610f7b57805160ff1916838001178555610fa9565b82800160010185558215610fa9579182015b82811115610fa8578251825591602001919060010190610f8d565b5b509050610fb69190610fba565b5090565b5b80821115610fd3576000816000905550600101610fbb565b5090565b6000604051905090565b600080fd5b600080fd5b60007fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b61102081610feb565b811461102b57600080fd5b50565b60008135905061103d81611017565b92915050565b60006020828403121561105957611058610fe1565b5b60006110678482850161102e565b91505092915050565b60008115159050919050565b61108581611070565b82525050565b60006020820190506110a0600083018461107c565b92915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006110d1826110a6565b9050919050565b6110e1816110c6565b81146110ec57600080fd5b50565b6000813590506110fe816110d8565b92915050565b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b61115282611109565b810181811067ffffffffffffffff821117156111715761117061111a565b5b80604052505050565b6000611184610fd7565b90506111908282611149565b919050565b600080fd5b600060ff82169050919050565b6111b08161119a565b81146111bb57600080fd5b50565b6000813590506111cd816111a7565b92915050565b600080fd5b600080fd5b600067ffffffffffffffff8211156111f8576111f761111a565b5b61120182611109565b9050602081019050919050565b82818337600083830152505050565b600061123061122b846111dd565b61117a565b90508281526020810184848401111561124c5761124b6111d8565b5b61125784828561120e565b509392505050565b600082601f830112611274576112736111d3565b5b813561128484826020860161121d565b91505092915050565b6000606082840312156112a3576112a2611104565b5b6112ad606061117a565b905060006112bd848285016111be565b600083015250602082013567ffffffffffffffff8111156112e1576112e0611195565b5b6112ed8482850161125f565b602083015250604082013567ffffffffffffffff81111561131157611310611195565b5b61131d8482850161125f565b60408301525092915050565b600080604083850312156113405761133f610fe1565b5b600061134e858286016110ef565b925050602083013567ffffffffffffffff81111561136f5761136e610fe6565b5b61137b8582860161128d565b9150509250929050565b60006020828403121561139b5761139a610fe1565b5b60006113a9848285016111be565b91505092915050565b6000819050919050565b6113c5816113b2565b82525050565b60006020820190506113e060008301846113bc565b92915050565b6000819050919050565b6113f9816113e6565b811461140457600080fd5b50565b600081359050611416816113f0565b92915050565b60006020828403121561143257611431610fe1565b5b600061144084828501611407565b91505092915050565b611452816113e6565b82525050565b600060208201905061146d6000830184611449565b92915050565b6000806040838503121561148a57611489610fe1565b5b600061149885828601611407565b92505060206114a9858286016110ef565b9150509250929050565b6114bc816113b2565b81146114c757600080fd5b50565b6000813590506114d9816114b3565b92915050565b600080604083850312156114f6576114f5610fe1565b5b6000611504858286016111be565b9250506020611515858286016114ca565b9150509250929050565b60006020828403121561153557611534610fe1565b5b6000611543848285016110ef565b91505092915050565b6115558161119a565b82525050565b6000604082019050611570600083018561154c565b61157d60208301846113bc565b9392505050565b600081519050919050565b600082825260208201905092915050565b60005b838110156115be5780820151818401526020810190506115a3565b838111156115cd576000848401525b50505050565b60006115de82611584565b6115e8818561158f565b93506115f88185602086016115a0565b61160181611109565b840191505092915050565b6000606082019050611621600083018661154c565b818103602083015261163381856115d3565b9050818103604083015261164781846115d3565b9050949350505050565b61165a8161119a565b82525050565b600082825260208201905092915050565b600061167c82611584565b6116868185611660565b93506116968185602086016115a0565b61169f81611109565b840191505092915050565b60006060830160008301516116c26000860182611651565b50602083015184820360208601526116da8282611671565b915050604083015184820360408601526116f48282611671565b9150508091505092915050565b6000602082019050818103600083015261171b81846116aa565b905092915050565b7f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560008201527f20726f6c657320666f722073656c660000000000000000000000000000000000602082015250565b600061177f602f8361158f565b915061178a82611723565b604082019050919050565b600060208201905081810360008301526117ae81611772565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806117fc57607f821691505b60208210810361180f5761180e6117b5565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600061184f826113b2565b915061185a836113b2565b9250817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff048311821515161561189357611892611815565b5b828202905092915050565b60006118a9826113b2565b91506118b4836113b2565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff038211156118e9576118e8611815565b5b828201905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b600061192e826113b2565b91506000820361194157611940611815565b5b600182039050919050565b7f537472696e67733a20686578206c656e67746820696e73756666696369656e74600082015250565b600061198260208361158f565b915061198d8261194c565b602082019050919050565b600060208201905081810360008301526119b181611975565b9050919050565b600081905092915050565b7f416363657373436f6e74726f6c3a206163636f756e7420000000000000000000600082015250565b60006119f96017836119b8565b9150611a04826119c3565b601782019050919050565b6000611a1a82611584565b611a2481856119b8565b9350611a348185602086016115a0565b80840191505092915050565b7f206973206d697373696e6720726f6c6520000000000000000000000000000000600082015250565b6000611a766011836119b8565b9150611a8182611a40565b601182019050919050565b6000611a97826119ec565b9150611aa38285611a0f565b9150611aae82611a69565b9150611aba8284611a0f565b91508190509392505050565b60006020820190508181036000830152611ae081846115d3565b90509291505056fea2646970667358221220bce708e519fc2957ff25a7fd57cd4bc8ac465d36e934edb79c85c83dbd755ebf64736f6c634300080d0033";

type EligibilityConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: EligibilityConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Eligibility__factory extends ContractFactory {
  constructor(...args: EligibilityConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<Eligibility> {
    return super.deploy(overrides || {}) as Promise<Eligibility>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): Eligibility {
    return super.attach(address) as Eligibility;
  }
  override connect(signer: Signer): Eligibility__factory {
    return super.connect(signer) as Eligibility__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): EligibilityInterface {
    return new utils.Interface(_abi) as EligibilityInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Eligibility {
    return new Contract(address, _abi, signerOrProvider) as Eligibility;
  }
}
