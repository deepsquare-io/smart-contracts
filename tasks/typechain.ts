import { subtask } from 'hardhat/config';
import { sync as rimraf } from 'rimraf';

subtask('typechain:generate-types', async (taskArgs, hre, runSuper) => {
  await runSuper(taskArgs);

  if (hre.config.typechain.outDir) {
    rimraf(hre.config.typechain.outDir + '/**/index.ts');
  }
});
