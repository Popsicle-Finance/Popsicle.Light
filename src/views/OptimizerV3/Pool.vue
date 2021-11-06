<template>
  <div class="pool">
    <button class="pool__back" @click="back">
      <img class="pool__back-img" src="@/assets/images/back.svg" alt="back" />
      Back to pools
    </button>

    <div class="pool__container" v-if="pool">
      <div class="pool-tabs">
        <div
          class="pool-tabs__item btn-wrap"
          :class="{ active: activeStep === 1 }"
          @click="setStep(1)"
        >
          <p class="btn">1 Select</p>
        </div>
        <div
          class="pool-tabs__item btn-wrap"
          :class="{ active: activeStep === 2, disabled: disabledSecondStepTab }"
          @click="setStep(2)"
        >
          <p class="btn">2 Join</p>
        </div>
        <div
          class="pool-tabs__item btn-wrap"
          :class="{ active: activeStep === 3, disabled: isTokensListLoading }"
          @click="setStep(3)"
        >
          <p class="btn">Zap</p>
        </div>
        <!-- <div
          class="pool-tabs__item btn-wrap"
          :class="{ active: activeStep === 4 }"
          @click="setStep(4)"
        >
          <p class="btn">Leverage</p>
        </div> -->
      </div>

      <transition name="fade" mode="out-in">
        <template v-if="activeStep === 1">
          <div class="pool-assets-block">
            <h3 class="pool-assets-block__title">Select Assets to Deposit</h3>
            <div class="pool-assets-block__container">
              <PoolAssetItem
                :token="pool.token0"
                :isActive="isToken0Choosen"
                :isDefaultActive="isDefaultChoosen"
                @toggleActive="toggleToken0"
                @setDefaultActive="setDefaultActive"
              />
              <PoolAssetItem
                :token="pool.token1"
                :isActive="isToken1Choosen"
                :isDefaultActive="isDefaultChoosen"
                @toggleActive="toggleToken1"
                @setDefaultActive="setDefaultActive"
              />
            </div>

            <div class="zapin-btn">
              <div class="btn-wrap" @click="setStep(3)">
                <p class="btn">
                  <Loading v-if="isTokensListLoading" />
                  <template v-else>Use Other Tokens</template>
                </p>
              </div>
            </div>

            <div
              class="btn-wrap border width-100 next-btn"
              :class="{ disabled: disabledSecondStepTab }"
            >
              <button class="btn width-100" @click="toJoinFormHandler">
                Next
              </button>
            </div>
          </div>
          <!-- <PoolAssets
          :token0="pool.token0"
          :token1="pool.token1"
          :chainToken="pool.chainToken"
        /> -->
        </template>
        <template v-if="activeStep === 2">
          <PoolForm
            :pool="pool"
            :isToken0Choosen="isToken0Choosen"
            :isToken1Choosen="isToken1Choosen"
            :isDefaultChoosen="isDefaultChoosen"
            @updateDefault="setDefaultActive"
            @changeTab="setStep"
          />
        </template>
        <template v-if="activeStep === 3">
          <PoolZapin :pool="pool" :tokensList="tokensList" />
        </template>
        <template v-if="activeStep === 4">
          <PoolLeverage />
        </template>
      </transition>
    </div>
  </div>
</template>

<script>
const PoolAssetItem = () => import("@/components/pool/PoolAssetItem");
const PoolTabs = () => import("@/components/pool/PoolTabs");
// const PoolAssets = () => import("@/components/pool/PoolAssets");
const PoolForm = () => import("@/components/pool/PoolForm");
const PoolSetting = () => import("@/components/pool/PoolSetting");
const PoolLeverage = () => import("@/components/pool/PoolLeverage");
const PoolZapin = () => import("@/components/pool/PoolZapin");
import tokensListMixin from "@/mixins/tokensList";
import sorbetto from "@/mixins/sorbetto";
import fragolaUserInfo from "@/mixins/fragola/fragolaUserInfo";

