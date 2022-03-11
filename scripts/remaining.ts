import { BigNumber, utils } from 'ethers';

async function main() {
  console.log(utils.id('genesis'));
  console.log(BigNumber.from(1e9).pow(3));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
