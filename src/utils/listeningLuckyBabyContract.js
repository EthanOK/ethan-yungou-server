const { ethers, WebSocketProvider, JsonRpcProvider } = require("ethers");
const { INFURA_GOERLI_WSS, INFURA_GOERLI_RPC } = require("../systemConfig");
const LuckyBabyABI = require("../abi/LuckyBabyABI.json");
const { insertDataOfMysql_OP_Paras } = require("./accessDB");
// WebSocketProvider: 监听合约使用 wss (几分钟就掉线？？)
// JsonRpcProvider: 查询区块链数据、发送交易、调用智能合约 http
const provider = new JsonRpcProvider(INFURA_GOERLI_RPC);

let eventListener = async (
  account,
  issueId,
  count,
  timeParticipate,
  numberCurrent,
  event
) => {
  try {
    let blockNumber = event.log.blockNumber;
    const transactionHash = event.log.transactionHash;

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
  } catch (error) {
    console.log(error);
  }
};

// 实时监听
const listenContract_LuckyBabyParticipate = async (target) => {
  try {
    const contract = new ethers.Contract(target, LuckyBabyABI, provider);

    // Participate (account, issueId, count, timeParticipate)

    contract.on("Participate", eventListener);
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
  const contract = new ethers.Contract(target, LuckyBabyABI, provider);
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
  listenContract_LuckyBabyParticipate,
  getPastEvent_LuckyBabyParticipate,
};

// listenContract_LuckyBabyParticipate("0x0ee08d42f1055da5c560f76ac029af9eebe5ed92");
// getPastEvent_LuckyBabyParticipate(
//   "0x66fD5106a5Af336CE81fd38A5AB2FFFD9bCD1C8c",
//   9525468,
//   null
// );
