<template>
  <div>
    <div class="optimizer" v-if="isCorrectNetwork">
      <!-- Popular -->
      <Popular :populars="popularPools" :isLoadPopular="sorbettoPoolsLoading" />

      <!-- All -->
      <section class="opportunity">
        <h1 class="title">
          All Opportunities
        </h1>

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
        <div class="list" :class="{ 'list-inline': inline }" v-if="isSkeleton">
          <div class="pool-skeleton" v-if="!sorbettoPools.length">
            <PoolItem
              :type="2"
              v-for="(skeleton, index) in skeletonPoolsCount"
              :key="index"
            />
          </div>

          <div
            class="pool-wrapper"
            v-for="pool in sortPools"
            :key="pool.id"
            v-else
          >
            <PoolItem
              :pool="pool"
              :loaded="sorbettoPoolsLoading"
              :type="2"
              :inline="inline"
            />
          </div>
        </div>

        <div class="error-search" v-else>
          <Error errorText="No results found" />
        </div>
      </section>
    </div>
    <div class="error-wrapper" v-else>
      <Error
        errorText="Our Multichain Yield Optimizer is Being Developed! While you wait, please consider using our V3 Optimizer on ETH!"
      />
    </div>
  </div>
</template>

<script>
const SearchBar = () => import("@/components/searchBar/SearchBar");
const PoolItem = () => import("@/components/ui/PoolItem");
const Popular = () => import("@/components/pool/Popular.vue");
const Error = () => import("@/components/ui/Error.vue");

import sorbetto from "@/mixins/sorbetto";
import fragolaUserInfo from "@/mixins/fragola/fragolaUserInfo";

import { mapGetters } from "vuex";

export default {
  mixins: [sorbetto, fragolaUserInfo],

  data() {
    return {
      acceptedNetworks: [
        {
          chainId: 1,
          poolsCount: 8,
        },
        // {
        //   chainId: 42161,
        //   poolsCount: 8,
        // },
      ],
      skeletonPoolsCount: 8,
      isSkeleton: true,
      inline: false,
      swiper: "",
      searchKey: "",
      sortKey: "Title",
      isSortFromTop: true,
      sortOptions: ["Title", "Hot", "APR"],
    };
  },

  computed: {
    ...mapGetters({
      chain: "getChain",
      sorbettoPools: "getSorbettoPools",
      sorbettoPoolsLoading: "getSorbettoPoolsLoading",
    }),

    isCorrectNetwork() {
      const chainObject = this.acceptedNetworks.find(
        (chain) => chain.chainId === this.chain
      );
      if (chainObject) return true;

      return false;
    },

    filterPools() {
      return this.sorbettoPools.filter(
        (pool) =>
          pool.name.toLowerCase().indexOf(this.searchKey.toLowerCase()) !== -1
      );
    },

    sortPools() {
      const ifTrue = this.isSortFromTop ? 1 : -1;
      const ifFalse = this.isSortFromTop ? -1 : 1;

      if (this.sortKey === "Title") {
        console.log("Title");
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
      if (this.sortKey === "APR") {
        return this.filterPools.sort((a, b) => {
          if (Number(a.poolApr) > Number(b.poolApr)) return ifFalse;
          if (Number(a.poolApr) < Number(b.poolApr)) return ifTrue;
          return 0;
        });
      }

      return this.filterPools;
    },

    popularPools() {
      return this.sorbettoPools.filter((item) => item.isPopular);
    },
  },

  watch: {
    filterPools() {
      this.filterPools.length
        ? (this.isSkeleton = true)
        : (this.isSkeleton = false);
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
        this.inline = false;
        return false;
      }
    },
  },

  async created() {
    this.checkInline();
    await this.createSorbetto();
    this.updateSorbettoInterval = setInterval(async () => {
      await this.createSorbetto();
    }, 15000);

    window.addEventListener("resize", this.checkInline);
  },

  beforeDestroy() {
    clearInterval(this.updateSorbettoInterval);
    window.removeEventListener("resize", this.checkInline);
  },

  components: {
    PoolItem,
    SearchBar,
    Popular,
    Error,
  },
};
</script>

<style lang="scss" scoped>
.optimizer {
  margin: 30px 0 80px;
  padding: 40px 30px 20px;
  border-radius: 12px;
  background: #2c2c2c;

  .title {
    font-weight: 600;
    font-size: 20px;
    line-height: 27px;
    margin: 0 0 30px;
  }
}

.opportunity {
  .list {
    margin-top: 30px;
    display: flex;
    flex-wrap: wrap;
    min-height: 450px;
  }

  .list-inline {
    flex-direction: column;

    .pool-wrapper {
      width: 100%;
    }
    .card {
      padding: 40px 20px 20px;
    }
  }

  .card {
    width: 100%;
    margin: 0 auto 20px;
    padding: 20px;
  }
}

.pool-wrapper {
  width: 25%;
}
.pool-skeleton {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
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

@media screen and (max-width: 1024px) {
  .pool-wrapper {
    width: 33.3%;
  }
}

@media screen and (max-width: 768px) {
  .pool-wrapper {
    width: 50%;
  }
}

@media screen and (max-width: 600px) {
  .optimizer {
    padding: 40px 15px 20px;
  }
  .opportunity .list-inline {
    min-height: 370px;
  }
  .opportunity .token-icon-wrap.big {
    width: 62px;
    height: 62px;
  }
  .pool-wrapper {
    width: 100%;
  }
}
</style>