export default {
  mixins: [sorbetto, tokensListMixin, fragolaUserInfo],
  data() {
    return {
      activeStep: 1,
      isToken0Choosen: false,
      isToken1Choosen: false,
      isDefaultChoosen: false,
    };
  },
  computed: {
    chain() {
      return this.$store.getters.getChain;
    },

    pool() {
      const poolId = this.$route.params.id;
      return this.$store.getters.getSorbettoPoolById(poolId);
    },
    disabledSecondStepTab() {
      if (this.isToken0Choosen || this.isToken1Choosen) return false;
      return true;
    },
    account() {
      return this.$store.getters.getWallet.address;
    },
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    setDefaultActive(isActive) {
      this.isDefaultChoosen = isActive;
    },
    toggleToken0() {
      this.isToken0Choosen = !this.isToken0Choosen;
    },
    toggleToken1() {
      this.isToken1Choosen = !this.isToken1Choosen;
    },
    toJoinFormHandler() {
      if (this.isToken0Choosen || this.isToken1Choosen) this.activeStep = 2;
    },
    setStep(step) {
      if (this.isTokensListLoading && tab === 3) {
        return false;
      }

      this.activeStep = step;
    },
  },
  async created() {
    const isConnected = this.$store.getters.getWallet.address;

    if (!isConnected) {
      this.$router.push({ name: "OptimizerV3" });
      alert("Connect wallet first");
      return false;
    }

    const poolId = this.$route.params.id;
    console.log("THIS IS - POOL ID: ", poolId);
    const poolItem = this.$store.getters.getSorbettoPoolById(poolId);

    if (!poolItem) {
      this.$router.push({ name: "OptimizerV3" });
      console.log("POOL IS UNDEFINED");
      return false;
    }

    if (this.pool.token0.canBeDefault) this.isDefaultChoosen = true;
    if (this.pool.token1.canBeDefault) this.isDefaultChoosen = true;

    this.createUserTokenList(this.account);

    this.updateSorbettoInterval = setInterval(async () => {
      await this.createSorbetto();
    }, 5000);

    console.log("POOL:", poolItem);
  },
  beforeDestroy() {
    clearInterval(this.updateSorbettoInterval);
  },
  components: {
    PoolTabs,
    // PoolAssets,
    PoolForm,
    PoolAssetItem,
    PoolSetting,
    PoolLeverage,
    PoolZapin,
  },
};
</script>

<style lang="scss" scoped>
.zapin-btn {
  margin: 10px 0;
  max-width: 466px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 20px;
  padding: 10px;

  .btn-wrap {
    margin: 0;
    width: 100%;

    .btn {
      width: 100%;
      height: 60px;
      background: #252423;
      text-align: center;

      @media (max-width: 600px) {
        height: 50px;
      }
    }
  }
}

.pool-assets-block {
  padding: 30px 0;
  padding-bottom: 60px;
  max-width: 466px;
  width: 100%;
  margin: 0 auto;
  @media (max-width: 600px) {
    padding: 20px 0;
  }
  &__title {
    font-size: 20px;
    line-height: 27px;
    font-weight: 400;
    margin-bottom: 40px;
    @media (max-width: 600px) {
      margin-bottom: 20px;
    }
  }
  &__container {
    display: flex;
    justify-content: space-between;
    @media (max-width: 600px) {
      flex-direction: column;
      align-items: center;
      margin-bottom: 20px;
      .pool-item:nth-child(1) {
        margin-bottom: 20px;
      }
    }
  }

  .next-btn {
    margin-top: 10px;
  }
}

.pool-tabs {
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;

  .btn-wrap {
    width: 150px;
    margin: 5px;
  }

  .btn {
    width: 100%;
    text-align: center;
    font-size: 14px;
    line-height: 19px;
    font-weight: 400;
    background: #303030;
    padding: 10px 0;
  }
}

.pool {
  margin: 0 auto 100px;
  &__back {
    background: transparent;
    border: none;
    color: #fff;
    cursor: pointer;
    font-size: 16px;
    line-height: 22px;
    max-width: 710px;
    width: 100%;
    display: block;
    margin: 30px auto;
    text-align: left;
    &-img {
      margin-right: 10px;
      height: 14px;
      width: 7px;
    }
  }
  &__container {
    background: $clrBg2;
    padding: 0 20px;
    max-width: 710px;
    width: 100%;
    border-radius: 12px;
    position: relative;
    margin: 0 auto;
    @media (max-width: 600px) {
      padding: 0 10px;
    }
  }
}
</style>
