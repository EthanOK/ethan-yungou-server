const {
  getDataOfMysql,
  getDataOfMysql_OP,
  insertDataOfMysql_OP,
} = require("./accessDB");

const { generateToken, verifyToken } = require("./generateToken");

const postReq = async (app) => {
  try {
    app.post("/api/getSystemData", async (req, res) => {
      const userToken = req.headers["user-token"];

      const requestData = req.body;
      let result;

      if (userToken.length == 0) {
        result = { code: -401, message: "unLogin, Please Login!" };
      } else {
        let [userAddress, message] = verifyToken(userToken);
        if (userAddress == null) {
          result = { code: -400, message: message };
        } else {
          const sql = "SELECT * FROM system";

          let data = await getDataOfMysql_OP(sql);
          result = { code: 200, data: data };
        }
      }

      res.json(result);
    });

    app.post("/api/login", async (req, res) => {
      const requestData = req.body;

      let userToken = generateToken(requestData);

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
