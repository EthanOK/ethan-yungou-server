const { Log } = require("ethers");
const {
  getPastEvent_LuckyBabyParticipate,
} = require("./utils/listeningLuckyBabyContract");

async function main() {
  let result = await getPastEvent_LuckyBabyParticipate(
    "0x66fD5106a5Af336CE81fd38A5AB2FFFD9bCD1C8c",
    9525468,
    null
  );
  if (result) {
    console.log("Update Success!");
    process.exit(0);
  }
}

main();
