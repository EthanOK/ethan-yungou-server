const {
  ethers,
  WebSocketProvider,
  JsonRpcProvider,
  AbiCoder,
} = require("ethers");
const {
  INFURA_MAIN_RPC,
  INFURA_GOERLI_RPC,
  YunGouDividend_Main,
  YgmeStaking_Main,
  addressLuckyBaby_G,
} = require("../systemConfig");
const YunGouDivABI = require("../abi/YunGouDivABI.json");
const YgmeStakingABI = require("../abi/YgmeStakingABI.json");
const LuckyBabyABI = require("../abi/LuckyBabyABI.json");
const { insertDataOfMysql_OP_Paras } = require("./accessDB");

const provider = new JsonRpcProvider(INFURA_MAIN_RPC);
const provider_G = new JsonRpcProvider(INFURA_GOERLI_RPC);

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

// 获取Participate 历史事件
const getPastEvent_LuckyBabyParticipate = async (
  target,
  fromBlock,
  toBlock
) => {
  const contract = new ethers.Contract(target, LuckyBabyABI, provider_G);
  const events = await contract.queryFilter("Participate", fromBlock, toBlock);
  // console.log(events.length);

  for (const event of events) {
    lastEvent = event;
    let blockNumber = event.blockNumber;
    let account = event.args.account;
    let issueId = event.args.issueId;
    let count = event.args.count;
    let timeParticipate = event.args.timeParticipate;
    let numberCurrent = event.args.numberCurrent;
    const transactionHash = event.transactionHash;

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
      console.log("Insert Login Log ID:", insertedId);
    } else {
      console.log("Insert Login Log Failure");
    }
  }

  return true;
};
module.exports = {
  getPastEvent_YunGouDivWithdraw,
  getPastEvent_YgmeStaking,
  getPastEvent_LuckyBabyParticipate,
};

// getPastEvent_YunGouDivWithdraw(YunGouDividend_Main, null, null);

// getPastEvent_YgmeStaking(YgmeStaking_Main, null, null);

// getPastEvent_LuckyBabyParticipate(addressLuckyBaby_G, null, null);
