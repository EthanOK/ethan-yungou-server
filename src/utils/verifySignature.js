const { verifyTypedData } = require("ethers");
const { equalityStringIgnoreCase } = require("./utils");

const verifyLoginSignature = async (paras) => {
  const types = {
    VerifyClaim: [
      { name: "userAddress", type: "address" },
      { name: "randNo", type: "uint256" },
      { name: "amount", type: "uint256" },
    ],
  };
  const recoveredAddress = verifyTypedData(
    paras.domainData,
    types,
    paras.message,
    paras.signature
  );

  if (equalityStringIgnoreCase(recoveredAddress, paras.message.userAddress)) {
    return true;
  }
  return false;
};
module.exports = { verifyLoginSignature };
