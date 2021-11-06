<template>
  <div class="card" :class="[convertTypeToStr, { inline }]">
    <div class="card-image">
      <TokenIcon :big="true" :imageName="pool.poolImage" v-if="!loaded" />

      <!-- skeleton loader -->
      <div class="skeleton" v-if="loaded"></div>
    </div>
    <div class="card-pair">
      <span v-if="!loaded">{{ pool.name }} {{ pool.poolPercent }}%</span>

      <!-- skeleton loader -->
      <div class="skeleton" v-if="loaded"></div>
    </div>
    <div class="card-apr">
      <span class="info-block" v-if="!loaded">APR {{ pool.poolApr }}%</span>

      <div
        class="max-cap info-block"
        v-if="!loaded && +pool.maxCap <= 100000000"
      >
        TVL/max cap - ${{ pool.poolTvl | formatNumber }}/${{
          pool.maxCap | formatCap
        }}
      </div>

      <div
        class="max-cap info-block"
        v-if="!loaded && +pool.maxCap > 100000000"
      >
        no max cap
      </div>

      <!-- skeleton loader -->
      <div class="skeleton" v-if="loaded"></div>
    </div>

    <div>
      <div class="card-action" v-if="loaded">
        <div class="skeleton"></div>
      </div>
      <div class="card-action" v-if="!wallet.address && !loaded">
        <span class="btn-wrap active" @click="$connectWallet">
          <span class="btn">Connect wallet</span>
        </span>
      </div>

      <div class="card-action" v-if="wallet.address && !loaded">
        <span class="btn-wrap active">
          <span class="btn" @click="toPoolPage">Join</span>
        </span>
      </div>
    </div>

    <div class="status-wrapper">
      <!-- like -->
      <div class="like" v-if="isLike" v-tooltip.bottom="heartTooltip">
        <img src="./img/heart.png" alt="" />
      </div>

      <!-- fire -->
      <div class="fire" v-if="isFire" v-tooltip.bottom="heartTooltip">
        <img src="./img/fire.png" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
const TokenIcon = () => import("@/components/ui/TokenIcon");

export default {
  components: {
    TokenIcon,
  },
  props: {
    pool: {
      type: [Object, Number],
      require: true,
      default: () => {},
    },
    loaded: {
      type: Boolean,
      require: true,
      default: true,
    },
    type: {
      /**
       * 0 (default) - no box shadow
       * 1 (popular) - red shadow
       * 2 (opportunity) - blue shadow
       */
      type: Number,
      default: 0,
    },
    /**
     * For inline mode
     */
    inline: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    // loaded: false,
    heartTooltip: "High Yield",
  }),
  computed: {
    ...mapGetters({
      wallet: "getWallet",
    }),

    convertTypeToStr() {
      return this.type === 1 ? "popular" : this.type === 2 ? "opportunity" : "";
    },

    isLike() {
      if (this.pool?.isLike) {
        return true;
      }
      return false;
    },

    isFire() {
      if (this.pool?.isFire) {
        return true;
      }
      return false;
    },
  },
  methods: {
    handleConnect() {
      console.log("connect");
    },
    toPoolPage() {
      this.$router.push({ name: "PoolV3", params: { id: this.pool.id } });
    },
  },
  filters: {
    formatNumber(value) {
      if (!value) return value;
      if (Number(value) === 0) return value;

      const lookup = [
        { value: 0, symbol: "" },
        { value: 1, symbol: "" },
        { value: 1e3, symbol: "k" },
        { value: 1e6, symbol: "M" },
      ];
      const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
      let item = lookup
        .slice()
        .reverse()
        .find(function(item) {
          return parseFloat(value) >= item.value;
        });
      return (
        (parseFloat(value) / item.value).toFixed(2).replace(rx, "$1") +
        item.symbol
      );
    },
    formatCap(value) {
      if (!value) return value;
      if (Number(value) === 0) return value;

      if (value > 100000000) return "∞";

      const lookup = [
        { value: 0, symbol: "" },
        { value: 1, symbol: "" },
        { value: 1e3, symbol: "k" },
        { value: 1e6, symbol: "M" },
      ];
      const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
      let item = lookup
        .slice()
        .reverse()
        .find(function(item) {
          return parseFloat(value) >= item.value;
        });
      return (
        (parseFloat(value) / item.value).toFixed(2).replace(rx, "$1") +
        item.symbol
      );
    },
  },
  mounted() {
    const path = String(this.$route.path).replace("/optimizer-v", "");
    this.routeName = `CurrentV${path}`;
  },
};
</script>

