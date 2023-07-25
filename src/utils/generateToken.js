const jwt = require("jsonwebtoken");
const { EXPIRES_TIME, SECRETKEY } = require("../systemConfig");

const generateToken = (requestData) => {
  // 生成 Token
  const token = jwt.sign(requestData, SECRETKEY, { expiresIn: EXPIRES_TIME });
  return token;
};

const verifyToken = (userToken) => {
  try {
    const decoded = jwt.verify(userToken, SECRETKEY);
    // console.log(decoded);
    return [decoded.message.userAddress, "vreify success"];
  } catch (err) {
    return [null, err.message];
  }
};

module.exports = { generateToken, verifyToken };
