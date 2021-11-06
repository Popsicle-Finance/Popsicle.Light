<template>
  <div class="position-pool">
    <span
      class="status-active"
      v-if="+pool.poolRoi"
      v-tooltip.bottom="'Active Farm'"
    ></span>
    <span class="status-discontinued" v-else></span>

    <div class="wrapper" :class="{ 'wrapper-info': isMoreInfo }">
      <div class="pool">
        <TokenIcon :big="true" :imageName="pool.poolIcon" />
        <div>
          <div class="pool-name">{{ pool.name }}</div>
        </div>
        <div class="pool-info">
          <div class="pool-title">ROI Annually</div>
          <div class="pool-value">{{ pool.poolRoi }}%</div>
        </div>
        <div class="pool-info">
          <div class="pool-title">Your LP Value</div>
          <div class="pool-value">
            ${{ parseFloat(+pool.positionBalance * +pool.lpPrice).toFixed(2) }}
          </div>
        </div>
        <div class="pool-info pool-status">
          <div class="pool-title">Status</div>
          <div class="pool-value">
            <span class="pool-active" v-if="+pool.poolRoi"></span>
            <span class="pool-discontinued" v-else></span>
            {{ statusText }}
          </div>
        </div>
      </div>
      <div class="buttons">
        <span class="btn-wrap border" @click="harvestHandler">
          <span class="btn">Harvest</span>
        </span>
        <span class="btn-wrap border" @click="openUnstakePopup">
          <span class="btn">Unstake</span>
        </span>
      </div>
    </div>

    <div class="info-wrapper">
      <transition name="fadeHeight">
        <div class="info" v-if="isInfoOpen">
          <ul class="info-list">
            <li class="info-item">
              <span class="info-title">TVL</span>
              <span class="info-value">${{ pool.poolTvl }}</span>
            </li>
            <li class="info-item">
              <span class="info-title">Yield Per $1000</span>
              <span class="info-value">{{ pool.poolYield }} ICE/day</span>
            </li>
            <li class="info-item">
              <span class="info-title">Reward</span>
              <span class="info-value"
                >${{
                  parseFloat(+pool.parsedReward * +pool.tokenPrice).toFixed(2)
                }}
                ({{ parseFloat(+pool.parsedReward).toFixed(4) }})</span
              >
            </li>
            <li class="info-item">
              <span class="info-title">
                <a :href="pool.stakingTokenLink" target="_blank">Get LP`s</a>
              </span>
            </li>
          </ul>
        </div>
      </transition>
      <button class="info-btn" @click="toggleInfo">
        More info
        <img
          class="info-arrow"
          :class="{ 'info-arrow-open': isInfoOpen }"
          src="@/assets/images/arrow-down.svg"
          alt=""
        />
      </button>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
const Button = () => import("@/components/ui/Button");
const TokenIcon = () => import("@/components/ui/TokenIcon");

export default {
  props: {
    pool: {
      type: Object,
    },
  },

  data() {
    return {
      isMoreInfo: true,
      isInfoOpen: false,
    };
  },

  computed: {
    statusText() {
      if (this.pool.isDiscontinued) return "Discontinued";
      return "Active";
    },

    itsMobile() {
      return window.innerWidth < 800;
    },
  },

  methods: {
    ...mapMutations({ openModal: "setModalState" }),

    createNotification(msg) {
      const id = this.$store.getters.getNotificationId;

      const notification = { id, msg };

      this.$store.commit("addNotification", notification);

      return id;
    },

    openUnstakePopup() {
      this.openModal({
        isShow: true,
        type: "farm-unstake",
        data: this.pool.id,
      });
    },

    toggleInfo() {
      this.isInfoOpen = !this.isInfoOpen;
    },

    async harvestHandler() {
      const notifyId = this.createNotification("Harvest in progress");
      try {
        const contract = this.pool.contractInstance;
        const poolId = this.pool.poolId;

        await contract.withdraw(poolId, "0");
        this.$store.commit("deleteNotification", notifyId);
      } catch (e) {
        this.$store.commit("deleteNotification", notifyId);
        console.log("stake err", e);
      }
    },
  },

  components: {
    TokenIcon,
    Button,
  },
};
</script>

<style lang="scss" scoped>
.position-pool {
  width: 100%;
  background: #252423;
  box-shadow: 0px 0px 5px rgba(25, 78, 202, 0.4);
  border-radius: 12px;
  margin-bottom: 10px;
  position: relative;
}

.status-active,
.status-discontinued {
  display: none;
  width: 10px;
  height: 10px;
  position: absolute;
  top: 10px;
  left: 10px;
  border-radius: 50%;
}

.status-active {
  background: #4aff88;
}

.status-discontinued {
  background: #e32573;
}

.wrapper {
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  padding: 10px 20px;
  min-height: 110px;
}

.wrapper-info {
  min-height: 110px;
  padding: 10px 20px;
}

.pool {
  max-width: 710px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pool-name {
  font-weight: 400;
  font-size: 14px;
  line-height: 21px;
  min-width: 80px;
  text-align: center;
}

.pool-arp {
  display: none;
}

.pool-info {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: 12px;
  max-width: 170px;
  width: 100%;
  height: 65px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-weight: 600;
  text-align: center;
}

.pool-title {
  font-size: 12px;
  line-height: 16px;
  color: #868686;
}

.pool-value {
  font-size: 14px;
  line-height: 18px;
  position: relative;
}

.pool-active,
.pool-discontinued {
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  top: 50%;
  transform: translateY(-50%);
  left: -15px;
}

.pool-active {
  background: #4aff88;
}

.pool-discontinued {
  background: #e32573;
}

.buttons {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-left: 20px;

  .btn-wrap {
    min-width: 120px;
    margin: 5px 0;
  }
  .btn {
    max-width: 125px;
    min-width: 105px;
    width: 100%;
    padding: 0 10px;
  }
}

.info-wrapper {
  padding-bottom: 10px;
  padding-left: 25px;
}

a {
  transition: all 0.3s ease;

  &:hover {
    color: #2bd2f7;
    text-decoration: underline;
  }
}

.info {
  max-width: 540px;
  width: 100%;
  height: 115px;
  background: red;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  margin-bottom: 10px;
  padding: 10px;
}

.info-item {
  line-height: 16px;
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.info-item:not(:last-child) {
  margin-bottom: 10px;
}

.info-title {
  font-weight: 600;
  font-size: 12px;
  color: #868686;
}

.info-value {
  font-weight: 600;
  font-size: 14px;
}

.info-btn {
  display: block;
  margin: 0 auto;
  background: transparent;
  outline: none;
  border: none;
  color: $clrWhite;
  font-weight: 600;
  font-size: 14px;
  line-height: 19px;
  cursor: pointer;
}

.info-arrow {
  width: 13px;
  height: 7px;
  margin-left: 4px;
  transition: all 0.5s;
}

.info-arrow-open {
  transform: rotate(180deg);
}

// style column card
.column {
  .position-pool {
    flex-direction: column;
    height: auto;
    max-width: 24%;
    min-width: 160px;
    padding: 18px 20px;
    position: relative;
  }

  .status-active,
  .status-discontinued {
    display: block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    position: absolute;
    top: 20px;
    transform: translateY(-50%);
    right: 20px;
  }

  .status-active {
    background: #4aff88;
  }

  .status-discontinued {
    background: #e32573;
  }

  .wrapper {
    flex-direction: column;
  }

  .wrapper-info {
    min-height: 110px;
    padding: 0;
  }

  .pool {
    flex-direction: column;
    margin-bottom: 8px;
  }

  .pool-name {
    margin-top: 8px;
  }

  .pool-info {
    background: none;
    height: auto;
    padding: 0;
    flex-direction: row;
    width: auto;
  }

  .pool-title {
    color: inherit;
    margin-right: 5px;
  }

  .pool-status {
    display: none;
  }

  .buttons {
    align-items: center;
    height: 90px;
    margin-left: 0;
  }

  .btn-wrap,
  .btn {
    max-width: 175px;
    width: 100%;
  }

  .info-wrapper {
    display: none;
  }
}

@media (max-width: 1024px) {
  .status-active,
  .status-discontinued {
    display: block;
  }

  .pool {
    justify-content: flex-start;
    gap: 2%;
  }

  .pool-info {
    max-width: 140px;
    padding: 15px 10px;
  }

  .pool-value {
    font-size: 12px;
  }

  .info-wrapper {
    padding-left: 0;
  }

  .column {
    .position-pool {
      max-width: 32%;
    }
  }
}

@media (max-width: 768px) {
  .position-pool {
    padding: 10px;
  }

  .pool {
    gap: 2%;
    .token-icon-wrap.big {
      min-width: 50px;
      min-height: 50px;
      height: 50px;
      width: 50px;
    }
  }

  .pool-name {
    font-size: 12px;
    min-width: 60px;
  }

  .column {
    .position-pool {
      max-width: 49%;
    }
  }
}

@media (max-width: 600px) {
  .pool-arp {
    display: block;
    font-size: 12px;
    font-weight: bold;
  }

  .pool-info {
    // display: none;
  }

  .column {
    .position-pool {
      max-width: 48%;
    }
  }
}

@media (max-width: 440px) {
  .column {
    .position-pool {
      max-width: 100%;
    }
  }
}
</style>
