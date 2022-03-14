import chalk from 'chalk';
import { Presets, SingleBar } from 'cli-progress';
import { randomBytes } from 'crypto';
import { BigNumber, utils } from 'ethers';
import { readFileSync } from 'fs';
import { task } from 'hardhat/config';
import { HardhatRuntimeEnvironment } from 'hardhat/types/runtime';
import { chunk } from 'lodash';
import { join } from 'path';
import { DPS_TOTAL_SUPPLY, ZERO_ADDRESS } from '../lib/constants';
import logger from '../lib/logger';
import { DEFAULT_ADMIN_ROLE } from '../lib/testing/AccessControl';
import BridgeToken from '../lib/types/BirdgeToken';
import DeepSquare from '../lib/types/DeepSquare';
import Eligibility from '../lib/types/Eligibility';
import Initializer from '../lib/types/Initializer';
import { Sale } from '../lib/types/Sale';
import SpenderSecurity from '../lib/types/SpenderSecurity';
import { grantRole, revokeRole } from '../lib/utils/AccessControl';
import * as assert from '../lib/utils/assert';
import e from '../lib/utils/e';
import getHumanBalance from '../lib/utils/getHumanBalance';
import waitTx from '../lib/utils/waitTx';
import checkBalances from './subtasks/checkBalances';
import './subtasks/deploy';
import getLegacyState from './subtasks/getLegacyState';
import proceed from './subtasks/proceed';
import { RawResult, RawTransfer } from './subtasks/state';

interface DeployArgs {
  stablecoin: string;
  mint: string;
  cafe: string;
  noHarden: boolean;
  yes: boolean;
}

interface DeployState {
  intial: {
    time: number;
    balance: BigNumber;
  };
  contracts: {
    USDCe: BridgeToken;
    Eligibility: Eligibility;
    DPS: DeepSquare;
    SpenderSecurity: SpenderSecurity;
    Initializer: Initializer;
    Sale: Sale;
  };
}

// constants
const GNOSIS_SAFE = '0xaEAE6CA5a34327b557181ae1E9E62BF2B5eB1D7F';
const MINIMUM_PURCHASE_USD = 250; // $250 min USD investment
const RESULTS_BATCH_SIZE = 50;
const TRANSFER_BATCH_SIZE = 200;
const SPENDER_ROLE = utils.id('SPENDER');
const WRITER_ROLE = utils.id('WRITER');

