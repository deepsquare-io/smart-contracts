const { hardhatArguments } = require("hardhat");

const networkEnvironment = function () {
  const networks = [
    {
      network: "fuji",
      usdt: "",
      dps: "", // "0x41393c11206c8996cf64ad46e80f0d1ad752b8df",
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
