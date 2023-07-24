import * as fs from 'fs';
import * as path from 'path';
import { formatUnits } from '@ethersproject/units';

// This script matches wallets with name. For privacy reasons names are not exposed in the repository.
// The format for the names is the following:
// [
//   {
//     "fullname": "Florin Dzeladini",
//     "wallet": {
//       "address": "0x80ef3F115E749A93c0aaAeD955a74F0547556556"
//     }
//   },
//   {
//     "fullname": "Berat Denizdurduran",
//     "wallet": {
//       "address": "0xcE257Fa20D245BBa4c3D6540204f386a6299dD47"
//     }
//   },
// ]

// Load and parse the json files
const valuesJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/gains.json'), 'utf8'));
const namesJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/names.json'), 'utf8'));

// Map of addresses to names
const nameMap: { [key: string]: string } = {};

// Populate the name map
for (const item of namesJson) {
  nameMap[item.wallet.address] = item.fullname;
}

// Create the new json
const newJson: { [key: string]: string } = {};
for (const address in valuesJson) {
  if (Object.prototype.hasOwnProperty.call(nameMap, address)) {
    const valueInWei = valuesJson[address];
    const valueInEther = formatUnits(valueInWei, 'ether');
    newJson[nameMap[address]] = valueInEther;
  }
}

// Write the new json to a file
fs.writeFileSync(path.join(__dirname, '../data/philippe.json'), JSON.stringify(newJson, null, 2));
