const { listeningContracts } = require("./utils/listeningContracts");
let count = 1;
async function main() {
  try {
    // console.log(count);
    // count++;
    await listeningContracts();
  } catch (error) {
    console.log(error);
  }
}
main();

// setInterval(main, 5 * 60000);
