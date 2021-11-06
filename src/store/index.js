import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import nice from "@/store/modules/nice";
import chain from "@/store/modules/chain";
import wallet from "@/store/modules/wallet";
import modals from "@/store/modules/modals";
import notification from "@/store/modules/notification";
import sorbettoFragola from "@/store/modules/sorbettoFragola";
import social from "@/store/modules/social";
import bridge from "@/store/modules/bridge";
import tokensList from "@/store/modules/tokensList";
import farms from "@/store/modules/farms";

export default new Vuex.Store({
  state: {
    web3Instance: null
  },
  mutations: {
    setWeb3Instance(state, payload) {
      state.web3Instance = payload
    },
  },
  getters: {
    getStateIndex: (state) => state,
    getWeb3Instance: (state) => state.web3Instance,
  },
  modules: {
    nice,
    chain,
    wallet,
    modals,
    sorbettoFragola,
    notification,
    social,
    bridge,
    tokensList,
    farms
  },
});
