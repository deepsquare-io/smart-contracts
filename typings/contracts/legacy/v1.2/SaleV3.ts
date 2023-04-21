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
  PayableOverrides,
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
} from "../../../common";

export interface SaleV3Interface extends utils.Interface {
  functions: {
    "DPS()": FunctionFragment;
    "STC()": FunctionFragment;
    "aggregator()": FunctionFragment;
    "close()": FunctionFragment;
    "convertAVAXtoSTC(uint256)": FunctionFragment;
    "convertDPStoSTC(uint256)": FunctionFragment;
    "convertSTCtoDPS(uint256)": FunctionFragment;
    "deliverDPS(uint256,address)": FunctionFragment;
    "eligibility()": FunctionFragment;
    "isPaused()": FunctionFragment;
    "minimumPurchaseSTC()": FunctionFragment;
    "owner()": FunctionFragment;
    "purchaseDPSWithAVAX()": FunctionFragment;
    "purchaseDPSWithSTC(uint256)": FunctionFragment;
    "raised()": FunctionFragment;
    "rate()": FunctionFragment;
    "remaining()": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "setAggregator(address)": FunctionFragment;
    "setPause(bool)": FunctionFragment;
    "sold()": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "DPS"
      | "STC"
      | "aggregator"
      | "close"
      | "convertAVAXtoSTC"
      | "convertDPStoSTC"
      | "convertSTCtoDPS"
      | "deliverDPS"
      | "eligibility"
      | "isPaused"
      | "minimumPurchaseSTC"
      | "owner"
      | "purchaseDPSWithAVAX"
      | "purchaseDPSWithSTC"
      | "raised"
      | "rate"
      | "remaining"
      | "renounceOwnership"
      | "setAggregator"
      | "setPause"
      | "sold"
      | "transferOwnership"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "DPS", values?: undefined): string;
  encodeFunctionData(functionFragment: "STC", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "aggregator",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "close", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "convertAVAXtoSTC",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "convertDPStoSTC",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "convertSTCtoDPS",
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
  encodeFunctionData(functionFragment: "isPaused", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "minimumPurchaseSTC",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "purchaseDPSWithAVAX",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "purchaseDPSWithSTC",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "raised", values?: undefined): string;
  encodeFunctionData(functionFragment: "rate", values?: undefined): string;
  encodeFunctionData(functionFragment: "remaining", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setAggregator",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "setPause", values: [boolean]): string;
  encodeFunctionData(functionFragment: "sold", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;

  decodeFunctionResult(functionFragment: "DPS", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "STC", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "aggregator", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "close", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "convertAVAXtoSTC",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "convertDPStoSTC",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "convertSTCtoDPS",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "deliverDPS", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "eligibility",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "isPaused", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "minimumPurchaseSTC",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "purchaseDPSWithAVAX",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "purchaseDPSWithSTC",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "raised", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "rate", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "remaining", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setAggregator",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setPause", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "sold", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;

  events: {
    "OwnershipTransferred(address,address)": EventFragment;
    "Purchase(address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Purchase"): EventFragment;
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

export interface PurchaseEventObject {
  investor: string;
  amountDPS: BigNumber;
}
export type PurchaseEvent = TypedEvent<
  [string, BigNumber],
  PurchaseEventObject
>;

export type PurchaseEventFilter = TypedEventFilter<PurchaseEvent>;

export interface SaleV3 extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: SaleV3Interface;

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

    aggregator(overrides?: CallOverrides): Promise<[string]>;

    close(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    convertAVAXtoSTC(
      amountAVAX: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    convertDPStoSTC(
      amountDPS: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    convertSTCtoDPS(
      amountSTC: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    deliverDPS(
      amountSTC: BigNumberish,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    eligibility(overrides?: CallOverrides): Promise<[string]>;

    isPaused(overrides?: CallOverrides): Promise<[boolean]>;

    minimumPurchaseSTC(overrides?: CallOverrides): Promise<[BigNumber]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    purchaseDPSWithAVAX(
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    purchaseDPSWithSTC(
      amountSTC: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    raised(overrides?: CallOverrides): Promise<[BigNumber]>;

    rate(overrides?: CallOverrides): Promise<[number]>;

    remaining(overrides?: CallOverrides): Promise<[BigNumber]>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setAggregator(
      newAggregator: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setPause(
      _isPaused: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    sold(overrides?: CallOverrides): Promise<[BigNumber]>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  DPS(overrides?: CallOverrides): Promise<string>;

  STC(overrides?: CallOverrides): Promise<string>;

  aggregator(overrides?: CallOverrides): Promise<string>;

  close(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  convertAVAXtoSTC(
    amountAVAX: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  convertDPStoSTC(
    amountDPS: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  convertSTCtoDPS(
    amountSTC: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  deliverDPS(
    amountSTC: BigNumberish,
    account: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  eligibility(overrides?: CallOverrides): Promise<string>;

  isPaused(overrides?: CallOverrides): Promise<boolean>;

  minimumPurchaseSTC(overrides?: CallOverrides): Promise<BigNumber>;

  owner(overrides?: CallOverrides): Promise<string>;

  purchaseDPSWithAVAX(
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  purchaseDPSWithSTC(
    amountSTC: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  raised(overrides?: CallOverrides): Promise<BigNumber>;

  rate(overrides?: CallOverrides): Promise<number>;

  remaining(overrides?: CallOverrides): Promise<BigNumber>;

  renounceOwnership(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setAggregator(
    newAggregator: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setPause(
    _isPaused: boolean,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  sold(overrides?: CallOverrides): Promise<BigNumber>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    DPS(overrides?: CallOverrides): Promise<string>;

    STC(overrides?: CallOverrides): Promise<string>;

    aggregator(overrides?: CallOverrides): Promise<string>;

    close(overrides?: CallOverrides): Promise<void>;

    convertAVAXtoSTC(
      amountAVAX: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    convertDPStoSTC(
      amountDPS: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    convertSTCtoDPS(
      amountSTC: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    deliverDPS(
      amountSTC: BigNumberish,
      account: string,
      overrides?: CallOverrides
    ): Promise<void>;

    eligibility(overrides?: CallOverrides): Promise<string>;

    isPaused(overrides?: CallOverrides): Promise<boolean>;

    minimumPurchaseSTC(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<string>;

    purchaseDPSWithAVAX(overrides?: CallOverrides): Promise<void>;

    purchaseDPSWithSTC(
      amountSTC: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    raised(overrides?: CallOverrides): Promise<BigNumber>;

    rate(overrides?: CallOverrides): Promise<number>;

    remaining(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    setAggregator(
      newAggregator: string,
      overrides?: CallOverrides
    ): Promise<void>;

    setPause(_isPaused: boolean, overrides?: CallOverrides): Promise<void>;

    sold(overrides?: CallOverrides): Promise<BigNumber>;

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

    "Purchase(address,uint256)"(
      investor?: string | null,
      amountDPS?: null
    ): PurchaseEventFilter;
    Purchase(investor?: string | null, amountDPS?: null): PurchaseEventFilter;
  };

  estimateGas: {
    DPS(overrides?: CallOverrides): Promise<BigNumber>;

    STC(overrides?: CallOverrides): Promise<BigNumber>;

    aggregator(overrides?: CallOverrides): Promise<BigNumber>;

    close(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    convertAVAXtoSTC(
      amountAVAX: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    convertDPStoSTC(
      amountDPS: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    convertSTCtoDPS(
      amountSTC: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    deliverDPS(
      amountSTC: BigNumberish,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    eligibility(overrides?: CallOverrides): Promise<BigNumber>;

    isPaused(overrides?: CallOverrides): Promise<BigNumber>;

    minimumPurchaseSTC(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    purchaseDPSWithAVAX(
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    purchaseDPSWithSTC(
      amountSTC: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    raised(overrides?: CallOverrides): Promise<BigNumber>;

    rate(overrides?: CallOverrides): Promise<BigNumber>;

    remaining(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setAggregator(
      newAggregator: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setPause(
      _isPaused: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    sold(overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    DPS(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    STC(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    aggregator(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    close(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    convertAVAXtoSTC(
      amountAVAX: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    convertDPStoSTC(
      amountDPS: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    convertSTCtoDPS(
      amountSTC: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    deliverDPS(
      amountSTC: BigNumberish,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    eligibility(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    isPaused(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    minimumPurchaseSTC(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    purchaseDPSWithAVAX(
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    purchaseDPSWithSTC(
      amountSTC: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    raised(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    rate(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    remaining(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setAggregator(
      newAggregator: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setPause(
      _isPaused: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    sold(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
