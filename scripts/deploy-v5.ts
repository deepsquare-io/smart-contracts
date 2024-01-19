import { ethers, network, run } from 'hardhat';
import { parseEther } from '@ethersproject/units';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import waitTx from '../lib/waitTx';
import { DeepSquare__factory } from '../typings/factories/contracts/DeepSquare__factory';
import { Sale__factory } from '../typings/factories/contracts/Sale__factory';
import { SaleV3__factory } from '../typings/factories/contracts/legacy/v1.2/SaleV3__factory';

// Context: Sale V5 for last week of January 2024.

type NetworkName = 'hardhat' | 'mainnet' | 'fuji';
type ContractName = 'USDC' | 'DeepSquare' | 'Eligibility' | 'PreviousSale' | 'Sale' | 'AggregatorV3' | 'Security';

const addresses: Record<ContractName, Record<NetworkName, string>> = {
  USDC: {
    hardhat: '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e',
    mainnet: '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e', //Centre: USD Coin or USDC
    fuji: '0x868cB9ab1436b071c32C68f0125c54c1eF21b11d',
  },
  DeepSquare: {
    hardhat: '0xf192cae2e7cd4048bea307368015e3647c49338e',
    mainnet: '0xf192cae2e7cd4048bea307368015e3647c49338e',
    fuji: '0xEeA08029DCcEBAe971039F4B4b2064D466baC2e5',
  },
  Eligibility: {
    hardhat: '0x52088e60AfB56E83cA0B6340B49F709e57973869',
    mainnet: '0x52088e60AfB56E83cA0B6340B49F709e57973869',
    fuji: '0x3bFB1294843B91139e66D5919102a79e6C9701ee',
  },
  PreviousSale: {
    hardhat: '0x8c94e12C2d05b2060DF9D9732980bca363F3F58a',
    mainnet: '0x8c94e12C2d05b2060DF9D9732980bca363F3F58a',
    fuji: '0x56F09eA30a42351184fC74450aa47860e74488c4',
  },
  Sale: {
    hardhat: '0x8c94e12C2d05b2060DF9D9732980bca363F3F58a',
    mainnet: '0x8c94e12C2d05b2060DF9D9732980bca363F3F58a',
    fuji: '0x721Ae05A95E1Ac7595f526ce5B0c2545fCFe6e97',
  },
  AggregatorV3: {
    hardhat: '0x0A77230d17318075983913bC2145DB16C7366156',
    mainnet: '0x0A77230d17318075983913bC2145DB16C7366156',
    fuji: '0x5498BB86BC934c8D34FDA08E81D444153d0D06aD',
  },
  Security: {
    hardhat: '0x3C603BF311AcFfcd2d4bB2cF14df437D429F1077',
    mainnet: '0x3C603BF311AcFfcd2d4bB2cF14df437D429F1077',
    fuji: '',
  },
};

async function main() {
  const networkName = network.name as NetworkName;
  const [deployer] = await ethers.getSigners();

  const DeepSquareFactory = new DeepSquare__factory(deployer);
  const DeepSquare = DeepSquareFactory.attach(addresses.DeepSquare[networkName]);

  let gnosis: SignerWithAddress | undefined = undefined;
  const gnosisAddress = '0xaEAE6CA5a34327b557181ae1E9E62BF2B5eB1D7F';

  console.log('deployer:', deployer.address);
  console.log('gnosis:', gnosisAddress);

  if (networkName === 'hardhat') {
    // The board gives the ownership of the sale to the deployer
    gnosis = await ethers.getSigner(gnosisAddress);

    await network.provider.request({
      method: 'hardhat_setBalance',
      params: [deployer.address, parseEther('10').toHexString().replace(/^0x0+/, '0x')],
    });
    await network.provider.request({
      method: 'hardhat_setBalance',
      params: [gnosis.address, parseEther('10').toHexString().replace(/^0x0+/, '0x')],
    });
  }

  const SaleFactory = new Sale__factory(deployer);
  const saleRate = 75;
  const minimumPurchaseStc = 7.5e6;
  const initialSold = 0;
  const SaleArgs = [
    DeepSquare.address,
    addresses.USDC[networkName],
    addresses.AggregatorV3[networkName],
    saleRate,
    minimumPurchaseStc,
    initialSold,
  ] as const;
  const Sale = await SaleFactory.deploy(...SaleArgs);
  await Sale.deployed();

  if (networkName === 'mainnet' || networkName === 'fuji') {
    await run('verify:verify', {
      address: Sale.address,
      constructorArguments: SaleArgs,
    });
  }

  if (networkName === 'fuji') {
    const previousSale = new SaleV3__factory().attach(addresses.Sale[networkName]);

    await waitTx(DeepSquare.transfer(Sale.address, await DeepSquare.balanceOf(previousSale.address)));
  }

  // No need to pause
  // await waitTx(Sale.setPause(true));

  if (networkName === 'mainnet') {
    await waitTx(Sale.transferOwnership(gnosisAddress));
  }

  console.debug('Sale:', Sale.address);
  console.debug('Sale.owner()', await Sale.owner());
  console.debug('Sale.remaining()', await Sale.remaining().then((bn) => bn.toString()));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
