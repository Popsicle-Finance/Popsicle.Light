<template>
  <div class="tabs">
    <!-- Optimizer v3 -->
    <router-link :to="{ name: 'OptimizerV3' }" tag="div" class="tabs-item">
      <span class="btn-wrap">
        <span class="btn">V3 Optimiser</span>
      </span>
    </router-link>

    <router-link :to="{ name: 'FarmStand' }" tag="div" class="tabs-item">
      <span class="btn-wrap">
        <span class="btn">Stand</span>
      </span>
    </router-link>

    <!-- Optimizer v2 (default) -->
    <!-- <router-link to="/optimizer-v2" tag="div" class="tabs-item">
      <span class="btn-wrap">
        <span class="btn">V2 Optimiser</span>
      </span>
    </router-link> -->

    <!-- Positions -->
    <template v-if="this.wallet.address">
      <router-link :to="{ name: 'Positions' }" tag="div" class="tabs-item">
        <span class="btn-wrap">
          <span class="btn">My positions</span>
        </span>
      </router-link>
    </template>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters({
      wallet: "getWallet",
    }),
  },
};
</script>

<style lang="scss">
.tabs {
  width: 100%;
  max-width: 466px;
  height: 50px;
  margin: 0 auto;
  padding: 0 5px;
  display: flex;
  align-items: center;
  background: #2c2c2c;
  border-radius: 14px;

  &-item {
    display: flex;
    flex: 1;
    font-size: 14px;
    margin: 5px;

    &.router-link-active {
      .btn-wrap {
        background: linear-gradient(to right, #5ac9e5, #7c5bff);
      }
    }

    .btn-wrap {
      flex: 1;
      .btn {
        width: 100%;
        background: #333;
        font-weight: normal;
      }
    }
  }
}

@media screen and(max-width : 500px) {
  .tabs {
    flex-direction: column;
    height: auto;
  }

  .tabs-item {
    width: 100%;
  }
}
</style>
