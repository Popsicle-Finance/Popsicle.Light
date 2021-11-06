<template>
  <div class="btn-wrap border" v-if="activeNetwork">
    <div class="btn" @click="handleShowModal">
      <img :src="activeNetwork.image" />
      <p>{{ activeNetwork.name }}</p>
    </div>
  </div>
</template>

<script>
const ethNetwork = require("@/assets/images/networks/eth.svg");
const bscNetwork = require("@/assets/images/networks/bsc.svg");
const ftmNetwork = require("@/assets/images/networks/ftm.svg");
const avalancheNetwork = require("@/assets/images/networks/avalanche.png");
const arbitrumNetwork = require("@/assets/images/networks/arbitrum.svg");

import { mapGetters, mapMutations } from "vuex";

export default {
  data() {
    return {
      networks: [
        {
          id: 1,
          name: "ETH",
          image: ethNetwork,
        },
        {
          id: 56,
          name: "BSC",
          image: bscNetwork,
        },
        {
          id: 250,
          name: "Fantom",
          image: ftmNetwork,
        },
        {
          id: 43114,
          name: "AVAX",
          image: avalancheNetwork,
        },
        {
          id: 42161,
          name: "AETH",
          image: arbitrumNetwork,
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      chain: "getChain",
    }),
    activeNetwork() {
      const network = this.networks.find((item) => item.id === this.chain);
      return network;
    },
  },
  methods: {
    ...mapMutations(["setModalState"]),

    handleShowModal() {
      this.setModalState({
        type: "chain",
        isShow: true,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.btn-wrap {
  margin-left: 10px;
}

.btn {
  font-size: 14px;
  padding: 0 30px;

  img {
    height: 20px;
    width: auto;
    margin-right: 10px;
  }
}
</style>
