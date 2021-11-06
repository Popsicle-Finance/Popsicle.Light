export default {
  state: {
    nIceStakeObject: null,
  },
  mutations: {
    setNIceStakeObject(state, payload) {
      state.nIceStakeObject = payload;
    },
  },
  actions: {},
  getters: {
    getNIceStakeObject: (state) => state.nIceStakeObject,
    getTokensRate: (state) => state.nIceStakeObject.tokensRate,
    isTokenApproved: (state) =>
      state.nIceStakeObject.stakeToken.isTokenApprowed,
  },
};
