const ERROR_NON_OWNER =
  "VM Exception while processing transaction: reverted with reason string 'Ownable: caller is not the owner'";

const ERROR_NON_ALLOW_LIST = 
"DeepSquareToken: user not in allowList";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const REFERENCE_ADDRESS_MISMATCH = "CrowdsaleDps: KYC reference does not match address";
module.exports = {
  ERROR_NON_OWNER,
  ZERO_ADDRESS,
  ERROR_NON_ALLOW_LIST,
  REFERENCE_ADDRESS_MISMATCH,
};
