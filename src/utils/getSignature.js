const {
  CC_SIGNATURE_KEY,
  crossChainAddress_G,
  crossChainAddress_TBSC,
} = require("../systemConfig");
const { ethers, AbiCoder } = require("ethers");
const { getDataOfMysql_OP_Paras } = require("./accessDB");

const getSignatureOfCrossChain = async (chainId, ccType, account, amount) => {
  let privateKey = CC_SIGNATURE_KEY;
  let signer = new ethers.Wallet(privateKey);
  // bytes memory _data = abi.encode(
  //   address(this),
  //   CCTYPE.BURN,
  //   _orderId,
  //   _account,
  //   _amount,
  //   _deadline
  // );
  let ccAddress;
  let currentTime = Math.floor(new Date().getTime() / 1000);

  if (chainId == "5" || parseInt(chainId) == 5) {
    ccAddress = crossChainAddress_G;
  } else if (chainId == "97" || parseInt(chainId) == 97) {
    ccAddress = crossChainAddress_TBSC;
  }
  let orderId = currentTime;

  let deadline = currentTime + 60 * 5;

  const type = ["address", "uint8", "uint256", "address", "uint256", "uint256"];

  const args = [ccAddress, ccType, orderId, account, amount, deadline];

  if (ccType == 1 || Number(ccType) == 1) {
    // amount <= db amount
    let sql_balance =
      "SELECT balance FROM aggregator_ethan.cross_chain_user" +
      " WHERE account = ? AND chainId = ?";

    let balanceData = await getDataOfMysql_OP_Paras(sql_balance, [
      account,
      chainId,
    ]);
    let balance;
    if (balanceData.length == 0) {
      balance = 0;
    } else {
      balance = balanceData[0].balance;
    }

    if (BigInt(balance) < BigInt(amount)) {
      return "InvalidAmount";
    }
  }

  const encodedData = AbiCoder.defaultAbiCoder().encode(type, args);

  const hashData = ethers.keccak256(encodedData);

  let binaryData_ = ethers.getBytes(hashData);

  let signature = await signer.signMessage(binaryData_);
  let data = {
    orderId: orderId,
    amount: amount,
    deadline: deadline,
    signature: signature,
  };
  return data;
};

module.exports = {
  getSignatureOfCrossChain,
};
