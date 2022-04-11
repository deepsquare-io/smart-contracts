import { task } from 'hardhat/config';
import { sync as rimraf } from 'rimraf';

task('typechain', 'Generate Typechain typings for compiled contracts', async (taskArgs, hre, runSuper) => {
  await runSuper(taskArgs);

  if (hre.config.typechain.outDir) {
    rimraf(hre.config.typechain.outDir + '/**/index.ts');
  }
});
