const mysql = require("mysql");

const getPoolMysql = () => {
  try {
    let pool = mysql.createPool({
      connectionLimit: 10,
      // TODO:change host address
      // host: "192.168.0.173",
      host: "localhost",
      user: "root",
      password: "root",
      port: "3306",
      database: "aggregator_ethan",
    });
    return pool;
  } catch (error) {
    console.log(error);
    return null;
  }
};
module.exports = { getPoolMysql };
