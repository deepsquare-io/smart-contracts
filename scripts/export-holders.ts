import * as fs from 'fs';
import { ethers, network } from 'hardhat';
import { DeepSquare__factory } from '../typings/factories/contracts/DeepSquare__factory';

type NetworkName = 'hardhat' | 'mainnet' | 'fuji';
type ContractName = 'DeepSquare';

const addresses: Record<ContractName, Record<NetworkName, string>> = {
  DeepSquare: {
    hardhat: '0xf192cae2e7cd4048bea307368015e3647c49338e',
    mainnet: '0xf192cae2e7cd4048bea307368015e3647c49338e',
    fuji: '0x270D1399744874C72f95873eB9606172D155669D',
  },
};

async function main() {
  const networkName = network.name as NetworkName;
  const [deployer] = await ethers.getSigners();

  const DeepSquareFactory = new DeepSquare__factory(deployer);
  const DeepSquare = DeepSquareFactory.attach(addresses.DeepSquare[networkName]);

  const holders = new Set<string>();
  let i = 12109726;
  const lastBlock = 13913253;

  while (i < lastBlock) {
    const to = i + 2048 > lastBlock ? lastBlock : i + 2048;
    const events = await DeepSquare.queryFilter(DeepSquare.filters.Transfer(), i, to);
    for (const event of events) {
      holders.add(event.args['to']);
    }
    i = to;
  }

  holders.delete('0xaEAE6CA5a34327b557181ae1E9E62BF2B5eB1D7F'); // gnosis safe
  holders.delete('0x8c94e12C2d05b2060DF9D9732980bca363F3F58a'); // sale contract
  holders.delete('0xb4A981d2663455aEE53193Da8e7c61c3579301cb'); // sale contract
  holders.delete('0xDA0096EB18c43A84f9E2EEF7FE6B7eD0Be29fEFa'); // deployment address
  holders.delete('0xC891fCbF84423dCeda561bB95388efFDb376C322'); // airdrop

  const balances: Map<string, string> = new Map<string, string>();
  for (const holder of holders) {
    balances.set(holder, (await DeepSquare.balanceOf(holder)).toString());
  }

  fs.writeFile('./data/users.json', JSON.stringify(Array.from(balances)), () => {
    return;
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
