<template>
  <div class="token-info" :class="center && 'token-info__center'">
    <TokenIcon :big="true" :imageName="imageName" :middle="middle" />
    <div class="token-info__wrap">
      <p class="token-info__name token-info__name_small">
        {{ token.name }}
      </p>
      <p class="token-info__balance">
        {{ parseFloat(token.userBalance).toFixed(4) }}
      </p>
      <p class="token-info-value" :class="dark && 'token-info-value_dark'">
        ${{ balanceUsd }}
      </p>
    </div>
  </div>
</template>

<script>
const TokenIcon = () => import("@/components/ui/TokenIcon");
import { mapGetters } from "vuex";
export default {
  components: {
    TokenIcon,
  },
  props: {
    token: {
      type: Object,
      default: {},
    },
    middle: {
      type: Boolean,
      default: false,
    },
    center: {
      type: Boolean,
      default: false,
    },
    dark: {
      type: Boolean,
      default: false,
    },
    imageName: {
      type: String,
      default: "Token_ice.svg",
    },
  },
  computed: {
    ...mapGetters({
      tokensRate: "getTokensRate",
    }),
    tokenBalance() {
      if (this.token?.balance === undefined) {
        return false;
      } else {
        return true;
      }
    },
    balanceUsd() {
      if (this.token.name === "ICE") {
        return parseFloat(this.token.userBalance * this.token.icePrice).toFixed(
          2
        );
      } else if (this.token.name === "nICE") {
        return parseFloat(
          (this.token.userBalance / +this.tokensRate) * +this.token.icePrice
        ).toFixed(2);
      }
    },
  },
};
</script>

<style lang="scss">
.token-info {
  display: flex;
  align-items: flex-start;
  &__center {
    align-items: center;
  }
  &__wrap {
    margin-left: 10px;
  }
  &__name {
    font-size: 18px;
    line-height: 25px;
    font-weight: 700;
    &_small {
      font-size: 14px;
      line-height: 21px;
      font-weight: 400;
    }
  }
  &__balance {
    font-weight: 700;
    font-size: 18px;
    line-height: 25px;
  }
  &-value {
    font-size: 12px;
    line-height: 16px;
    font-weight: 400;
    &_dark {
      color: #868686;
    }
  }
}
</style>
