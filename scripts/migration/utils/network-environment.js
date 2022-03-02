const { hardhatArguments } = require("hardhat");

const networkEnvironment = function () {
  const networks = [
    {
      network: "fuji",
      usdt: "0xAF82969ECF299c1f1Bb5e1D12dDAcc9027431160", // USDC.E testnet
      dps: "0x0ecce311a56cf2529348cc43a33e13f6dc07ca06",
    },
    {
      network: "mainnet",
      usdt: "0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664", // USDC.E mainnet
      dps: null,
    },
    {
      network: "default",
      usdt: null,
      dps: null,
    },
  ];

  return networks.find((v) => {
    return v.network === (hardhatArguments.network ?? "default");
  });
};

module.exports = {
  networkEnvironment,
};
