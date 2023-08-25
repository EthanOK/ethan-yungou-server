const {
  ethers,
  WebSocketProvider,
  JsonRpcProvider,
  AbiCoder,
} = require("ethers");
const {
  INFURA_MAIN_RPC,
  YunGouDividend_Main,
  YgmeStaking_Main,
} = require("../systemConfig");
const YunGouDivABI = require("../abi/YunGouDivABI.json");
const YgmeStakingABI = require("../abi/YgmeStakingABI.json");
const { insertDataOfMysql_OP_Paras } = require("./accessDB");

const provider = new JsonRpcProvider(INFURA_MAIN_RPC);
// 获取 YunGouDiv Withdraw 历史事件
const getPastEvent_YunGouDivWithdraw = async (target, fromBlock, toBlock) => {
  try {
    const contract = new ethers.Contract(target, YunGouDivABI, provider);
    const events = await contract.queryFilter("Withdraw", fromBlock, toBlock);
    // console.log(events.length);

    for (const event of events) {
      let logDemo = event;
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
    }
  } catch (error) {
    console.log(error);
  }
};

// 获取 YGME Staking/Unstake 历史事件
const getPastEvent_YgmeStaking = async (target, fromBlock, toBlock) => {
  try {
    const contract = new ethers.Contract(target, YgmeStakingABI, provider);
    const events = await contract.queryFilter("Staking", fromBlock, toBlock);
    // console.log(events.length);

    for (const event of events) {
      let logDemo = event;

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
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getPastEvent_YunGouDivWithdraw,
  getPastEvent_YgmeStaking,
};

// getPastEvent_YunGouDivWithdraw(YunGouDividend_Main, null, null);

// getPastEvent_YgmeStaking(YgmeStaking_Main, null, null);
