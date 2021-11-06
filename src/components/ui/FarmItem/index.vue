<template>
  <div class="wrapper">
    <div class="wrapper-info">
      <div class="wrapper-icon">
        <TokenIcon :big="true" :imageName="pool.poolIcon" />
        <p class="name">
          {{ pool.name }} <br />
          <span>{{ pool.nameSubtitle }}</span>
        </p>
      </div>
      <div class="info">
        <div class="info-item">
          <p class="info-title">Yield Per $1000</p>
          <p>{{ pool.poolYield }}</p>
          <p><span>ICE/day</span></p>
        </div>
        <div class="info-item">
          <p class="info-title">ROI</p>
          <p v-if="roiDaily">{{ roiDaily }}% <span> Daily </span></p>
          <p v-if="roiWeekly">{{ roiWeekly }}% <span> Weekly </span></p>
          <p>{{ pool.poolRoi }}% <span> Annually </span></p>
        </div>
        <div class="info-item">
          <p class="info-title">TVL</p>
          <p>${{ pool.poolTvl }}</p>
        </div>
      </div>
      <div class="info-mobile">
        <div class="info-item">
          <p class="info-title">Yield Per $1000</p>
          <p>{{ pool.poolYield }} <span>Ice/day</span></p>
          <p>TVL ${{ pool.poolTvl }}</p>
        </div>
      </div>
    </div>
    <div class="wrapper-btns">
      <span class="btn-wrap width-100" @click="openStakePopup">
        <span class="btn width-100">Stake</span>
      </span>
      <span class="btn-wrap width-100" @click="openUnstakePopup">
        <span class="btn width-100">Unstake</span>
      </span>
    </div>
    <div class="cxt-menu-wrapper" v-click-outside="closeCtxMenu">
      <div class="cxt-menu-inner" @click.stop>
        <div class="icon-wrap" @click="setCtxMenu(true)">
          <img src="@/assets/images/cxt.svg" alt="" />
        </div>

        <div class="cxt-menu" v-if="isCxtMenu">
          <div>
            <a :href="pool.stakingTokenLink" target="_blank">Get LP`s</a>
          </div>
        </div>
      </div>
    </div>
    <div
      class="farm-status"
      :class="{ discontinued: !isFarmActive }"
      v-tooltip.bottom="statusText"
    ></div>
  </div>
</template>

<script>
const TokenIcon = () => import("@/components/ui/TokenIcon");
import { mapMutations } from "vuex";

export default {
  props: {
    pool: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      isCxtMenu: false,
    };
  },

  computed: {
    isFarmActive() {
      return +this.pool.poolRoi > 0;
    },
    statusText() {
      if (this.isFarmActive) return "Active Farm";
      return "Unactive Farm";
    },
    roiWeekly() {
      if (this.pool?.poolRoi)
        return parseFloat(+this.pool?.poolRoi / 12).toFixed(2);

      return false;
    },
    roiDaily() {
      if (this.roiWeekly) return parseFloat(+this.roiWeekly / 7).toFixed(2);

      return false;
    },
  },

  methods: {
    ...mapMutations({ openModal: "setModalState" }),
    closeCtxMenu() {
      this.isCxtMenu = false;
    },
    setCtxMenu(state) {
      this.isCxtMenu = state;
    },
    openStakePopup() {
      this.openModal({
        isShow: true,
        type: "farm-stake",
        data: this.pool.id,
      });
    },
    openUnstakePopup() {
      this.openModal({
        isShow: true,
        type: "farm-unstake",
        data: this.pool.id,
      });
    },
  },

  components: { TokenIcon },
};
</script>

<style lang="scss" scoped>
.wrapper {
  padding: 16px 24px 16px 20px;
  width: 100%;
  background: $clrBg1;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  position: relative;
}

.wrapper-info {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.wrapper-icon {
  display: flex;
  align-items: center;
}

.name {
  margin-left: 10px;
  font-size: 14px;
  line-height: 1.3;
  min-width: 80px;

  span {
    color: #868686;
    line-height: 1;
    font-size: 12px;
    text-transform: inherit;
  }
}

.info {
  display: flex;
  width: 100%;
  justify-content: space-evenly;
}

.info-mobile {
  display: none;
}

.info-item {
  padding-top: 6px;
}

.info-item p {
  font-weight: bold;
  font-size: 14px;
  line-height: 19px;
  text-align: center;
}

.info-item span {
  font-weight: normal;
  color: #868686;
}

.info-title {
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  text-align: center;
  color: #868686;
  margin-bottom: 4px;
}

.wrapper-btns {
  max-width: 170px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.cxt-menu-wrapper {
  position: absolute;
  top: 24px;
  right: 10px;
  cursor: pointer;
  width: 10px;
  text-align: center;
}

.cxt-menu-inner {
  position: relative;

  .icon-wrap {
    padding: 3px;
    img {
      width: 4px;
      height: auto;
    }
  }
}

.cxt-menu {
  position: absolute;
  background: #343434;
  top: 100%;
  right: 0;
  border: 0.5px solid rgba(255, 255, 255, 0.1);
  color: white;
  border-radius: 12px;
  padding: 10px 7px;
  width: 100px;
  text-align: center;
  font-size: 14px;
  line-height: 19px;
  z-index: 1;
}

.cxt-menu a {
  transition: all 0.3s ease;

  &:hover {
    color: #2bd2f7;
    text-decoration: underline;
  }
}

.farm-status {
  width: 10px;
  height: 10px;
  background: #4aff88;
  border-radius: 50%;
  position: absolute;
  top: 20px;
  right: 20px;
  display: none;

  &.discontinued {
    background: #e32573;
  }
}

.inline {
  .wrapper {
    display: block;
    min-width: 200px;
    max-width: 216px;
    padding: 17px 20px;
  }
  .wrapper-info,
  .wrapper-icon,
  .info-mobile,
  .info,
  .farm-status {
    display: block;
  }

  .info {
    display: none;
  }

  .token-icon-wrap {
    margin: 0 auto 7px;
  }

  .name {
    margin: 0;
    text-align: center;
  }

  .info-item {
    padding: 0;
    margin-bottom: 7px;
  }

  .info-title {
    margin: 0;
  }

  .wrapper-btns {
    max-width: 100%;
  }

  .btn-wrap:not(:last-child) {
    margin-bottom: 8px;
  }

  .cxt-menu-wrapper {
    right: auto;
    left: 10px;
    top: 18px;
  }
  .cxt-menu {
    right: auto;
    left: 0;
  }
}

@media screen and (max-width: 1024px) {
  .inline {
    .wrapper {
      max-width: 32%;
    }
  }
}

@media screen and (max-width: 768px) {
  .inline {
    .wrapper {
      max-width: 48%;
    }
  }
}

@media screen and (max-width: 600px) {
  .inline {
    .wrapper {
      max-width: 100%;
    }
  }
}
</style>
