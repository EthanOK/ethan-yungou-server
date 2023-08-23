const {
  listenContract_LuckyBabyParticipate,
} = require("./listeningLuckyBabyContract");
const { addressLuckyBaby_G } = require("../systemConfig");
const listeningContracts = async () => {
  try {
    const addressLuckyBaby = addressLuckyBaby_G;
    await listenContract_LuckyBabyParticipate(addressLuckyBaby);
  } catch (error) {
    console.log(error);
  }
  return true;
};
module.exports = {
  listeningContracts,
};
