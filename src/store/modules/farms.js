export default {
    state: {
      farmPools: [],
      farmPoolsLoading: true
    },
    mutations: {
      setFarmPools(state, payload) {
        state.farmPools = payload;
      },
      setFarmPoolsLoading(state, payload) {
        state.farmPoolsLoading = payload;
      },
    },
    getters: {
      getFarmPools: (state) => state.farmPools,
      getFarmPoolsLoading: (state) => state.farmPoolsLoading,
      getFarmPoolById: (state) => (id) => {
        return state.farmPools.find((pool) => pool.id == id);
      },
    },
  };
  