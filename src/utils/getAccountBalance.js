const { getDataOfMysql_OP_Paras } = require("./accessDB");

const getClaimYGIOBalance = async (account, chainId) => {
  let sql_balance =
    "SELECT balance FROM aggregator_ethan.cross_chain_user" +
    " WHERE account = ? AND chainId = ?";

  let balanceData = await getDataOfMysql_OP_Paras(sql_balance, [
    String(account).toLowerCase(),
    chainId,
  ]);

  console.log(balanceData);

  if (balanceData.length == 0) {
    return { balance: 0 };
  } else {
    return { balance: balanceData[0].balance };
  }
};

module.exports = {
  getClaimYGIOBalance,
};
