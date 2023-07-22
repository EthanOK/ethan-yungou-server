const jwt = require("jsonwebtoken");
require("dotenv").config();

const secretKey = process.env.JWT_SECRET_KEY;

const generateToken = (requestData) => {
  const expiresIn = process.env.EXPIRES_TIME;
  // 生成 Token
  const token = jwt.sign(requestData, secretKey, { expiresIn });
  return token;
};

const verifyToken = (userToken) => {
  try {
    const decoded = jwt.verify(userToken, secretKey);
    console.log(decoded);
    return [decoded.userAddress, "vreify success"];
  } catch (err) {
    return [null, err.message];
  }
};

module.exports = { generateToken, verifyToken };
