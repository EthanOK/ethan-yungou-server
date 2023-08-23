const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { listeningContracts } = require("./utils/listeningContracts");
const { postReq } = require("./utils/postRequest");
const app = express();

async function main() {
  // 设置跨域访问
  app.use(cors());

  // 解析请求体
  app.use(bodyParser.json());

  // 记录请求日志的中间件
  app.use((req, res, next) => {
    console.log(
      `[${new Date().toLocaleString()}] ${req.headers.origin} ${req.method} ${
        req.url
      }`
    );

    next();
  });

  // post
  await postReq(app);

  // 启动服务器，监听端口3001
  const PORT = 3001;
  app.listen(PORT, () => {
    console.log(`服务器已启动，监听端口：${PORT}`);
  });

  // //listening Contract
  // await listeningContracts();
}

main();
