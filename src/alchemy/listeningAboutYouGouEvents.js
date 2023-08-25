const { Alchemy, Network, AlchemySubscription } = require("alchemy-sdk");
const {
  ALCHEMY_API_KEY,
  YunGouDividend_Main,
  YgmeStaking_Main,
} = require("../systemConfig");
const { id, AbiCoder } = require("ethers");
const { insertDataOfMysql_OP_Paras } = require("../utils/accessDB");

const settings = {
  apiKey: ALCHEMY_API_KEY, // Replace with your Alchemy API key.
  network: Network.ETH_MAINNET, // Replace with your network.
};

const alchemy = new Alchemy(settings);

async function main() {
  /*  YunGouDividend
        event Withdraw(
        uint256 indexed orderId,
        address indexed coinAddress,
        address indexed account,
        uint256 amount
    );
     */
  const filter_withdraw = {
    address: YunGouDividend_Main,
    // id("Withdraw(uint256,address,address,uint256)")
    topics: [
      "0xfeb2000dca3e617cd6f3a8bbb63014bb54a124aac6ccbf73ee7229b4cd01f120",
    ],
  };

  const filter_USDC = {
    address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    topics: [
      "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
    ],
  };

  const filter_YgmeStaking = {
    address: YgmeStaking_Main,
    topics: [
      "0xe47225b875de4852fd470382456b118594ebcb4992992c55659271dcb9d05c8a",
    ],
  };

  // 实时监听 withdraw 事件
  alchemy.ws.on(filter_withdraw, async (log) => {
    try {
      //   let logDemo = {
      //     blockNumber: 17988464,
      //     blockHash:
      //       "0xb3722ca8236a996cd00ce1610a9d8a419616842715826f96da279e633a895114",
      //     transactionIndex: 10,
      //     removed: false,
      //     address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      //     data: "0x0000000000000000000000000000000000000000000000000040024fbca3b800",
      //     topics: [
      //       "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
      //       "0x0000000000000000000000000000098ee414e7ffa47b2240c5a9390706374d54",
      //       "0x0000000000000000000000000000000000000000000000000000000000000000",
      //       "0x00000000000000000000000082fde8eb0c0247c34487cf6c2ccbaae0a0a86a7b",
      //     ],
      //     transactionHash:
      //       "0x4e2407d96547d01a20eab9435480f814c0220f042a5e89bc53f6ca3ab2651f9f",
      //     logIndex: 66,
      //   };
      let logDemo = log;
      const orderId = AbiCoder.defaultAbiCoder()
        .decode(["uint256"], logDemo.topics[1])
        .toString();
      const coinAddress = AbiCoder.defaultAbiCoder()
        .decode(["address"], logDemo.topics[2])
        .toString();
      const account = AbiCoder.defaultAbiCoder()
        .decode(["address"], logDemo.topics[3])
        .toString();
      const amount = AbiCoder.defaultAbiCoder()
        .decode(["uint256"], logDemo.data)
        .toString();
      const blockNumber = logDemo.blockNumber;
      const transactionHash = logDemo.transactionHash;
      const sql =
        "INSERT IGNORE INTO aggregator_ethan.event_withdraw_ygdiv " +
        "(orderId, coinAddress, account, amount, blockNumber, transactionHash) VALUES(?, ?, ?, ?, ?, ?);";

      const paras = [
        orderId,
        coinAddress,
        account,
        amount,
        blockNumber,
        transactionHash,
      ];
      let insertedId = await insertDataOfMysql_OP_Paras(sql, paras);
      if (insertedId !== null) {
        console.log("Insert Login Log ID:", insertedId);
      } else {
        console.log("Insert Login Log Failure");
      }
    } catch (error) {
      console.log(error);
    }
  });

  // 实时监听 staking 事件
  alchemy.ws.on(filter_YgmeStaking, async (log) => {
    try {
      let logDemo = log;
      const account = AbiCoder.defaultAbiCoder()
        .decode(["address"], logDemo.topics[1])
        .toString();

      const tokenId = AbiCoder.defaultAbiCoder()
        .decode(["uint256"], logDemo.topics[2])
        .toString();
      const nftContract = AbiCoder.defaultAbiCoder()
        .decode(["address"], logDemo.topics[3])
        .toString();
      const blockNumber = logDemo.blockNumber;
      const transactionHash = logDemo.transactionHash;

      let [startTime, endTime, pledgeType] = AbiCoder.defaultAbiCoder().decode(
        ["uint256", "uint256", "uint8"],
        logDemo.data
      );

      const sql =
        "INSERT IGNORE INTO aggregator_ethan.event_staking_ygme " +
        "(account, nftContract, tokenId, startTime, endTime, pledgeType, blockNumber,transactionHash) " +
        "VALUES(?, ?, ?, ?, ?, ?, ?, ?);";

      const paras = [
        account,
        nftContract,
        tokenId,
        startTime,
        endTime,
        pledgeType,
        blockNumber,
        transactionHash,
      ];
      let insertedId = await insertDataOfMysql_OP_Paras(sql, paras);
      if (insertedId !== null) {
        console.log("Insert Login Log ID:", insertedId);
      } else {
        console.log("Insert Login Log Failure");
      }
    } catch (error) {
      console.log(error);
    }
  });

  //   const output = await alchemy.ws.listenerCount(filter);
  //   console.log(output);
}

main();
