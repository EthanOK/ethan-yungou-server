const { ethers } = require("ethers");
const axios = require("axios");
const { INFURA_MAIN_RPC, KNN3_API_KEY } = require("../systemConfig");

const { setAuthKey, getAddr, holdNfts, getAddrList } = require("knn3-sdk");
setAuthKey(KNN3_API_KEY);
const provider = new ethers.JsonRpcProvider(INFURA_MAIN_RPC);

async function getAddressOfENS(ens) {
  try {
    const provider = new ethers.JsonRpcProvider(INFURA_MAIN_RPC);
    const address = await provider.resolveName(ens);
    // 0xA508c16666C5B8981Fa46Eb32784Fccc01942A71
    ens = await provider.lookupAddress(
      "0xDA482dDF91922e4ae66Fa1Aa82290E9B70a4693b"
    );
    console.log(ens);
    if (address == null) {
      return null;
    } else {
      return address;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function getENSOfAddress(address) {
  try {
    const ens = await provider.lookupAddress(address);

    if (ens == null) {
      return null;
    } else {
      return ens;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function getENSOfAddressTheGraph(address) {
  try {
    // 获取当前时间戳（毫秒）
    const currentTimestamp = Date.now();

    // 将毫秒转换为秒（Unix时间戳格式）
    const unixTimestamp = Math.floor(currentTimestamp / 1000);

    const result = await axios.post(
      "https://api.thegraph.com/subgraphs/name/ensdomains/ens",
      {
        query:
          "query getNames($id: ID!, $expiryDate: Int) {\n  account(id: $id) {\n    registrations(first: 1000, where: {expiryDate_gt: $expiryDate}) {\n      registrationDate\n      expiryDate\n      domain {\n        id\n        labelName\n        labelhash\n        name\n        isMigrated\n        parent {\n          name\n          id\n        }\n        createdAt\n      }\n    }\n    domains(first: 1000) {\n      id\n      labelName\n      labelhash\n      name\n      isMigrated\n      parent {\n        name\n        id\n      }\n      createdAt\n      registration {\n        registrationDate\n        expiryDate\n      }\n    }\n    wrappedDomains(first: 1000) {\n      expiryDate\n      fuses\n      domain {\n        id\n        labelName\n        labelhash\n        name\n        isMigrated\n        parent {\n          name\n          id\n        }\n        createdAt\n        registration {\n          registrationDate\n          expiryDate\n        }\n      }\n    }\n  }\n}",
        variables: {
          id: address.toLowerCase(),
          expiryDate: unixTimestamp,
        },
        operationName: "getNames",
      }
    );
    if (result.status == 200) {
      let data = result.data.data;

      if (data.account == null) {
        return null;
      }
      return data.account;
    }
    return false;
  } catch (error) {
    // console.log(error);
    return false;
  }
}

async function getAddressInfo(address) {
  const info = await getAddr(address);
  console.log(info);
}
async function getNftList(address, network) {
  const nftList = await holdNfts(address, network);
  console.log(JSON.stringify(nftList));
  console.log(nftList.list.length);
}
module.exports = {
  getAddressOfENS,
  getENSOfAddress,
  getENSOfAddressTheGraph,
};

// getAddressInfo("0xDA482dDF91922e4ae66Fa1Aa82290E9B70a4693b");
// getNftList("0xDA482dDF91922e4ae66Fa1Aa82290E9B70a4693b", "ethereum");
getENSOfAddressTheGraph("0xDA482dDF91922e4ae66Fa1Aa82290E9B70a4693b");
