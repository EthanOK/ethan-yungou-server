const { getDataOfMysql_OP } = require("./accessDB");

const getLastBlockNumber_LuckyBabyParticipate = async () => {
  let sql =
    "SELECT MAX(blockNumber) AS maxBlockNumber FROM aggregator_ethan.event_participate_lb";
  let datas = await getDataOfMysql_OP(sql);
  let lastBlockNumber = datas[0].maxBlockNumber;
  return lastBlockNumber;
};

module.exports = {
  getLastBlockNumber_LuckyBabyParticipate,
};
