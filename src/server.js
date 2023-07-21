const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

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

// 创建MySQL数据库连接
const db = mysql.createConnection({
  host: "192.168.0.173",
  user: "root",
  password: "root",
  port: "3306",
  database: "aggregator_ethan",
});

// 连接到MySQL数据库
db.connect((err) => {
  if (err) {
    console.error("MySQL连接错误:", err);
  } else {
    console.log("成功连接到MySQL数据库");
  }
});

// 创建一个简单的API路由，用于从数据库中获取表数据
// app.get("/api/data", (req, res) => {
//   const sql = "SELECT * FROM system";

//   db.query(sql, (err, result) => {
//     if (err) {
//       console.error("查询数据库错误：", err);
//       res.status(500).json({ error: "数据库查询错误" });
//     } else {
//       res.json(result);
//     }
//   });
// });

// post
app.post("/api/getSystemData", (req, res) => {
  const sql = "SELECT * FROM system";

  db.query(sql, (err, result) => {
    if (err) {
      console.error("查询数据库错误：", err);
      res.status(500).json({ error: "数据库查询错误" });
    } else {
      res.json(result);
    }
  });
});

// 启动服务器，监听端口3001
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`服务器已启动，监听端口：${PORT}`);
});
