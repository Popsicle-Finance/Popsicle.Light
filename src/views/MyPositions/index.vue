<template>
  <div class="my-positions">
    <section class="optimizer-section">
      <div class="my-positions__header">
        <h3 class="my-positions__title">My positions</h3>
      </div>
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
      <div
        class="my-positions__list"
        :class="inline && 'my-positions__list-column column'"
      >
        <div class="error-wrapper" v-if="errorText && !isFragolaLoadingProcess">
          <Error :errorText="errorText" />
        </div>
        <template v-else>
          <template v-if="!isFragolaLoadingProcess">
            <MyPositionPool
              v-for="pool in sortPools"
              :key="pool.id"
              :pool="pool"
            />
          </template>
          <template v-else>
            <SkeletonMyPosition v-for="item in 4" :key="item" />
          </template>
        </template>
      </div>
    </section>
    <section class="optimizer-section farm-section">
      <div class="my-positions__header">
        <h3 class="my-positions__title">My farms positions</h3>
      </div>
      <div
        class="my-positions__list"
        :class="inline && 'my-positions__list-column column'"
      >
        <div class="error-wrapper" v-if="farmErrorText && !farmPoolsLoading">
          <Error :errorText="farmErrorText" />
        </div>
        <template v-else>
          <template v-if="!farmPoolsLoading">
            <MyPositionFarm
              v-for="pool in openFarmPositions"
              :key="`farm-${pool.id}`"
              :pool="pool"
            />
          </template>
          <template v-else>
            <SkeletonMyPosition v-for="item in 4" :key="item" />
          </template>
        </template>
      </div>
    </section>
  </div>
</template>

<script>
const MyPositionPool = () => import("@/components/ui/MyPositionPool");
const MyPositionFarm = () => import("@/components/ui/MyPositionFarm");
const SearchBar = () => import("@/components/searchBar/SearchBar");
const Error = () => import("@/components/ui/Error");
const SkeletonMyPosition = () => import("@/components/ui/SkeletonMyPosition");

import { mapGetters } from "vuex";

import sorbetto from "@/mixins/sorbetto";
import farmPools from "@/mixins/farmPools";
import fragolaUserInfo from "@/mixins/fragola/fragolaUserInfo";

export default {
  mixins: [sorbetto, fragolaUserInfo, farmPools],
  data() {
    return {
      inline: false,
      searchKey: "",
      sortKey: "Title",
      isSortFromTop: true,
      sortOptions: ["Title", "Hot", "Active"],

      updatePositionsInterval: null,
    };
  },
  computed: {
    ...mapGetters({
      chain: "getChain",
      farmsPools: "getFarmPools",
      sorbettoPools: "getSorbettoPools",
    }),

    isFragolaLoadingProcess() {
      return this.$store.getters.getSorbettoPoolsLoading;
    },

    farmPoolsLoading() {
      return this.$store.getters.getFarmPoolsLoading;
    },

    openFragolaPositions() {
      return this.sorbettoPools.filter(
        (pool) => +pool.userPoolInfo.userLpBalance > 0
      );
    },

    openFarmPositions() {
      return this.farmsPools?.filter((pool) => +pool.positionBalance > 0);
    },

    errorText() {
      if (!this.openFragolaPositions?.length)
        return "You have no open positions yet.";

      if (!this.sortPools?.length) return "No results found.";
    },

    farmErrorText() {
      if (!this.openFarmPositions?.length)
        return "You have no open farm positions yet.";

      return false;
    },

    filterPools() {
      return this.openFragolaPositions.filter(
        (pool) =>
          pool.name.toLowerCase().indexOf(this.searchKey.toLowerCase()) !== -1
      );
    },

    sortPools() {
      const ifTrue = this.isSortFromTop ? 1 : -1;
      const ifFalse = this.isSortFromTop ? -1 : 1;

      if (this.sortKey === "Title") {
        return this.filterPools.sort((a, b) => {
          if (a.name.toLowerCase() < b.name.toLowerCase()) return ifFalse;
          if (a.name.toLowerCase() > b.name.toLowerCase()) return ifTrue;
          return 0;
        });
      }
      if (this.sortKey === "Hot") {
        return this.filterPools.sort((pool) => {
          if (pool.isHot) return ifFalse;
          if (!pool.isHot) return ifTrue;
          return 0;
        });
      }
      if (this.sortKey === "Active") {
        return this.filterPools.sort((a, b) => {
          if (!a.isDiscontinued) return ifFalse;
          if (a.isDiscontinued) return ifTrue;
          return 0;
        });
      }

      return this.filterPools;
    },
  },

  watch: {
    filterPools() {
      this.filterPools.length
        ? (this.isNotFound = true)
        : (this.isNotFound = false);
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

  beforeDestroy() {
    window.removeEventListener("resize", this.checkInline);
  },

  async created() {
    this.checkInline();

    await this.createSorbetto();
    await this.createFarmPools();

    this.updatePositionsInterval = setInterval(async () => {
      await this.createSorbetto();
      await this.createFarmPools();
    }, 20000);

    window.addEventListener("resize", this.checkInline);
  },

  beforeDestroy() {
    clearInterval(this.updatePositionsInterval);
  },

  components: {
    MyPositionPool,
    SearchBar,
    Error,
    SkeletonMyPosition,
    MyPositionFarm,
  },
};
</script>

<style lang="scss">
.error-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px auto;
}

.farm-section {
  margin-top: 50px;
}

.my-positions {
  margin: 30px 0;
  padding: 40px 30px 30px;
  border-radius: 12px;
  background: #2c2c2c;
  box-shadow: 0px 0px 16px rgba(20, 20, 19, 0.05);

  @media (max-width: 600px) {
    padding: 40px 10px 30px;
  }

  &__header {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    margin-bottom: 30px;
  }

  &__title {
    font-weight: 400;
    font-size: 20px;
    line-height: 27px;
    margin-bottom: 25px;
  }

  &__list {
    margin-top: 30px;

    &-column {
      display: flex;
      flex-wrap: wrap;
      gap: 1%;
      @media (max-width: 1024px) {
        gap: 0;
        justify-content: space-between;
      }
    }
  }
}

.search {
  height: 105px;
}
</style>
