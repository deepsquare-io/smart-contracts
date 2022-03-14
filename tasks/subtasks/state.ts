export interface RawResult {
  account: string;
  result: {
    tier: 1 | 2 | 3;
    validator: string;
    transactionId: string;
  };
}

export interface RawTransfer {
  _id: string;
  blockNumber: number;
  amount: string;
  human: number;
  rate: number;
  metadata: {
    originTxId: string;
    from: string;
    to: string;
  };
}
