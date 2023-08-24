// How to Use WebSockets in Ethers.js
// https://docs.alchemy.com/reference/alchemy-sdk-quickstart
// WebSocket 获得连续的信息流，包括最新挖掘的交易、待处理的交易哈希、新的标头块、日志等等

const { Alchemy, Network, AlchemySubscription } = require("alchemy-sdk");
const { ALCHEMY_API_KEY } = require("../systemConfig");
const settings = {
  apiKey: ALCHEMY_API_KEY, // Replace with your Alchemy API key.
  network: Network.ETH_MAINNET, // Replace with your network.
};

const alchemy = new Alchemy(settings);

// PENDING_TRANSACTIONS

/* alchemy.ws.on(
  {
    method: AlchemySubscription.PENDING_TRANSACTIONS,
  },
  (res) => console.log(res)
);
 */

async function main() {
  //   // Subscribe to new blocks, or newHeads
  //   alchemy.ws.on("block", (blockNumber) =>
  //     console.log("Latest block:", blockNumber)
  //   );

  const filter = {
    address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    topics: [
      "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
    ],
  };
  alchemy.ws.on(filter, (log) => {
    console.log(log);
  });

  //   const output = await alchemy.ws.listeners("block");
  //   console.log(output);

  //   const output = await alchemy.ws.listenerCount("block");
  //   console.log(output);
}

main();
