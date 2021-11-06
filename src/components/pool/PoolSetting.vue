<template>
  <div class="settings">
    <div class="settings__top">
      <h3 class="settings__top-title">Settings</h3>
      <button class="settings__top-back" @click="closeSettings">Back</button>
    </div>

    <div class="settings__container">
      <SlipageBlock
        v-if="showSlipage"
        :slipage="slipage"
        :slipageItems="slipageItems"
        :tooltipPercent="tooltipPercent"
        :title="title"
        @update="updateSlipage"
      />

      <SpeedBlock :txSpeed="txSpeed" @update="updateTxSpeed" />
    </div>
    <div class="btn-wrap border width-100">
      <button class="btn width-100" @click="closeSettings">Save</button>
    </div>
  </div>
</template>

<script>
const SlipageBlock = () => import("@/components/pool/SlippageBlock");
const SpeedBlock = () => import("@/components/pool/SpeedBlock");

export default {
  props: {
    slipage: {},
    txSpeed: {},
  },
  data() {
    return {
      title: "Slippage tolerance",
      slipageItems: [0.1, 0.5, 1],
      tooltipPercent:
        "Your Transaction will revert if the price changes unfavourably by more than this percentage",
    };
  },
  computed: {
    showSlipage() {
      return true;
    },
  },
  methods: {
    closeSettings() {
      this.$emit("closeSettings");
    },
    updateSlipage(newVal) {
      this.$emit("updateSlipage", newVal);
    },
    updateTxSpeed(newVal) {
      this.$emit("updateTxSpeed", newVal);
    },
  },
  components: {
    SlipageBlock,
    SpeedBlock,
  },
};
</script>

<style lang="scss" scoped>
.settings {
  padding: 30px 0;
  max-width: 466px;
  width: 100%;
  margin: 0 auto;

  &__top {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 30px;
    @media (max-width: 600px) {
      justify-content: inherit;
      align-items: inherit;
      flex-direction: column;
      margin-bottom: 10px;
    }
    &-title {
      font-size: 20px;
      line-height: 27px;
      font-weight: 400;
    }
    &-back {
      border: none;
      background: transparent;
      font-weight: 600;
      font-size: 14px;
      line-height: 19px;
      text-align: right;
      color: #2bd2f7;
      cursor: pointer;
      @media (max-width: 600px) {
        margin-top: 10px;
      }
    }
  }

  &__container {
    height: 220px;
    @media (max-width: 600px) {
      height: auto;
    }
  }

  &__title {
    font-weight: 400;
    font-size: 14px;
    line-height: 19px;
    display: flex;
    align-items: center;
    &-img {
      display: block;
      margin-left: 10px;
    }
  }
  &__percent {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 20px 0 30px;
    &-custom {
      border: none;
      text-align: center;
      outline: none;
      width: 50px;
      padding-left: 5px;
      padding-right: 5px;
      font-size: 16px;
      color: #fff;
      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
    }
    @media (max-width: 600px) {
      justify-content: inherit;
      flex-wrap: wrap;
      margin: 20px 0;
    }
    .btn-wrap {
      @media (max-width: 600px) {
        margin: 0 10px 10px 0;
      }
    }
    .btn-wrap,
    .btn {
      max-width: 110px;
      width: 100%;
      @media (max-width: 360px) {
        max-width: 100px;
      }
    }
  }

  &__speed {
    display: flex;
    margin: 20px 0 30px;
    .btn-wrap {
      margin-right: 10px;
      @media (max-width: 600px) {
        margin: 0 10px 10px 0;
      }
    }
    .btn-wrap,
    .btn {
      max-width: 110px;
      width: 100%;
      @media (max-width: 360px) {
        max-width: 100px;
      }
    }
  }

  &__message {
    margin: 10px auto 20px;
    padding: 20px 10px;
    background: #373f40;
    border-radius: 12px;
    &-text {
      text-align: center;
      font-weight: 300;
      font-size: 14px;
      line-height: 19px;
      margin-bottom: 10px;
      letter-spacing: 0.02em;
    }
  }
}
</style>
