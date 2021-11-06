<template>
  <div class="farms-wrap">
    <div class="farm" v-if="!warningText">
      <h3 class="farm-title">All opportunity</h3>
      <SearchBar
        @toggleView="toggleView"
        :sortValue="sortKey"
        :sortFromTop="isSortFromTop"
        :sortOptions="sortOptions"
        @updateFlow="updateSortFlow"
        @updateSortValue="updateSortKey"
        :searchKey="searchKey"
        @updateSearchInput="updateSearchKey"
      />

      <div class="loading-wrap" v-if="farmPoolsLoading">
        <Loading></Loading>
      </div>

      <div
        class="farm-list"
        :class="{ inline }"
        v-else-if="!farmPoolsLoading && sortPools.length"
      >
        <FarmItem v-for="pool in sortPools" :key="pool.id" :pool="pool" />
      </div>

      <div class="error-search" v-else>
        <Error errorText="No results found" />
      </div>
    </div>
    <div class="error-wrapper" v-if="warningText">
      <Error :errorText="warningText" />
    </div>
  </div>
</template>

<script>
const SearchBar = () => import("@/components/searchBar/SearchBar");
const FarmItem = () => import("@/components/ui/FarmItem");
const Error = () => import("@/components/ui/Error");

import { mapGetters } from "vuex";

import farmPools from "@/mixins/farmPools";

export default {
  mixins: [farmPools],
  data() {
    return {
      inline: false,
      searchKey: "",
      sortKey: "Yield",
      isSortFromTop: true,
      sortOptions: ["Yield", "Roi", "TVL"],

      updateFarmsInterval: null,

      warningText: "",
    };
  },
  computed: {
    ...mapGetters({
      chain: "getChain",
      farmPools: "getFarmPools",
      farmPoolsLoading: "getFarmPoolsLoading",
    }),

    filterPools() {
      return this.farmPools.filter(
        (pool) =>
          pool.name.toLowerCase().indexOf(this.searchKey.toLowerCase()) !== -1
      );
    },

    sortPools() {
      const ifTrue = this.isSortFromTop ? 1 : -1;
      const ifFalse = this.isSortFromTop ? -1 : 1;

      // if (this.sortKey === "Title") {
      //   return this.filterPools.sort((a, b) => {
      //     if (a.name.toLowerCase() < b.name.toLowerCase()) return ifFalse;
      //     if (a.name.toLowerCase() > b.name.toLowerCase()) return ifTrue;
      //     return 0;
      //   });
      // }
      if (this.sortKey === "Yield") {
        return this.filterPools.sort((a, b) => {
          if (+a.poolYield > +b.poolYield) return ifFalse;
          if (+a.poolYield < +b.poolYield) return ifTrue;
          return 0;
        });
      }

      if (this.sortKey === "Roi") {
        return this.filterPools.sort((a, b) => {
          if (+a.poolRoi > +b.poolRoi) return ifFalse;
          if (+a.poolRoi < +b.poolRoi) return ifTrue;
          return 0;
        });
      }

      if (this.sortKey === "TVL") {
        return this.filterPools.sort((a, b) => {
          if (+a.poolNumberTvl > +b.poolNumberTvl) return ifFalse;
          if (+a.poolNumberTvl < +b.poolNumberTvl) return ifTrue;
          return 0;
        });
      }

      return this.filterPools;
    },
  },

  methods: {
    toggleView() {
      this.inline = !this.inline;
    },

    updateSortFlow(value) {
      this.isSortFromTop = value;
    },

    updateSortKey(value) {
      this.sortKey = value;
    },

    updateSearchKey(value) {
      this.searchKey = value;
    },

    checkInline() {
      if (window.innerWidth < 900) {
        this.inline = true;
        return false;
      }
    },
  },

  async created() {
    const isConnected = this.$store.getters.getWallet.address;

    if (!isConnected) {
      this.warningText = "Please connect to use Stand";
      return false;
    }

    const acceptedNetworks = [1, 56, 250];

    const isChainAccept = acceptedNetworks.indexOf(this.chain) !== -1;

    if (!isChainAccept) {
      this.warningText = "No Farms on this network yet";
      return false;
    }

    this.checkInline();
    await this.createFarmPools();

    this.updateFarmsInterval = setInterval(async () => {
      await this.createFarmPools();
    }, 15000);

    window.addEventListener("resize", this.checkInline);
  },

  beforeDestroy() {
    clearInterval(this.updateFarmsInterval);
    window.removeEventListener("resize", this.checkInline);
  },

  components: {
    SearchBar,
    FarmItem,
    Error,
  },
};
</script>

<style lang="scss" scoped>
.loading-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
}

.error-search {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  min-height: 450px;
  margin-top: 30px;
}

.error-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10%;
}

.farm {
  margin: 30px 0;
  padding: 50px 30px 20px;
  border-radius: 12px;
  background: #2c2c2c;
  box-shadow: 0px 0px 16px rgba(20, 20, 19, 0.05);
}

.farm-title {
  font-weight: 400;
  font-size: 20px;
  line-height: 27px;
  margin-bottom: 25px;
}

.farm-list {
  margin-top: 20px;
}

.search {
  height: 105px;
}

.error-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10% auto;
}

.inline {
  display: flex;
  gap: 1.5%;
}

@media screen and (max-width: 1024px) {
  .inline {
    flex-wrap: wrap;
  }
}

@media screen and (max-width: 768px) {
  .inline {
    justify-content: space-between;
  }
}

@media screen and (max-width: 600px) {
  .inline {
    justify-content: space-between;
  }
}
</style>
