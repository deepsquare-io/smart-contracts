import assert from 'assert';
import { Presets, SingleBar } from 'cli-progress';
import 'dotenv/config';
import { BaseContract, BigNumber, utils } from 'ethers';
import { readFileSync } from 'fs';
import { ethers } from 'hardhat';
import { join } from 'path';
import prompts from 'prompts';
import { z } from 'zod';
import { DPS_TOTAL_SUPPLY } from '../lib/constants';
import { DEFAULT_ADMIN_ROLE } from '../lib/testing/AccessControl';
import DeepSquare from '../lib/types/DeepSquare';
import Eligibility from '../lib/types/Eligibility';
import { Sale } from '../lib/types/Sale';
import SpenderSecurity from '../lib/types/SpenderSecurity';
import IERC20 from '../lib/types/openzeppelin/IERC20';
import FileState from '../lib/utils/FileState';
import { title } from '../lib/utils/console';
import getHumanBalance from '../lib/utils/getHumanBalance';
import getLegacyState from '../lib/utils/getLegacyState';
import grantRole from '../lib/utils/grantRole';
import waitTx from '../lib/utils/waitTx';

// Constants
const SPENDER_ROLE = utils.id('SPENDER');
const WRITER_ROLE = utils.id('WRITER');
const MINIMUM_PURCHASE_STC = 250e6; // 250 USDC.e

const configSchema = z.object({
  gnosis: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  cafe: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
});

/** @type {FileState} The migration state which allow to track the migration progress. */
const state = new FileState(join(__dirname, '..', 'state', 'state.json'));

/**
 * Deploy a contract using the default Hardhat signer.
 * @param {string} name The contract name.
 * @param {unknown[]} args The contract constructor arguments.
 * @return {Promise<T>} The deployed contract.
 */
async function deploy<T extends BaseContract = BaseContract>(name: string, ...args: unknown[]): Promise<T> {
  const factory = await ethers.getContractFactory(name);
  const existing = state.get(`contracts.${name}`) as string | undefined;

  if (existing) {
    // Contract is the name and thus should not be deployed. We simply attach ethers ot it.
    console.log('Skipping', name, 'deployment');
    return factory.attach(existing) as T;
  }

  process.stdout.write(`Deploying ${name}...`);
  const contract = await factory.deploy(...args).then((deploying) => deploying.deployed());
  console.log(' deployed to', contract.address);
  state.set(`contracts.${name}`, contract.address);

  return contract as T;
}

