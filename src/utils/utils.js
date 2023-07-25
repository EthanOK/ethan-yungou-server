const {
  INFURA_MAIN_RPC,
  INFURA_GOERLI_RPC,
  INFURA_SEPOLIA_RPC,
  ANKR_BSC_RPC,
  ANKR_TBSC_RPC,
} = require("../systemConfig");

const equalityStringIgnoreCase = (string1, string2) => {
  if (string1.toLowerCase() === string2.toLowerCase()) {
    return true;
  } else {
    return false;
  }
};

const getRpc = (chainId) => {
  let rpc;
  if (chainId == 1) {
    rpc = INFURA_MAIN_RPC;
  } else if (chainId == 5) {
    rpc = INFURA_GOERLI_RPC;
  } else if (chainId == 11155111) {
    rpc = INFURA_SEPOLIA_RPC;
  } else if (chainId == 56) {
    rpc = ANKR_BSC_RPC;
  } else if (chainId == 97) {
    rpc = ANKR_TBSC_RPC;
  }
};
module.exports = { equalityStringIgnoreCase, getRpc };
