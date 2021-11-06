export default {
  state: {
    chain: 1,
  },
  mutations: {
    SET_CHAIN: (state, payload) => {
      state.chain = payload;
    },
  },
  getters: {
    getChain: (state) => state.chain,
  },
};
