const axios = require("axios");

const getBNBPriceUSDT = async () => {
  let currentPrice = await getPriceUSDT("BNB");
  return currentPrice;
};
const getETHPriceUSDT = async () => {
  let currentPrice = await getPriceUSDT("ETH");
  return currentPrice;
};

const getPriceUSDT = async (symbol) => {
  try {
    symbol = symbol.toUpperCase();
    const result = await axios.get(
      `https://www.binance.com/bapi/asset/v2/public/asset-service/product/get-product-by-symbol?symbol=${symbol}USDT`
    );

    if (result.status == 200) {
      let currentPrice = result.data.data.c;
      return currentPrice;
    }
  } catch (error) {
    return null;
  }
};

module.exports = {
  getBNBPriceUSDT,
  getETHPriceUSDT,
  getPriceUSDT,
};
// async function main() {
//   console.log(await getPriceUSDT("op"));
// }
// main();
