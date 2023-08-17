const {
  listenContract_LuckyBabyParticipate,
} = require("./listeningLuckyBabyContract");
const { addressLuckyBaby_G } = require("../systemConfig");
const listeningContracts = async () => {
  const addressLuckyBaby = addressLuckyBaby_G;
  await listenContract_LuckyBabyParticipate(addressLuckyBaby);
};
module.exports = {
  listeningContracts,
};
