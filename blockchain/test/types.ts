import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { School } from "../contract_types/School";
import { UnicefSatchel } from '../contract_types/UnicefSatchel';

export interface Signers {
  admin: SignerWithAddress;
  owner: SignerWithAddress;
  deployer: SignerWithAddress;
  alice: SignerWithAddress;
  bob: SignerWithAddress;
  charlie: SignerWithAddress;
  dave: SignerWithAddress;
  eve: SignerWithAddress;
  daiWhale: SignerWithAddress;
  usdtWhale: SignerWithAddress;
}

// declare module "mocha" {
//   export interface Context {
//     school: School;
//     unicefSatchel: UnicefSatchel;
//     signers: Signers;
//   }
// }