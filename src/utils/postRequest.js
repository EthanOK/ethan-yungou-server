const {
  getDataOfMysql,
  getDataOfMysql_OP,
  insertDataOfMysql_OP,
} = require("./accessDB");

const { generateToken, verifyToken } = require("./generateToken");
const { verifyLoginSignature } = require("./verifySignature");
const { getSignature } = require("./getOpenSeaData");
const {
  getAddressOfENS,
  getENSOfAddress,
  getENSOfAddressTheGraph,
} = require("./getENSData");

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
      let result;
      const requestData = req.body;

      let result_verify = await verifyLoginSignature(requestData);
      if (!result_verify) {
        result = { code: -444, message: "Invalid signature" };
      } else {
        let userToken = generateToken(requestData);

        //   const sql = "SELECT * FROM system";
        //   await insertDataOfMysql_OP(sql);
        let data = { userToken: userToken };
        result = { code: 200, data: data };
      }

      res.json(result);
    });

    app.post("/api/getOrderHashSignatureOpenSea", async (req, res) => {
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
          let data = await getSignature(
            userAddress,
            requestData.chainId,
            requestData.tokenAddress,
            requestData.tokenId
          );
          if (data.orderHash == null) {
            result = { code: -402, message: "Invalid Order" };
          } else {
            result = { code: 200, data: data };
          }
        }
      }

      res.json(result);
    });

    app.post("/api/getENSOfAddress", async (req, res) => {
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
          let data = await getENSOfAddress(requestData.address);
          if (data == false) {
            result = { code: -444, message: "后台访问ens,连接出错" };
          } else {
            result = { code: 200, data: data };
          }
        }
      }

      res.json(result);
    });
    // getAddressOfENS
    app.post("/api/getAddressOfENS", async (req, res) => {
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
          let data = await getAddressOfENS(requestData.ens);
          if (data == false) {
            result = { code: -444, message: "后台访问ens,连接出错" };
          } else {
            result = { code: 200, data: data };
          }
        }
      }

      res.json(result);
    });
    // getENSOfAddressTheGraph
    app.post("/api/getENSOfAddressTheGraph", async (req, res) => {
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
          let data = await getENSOfAddressTheGraph(requestData.address);
          if (data == false) {
            result = { code: -444, message: "后台访问ens,连接出错" };
          } else if (data == null) {
            result = { code: 200, data: null };
          } else {
            const domains = data.domains;
            if (domains == null || domains.length == 0) {
              result = { code: 200, data: null };
            } else {
              result = { code: 200, data: domains[0] };
            }
          }
        }
      }

      res.json(result);
    });
  } catch (error) {
    console.log("post error:" + error);
  }
};
module.exports = { postReq };
