const {
  getDataOfMysql,
  getDataOfMysql_OP,
  insertDataOfMysql_OP,
} = require("./accessDB");

const { generateToken } = require("./generateToken");

const postReq = async (app) => {
  try {
    app.post("/api/getSystemData", async (req, res) => {
      const requestData = req.body;
      console.log(requestData);
      const sql = "SELECT * FROM system";

      let result = await getDataOfMysql_OP(sql);
      res.json(result);
    });

    app.post("/api/login", async (req, res) => {
      const requestData = req.body;
      console.log(requestData);

      let userToken = generateToken(requestData);
      console.log(userToken);

      //   const sql = "SELECT * FROM system";
      //   await insertDataOfMysql_OP(sql);
      let result = { userToken: userToken };

      res.json(result);
    });
  } catch (error) {
    console.log("post error:" + error);
  }
};
module.exports = { postReq };
