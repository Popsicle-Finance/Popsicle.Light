import axios from "axios";
import Web3 from "web3";
const web3 = new Web3();

export const fromWei = (value, weiFormat) => {
  return web3.utils.fromWei(value, weiFormat);
};

export const toWei = (value, weiFormat) => {
  return web3.utils.toWei(value, weiFormat);
};

export const BigInt = (value) => {
  return web3.utils.toBN(value);
};

export const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const tokenPrices = async (tokens) => {
  const prices = {};

  if (tokens.includes("wonderland")) {
    const { data } = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=wonderland&vs_currencies=usd"
    );
    prices["wonderland"] = data.wonderland.usd;
  }

  if (tokens.includes("convex-finance")) {
    const { data } = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=convex-finance&vs_currencies=usd"
    );
    prices["convex-finance"] = data["convex-finance"].usd;
  }

  if (tokens.includes("curve-dao-token")) {
    const { data } = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=curve-dao-token&vs_currencies=usd"
    );
    prices["curve-dao-token"] = data["curve-dao-token"].usd;
  }

  if (tokens.includes("uop")) {
    const { data } = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=utopia-genesis-foundation&vs_currencies=usd"
    );
    prices["uop"] = data["utopia-genesis-foundation"].usd;
  }

  if (tokens.includes("uop")) {
    const { data } = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=utopia-genesis-foundation&vs_currencies=usd"
    );
    prices["uop"] = data["utopia-genesis-foundation"].usd;
  }

  if (tokens.includes("weth")) {
    const { data } = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=weth&vs_currencies=usd"
    );
    prices["weth"] = data.weth.usd;
  }

  if (tokens.includes("olympus")) {
    const { data } = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=olympus&vs_currencies=usd"
    );
    prices["olympus"] = data.olympus.usd;
  }

  if (tokens.includes("sushi")) {
    const { data } = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=sushi&vs_currencies=usd"
    );
    prices["sushi"] = data.sushi.usd;
  }

  if (tokens.includes("ice")) {
    const { data } = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=ice-token&vs_currencies=usd"
    );

    prices["ice"] = data["ice-token"].usd;
  }

  if (tokens.includes("spell")) {
    const { data } = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=spell-token&vs_currencies=usd"
    );

    prices["spell"] = data["spell-token"].usd;
  }

  if (tokens.includes("mim")) {
    const { data } = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=magic-internet-money&vs_currencies=usd"
    );

    prices["mim"] = data["magic-internet-money"].usd;
  }

  if (tokens.includes("staker")) {
    const { data } = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=ellipsis&vs_currencies=usd"
    );

    prices["staker"] = data.ellipsis.usd;
  }

  return prices;
};
