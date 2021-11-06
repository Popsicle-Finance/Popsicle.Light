<template>
  <div class="token-icon-wrap" :class="{ big, middle, small }">
    <img v-if="tokenIcon" :src="tokenIcon" alt="" class="token-icon" />
  </div>
</template>

<script>
export default {
  props: {
    imageName: {
      type: String,
    },
    big: {
      type: Boolean,
      default: false,
    },
    middle: {
      type: Boolean,
      default: false,
    },
    small: {
      type: Boolean,
      default: false,
    },

    itsImgURL: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    tokenIcon() {
      try {
        if (this.itsImgURL) return this.imageName;

        const tokenImg = require(`@/assets/images/tokens/${this.imageName}`);

        return tokenImg;
      } catch (e) {
        console.log("tokenIcon err:", e);

        return require(`@/assets/images/tokens/Token_ice.svg`);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.token-icon-wrap {
  width: 40px;
  height: 40px;
  min-width: 40px;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #2c2c2c;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 9px;

  img {
    max-width: 100%;
    max-height: 100%;
    height: auto;
  }

  &.big {
    width: 60px;
    height: 60px;
    min-width: 60px;
    min-height: 60px;
    @media (max-width: 600px) {
      width: 48px;
      height: 48px;
      min-width: 48px;
      min-height: 48px;
    }
  }
  &.middle {
    width: 46px;
    height: 46px;
    min-width: 46px;
    min-height: 46px;
  }
  &.small {
    width: 16px;
    height: 16px;
    min-width: 16px;
    min-height: 16px;
    background: transparent;
    border: none;
    border-radius: 0;
    padding: 0;
    @media (max-width: 600px) {
      width: 12px;
      height: 12px;
      min-width: 12px;
      min-height: 12px;
    }
  }
}
</style>