<style lang="scss" scoped>
$base-color: rgba(255, 255, 255, 0.05);
$shine-color: rgba(255, 255, 255, 0.1);

$skeleton-image: linear-gradient(
  90deg,
  $base-color 0px,
  $shine-color 60px,
  $base-color 120px
);
$skeleton-size: 1000px;

.max-cap {
  display: block;
  text-transform: uppercase;
  font-size: 10px;
  line-height: 14px;
  font-weight: normal;
  margin-top: 2px;
}

.card {
  padding: 20px;
  max-height: 225px;
  max-width: 210px;
  min-height: 120px;

  border-radius: 12px;
  background: #252423;
  position: relative;

  display: grid;
  grid-template-rows: repeat(4, auto);

  text-align: center;
  align-items: center;
  @media screen and(max-width: 600px) {
    max-width: 268px;
    // min-height: 256px;
  }

  &.inline {
    max-width: 100%;
    grid-template-columns: auto auto 1fr 170px;
    grid-template-rows: unset;
    height: 100%;
    margin-bottom: 20px;

    .card-apr {
      margin-top: 0;

      display: flex;
      align-items: center;
      justify-content: center;

      .info-block {
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(20px);
        border-radius: 12px;
        padding: 5px;
        margin: 5px;
        min-width: 100px;
        width: 40%;
        min-height: 60px;
        font-weight: bold;
        font-size: 14px;
      }

      .skeleton {
        animation: skeleton-inline 1.6s infinite forwards !important;
      }
    }

    .card-pair {
      .skeleton {
        display: none;
      }
    }

    .card-action {
      margin-top: 0;
    }

    .card-image {
      margin-bottom: 0;
      margin-right: 15px;
    }

    .status-wrapper {
      position: absolute;
      top: 12px;
      left: 22px;
    }

    .like,
    .fire {
      position: initial;
      display: inline-block;
    }

    .like {
      margin-right: 15px;
    }
  }

  &.popular {
    box-shadow: 0px 0px 5px rgba(233, 52, 115, 0.4);
  }

  &.opportunity {
    box-shadow: 0px 0px 5px rgba(25, 78, 202, 0.4);
  }

  &-action {
    margin-top: 15px;
    .skeleton {
      width: 100%;
      height: 39px;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background-image: $skeleton-image;
      background-size: $skeleton-size;
      animation: skeleton 1.6s infinite forwards;
    }

    .btn-wrap {
      width: 100%;
      .btn {
        width: 100%;
      }
    }
  }

  &-image {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 15px;

    .skeleton {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background-image: $skeleton-image;
      background-size: $skeleton-size;
      animation: skeleton 1.6s infinite forwards;
    }
  }

  &-pair {
    font-size: 14px;
  }

  &-apr {
    margin-top: 5px;
    font-weight: 700;
  }

  &-apr,
  &-pair {
    .skeleton {
      height: 17px;
      width: 100%;
      border-radius: 4px;
      background-image: $skeleton-image;
      background-size: $skeleton-size;
      animation: skeleton 1.6s infinite forwards;
    }
  }

  .like,
  .fire {
    position: absolute;
    width: 16px;
    height: 16px;
    cursor: pointer;
  }

  .like {
    top: 15px;
    left: 15px;
  }

  .fire {
    top: 15px;
    right: 15px;
    &:hover {
      &::before {
        right: 0;
      }
    }
  }
}

@keyframes skeleton {
  0% {
    background-position: -100px;
  }

  40%,
  100% {
    background-position: 180px;
  }
}

@keyframes skeleton-inline {
  0% {
    background-position: -100px;
  }

  40%,
  100% {
    background-position: 600px;
  }
}

@media screen and(max-width: 600px) {
  .card {
    width: 268px;
    margin: 0 auto;
    min-height: 255px;
    &.inline {
      max-height: 200px;
      grid-template-columns: unset;
      grid-template-rows: unset;
      align-items: center;

      grid-template-areas:
        "image pair apr"
        "action action action";

      .card-image {
        grid-area: image;
      }

      .card-action {
        grid-area: action;
        margin: 0;
        margin-top: 15px;
      }

      .card-pair {
        grid-area: pair;
        .skeleton {
          display: flex !important;
          margin: 0;
          width: 80px;
        }
      }

      .card-apr {
        grid-area: apr;
        .skeleton {
          width: 50px;
        }
      }
    }
  }
}
</style>
