require("dotenv").config();
const { deployDeepSquareToken } = require("./helpers/deep-square-token");

async function main() {
  await deployDeepSquareToken(true);
}

return main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
