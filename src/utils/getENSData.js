const { ethers, getAddress, namehash, dnsEncode, Contract } = require("ethers");
const axios = require("axios");
const { INFURA_MAIN_RPC, KNN3_API_KEY } = require("../systemConfig");

const { setAuthKey, getAddr, holdNfts, getAddrList } = require("knn3-sdk");
const { log } = require("console");
const { json } = require("stream/consumers");
setAuthKey(KNN3_API_KEY);
const provider = new ethers.JsonRpcProvider(INFURA_MAIN_RPC);

async function getAddressOfENS(ens) {
  try {
    const provider = new ethers.JsonRpcProvider(INFURA_MAIN_RPC);
    const address = await provider.resolveName(ens);

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
    // console.log(error);
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

async function getAddressOfENSTheGraph(ens) {
  ens = ethers.ensNormalize(ens);
  try {
    const query = `{
      domains(where: {name: "${ens}"}) {
        id
        name
        labelName
        labelhash
        owner {
          id
        }
      }
    }
    `;
    const result = await axios.post(
      "https://api.thegraph.com/subgraphs/name/ensdomains/ens",
      { query: query }
    );
    if (result.status == 200) {
      let domains = result.data.data.domains;

      if (domains.length == 0) {
        return null;
      }

      return domains[0].owner.id;
    }
    return false;
  } catch (error) {
    // console.log(error);
    return false;
  }
}

// 有问题会查询账户下所有的ens
async function getENSByTokenIdTheGraph(tokenId) {
  const labelHash = BigInt(tokenId).toString(16);
  // if (labelHash.length != 64) return false;
  // console.log(labelHash);
  try {
    const query = `query{
      domains(first:1, where:{labelhash:"${labelHash}"}){
        labelName
      }
    }`;
    const result = await axios.post(
      "https://api.thegraph.com/subgraphs/name/ensdomains/ens",
      { query: query }
    );
    if (result.status == 200) {
      let domains = result.data.data.domains;

      if (domains.length == 0) {
        return null;
      }
      let name = domains[0].labelName + ".eth";
      // console.log(name);
      return name;
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

async function getENSOfAddressByContract(address) {
  try {
    address = getAddress(address);
    const dnsName = address.substring(2).toLowerCase() + ".addr.reverse";
    const reverseName = dnsEncode(dnsName);

    const universalResolver = new Contract(
      "0xc0497E381f536Be9ce14B0dD3817cBcAe57d2F62",
      [
        "function reverse(bytes reverseName) view returns (string, address, address, address)",
      ],
      provider
    );

    const result = await universalResolver.reverse(reverseName);

    return result[0];
  } catch (error) {
    return null;
  }
}
module.exports = {
  getAddressOfENS,
  getENSOfAddress,
  getENSOfAddressTheGraph,
  getAddressOfENSTheGraph,
  getENSByTokenIdTheGraph,
  getENSOfAddressByContract,
};

// getAddressInfo("0xDA482dDF91922e4ae66Fa1Aa82290E9B70a4693b");
// getNftList("0xDA482dDF91922e4ae66Fa1Aa82290E9B70a4693b", "ethereum");
// getENSOfAddressTheGraph("0xDA482dDF91922e4ae66Fa1Aa82290E9B70a4693b");

// getENSByTokenIdTheGraph(
//   "7315564503871311976272839400035544870733041980623205899485940238463606699374"
// );

// reverseName：b6E040C9ECAaE172a89bD561c5F73e1C48d28cd9.addr.reverse
