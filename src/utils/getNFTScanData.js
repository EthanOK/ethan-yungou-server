const { ErcType, EvmChain, NftscanEvm } = require("nftscan-api");
const { NFTSCAN_API_KEY } = require("../systemConfig");

const config = {
  apiKey: NFTSCAN_API_KEY,
  chain: EvmChain.ETH,
};

const evm = new NftscanEvm(config);

async function getNFTTotalOfAccount_ERC721(accountAddress) {
  try {
    let result = await evm.asset.getAssetsByAccount(accountAddress, {
      erc_type: ErcType.ERC_721,
    });
    return result.total;
  } catch (error) {
    console.log(error);
    return 0;
  }
}

async function getNFTTotalOfAccount_ERC1155(accountAddress) {
  try {
    let result = await evm.asset.getAssetsByAccount(accountAddress, {
      erc_type: ErcType.ERC_1155,
    });

    return result.total;
  } catch (error) {
    console.log(error);
    return 0;
  }
}
async function getNFTsOfAccount(accountAddress, contract_address) {
  try {
    let nextCursor = "";
    let data = [];

    while (nextCursor != null) {
      const { content, next } = await evm.asset.getAssetsByAccount(
        accountAddress,
        {
          contract_address: contract_address,
          cursor: nextCursor,
          limit: 100,
        }
      );
      nextCursor = next;
      // console.log(content.length);
      data = data.concat(content);
    }
    // console.log(data.length);
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
}
module.exports = {
  getNFTTotalOfAccount_ERC1155,
  getNFTTotalOfAccount_ERC721,
  getNFTsOfAccount,
};
// getNFTsOfAccount(
//   "0x95B3Aad7f20E78a0e4DcEB9c23beca4e55ebdDF6",
//   "0x1b489201d974d37ddd2faf6756106a7651914a63"
// );
