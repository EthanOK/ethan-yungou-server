const { ethers, ZeroAddress } = require("ethers");
const { OpenSeaSDK, Chain } = require("opensea-js");
const { OPENSEA_API_KEY, chainIds_testnet } = require("../systemConfig");
const { getRpc } = require("./utils");

const waitOneSecond = async () => {
  return new Promise((resolve) => setTimeout(resolve, 1000));
};
const getOrder = async (chainId, tokenAddress, tokenId) => {
  try {
    let openseaSDK = await getOpenseaSDK(chainId);
    const order = await openseaSDK.api.getOrder({
      side: "ask",
      assetContractAddress: tokenAddress,
      tokenId: tokenId,
    });
    return order;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getOpenseaSDK = async (chainId) => {
  const rpc = getRpc(chainId);
  const provider = new ethers.JsonRpcProvider(rpc);
  let openseaSDK;
  if (chainId == "1") {
    openseaSDK = new OpenSeaSDK(provider, {
      chain: Chain.Mainnet,
      apiKey: OPENSEA_API_KEY,
    });
  } else if (chainId == "56") {
    openseaSDK = new OpenSeaSDK(provider, {
      chain: Chain.BNB,
      apiKey: OPENSEA_API_KEY,
    });
  } else if (chainId == "5") {
    openseaSDK = new OpenSeaSDK(provider, {
      chain: Chain.Goerli,
    });
  } else if (chainId == "97") {
    openseaSDK = new OpenSeaSDK(provider, {
      chain: Chain.BNBTestnet,
    });
  }
  return openseaSDK;
};

const getSignature = async (
  fulfillerAddress,
  chainId,
  tokenAddress,
  tokenId
) => {
  try {
    let openseaSDK = await getOpenseaSDK(chainId);
    const order = await openseaSDK.api.getOrder({
      side: "ask",
      assetContractAddress: tokenAddress,
      tokenId: tokenId,
    });
    // console.log(order);
    const currentPrice = ethers.formatEther(order.currentPrice.toString());

    const orderHash = order.orderHash;
    if (orderHash == null) {
      return { currentPrice: null, orderHash: null, signature: null };
    }

    if (chainIds_testnet.includes(chainId)) {
      await waitOneSecond();
    }
    const fulfillment = await openseaSDK.api.generateFulfillmentData(
      fulfillerAddress,
      order.orderHash,
      order.protocolAddress,
      order.side
    );
    const signature =
      fulfillment.fulfillment_data.transaction.input_data.parameters.signature;
    if (signature == null) {
      return { currentPrice: currentPrice, orderHash: null, signature: null };
    }

    return {
      currentPrice: currentPrice,
      orderHash: orderHash,
      signature: signature,
    };
  } catch (error) {
    console.log(error);
    return { currentPrice: null, orderHash: null, signature: null };
  }
};

module.exports = {
  getOrder,
  getSignature,
};
