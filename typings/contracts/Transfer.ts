/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
} from "../common";

export interface TransferInterface extends utils.Interface {
  functions: {
    "DPS()": FunctionFragment;
    "STC()": FunctionFragment;
    "close()": FunctionFragment;
    "convertDPStoSTC(uint256)": FunctionFragment;
    "deliverDPS(uint256,address)": FunctionFragment;
    "eligibility()": FunctionFragment;
    "owner()": FunctionFragment;
    "rate()": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "DPS"
      | "STC"
      | "close"
      | "convertDPStoSTC"
      | "deliverDPS"
      | "eligibility"
      | "owner"
      | "rate"
      | "renounceOwnership"
      | "transferOwnership"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "DPS", values?: undefined): string;
  encodeFunctionData(functionFragment: "STC", values?: undefined): string;
  encodeFunctionData(functionFragment: "close", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "convertDPStoSTC",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "deliverDPS",
    values: [BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "eligibility",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(functionFragment: "rate", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;

  decodeFunctionResult(functionFragment: "DPS", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "STC", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "close", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "convertDPStoSTC",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "deliverDPS", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "eligibility",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "rate", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;

  events: {
    "OwnershipTransferred(address,address)": EventFragment;
    "TransferEvent(address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "TransferEvent"): EventFragment;
}

export interface OwnershipTransferredEventObject {
  previousOwner: string;
  newOwner: string;
}
export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  OwnershipTransferredEventObject
>;

export type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>;

export interface TransferEventEventObject {
  investor: string;
  amountDPS: BigNumber;
}
export type TransferEventEvent = TypedEvent<
  [string, BigNumber],
  TransferEventEventObject
>;

export type TransferEventEventFilter = TypedEventFilter<TransferEventEvent>;

export interface Transfer extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: TransferInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    DPS(overrides?: CallOverrides): Promise<[string]>;

    STC(overrides?: CallOverrides): Promise<[string]>;

    close(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    convertDPStoSTC(
      amountDPS: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    deliverDPS(
      amountDPS: BigNumberish,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    eligibility(overrides?: CallOverrides): Promise<[string]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    rate(overrides?: CallOverrides): Promise<[number]>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  DPS(overrides?: CallOverrides): Promise<string>;

  STC(overrides?: CallOverrides): Promise<string>;

  close(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  convertDPStoSTC(
    amountDPS: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  deliverDPS(
    amountDPS: BigNumberish,
    account: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  eligibility(overrides?: CallOverrides): Promise<string>;

  owner(overrides?: CallOverrides): Promise<string>;

  rate(overrides?: CallOverrides): Promise<number>;

  renounceOwnership(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    DPS(overrides?: CallOverrides): Promise<string>;

    STC(overrides?: CallOverrides): Promise<string>;

    close(overrides?: CallOverrides): Promise<void>;

    convertDPStoSTC(
      amountDPS: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    deliverDPS(
      amountDPS: BigNumberish,
      account: string,
      overrides?: CallOverrides
    ): Promise<void>;

    eligibility(overrides?: CallOverrides): Promise<string>;

    owner(overrides?: CallOverrides): Promise<string>;

    rate(overrides?: CallOverrides): Promise<number>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "OwnershipTransferred(address,address)"(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;

    "TransferEvent(address,uint256)"(
      investor?: string | null,
      amountDPS?: null
    ): TransferEventEventFilter;
    TransferEvent(
      investor?: string | null,
      amountDPS?: null
    ): TransferEventEventFilter;
  };

  estimateGas: {
    DPS(overrides?: CallOverrides): Promise<BigNumber>;

    STC(overrides?: CallOverrides): Promise<BigNumber>;

    close(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    convertDPStoSTC(
      amountDPS: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    deliverDPS(
      amountDPS: BigNumberish,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    eligibility(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    rate(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    DPS(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    STC(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    close(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    convertDPStoSTC(
      amountDPS: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    deliverDPS(
      amountDPS: BigNumberish,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    eligibility(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    rate(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
