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
  getAddressOfENSTheGraph,
  getENSByTokenIdTheGraph,
  getENSOfAddressByContract,
  getENSByTokenId,
} = require("./getENSData");

const { getBNBPriceUSDT, getETHPriceUSDT } = require("./getPriceBaseUSDT");
const { getSignatureOfCrossChain } = require("./getSignature");

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

        let data = { userToken: userToken };
        result = { code: 200, data: data };
        const user_address = requestData.message.userAddress;
        const chainId = requestData.domainData.chainId;
        const create_time = Math.round(new Date().getTime() / 1000);

        const sql = `INSERT INTO aggregator_ethan.yg_user_token 
        (user_address, user_token, deleted, create_time, update_time,chain_id)
         VALUES("${user_address}", "${userToken}", 0, ${create_time}, ${create_time}, ${chainId});`;

        let insertedId = await insertDataOfMysql_OP(sql);
        if (insertedId !== null) {
          console.log("Insert Login Log ID:", insertedId);
        } else {
          console.log("Insert Login Log Failure");
        }
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

    // getAddressOfENSTheGraph
    app.post("/api/getAddressOfENSTheGraph", async (req, res) => {
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
          let data = await getAddressOfENSTheGraph(requestData.ens);
          if (data == false) {
            result = { code: -444, message: "后台访问ens,连接出错" };
          } else {
            result = { code: 200, data: data };
          }
        }
      }

      res.json(result);
    });

    // getENSByTokenIdTheGraph
    app.post("/api/getENSByTokenIdTheGraph", async (req, res) => {
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
          let data = await getENSByTokenIdTheGraph(requestData.tokenId);
          if (data == false) {
            result = { code: -444, message: "后台访问ens,连接出错" };
          } else {
            result = { code: 200, data: data };
          }
        }
      }
      res.json(result);
    });

    // getENSByTokenId
    app.post("/api/getENSByTokenId", async (req, res) => {
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
          let data = await getENSByTokenId(requestData.tokenId);

          if (data == false) {
            result = { code: -444, message: "后台访问ens,连接出错" };
          } else {
            result = { code: 200, data: data };
          }
        }
      }
      res.json(result);
    });

    // getCrossChainSignature
    app.post("/api/getCrossChainSignature", async (req, res) => {
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
          let data = await getSignatureOfCrossChain(
            requestData.chainId,
            requestData.ccType,
            userAddress,
            requestData.amount
          );

          if (data == false) {
            result = { code: -444, message: "后台访问ens,连接出错" };
          } else {
            result = { code: 200, data: data };
          }
        }
      }
      res.json(result);
    });

    // getENSOfAddressByContract
    app.post("/api/getENSOfAddressByContract", async (req, res) => {
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
          let data = await getENSOfAddressByContract(requestData.address);
          result = { code: 200, data: data };
        }
      }

      res.json(result);
    });

    app.post("/api/getPriceBaseUSDT", async (req, res) => {
      let result;
      let bnbPrice = await getBNBPriceUSDT();
      let ethPrice = await getETHPriceUSDT();
      let data = { bnbPrice: bnbPrice, ethPrice: ethPrice };
      result = { code: 200, data: data };

      res.json(result);
    });
  } catch (error) {
    console.log("post error:" + error);
  }
};
module.exports = { postReq };
