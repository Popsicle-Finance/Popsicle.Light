<template>
  <div class="pool">
    <button class="pool__back" @click="back">
      <img class="pool__back-img" src="@/assets/images/back.svg" alt="back" />
      Back to pools
    </button>

    <!-- <div class="pool__container">
      <PoolTabs :poolVersion="version" />
      <PoolAssets @nextPool="nextPool" v-if="chosePoolV3" />
      <PoolV2
        @openSettings="toggleSettings"
        v-if="!setting && chosePoolV2"
        :mainToken="mainToken"
        :fromToken="fromToken"
      />
      <PoolSetting @closeSettings="toggleSettings" v-if="setting" />
    </div> -->
  </div>
</template>

<script>
// const PoolTabs = () => import("@/components/pool/PoolTabs");
// const PoolAssets = () => import("@/components/pool/PoolAssets");
// const PoolV2 = () => import("@/components/pool/PoolV2");
// const PoolSetting = () => import("@/components/pool/PoolSetting");

export default {
  data() {
    return {
      setting: false,
      version: null,
    };
  },
  props: {
    mainToken: {
      type: Object,
      default: () => {},
    },
    fromToken: {
      type: Object,
      default: () => {},
    },
    poolVersion: {
      type: String,
      default: "v3",
    },
  },
  computed: {
    chosePoolV3() {
      return this.poolVersion === "v3";
    },
    chosePoolV2() {
      return this.poolVersion === "v2";
    },
  },
  methods: {
    toggleSettings() {
      this.setting = !this.setting;
    },
    back() {
      this.$router.go(-1);
    },
    nextPool() {
      this.poolVersion = "v2";
    },
  },
  mounted() {
    this.version = this.poolVersion;
  },
  // components: {
  //   PoolTabs,
  //   PoolAssets,
  //   PoolV2,
  //   PoolSetting,
  // },
};
</script>

<style lang="scss" scoped>
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
    min-height: 605px;
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
