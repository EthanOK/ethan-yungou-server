const { Alchemy, Network, AlchemySubscription } = require("alchemy-sdk");
const { ALCHEMY_API_KEY, YunGouDividend_Main } = require("../systemConfig");
const settings = {
  apiKey: ALCHEMY_API_KEY, // Replace with your Alchemy API key.
  network: Network.ETH_MAINNET, // Replace with your network.
};

const alchemy = new Alchemy(settings);

async function main() {
  const filter = {
    address: YunGouDividend_Main,
    topics: [
      "0xfeb2000dca3e617cd6f3a8bbb63014bb54a124aac6ccbf73ee7229b4cd01f120",
    ],
  };
  alchemy.ws.on(filter, (log) => {
    console.log(log);
  });

  //   const output = await alchemy.ws.listenerCount("block");
  //   console.log(output);
}

main();
