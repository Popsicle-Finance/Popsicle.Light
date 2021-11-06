<template>
  <div class="pool-v3">
    <h3 class="pool-v3__title">Select Assets to Deposit</h3>
    <div class="pool-v3__container">
      <PoolAssetItem
        :token="token0"
        :isActive="isToken0Choosen"
        :isDefaultActive="isDefaultChoosen"
        @toggleActive="toggleToken0"
        @setDefaultActive="setDefaultActive"
      />
      <PoolAssetItem
        :token="token1"
        :isActive="isToken1Choosen"
        :isDefaultActive="isDefaultChoosen"
        @toggleActive="toggleToken1"
        @setDefaultActive="setDefaultActive"
      />
    </div>
    <div class="btn-wrap border width-100">
      <button class="btn width-100" @click="nextSteap">
        Join proportionally
      </button>
    </div>
  </div>
</template>

<script>
const PoolAssetItem = () => import("@/components/pool/PoolAssetItem");
export default {
  props: {
    token0: {
      type: Object,
      required: true,
    },
    token1: {
      type: Object,
      required: true,
    },
    chainToken: {
      type: Object,
    },
  },
  data() {
    return {
      isToken0Choosen: false,
      isToken1Choosen: false,
      isDefaultChoosen: false,
    };
  },
  components: { PoolAssetItem },
  methods: {
    setDefaultActive(isActive) {
      this.isDefaultChoosen = isActive;
    },
    toggleToken0() {
      this.isToken0Choosen = !this.isToken0Choosen;
    },
    toggleToken1() {
      this.isToken1Choosen = !this.isToken1Choosen;
    },
    nextSteap() {
      this.$emit("nextPool");
    },
  },
};
</script>

<style lang="scss" scoped>
.pool-v3 {
  padding: 30px 0;
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
    margin-bottom: 140px;
    @media (max-width: 600px) {
      flex-direction: column;
      align-items: center;
      margin-bottom: 20px;
      .pool-item:nth-child(1) {
        margin-bottom: 20px;
      }
    }
  }
}
</style>
