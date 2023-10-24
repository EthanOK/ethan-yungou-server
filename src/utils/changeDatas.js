const { parseEther, toBigInt } = require("ethers");

const {
  getDataOfMysql_OP,
  insertDataOfMysql_OP_Paras,
  getDataOfMysql_OP_Paras,
  updateDataOfMysql_OP_Paras,
} = require("./accessDB");

const changeCrossChainDatas = async (
  chainId,
  ccType,
  _account,
  amount,
  toChainId
) => {
  try {
    let account = String(_account).toLowerCase();
    // insert 数据库
    const sql =
      "INSERT IGNORE INTO aggregator_ethan.cross_chain_log" +
      " (address, amount, fromChainId, toChainId, ccType, createTime)" +
      " VALUES(?,?,?,?,?,?)";

    let currentTime = Math.floor(new Date().getTime() / 1000);

    let paras = [account, amount, chainId, toChainId, ccType, currentTime];

    let insertedId = await insertDataOfMysql_OP_Paras(sql, paras);

    if (insertedId !== null) {
      console.log("Insert Login Log ID:", insertedId);
    } else {
      console.log("Insert Login Log Failure");
    }

    if (ccType == 1 || Number(ccType) == 1) {
      let sql_balance =
        "SELECT balance FROM aggregator_ethan.cross_chain_user" +
        " WHERE account = ? AND chainId = ?";

      let balanceData = await getDataOfMysql_OP_Paras(sql_balance, [
        account,
        chainId,
      ]);

      let beforeBalance = balanceData[0].balance;
      let afterBalance =
        toBigInt(beforeBalance.toString()) - toBigInt(amount.toString());

      afterBalance = afterBalance.toString();

      // UPDATE
      const sql_update_user =
        "UPDATE aggregator_ethan.cross_chain_user" +
        " SET balance=?, updateTime=?" +
        " WHERE chainId=? AND account=?";

      let updateTime = Math.floor(new Date().getTime() / 1000);

      let paras = [afterBalance, updateTime, chainId, account];

      await updateDataOfMysql_OP_Paras(sql_update_user, paras);

      console.log("UPDATE Success");

      return { balance: afterBalance };
    } else if (ccType == 2 || Number(ccType) == 2) {
      // 查询  account cross chain 余额
      let sql_balance =
        "SELECT balance FROM aggregator_ethan.cross_chain_user" +
        " WHERE account = ? AND chainId = ?";

      let balanceData = await getDataOfMysql_OP_Paras(sql_balance, [
        account,
        toChainId,
      ]);

      if (balanceData.length == 0) {
        // insert user data

        const sql_insert_user =
          "INSERT IGNORE INTO aggregator_ethan.cross_chain_user" +
          " (chainId, account, balance, updateTime)" +
          " VALUES(?,?,?,?)";

        let updateTime = Math.floor(new Date().getTime() / 1000);

        let paras = [toChainId, account, amount, updateTime];

        let insertedId = await insertDataOfMysql_OP_Paras(
          sql_insert_user,
          paras
        );

        if (insertedId !== null) {
          console.log("Insert Login Log ID:", insertedId);
        } else {
          console.log("Insert Login Log Failure");
        }

        return { balance: amount };
      } else {
        // update
        let beforeBalance = balanceData[0].balance;
        let afterBalance =
          toBigInt(beforeBalance.toString()) + toBigInt(amount.toString());

        afterBalance = afterBalance.toString();

        // UPDATE
        const sql_update_user =
          "UPDATE aggregator_ethan.cross_chain_user" +
          " SET balance=?, updateTime=?" +
          " WHERE chainId=? AND account=?";

        let updateTime = Math.floor(new Date().getTime() / 1000);

        let paras = [afterBalance, updateTime, toChainId, account];

        await updateDataOfMysql_OP_Paras(sql_update_user, paras);

        console.log("UPDATE Success");

        return { balance: afterBalance };
      }
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  changeCrossChainDatas,
};
