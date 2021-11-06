<template>
  <div class="stake-info">
    <div class="stake-info__token">
      <TokenInfo
        :token="token.mainToken"
        :dark="true"
        :center="true"
        imageName="nIce.svg"
      />
    </div>
    <h4 class="stake-info__title">Balance</h4>
    <div class="stake-info__token stake-info__token_balance">
      <TokenInfo
        :token="token.stakeToken"
        imageName="Token_ice.svg"
        :dark="true"
        :middle="true"
      />
      <div class="stake-info__line"></div>
    </div>
    <h4 class="stake-info__title">Staked</h4>
    <div class="stake-info__token stake-info__token_staked">
      <TokenInfo
        :token="token.mainToken"
        imageName="nIce.svg"
        :dark="true"
        :middle="true"
      />
    </div>
    <div class="stake-info__percent">
      <span class="stake-info__percent-text">Approximate Staking APR</span>
      <span class="stake-info__percent-value">{{ token.apr }}%</span>
    </div>
    <div class="stake-info__percent">
      <span class="stake-info__percent-text">Total ICE Locked</span>
      <span class="stake-info__percent-value">{{ token.tvl }}</span>
    </div>
    <div class="stake-info__percent">
      <span class="stake-info__percent-text">Staked Protocol Fees</span>
      <span class="stake-info__percent-value">${{ token.iceAmount }}</span>
    </div>
  </div>
</template>

<script>
const TokenInfo = () => import("@/components/ui/TokenInfo.vue");
export default {
  props: {
    token: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  components: {
    TokenInfo,
  },
};
</script>

<style lang="scss">
.stake-info {
  min-width: 300px;
  width: 355px;
  background: $clrBg2;
  border-radius: 12px;
  padding: 40px 15px;
  @media (max-width: 768px) {
    width: 100%;
    margin-bottom: 20px;
  }
  &__token {
    margin-bottom: 30px;
    &_balance {
      margin-bottom: 10px;
    }
    &_staked {
      margin-bottom: 20px;
    }
  }
  &__title {
    margin-bottom: 10px;
    font-size: 14px;
    line-height: 19px;
    color: #868686;
    font-weight: 400;
  }
  &__line {
    width: 100%;
    height: 1px;
    background: rgba(255, 255, 255, 0.1);
    margin-top: 10px;
  }
  &__percent {
    width: 100%;
    border-radius: 10px;
    // border: 0.1px solid #e4ecee;
    border: 1px solid rgba(164, 222, 255, 0.3);
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    font-size: 14px;
    line-height: 19px;
    font-weight: 400;
    margin-bottom: 10px;
    @media (max-width: 1024px) {
      font-size: 12px;
    }
  }
}
</style>