task<DeployArgs>('deploy', 'Deploy the smart contracts', async (taskArgs, hre: HardhatRuntimeEnvironment) => {
  // Parse the options
  const mint = BigNumber.from(taskArgs.mint ?? 0);
  const harden = !taskArgs.noHarden;
  const cafe = taskArgs.cafe;

  const [deployer] = await hre.ethers.getSigners();
  const initialDeployerBalance = await getHumanBalance(deployer);

  const results: RawResult[] = JSON.parse(
    readFileSync(join(__dirname, '..', 'state', 'results.json'), { encoding: 'utf-8' }),
  );

  const transfers: RawTransfer[] = JSON.parse(
    readFileSync(join(__dirname, '..', 'state', 'transfers.json'), { encoding: 'utf-8' }),
  );

  // Display what we will do
  logger.info('Deployer:      ', chalk.magenta(deployer.address), `(${initialDeployerBalance} AVAX)`);
  logger.info('Café (backend):', chalk.magenta(cafe));
  logger.info('Gnosis safe:   ', chalk.magenta(GNOSIS_SAFE));

  if (harden) {
    logger.info(`The deployment will be hardened and the permissions transferred to ${harden}`);
  } else {
    logger.info(`The deployment will not be hardened`);
  }

  if (!taskArgs.yes && !(await proceed())) {
    return;
  }

  // Contract deployment
  // ===================
  const state = {
    intial: {
      time: Date.now(),
      balance: await deployer.getBalance(),
    },
    contracts: {
      USDCe: await hre.run('deploy:contract', { name: 'BridgeToken' }),
      Eligibility: await hre.run('deploy:contract', { name: 'Eligibility' }),
      SpenderSecurity: await hre.run('deploy:contract', { name: 'SpenderSecurity' }),
    },
  } as DeployState;

  state.contracts.DPS = await hre.run('deploy:contract', {
    name: 'DeepSquare',
    args: [state.contracts.SpenderSecurity.address],
  });
  state.contracts.Initializer = await hre.run('deploy:contract', {
    name: 'Initializer',
    args: [state.contracts.DPS.address, state.contracts.Eligibility.address],
  });

  const { remaining, sold } = await getLegacyState();
  state.contracts.Sale = await hre.run('deploy:contract', {
    name: 'Sale',
    args: [
      state.contracts.DPS.address,
      state.contracts.USDCe.address,
      state.contracts.Eligibility.address,
      40,
      MINIMUM_PURCHASE_USD * 1e6,
      sold,
    ],
  });
  await waitTx(state.contracts.DPS.transfer(state.contracts.Sale.address, remaining));
  logger.info('Sale contract funded with', remaining.div(e(18)).toNumber(), 'DPS');

  if (mint.gt(0)) {
    const mint_STC = mint.mul(e(await state.contracts.USDCe.decimals()));
    await waitTx(
      state.contracts.USDCe.mint(
        deployer.address,
        mint_STC,
        ZERO_ADDRESS,
        0,
        utils.id(randomBytes(16).toString('hex')),
      ),
    );

    assert.equal(
      mint_STC.toString(),
      (await state.contracts.USDCe.balanceOf(deployer.address)).toString(),
      'Deployer has been correctly minted',
      'Deployer has not been correctly minted',
    );

    logger.info(
      'Minted',
      mint_STC.div(e(await state.contracts.USDCe.decimals())).toString(),
      'to',
      chalk.magenta(deployer.address),
    );
  }

  // Configuration of the roles
  await grantRole(state.contracts.SpenderSecurity, 'SPENDER', state.contracts.Sale.address); // Make Sale DPS spender
  await grantRole(state.contracts.Eligibility, 'WRITER', cafe); // Make cafe Eligibility WRITER spender

  // Post-deployment checks
  assert.equal(
    (await state.contracts.DPS.totalSupply()).toString(),
    DPS_TOTAL_SUPPLY.toString(),
    'DPS.totalSupply() does match',
    'DPS.totalSupply() does not match',
  );
  assert.equal(
    (await state.contracts.DPS.balanceOf(state.contracts.Sale.address)).toString(),
    remaining,
    'Sale.remaining() does match',
    'Sale.remaining() does not match',
  );
  assert.ok(
    await state.contracts.SpenderSecurity.hasRole(utils.id('SPENDER'), state.contracts.Sale.address),
    `${state.contracts.Sale.address} has the SPENDER role`,
    `${state.contracts.Sale.address} has not the SPENDER role`,
  );
  assert.ok(
    await state.contracts.Eligibility.hasRole(utils.id('WRITER'), cafe),
    `${cafe} has the WRITE role`,
    `${cafe} has not the WRITE role`,
  );

  // Write the KYC results in batch
  // ==============================
  logger.info('Set KYC results in Eligibility');
  await grantRole(state.contracts.Eligibility, 'WRITER', state.contracts.Initializer.address);

  const progressR = new SingleBar({}, Presets.shades_classic);
  progressR.start(results.length, 0);
  for (const resultsChunk of chunk(results, RESULTS_BATCH_SIZE)) {
    await waitTx(
      state.contracts.Initializer.setResults(
        resultsChunk.map((r) => r.account),
        resultsChunk.map((r) => r.result),
      ),
    );
    progressR.increment(resultsChunk.length);
  }
  progressR.stop();

  await revokeRole(state.contracts.Eligibility, 'WRITER', state.contracts.Initializer.address);

  // Airdrop the DPS tokens
  // ======================
  logger.info('Replay transfers');
  await grantRole(state.contracts.SpenderSecurity, 'SPENDER', state.contracts.Initializer.address);
  const totalDPS = transfers.reduce((sum, t) => sum.add(BigNumber.from(t.amount)), BigNumber.from(0));
  await waitTx(state.contracts.DPS.transfer(state.contracts.Initializer.address, totalDPS));

  const progressT = new SingleBar({}, Presets.shades_classic);
  progressT.start(transfers.length, 0);

  const phase1: RawTransfer[] = [];
  const phase2: RawTransfer[] = [];
  let border = 0;

  for (const t of transfers) {
    if (t.rate === 20) {
      phase1.push(t);
    } else if (t.rate) {
      phase2.push(t);
    }
  }

  for (const transferChunk of chunk(phase1, TRANSFER_BATCH_SIZE)) {
    const tx = await waitTx(
      state.contracts.Initializer.airdrop(
        transferChunk.map((t) => t.metadata.to),
        transferChunk.map((t) => BigNumber.from(t.amount)),
      ),
    );

    border = tx.blockNumber;

    progressT.increment(transferChunk.length);
  }

  for (const transferChunk of chunk(phase2, TRANSFER_BATCH_SIZE)) {
    await waitTx(
      state.contracts.Initializer.airdrop(
        transferChunk.map((t) => t.metadata.to),
        transferChunk.map((t) => BigNumber.from(t.amount)),
      ),
    );

    progressT.increment(transferChunk.length);
  }

  progressT.stop();

  // Post-aidrop checks
  await state.contracts.Initializer.destruct();

  // Integrity check
  await checkBalances(
    state.contracts.DPS,
    transfers.map((t) => t.metadata.to),
  );

  if (harden) {
    // Step 6: transfer all privileges to the gnosis
    logger.info('Hardening: transferring all permissions to', chalk.magenta(GNOSIS_SAFE));

    // DeepSquare
    await waitTx(state.contracts.DPS.transferOwnership(GNOSIS_SAFE));
    assert.equal(
      await state.contracts.DPS.owner(),
      harden,
      `DPS owner is now ${GNOSIS_SAFE}`,
      `DPS owner is not ${GNOSIS_SAFE}`,
    );

    // Sale
    await waitTx(state.contracts.Sale.transferOwnership(GNOSIS_SAFE));
    assert.equal(
      await state.contracts.Sale.owner(),
      harden,
      `DPS owner is now ${harden}`,
      `DPS owner is not ${harden}`,
    );

    // Make gnosis spender admin
    await grantRole(state.contracts.SpenderSecurity, DEFAULT_ADMIN_ROLE, GNOSIS_SAFE);
    assert.ok(
      await state.contracts.SpenderSecurity.hasRole(DEFAULT_ADMIN_ROLE, GNOSIS_SAFE),
      `${harden} has the DEFAULT_ADMIN_ROLE role`,
      `${harden} has not the DEFAULT_ADMIN_ROLE role`,
    );

    // Make gnosis eligibility WRITER
    await grantRole(state.contracts.SpenderSecurity, 'SPENDER', GNOSIS_SAFE);
    assert.ok(
      await state.contracts.SpenderSecurity.hasRole(SPENDER_ROLE, GNOSIS_SAFE),
      `${harden} has the SPENDER role`,
      `${harden} has not the SPENDER role`,
    );

    await waitTx(state.contracts.SpenderSecurity.renounceRole(DEFAULT_ADMIN_ROLE, deployer.address));
    await waitTx(state.contracts.SpenderSecurity.renounceRole(SPENDER_ROLE, deployer.address));

    // Make gnosis eligibility admin
    await grantRole(state.contracts.Eligibility, DEFAULT_ADMIN_ROLE, GNOSIS_SAFE);
    assert.ok(
      await state.contracts.Eligibility.hasRole(DEFAULT_ADMIN_ROLE, GNOSIS_SAFE),
      `${harden} has the DEFAULT_ADMIN_ROLE role`,
      `${harden} has not the DEFAULT_ADMIN_ROLE role`,
    );

    await grantRole(state.contracts.Eligibility, 'WRITER', GNOSIS_SAFE); // Make gnosis eligibility WRITER
    assert.ok(
      await state.contracts.Eligibility.hasRole(WRITER_ROLE, GNOSIS_SAFE),
      `${harden} has the WRITER role`,
      `${harden} has not the WRITER role`,
    );
    assert.ok(
      await state.contracts.Eligibility.hasRole(WRITER_ROLE, GNOSIS_SAFE),
      `${harden} has not the WRITER role`,
      `${harden} has not the WRITER role`,
    );

    await waitTx(state.contracts.Eligibility.renounceRole(DEFAULT_ADMIN_ROLE, deployer.address));
    await waitTx(state.contracts.Eligibility.renounceRole(WRITER_ROLE, deployer.address));
  }

  const duration = Math.floor((Date.now() - state.intial.time) / 1000);
  const used = (
    state.intial.balance
      .sub(await deployer.getBalance())
      .div(e(16))
      .toNumber() / 100
  ).toFixed(2);

  logger.info('Migration duration:', duration, 'seconds');
  logger.info('Migration cost:    ', used, 'AVAX');
  logger.info('USDC.e:            ', state.contracts.USDCe.address);
  logger.info('Eligibility:       ', state.contracts.Eligibility.address);
  logger.info('SpenderSecurity:   ', state.contracts.SpenderSecurity.address);
  logger.info('DeepSquare:        ', state.contracts.DPS.address);
  logger.info('Sale:              ', state.contracts.Sale.address);
  logger.info('Phase 1/2 block:   ', border);
})
  .addOptionalParam('stablecoin', 'Address of the existing stablecoin contract')
  .addOptionalParam('mint', 'Mint stablecoin to the deployer')
  .addOptionalParam('cafe', 'The café account address', '0xCAFEFbC500ef20b0c75198C74bbef6C17a19d793')
  .addFlag('noHarden', 'Do not harden the deployment by transferring privileges to the gnosis')
  .addFlag('yes', 'Skip the checks');
