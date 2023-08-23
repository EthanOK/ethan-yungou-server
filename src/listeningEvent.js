const { Log } = require("ethers");
const { listeningContracts } = require("./utils/listeningContracts");

async function main() {
  try {
    await listeningContracts();
  } catch (error) {}
}
main();
