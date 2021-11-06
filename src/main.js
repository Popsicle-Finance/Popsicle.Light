import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { Swiper as SwiperClass, Mousewheel } from "swiper/core";
import VueAwesomeSwiper from "vue-awesome-swiper";
import VTooltip from "v-tooltip";
import clickOutside from "./directives/clickOutside";

import "swiper/swiper.scss";
import "swiper/swiper-bundle.css";

import chain from "./plugins/chain";
import connectWallet from "./plugins/connectWallet";
// import tooltip from "./directives/tooltip";

import { ethers } from "ethers";
const Web3 = require("web3");
const web3Instance = new Web3();

if (window.ethereum) {
  web3Instance.currentProvider = window.ethereum;
}

SwiperClass.use([Mousewheel]);
Vue.use(VueAwesomeSwiper);

Vue.use(chain);
Vue.use(connectWallet);
// Vue.use(tooltip);
Vue.use(VTooltip);

Vue.prototype.$ethers = ethers;
Vue.prototype.$web3 = web3Instance;

Vue.config.productionTip = false;

Vue.directive("click-outside", clickOutside);
Vue.component("Loading", () => import("@/components/ui/Loading"));

Vue.mixin({
  computed: {
    web3() {
      if(this.$store.getters.getWeb3Instance) return this.$store.getters.getWeb3Instance
      console.log("here")
      return this.$web3
    }
  }
})

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
