const {
  ethers,
  WebSocketProvider,
  JsonRpcProvider,
  AbiCoder,
} = require("ethers");
const { INFURA_MAIN_RPC, YunGouDividend_Main } = require("../systemConfig");
const YunGouDivABI = require("../abi//YunGouDivABI.json");
const { insertDataOfMysql_OP_Paras } = require("./accessDB");

const provider = new JsonRpcProvider(INFURA_MAIN_RPC);
// 获取Participate 历史事件
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

module.exports = {
  getPastEvent_YunGouDivWithdraw,
};

// getPastEvent_YunGouDivWithdraw(YunGouDividend_Main, null, null);
