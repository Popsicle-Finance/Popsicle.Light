import { ETH_CHAIN, BSC_CHAIN, FTM_CHAIN } from "./chains.json";

const setChain = async (chain, switchChain = false) => {
  try {
    let method = "";

    !switchChain
      ? (method = "wallet_addEthereumChain")
      : (method = "wallet_switchEthereumChain");

    await window.ethereum
      .request({
        method,
        params: [chain],
      })
      .then(() => {
        window.location.reload();
      });
  } catch (error) {
    console.log("Error in setChain");
    console.log(error);
  }
};

// window.ethereum.on("chainChanged", (chainId) => {
//   const chains = {
//     "0x1": "eth",
//     "0xfa": "fantom",
//     "0x38": "bsc",
//     "0x2a": "kovan",
//     "0x61": "bsc",
//     "0x4": "eth",
//   };

//   // const chain = chains[chainId];
//   // localStorage.setItem("network", chain);

//   window.location.reload();
// });

export default {
  async install(Vue, options) {
    Vue.prototype.$switchChain = async (network) => {
      try {
        if (!network || !network.point) return;

        switch (network.point) {
          // Ethereum
          case 1:
            await setChain(ETH_CHAIN, true);
            break;
          // Binance
          case 2:
            await setChain(BSC_CHAIN);
            break;
          // Fantom
          case 3:
            await setChain(FTM_CHAIN);
            break;
          default:
            break;
        }
      } catch (error) {
        console.log("Error in chain plugin");
        console.log(error);
      }
    };
  },
};
