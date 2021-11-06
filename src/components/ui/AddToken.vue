<template>
  <div class="btn-wrap border">
    <div class="token-icon" @click="addToken">
      <img :src="tokenIcon" alt="" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tokenName: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      tokensData: [
        {
          name: "Ice",
          chain: "0x1",
          address: "0xf16e81dce15B08F326220742020379B855B87DF9",
          symbol: "ICE",
          decimals: 18,
          image:
            "https://fra1.digitaloceanspaces.com/static.popsicle.finance/Token_Ice.png",
        },
        {
          name: "nICE",
          chain: "0x1",
          address: "0xfF3Ac80c1caA08Cbd43a7e90d20c398d54C7342f",
          symbol: "nICE",
          decimals: 18,
          image:
            "https://fra1.digitaloceanspaces.com/static.popsicle.finance/Token_nICE.png",
        },
      ],
    };
  },
  computed: {
    tokenIcon() {
      return require(`@/assets/images/tokens/${this.tokenName}.svg`);
    },
  },
  methods: {
    async addToken() {
      const tokenInfo = this.tokensData.find(
        (item) => item.name.toUpperCase() === this.tokenName.toUpperCase()
      );

      if (!tokenInfo) return false;

      const tokenAddress = tokenInfo.address;
      const tokenSymbol = tokenInfo.symbol;
      const tokenDecimals = tokenInfo.decimals;
      const tokenImage = tokenInfo.image;

      const { ethereum } = window;

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts && accounts.length) {
        try {
          // wasAdded is a boolean. Like any RPC method, an error may be thrown.
          const wasAdded = await ethereum.request({
            method: "wallet_watchAsset",
            params: {
              type: "ERC20", // Initially only supports ERC20, but eventually more!
              options: {
                address: tokenAddress, // The address that the token is at.
                symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
                decimals: tokenDecimals, // The number of decimals in the token
                image: tokenImage, // A string url of the token logo
              },
            },
          });

          if (wasAdded) {
            console.log("Thanks for your interest!");
          } else {
            console.log("Your loss!");
          }
        } catch (error) {
          console.log(error);
        }
      }

      if (!accounts) {
        console.log("Please connect wallet");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.btn-wrap {
  margin-left: 10px;
}

.token-icon {
  width: 40px;
  height: 40px;
  background: #2e2d2c;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  img {
    height: 22px;
    width: auto;
    object-fit: contain;
  }
}
</style>
