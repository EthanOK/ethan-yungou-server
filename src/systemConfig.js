require("dotenv").config();

const EXPIRES_TIME = "7d";
const SECRETKEY = process.env.JWT_SECRET_KEY;
const INFURA_MAIN_RPC = process.env.INFURA_MAIN_RPC;
const INFURA_GOERLI_RPC = process.env.INFURA_GOERLI_RPC;
const INFURA_SEPOLIA_RPC = process.env.INFURA_SEPOLIA_RPC;
const ANKR_BSC_RPC = process.env.ANKR_BSC_RPC;
const ANKR_TBSC_RPC = process.env.ANKR_TBSC_RPC;
const OPENSEA_API_KEY = process.env.OPENSEA_API_KEY;
const NFTSCAN_API_KEY = process.env.NFTSCAN_API_KEY;
const chainIds_testnet = ["5", "97", "11155111"];
const KNN3_API_KEY = process.env.KNN3_API_KEY;
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
const INFURA_GOERLI_WSS = process.env.INFURA_GOERLI_WSS;

const CC_SIGNATURE_KEY = process.env.CC_SIGNATURE_KEY;

const crossChainAddress_G = "0x2817c37eB23FC4F94f1168A94f26befa1F42FF7d";
const crossChainAddress_TBSC = "0x6AAf3B8a8E42BeDc226e2d1F166Dfdc22d4b5182";

const YunGouDividend_Main = "0x4643B06deBE49fCE229A77eBC9E7c5C036b2CEdC";

const YgmeStaking_Main = "0x1981f583d723bcbe7a0b41854afadf7fc287f11c";

const addressLuckyBaby_G = "0x66fD5106a5Af336CE81fd38A5AB2FFFD9bCD1C8c";

module.exports = {
  EXPIRES_TIME,
  SECRETKEY,
  INFURA_MAIN_RPC,
  INFURA_GOERLI_RPC,
  INFURA_SEPOLIA_RPC,
  ANKR_BSC_RPC,
  ANKR_TBSC_RPC,
  OPENSEA_API_KEY,
  NFTSCAN_API_KEY,
  chainIds_testnet,
  KNN3_API_KEY,
  addressLuckyBaby_G,
  INFURA_GOERLI_WSS,
  ALCHEMY_API_KEY,
  YunGouDividend_Main,
  YgmeStaking_Main,
  CC_SIGNATURE_KEY,
  crossChainAddress_G,
  crossChainAddress_TBSC,
};
