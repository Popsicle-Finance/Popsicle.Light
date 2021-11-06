<template>
  <div class="leverage">
    <h3 class="leverage-title">Leverage up</h3>

    <SlipageBlock
      :slipage="slipage"
      :slipageItems="slipageItems"
      :tooltipPercent="tooltipPercent"
      :title="title"
      @update="updateSlipage"
    />
    <div class="leverage-range">
      <h3 class="leverage-subtitle">
        Choose your leverage
        <img
          v-tooltip.bottom="tooltipPercent"
          class="leverage-icon"
          src="@/assets/images/pool/info.svg"
          alt="info"
        />
      </h3>
      <div class="leverage-percent">{{ formatLeverageValue }}</div>
      <div class="range-wrapper">
        <vue-range-slider
          v-model="amount"
          :max="leverageMax"
          :step="leverageStep"
          :formatter="formatRangeTooltip"
          tooltip-dir="bottom"
        ></vue-range-slider>
      </div>
    </div>
    <div class="leverage-info">
      <div class="leverage-info-row">
        <span class="leverage-info-title">Expected amount</span>
        <span class="leverage-info-value">~0.00%</span>
      </div>
      <div class="leverage-info-row">
        <span class="leverage-info-title">Expected APY</span>
        <span class="leverage-info-value">~0.09%</span>
      </div>
      <div class="leverage-info-row">
        <span class="leverage-info-title">Expected leverage</span>
        <span class="leverage-info-value">~0.0x</span>
      </div>
      <div class="leverage-info-row">
        <span class="leverage-info-title">Expected liquidation price</span>
        <span class="leverage-info-value">~$0.0</span>
      </div>
    </div>
    <div class="btn-wrap border width-100">
      <button class="btn width-100">Confirm</button>
    </div>
  </div>
</template>

<script>
const SlipageBlock = () => import("@/components/pool/SlippageBlock");
import "vue-range-component/dist/vue-range-slider.css";
import VueRangeSlider from "vue-range-component";

export default {
  data() {
    return {
      amount: 0.0,
      rangeType: "leverageUp",
      leverageUpMax: 10,
      stepLeverageDown: 0.0001,
      stepLeverageUp: 1,
      slipage: 1,
      title: "Slippage tolerance",
      slipageItems: [0.5, 1, 2, 3],
      tooltipPercent:
        "Your Transaction will revert if the price changes unfavourably by more than this percentage",
    };
  },

  computed: {
    leverageMax() {
      if (this.rangeType === "leverageUp") {
        return this.leverageUpMax;
      } else {
        return Number((+"20.122356457889451256").toFixed(4));
      }
    },

    leverageStep() {
      if (this.rangeType === "leverageUp") {
        return this.stepLeverageUp;
      } else {
        return this.stepLeverageDown;
      }
    },

    formatLeverageValue() {
      return this.rangeType === "leverageUp" ? `${this.amount}x` : this.amount;
    },
  },

  methods: {
    updateSlipage(newVal) {
      this.slipage = newVal;
    },

    formatRangeTooltip(value) {
      return this.rangeType === "leverageUp" ? `${value}x` : value;
    },

    toggleRange() {
      this.amount = 0;
      if (this.rangeType === "leverageUp") {
        this.rangeType = "leverageDown";
      } else {
        this.rangeType = "leverageUp";
      }
    },
  },

  components: {
    SlipageBlock,
    VueRangeSlider,
  },
};
</script>

<style lang="scss">
.leverage {
  max-width: 466px;
  width: 100%;
  margin: 0 auto;
  padding: 25px 0 30px;
}

.leverage-title {
  font-weight: normal;
  font-size: 20px;
  line-height: 27px;
  margin-bottom: 23px;
}

.leverage-range {
  margin-bottom: 20px;
}

.leverage-subtitle {
  font-weight: 400;
  font-size: 14px;
  line-height: 19px;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.leverage-icon {
  display: block;
  margin-left: 10px;
}

.leverage-percent {
  width: 100%;
  text-align: end;
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 1.7px;
}

.leverage-info {
  padding: 20px 10px;
  margin-bottom: 20px;
  background: linear-gradient(
    180deg,
    rgba(145, 255, 232, 0.1) 0%,
    rgba(164, 222, 255, 0.1) 96.16%
  );
  border-radius: 8px;
}

.leverage-info-row {
  display: flex;
  justify-content: space-between;
  font-weight: 300;
  font-size: 14px;
  line-height: 19px;
  letter-spacing: 0.02em;
}

.leverage-info-row:not(:last-child) {
  margin-bottom: 10px;
}

// Range slider
.range-wrapper {
  .vue-range-slider.slider-component {
    padding: 13px 0 !important;
  }

  .vue-range-slider.slider-component .slider {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(100px);
    height: 8px !important;
  }

  .vue-range-slider.slider-component.slider-horizontal .slider-process {
    background: rgb(90, 201, 229);
    background: linear-gradient(
      90deg,
      rgba(90, 201, 229, 1) 0%,
      rgba(25, 78, 202, 1) 100%
    );
  }

  .vue-range-slider.slider-component .slider .slider-dot {
    background: linear-gradient(
      113.01deg,
      rgba(90, 201, 229, 0.2) 7.66%,
      rgba(25, 78, 202, 0.2) 105.32%
    );
    width: 26px !important;
    height: 26px !important;
    top: -9px !important;
    &::after {
      content: "";
      width: 16px;
      height: 16px;
      background: linear-gradient(113.01deg, #5ac9e5 7.66%, #194eca 105.32%);
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      border-radius: 50%;
    }
  }

  .vue-range-slider.slider-component .slider-tooltip-wrap .slider-tooltip {
    background: none;
    border: none;
    font-weight: 600;
    font-size: 12px;
    line-height: 16px;
    &::before {
      content: none !important;
    }
  }

  .vue-range-slider.slider-component
    .slider-tooltip-wrap.slider-tooltip-bottom {
    bottom: 0;
  }
}
</style>
