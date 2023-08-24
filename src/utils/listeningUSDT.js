const {
  ethers,
  JsonRpcProvider,
  Contract,
  WebSocketProvider,
  formatEther,
} = require("ethers");

const usdtABI = require("../abi/USDTABI.json");

async function main() {
  const provider = new JsonRpcProvider("...");

  // 交互合约 new ethers.Contract(addressOrName, abi, providerOrSigner);
  let usdtAddress = "0xC2C527C0CACF457746Bd31B2a698Fe89de2b6d49";

  const contract = new Contract(usdtAddress, usdtABI, provider);
  let symbol = await contract.symbol();
  // 监听所有事件
  console.log("Transfer(from, to, value)");
  contract.on("Transfer", (from, to, value) => {
    console.log(from, to, formatEther(value), symbol);
  });

  //   // 过滤事件
  //   let contract = new ethers.Contract(addressC, abi, provider);
  //   let filteraddress = "0x53188E798f2657576c9de8905478F46ac2f24b67";
  //   let filter = contract.filters.Transfer(null, filteraddress, null);
  //   console.log("Transfer(null, %s, null)", filteraddress);
  //   contract.on(filter, (from, to, value) => {
  //     // 只有 Transfer to = filteraddress 才 log
  //     console.log(from, to, ethers.utils.formatEther(value), symbol);
  //   });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// node scripts/eventlog.js
