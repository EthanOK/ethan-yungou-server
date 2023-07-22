const jwt = require("jsonwebtoken");
require("dotenv").config();

const secretKey = process.env.JWT_SECRET_KEY;

const generateToken = (requestData) => {
  // 生成 Token
  const token = jwt.sign(requestData, secretKey);
  return token;
};

module.exports = { generateToken };
