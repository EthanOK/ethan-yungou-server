const { getPoolMysql } = require("./connectMysql");
const util = require("util");
const pool = getPoolMysql();

const getDataOfMysql = async (statementSQL) => {
  try {
    return new Promise((resolve, reject) => {
      // Get a connection from the pool
      pool.getConnection((err, connection) => {
        if (err) {
          console.error("MySQL连接错误:", err);
          return reject(err); // Reject the Promise with the error
        } else {
          // Use the connection for your database operations
          connection.query(statementSQL, (error, results) => {
            // Release the connection back to the pool regardless of the result
            connection.release();

            if (error) {
              console.error("MySQL查询错误:", error);
              return reject(error); // Reject the Promise with the error
            }

            resolve(results); // Resolve the Promise with the query results
          });
        }
      });
    });
  } catch (error) {
    return [];
  }
};

const getDataOfMysql_OP = async (statementSQL) => {
  const getConnection = util.promisify(pool.getConnection).bind(pool);
  const connection = await getConnection();
  const query = util.promisify(connection.query).bind(connection);

  try {
    const results = await query(statementSQL);
    connection.release();
    return results;
  } catch (error) {
    console.error("MySQL错误:", error);
    return [];
  }
};
const getDataOfMysql_OP_Paras = async (statementSQL, paras) => {
  const getConnection = util.promisify(pool.getConnection).bind(pool);
  const connection = await getConnection();
  const query = util.promisify(connection.query).bind(connection);

  try {
    const results = await query(statementSQL, paras);
    connection.release();
    return results;
  } catch (error) {
    console.error("MySQL错误:", error);
    return [];
  }
};

const insertDataOfMysql_OP = async (statementSQL) => {
  const getConnection = util.promisify(pool.getConnection).bind(pool);
  const connection = await getConnection();
  const query = util.promisify(connection.query).bind(connection);

  try {
    const result = await query(statementSQL);
    connection.release();
    return result.insertId;
  } catch (error) {
    console.error("MySQL错误:", error);
    return null;
  }
};

const insertDataOfMysql_OP_Paras = async (statementSQL, paras) => {
  const getConnection = util.promisify(pool.getConnection).bind(pool);
  const connection = await getConnection();
  const query = util.promisify(connection.query).bind(connection);

  try {
    const result = await query(statementSQL, paras);
    connection.release();
    return result.insertId;
  } catch (error) {
    console.error("MySQL错误:", error);
    return null;
  }
};
const updateDataOfMysql_OP_Paras = async (statementSQL, paras) => {
  const getConnection = util.promisify(pool.getConnection).bind(pool);
  const connection = await getConnection();
  const query = util.promisify(connection.query).bind(connection);

  try {
    const result = await query(statementSQL, paras);
    connection.release();
    return result;
  } catch (error) {
    console.error("MySQL错误:", error);
    return null;
  }
};

module.exports = {
  getDataOfMysql,
  getDataOfMysql_OP,
  getDataOfMysql_OP_Paras,
  insertDataOfMysql_OP,
  insertDataOfMysql_OP_Paras,
  updateDataOfMysql_OP_Paras,
};