async function main() {
  title('Avalanche Migration', true);
  // Step 0: validation
  const config = configSchema.parse(state.get('config'));
  const results = JSON.parse(readFileSync(join(__dirname, '..', 'state', 'results.json'), { encoding: 'utf-8' }));
  const transfers = JSON.parse(readFileSync(join(__dirname, '..', 'state', 'transfers.json'), { encoding: 'utf-8' }));

  console.log('Found', results.length, 'results to migrate');
  console.log('Found', transfers.length, 'transfers to migrate');
  const [deployer] = await ethers.getSigners();
  const before = await getHumanBalance(deployer);
  console.log('Deployer address is:', deployer.address, `(${before}) AVAX`);
  console.log('Gnosis address is:  ', config.gnosis);

  const go = await prompts([
    {
      type: 'confirm',
      name: 'correct',
      message: `Are the following accounts correct?`,
    },
    {
      type: 'confirm',
      name: 'sure',
      message: `Start the migration?`,
    },
  ]);

  if (!go.correct || !go.sure) {
    process.stdout.write('Aborting\n');
    return;
  }

  const startTime = Math.floor(Date.now() / 1000);

  // Step 1: deployment
  title('Deployment');
  const USDCe = await deploy<IERC20>('BridgeToken');
  const eligibility = await deploy<Eligibility>('Eligibility');
  const spenderSecurity = await deploy<SpenderSecurity>('SpenderSecurity');
  const DPS = await deploy<DeepSquare>('DeepSquare', spenderSecurity.address);

  const { remaining, sold } = await getLegacyState();
  const sale = await deploy<Sale>(
    'Sale',
    DPS.address,
    USDCe.address,
    eligibility.address,
    40,
    MINIMUM_PURCHASE_STC,
    sold,
  );
  await waitTx(DPS.transfer(sale.address, remaining));

  // Step 2: configuration
  title('Configuration');
  await grantRole(spenderSecurity, 'SPENDER', sale.address); // Make Sale DPS spender
  await grantRole(eligibility, 'WRITER', config.cafe); // Make cafe Eligibility WRITER spender

  // Step 3: invariant checks
  title('Deployment checks');
  assert.equal((await DPS.totalSupply()).toString(), DPS_TOTAL_SUPPLY.toString(), 'DPS.totalSupply() does not match');
  assert.equal((await DPS.balanceOf(sale.address)).toString(), remaining, 'Sale.remaining() does not match');
  assert.ok(
    await spenderSecurity.hasRole(utils.id('SPENDER'), sale.address),
    `${sale.address} has not the SPENDER role`,
  );
  assert.ok(await eligibility.hasRole(utils.id('WRITER'), config.cafe), `${config.cafe} has not the WRITE role`);

  // Step 4: set KYC results
  title('KYC migrations');
  const progressR = new SingleBar({}, Presets.shades_classic);
  progressR.start(results.length, 0);
  for (const r of results) {
    await waitTx(eligibility.setResult(r.account, r.result));
    progressR.increment();
  }
  progressR.stop();

  // Step 5: replay transfers
  title('Replay transfers');
  const progressT = new SingleBar({}, Presets.shades_classic);
  progressT.start(transfers.length, 0);
  for (const t of transfers) {
    await waitTx(DPS.transfer(t.metadata.to, BigNumber.from(t.amount)));
    progressT.increment();
  }
  progressT.stop();

  // Step 6: transfer all privileges to the gnosis
  title('Hardening');

  // DeepSquare
  await waitTx(DPS.transferOwnership(config.gnosis));
  assert.equal(await DPS.owner(), config.gnosis, `DPS owner is not ${config.gnosis}`);

  // Sale
  await waitTx(sale.transferOwnership(config.gnosis));
  assert.equal(await sale.owner(), config.gnosis, `DPS owner is not ${config.gnosis}`);

  // Make gnosis spender admin
  await grantRole(spenderSecurity, DEFAULT_ADMIN_ROLE, config.gnosis);
  assert.ok(
    await spenderSecurity.hasRole(DEFAULT_ADMIN_ROLE, config.gnosis),
    `${config.gnosis} has not the DEFAULT_ADMIN_ROLE role`,
  );

  // Make gnosis eligibility WRITER
  await grantRole(spenderSecurity, 'SPENDER', config.gnosis);
  assert.ok(await spenderSecurity.hasRole(SPENDER_ROLE, config.gnosis), `${config.gnosis} has not the SPENDER role`);

  await waitTx(spenderSecurity.renounceRole(DEFAULT_ADMIN_ROLE, deployer.address));
  await waitTx(spenderSecurity.renounceRole(SPENDER_ROLE, deployer.address));

  // Make gnosis eligibility admin
  await grantRole(eligibility, DEFAULT_ADMIN_ROLE, config.gnosis);
  assert.ok(
    await eligibility.hasRole(DEFAULT_ADMIN_ROLE, config.gnosis),
    `${config.gnosis} has not DEFAULT_ADMIN_ROLE role`,
  );

  await grantRole(eligibility, 'WRITER', config.gnosis); // Make gnosis eligibility WRITER
  assert.ok(await eligibility.hasRole(WRITER_ROLE, config.gnosis), `${config.gnosis} has not the WRITER role`);

  await waitTx(eligibility.renounceRole(DEFAULT_ADMIN_ROLE, deployer.address));
  await waitTx(eligibility.renounceRole(WRITER_ROLE, deployer.address));

  title('Recap');
  const duration = Math.floor(Date.now() / 1000) - startTime;
  const used = before - (await getHumanBalance(deployer));

  console.log('Migration duration:', duration, 'seconds');
  console.log('Migration cost:    ', used, 'AVAX');
  console.log('USDC.e:            ', USDCe.address);
  console.log('Eligibility:       ', eligibility.address);
  console.log('SpenderSecurity:   ', USDCe.address);
  console.log('DeepSquare:        ', DPS.address);
  console.log('Sale:              ', sale.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
