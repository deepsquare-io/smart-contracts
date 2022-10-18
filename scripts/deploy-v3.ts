import { ethers, network, run } from 'hardhat';
import { parseEther } from '@ethersproject/units';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { DeepSquare__factory } from '../typings/factories/contracts/DeepSquare__factory';
import { Sale__factory } from '../typings/factories/contracts/Sale__factory';

type NetworkName = 'hardhat' | 'mainnet' | 'fuji';
type ContractName = 'USDC' | 'DeepSquare' | 'Eligibility' | 'PreviousSale' | 'Sale' | 'AggregatorV3' | 'Security';

const addresses: Record<ContractName, Record<NetworkName, string>> = {
  USDC: {
    hardhat: '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e',
    mainnet: '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e', //Centre: USD Coin or USDC
    fuji: '0x40479524A1D4E8E160CB24B5D466e2a336327331',
  },
  DeepSquare: {
    hardhat: '0xf192cae2e7cd4048bea307368015e3647c49338e',
    mainnet: '0xf192cae2e7cd4048bea307368015e3647c49338e',
    fuji: '0x7E8Ab41d9Fd280AAac0643d011E6241F6e540497',
  },
  Eligibility: {
    hardhat: '0x52088e60AfB56E83cA0B6340B49F709e57973869',
    mainnet: '0x52088e60AfB56E83cA0B6340B49F709e57973869',
    fuji: '0x64f8dE5BE4403E30e58394D3337d547F59be5035',
  },
  PreviousSale: {
    hardhat: '0x8c94e12C2d05b2060DF9D9732980bca363F3F58a',
    mainnet: '0x8c94e12C2d05b2060DF9D9732980bca363F3F58a',
    fuji: '',
  },
  Sale: {
    hardhat: '0x8c94e12C2d05b2060DF9D9732980bca363F3F58a',
    mainnet: '0x8c94e12C2d05b2060DF9D9732980bca363F3F58a',
    fuji: '0x5f4E48bDC794E9bcEAd4A47D766C2Db3973Ba2C3',
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
  const saleRate = 60;
  const minimumPurchaseStc = 250e6;
  const initialSold = 0;
  const SaleArgs = [
    DeepSquare.address,
    addresses.USDC[networkName],
    addresses.Eligibility[networkName],
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

  await Sale.transferOwnership(gnosisAddress);

  console.debug('Sale:', Sale.address);
  console.debug('Sale.owner()', await Sale.owner());
  console.debug('Sale.remaining()', await Sale.remaining().then((bn) => bn.toString()));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
