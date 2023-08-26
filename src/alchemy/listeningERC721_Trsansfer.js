const { Alchemy, Network, AlchemySubscription } = require("alchemy-sdk");
const {
  ALCHEMY_API_KEY,
  YunGouDividend_Main,
  YgmeStaking_Main,
  addressLuckyBaby_G,
} = require("../systemConfig");
const { id, AbiCoder, ZeroAddress } = require("ethers");
const { insertDataOfMysql_OP_Paras } = require("../utils/accessDB");

const settings = {
  apiKey: ALCHEMY_API_KEY, // Replace with your Alchemy API key.
  network: Network.ETH_MAINNET, // Replace with your network.
};

const settings_G = {
  apiKey: ALCHEMY_API_KEY, // Replace with your Alchemy API key.
  network: Network.ETH_GOERLI, // Replace with your network.
};

const alchemy = new Alchemy(settings);

const alchemy_G = new Alchemy(settings_G);

async function LISTEN_ETH_MAINNET() {
  const filter_ERC721_Transfer = {
    topics: [
      "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
    ],
  };
  // 实时监听 ERC721 Transfer 事件
  alchemy.ws.on(filter_ERC721_Transfer, async (log) => {
    try {
      let logDemo = log;
      let length = logDemo.topics.length;
      let from = AbiCoder.defaultAbiCoder()
        .decode(["address"], logDemo.topics[1])
        .toString();
      let to = AbiCoder.defaultAbiCoder()
        .decode(["address"], logDemo.topics[2])
        .toString();

      if (length == 4 && from != ZeroAddress && to != ZeroAddress) {
        console.log(logDemo);
      }
    } catch (error) {
      console.log(error);
    }
  });

  //   const output = await alchemy.ws.listenerCount(filter);
  //   console.log(output);
}
async function LISTEN_ETH_G() {
  const filter_Participate = {
    address: addressLuckyBaby_G,
    topics: [
      "0xa70b3235e9f90bc08cccbcbd3b4b5963810f386021539eb1648c780ed1a344f1",
    ],
  };

  // 实时监听 Participate event
  alchemy_G.ws.on(filter_Participate, async (log) => {
    try {
      let logDemo = log;
      const account = AbiCoder.defaultAbiCoder()
        .decode(["address"], logDemo.topics[1])
        .toString();
      const issueId = AbiCoder.defaultAbiCoder()
        .decode(["uint256"], logDemo.topics[2])
        .toString();
      let [count, timeParticipate, numberCurrent] =
        AbiCoder.defaultAbiCoder().decode(
          ["uint256", "uint256", "uint256"],
          logDemo.data
        );
      const blockNumber = logDemo.blockNumber;
      const transactionHash = logDemo.transactionHash;

      const sql =
        "INSERT IGNORE INTO aggregator_ethan.event_participate_lb" +
        " (account, issueId, count, timeParticipate, blockNumber, numberCurrent, transactionHash)" +
        " VALUES(?,?,?,?,?,?,?)";

      let paras = [
        account,
        issueId,
        count,
        timeParticipate,
        blockNumber,
        numberCurrent,
        transactionHash,
      ];
      let insertedId = await insertDataOfMysql_OP_Paras(sql, paras);
      if (insertedId !== null) {
        console.log("event_participate_lb Insert ID:", insertedId);
      } else {
        console.log("Insert Login Log Failure");
      }
    } catch (error) {
      console.log(error);
    }
  });
}

async function main() {
  await LISTEN_ETH_MAINNET();
  // await LISTEN_ETH_G();
}

main();
