/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers } from "ethers";
import {
  FactoryOptions,
  HardhatEthersHelpers as HardhatEthersHelpersBase,
} from "@nomiclabs/hardhat-ethers/types";

import * as Contracts from ".";

declare module "hardhat/types/runtime" {
  interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
    getContractFactory(
      name: "AggregatorV3Interface",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.AggregatorV3Interface__factory>;
    getContractFactory(
      name: "AccessControl",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.AccessControl__factory>;
    getContractFactory(
      name: "IAccessControl",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IAccessControl__factory>;
    getContractFactory(
      name: "Ownable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Ownable__factory>;
    getContractFactory(
      name: "ERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC20__factory>;
    getContractFactory(
      name: "IERC20Metadata",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20Metadata__factory>;
    getContractFactory(
      name: "IERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20__factory>;
    getContractFactory(
      name: "ERC165",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC165__factory>;
    getContractFactory(
      name: "IERC165",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC165__factory>;
    getContractFactory(
      name: "Advisors",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Advisors__factory>;
    getContractFactory(
      name: "CommunityDev",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.CommunityDev__factory>;
    getContractFactory(
      name: "DeepSquare",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.DeepSquare__factory>;
    getContractFactory(
      name: "Eligibility",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Eligibility__factory>;
    getContractFactory(
      name: "IEligibility",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IEligibility__factory>;
    getContractFactory(
      name: "ISecurity",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ISecurity__factory>;
    getContractFactory(
      name: "Initializer",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Initializer__factory>;
    getContractFactory(
      name: "Sale",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Sale__factory>;
    getContractFactory(
      name: "SpenderSecurity",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.SpenderSecurity__factory>;
    getContractFactory(
      name: "Initializer",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Initializer__factory>;
    getContractFactory(
      name: "Sale",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Sale__factory>;
    getContractFactory(
      name: "LockingSecurity",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.LockingSecurity__factory>;
    getContractFactory(
      name: "ReferralProgram",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ReferralProgram__factory>;
    getContractFactory(
      name: "Sale",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Sale__factory>;
    getContractFactory(
      name: "SpenderSecurity",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.SpenderSecurity__factory>;
    getContractFactory(
      name: "Team",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Team__factory>;
    getContractFactory(
      name: "Transfer",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Transfer__factory>;
    getContractFactory(
      name: "Treasury",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Treasury__factory>;
    getContractFactory(
      name: "BridgeToken",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.BridgeToken__factory>;
    getContractFactory(
      name: "ERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC20__factory>;
    getContractFactory(
      name: "ERC20Burnable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC20Burnable__factory>;
    getContractFactory(
      name: "IERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20__factory>;
    getContractFactory(
      name: "IERC20Metadata",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20Metadata__factory>;

    getContractAt(
      name: "AggregatorV3Interface",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.AggregatorV3Interface>;
    getContractAt(
      name: "AccessControl",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.AccessControl>;
    getContractAt(
      name: "IAccessControl",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IAccessControl>;
    getContractAt(
      name: "Ownable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Ownable>;
    getContractAt(
      name: "ERC20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC20>;
    getContractAt(
      name: "IERC20Metadata",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20Metadata>;
    getContractAt(
      name: "IERC20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20>;
    getContractAt(
      name: "ERC165",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC165>;
    getContractAt(
      name: "IERC165",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC165>;
    getContractAt(
      name: "Advisors",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Advisors>;
    getContractAt(
      name: "CommunityDev",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.CommunityDev>;
    getContractAt(
      name: "DeepSquare",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.DeepSquare>;
    getContractAt(
      name: "Eligibility",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Eligibility>;
    getContractAt(
      name: "IEligibility",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IEligibility>;
    getContractAt(
      name: "ISecurity",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ISecurity>;
    getContractAt(
      name: "Initializer",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Initializer>;
    getContractAt(
      name: "Sale",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Sale>;
    getContractAt(
      name: "SpenderSecurity",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.SpenderSecurity>;
    getContractAt(
      name: "Initializer",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Initializer>;
    getContractAt(
      name: "Sale",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Sale>;
    getContractAt(
      name: "LockingSecurity",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.LockingSecurity>;
    getContractAt(
      name: "ReferralProgram",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ReferralProgram>;
    getContractAt(
      name: "Sale",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Sale>;
    getContractAt(
      name: "SpenderSecurity",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.SpenderSecurity>;
    getContractAt(
      name: "Team",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Team>;
    getContractAt(
      name: "Transfer",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Transfer>;
    getContractAt(
      name: "Treasury",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Treasury>;
    getContractAt(
      name: "BridgeToken",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.BridgeToken>;
    getContractAt(
      name: "ERC20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC20>;
    getContractAt(
      name: "ERC20Burnable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC20Burnable>;
    getContractAt(
      name: "IERC20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20>;
    getContractAt(
      name: "IERC20Metadata",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20Metadata>;

    // default types
    getContractFactory(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.ContractFactory>;
    getContractFactory(
      abi: any[],
      bytecode: ethers.utils.BytesLike,
      signer?: ethers.Signer
    ): Promise<ethers.ContractFactory>;
    getContractAt(
      nameOrAbi: string | any[],
      address: string,
      signer?: ethers.Signer
    ): Promise<ethers.Contract>;
  }
}
