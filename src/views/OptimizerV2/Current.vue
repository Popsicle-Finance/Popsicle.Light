<template>
  <div></div>
  <!-- <Pool :mainToken="mainToken" :fromToken="fromToken" poolVersion="v2" /> -->
</template>

<script>
const Pool = () => import("@/components/pool/Pool");

export default {
  data() {
    return {
      mainToken: {
        name: "EHT",
        address: "0xfF3Ac80c1caA08Cbd43a7e90d20c398d54C7342f",
        decimals: 18,
        userBalance: "3",
        imageName: "Token_ETH.svg",
      },
      fromToken: {
        name: "USDT",
        address: "0xf16e81dce15b08f326220742020379b855b87df9",
        decimals: 18,
        userBalance: "1",
        isTokenApprowed: true,
        imageName: "Token_USDT.svg",
      },
    };
  },
  components: { Pool },
};
</script>

<style></style>
