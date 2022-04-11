import { ethers, network, run } from 'hardhat';
import { BigNumber } from '@ethersproject/bignumber';
import { parseEther } from '@ethersproject/units';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import waitTx from '../lib/waitTx';
import { DeepSquare__factory } from '../typings/factories/contracts/DeepSquare__factory';
import { Sale__factory as SaleV2__factory } from '../typings/factories/contracts/Sale__factory';
import { SpenderSecurity__factory } from '../typings/factories/contracts/SpenderSecurity__factory';
import { Sale__factory as SaleV1__factory } from '../typings/factories/contracts/legacy/v1/Sale__factory';

const REMAINING: BigNumber | null = BigNumber.from('0x0');

type NetworkName = 'hardhat' | 'mainnet' | 'fuji';
type ContractName = 'USDCe' | 'DeepSquare' | 'Eligibility' | 'SaleV1' | 'SaleV2' | 'AggregatorV3';

const addresses: Record<ContractName, Record<NetworkName, string>> = {
  USDCe: {
    hardhat: '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e',
    mainnet: '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e',
    fuji: '', // 0x5425890298aed601595a70ab815c96711a31bc65
  },
  DeepSquare: {
    hardhat: '0xf192cae2e7cd4048bea307368015e3647c49338e',
    mainnet: '0xf192cae2e7cd4048bea307368015e3647c49338e',
    fuji: '0xf192caE2e7Cd4048Bea307368015E3647c49338e',
  },
  Eligibility: {
    hardhat: '0x52088e60AfB56E83cA0B6340B49F709e57973869',
    mainnet: '0x52088e60AfB56E83cA0B6340B49F709e57973869',
    fuji: '0x5d78d4f78b28FC41f76282a8684A253dee27F4d4',
  },
  SaleV1: {
    hardhat: '0xb4A981d2663455aEE53193Da8e7c61c3579301cb',
    mainnet: '0xb4A981d2663455aEE53193Da8e7c61c3579301cb',
    fuji: '', // '0xf0e30dff049b1ae866764a487488546f0136ce76',
  },
  SaleV2: {
    hardhat: '',
    mainnet: '',
    fuji: '0x393C042f655Aa6D7Fd9F7cc8418bE0023dc1DcA4',
  },
  AggregatorV3: {
    hardhat: '0x0A77230d17318075983913bC2145DB16C7366156',
    mainnet: '0x0A77230d17318075983913bC2145DB16C7366156',
    fuji: '0x5498BB86BC934c8D34FDA08E81D444153d0D06aD',
  },
};

async function main() {
  const networkName = network.name as NetworkName;
  const [deployer] = await ethers.getSigners();

  const SaleV1Factory = new SaleV1__factory(deployer);
  const SaleV1 = SaleV1Factory.attach('0xb4A981d2663455aEE53193Da8e7c61c3579301cb');
  const SpenderSecurityFactory = new SpenderSecurity__factory(deployer);
  const Security = SpenderSecurityFactory.attach('0x3c603bf311acffcd2d4bb2cf14df437d429f1077');
  const DeepSquareFactory = new DeepSquare__factory(deployer);
  const DeepSquare = DeepSquareFactory.attach('0xf192caE2e7Cd4048Bea307368015E3647c49338e');

  let gnosis: SignerWithAddress | undefined = undefined;
  const gnosisAddress = await SaleV1.owner();

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

  const remaining = REMAINING ?? (await SaleV1.remaining());

  if (networkName === 'hardhat' && gnosis) {
    await network.provider.request({ method: 'hardhat_impersonateAccount', params: [gnosis.address] });
    await waitTx(SaleV1.connect(gnosis).close());
    await waitTx(Security.connect(gnosis).revokeRole(await Security.SPENDER(), SaleV1.address));
    await network.provider.request({ method: 'hardhat_stopImpersonatingAccount', params: [gnosis.address] });
  }

  const SaleV2Factory = new SaleV2__factory(deployer);
  const SaleV2Args = [
    DeepSquare.address,
    addresses.USDCe[networkName],
    addresses.Eligibility[networkName],
    addresses.AggregatorV3[networkName],
    40,
    250e6,
    await SaleV1.sold(),
  ] as const;
  const SaleV2 = await SaleV2Factory.deploy(...SaleV2Args);
  await SaleV2.deployed();

  if (networkName === 'mainnet' || networkName === 'fuji') {
    await run('verify:verify', {
      address: SaleV2.address,
      constructorArguments: SaleV2Args,
    });
  }

  await SaleV2.transferOwnership(gnosisAddress);

  if (networkName === 'hardhat' && gnosis) {
    // The board gives the ownership of the sale to the deployer
    await network.provider.request({ method: 'hardhat_impersonateAccount', params: [gnosis.address] });
    await waitTx(Security.connect(gnosis).grantRole(await Security.SPENDER(), SaleV2.address));
    await waitTx(DeepSquare.connect(gnosis).transfer(SaleV2.address, remaining));
    await network.provider.request({ method: 'hardhat_stopImpersonatingAccount', params: [gnosis.address] });
  }

  console.debug('SaleV2:', SaleV2.address);
  console.debug('SaleV2.owner()', await SaleV2.owner());
  console.debug('SaleV2.remaining()', await SaleV2.remaining().then((bn) => bn.toString()));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
