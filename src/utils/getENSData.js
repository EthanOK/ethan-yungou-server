const { ethers } = require("ethers");
const axios = require("axios");
const { INFURA_MAIN_RPC } = require("../systemConfig");

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
    const query = `
    query getDomainForAccount {
      account(id: "${address}") {
        registrations(orderBy: expiryDate, orderDirection: desc) {
          domain {
            name
            expiryDate
          }
        }
        id
      }
    }
    `;

    const result = await axios.post(
      "https://api.thegraph.com/subgraphs/name/ensdomains/ens",
      {
        query,
      }
    );
    if (result.status == 200) {
      let data = result.data.data;
      // console.log(JSON.stringify(data));
      return data;
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

module.exports = {
  getAddressOfENS,
  getENSOfAddress,
  getENSOfAddressTheGraph,
};
