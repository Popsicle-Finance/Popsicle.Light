<template>
  <div class="slipage-block">
    <h3 class="settings__title">
      <span class="settings__title-text">{{ title }}</span>
      <img
        v-tooltip.bottom="tooltipPercent"
        class="settings__title-img"
        src="@/assets/images/pool/info.svg"
        alt="info"
      />
    </h3>
    <div class="settings__percent">
      <div
        class="btn-wrap border"
        :class="{
          active: slipage === item,
          'btn-small': slipageItems.length > 3,
        }"
        v-for="(item, idx) in slipageItems"
        :key="idx"
        @click="setSlipageHandler(item)"
      >
        <p class="btn">{{ item }}%</p>
      </div>
      <label
        class="btn-wrap border"
        :class="{ active: slipage === +customValue }"
      >
        <span class="btn" v-show="!isCustom" @click="setCustomState(true)">
          {{ customValue ? `${customValue}%` : "custom" }}
        </span>
        <input
          class="settings__percent-custom btn"
          type="number"
          v-show="isCustom"
          placeholder="X%"
          @input="setCustomValue($event.target.value)"
        />
      </label>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    slipage: {
      type: Number,
      required: true,
    },
    slipageItems: {
      type: Array,
      required: true,
    },
    tooltipPercent: {
      type: String,
    },
    title: {
      type: String,
    },
  },
  data() {
    return {
      customValue: null,
      isCustom: false,
    };
  },
  methods: {
    setSlipageHandler(item) {
      this.setCustomState(false);
      this.customValue = null;
      this.setSlipage(item);
    },
    setSlipage(item) {
      this.$emit("update", item);
    },
    setCustomState(bool) {
      this.isCustom = bool;
    },
    setCustomValue(value) {
      console.log("WORk", value);
      if (value < 0 || value > 100) {
        this.setSlipage(1);
        this.customValue = null;
        this.setCustomState(false);
        return false;
      }
      this.customValue = value;
      if (value && value > 0 && value <= 100) this.setSlipage(+value);
    },
  },
};
</script>

<style lang="scss" scoped>
.slipage-block {
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
  }
  .btn-small {
    max-width: 77px !important;
  }
}
</style>
