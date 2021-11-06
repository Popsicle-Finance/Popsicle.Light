<template>
  <div class="speed-block">
    <h3 class="settings__title">
      <span class="settings__title-text">Transaction speed</span>
      <img
        v-tooltip.bottom="tooltipSpead"
        class="settings__title-img"
        src="@/assets/images/pool/info.svg"
        alt="info"
      />
    </h3>
    <div class="settings__speed">
      <div class="btn-wrap border" :class="{ active: txSpeed === 0.8 }">
        <span class="btn" @click="updateTxSpeed(0.8)">Slow</span>
      </div>
      <div class="btn-wrap border" :class="{ active: txSpeed === 1 }">
        <span class="btn" @click="updateTxSpeed(1)">Medium</span>
      </div>
      <div class="btn-wrap border" :class="{ active: txSpeed === 1.25 }">
        <span class="btn" @click="updateTxSpeed(1.25)">Fast</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    txSpeed: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      tooltipSpead: "The higher the gas fees, the faster the transaction",
    };
  },
  methods: {
    updateTxSpeed(newVal) {
      this.$emit("update", newVal);
    },
  },
};
</script>

<style lang="scss" scoped>
.speed-block {
  .settings {
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
  }
}
</style>
