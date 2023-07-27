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
};
