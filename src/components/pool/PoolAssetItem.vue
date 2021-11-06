<template>
  <div class="pool-item">
    <div
      class="pool-item__inner"
      :class="{ 'pool-item__inner-active': isActive }"
      @click.stop="$emit('toggleActive')"
    >
      <div class="pool-item__container">
        <img
          class="pool-item__checked"
          :class="{ 'pool-item__checked-active': isActive }"
          src="@/assets/images/pool/checked.svg"
          alt=""
        />
        <TokenIcon :big="true" :imageName="mainImg" />
        <h4 class="pool-item__name">{{ mainSymbol }}</h4>

        <!-- <div class="pool-item__row" v-if="token.canBeDefault" @click.stop>
          <span
            class="btn-wrap border"
            :class="{ active: isActive && isDefaultActive }"
            @click="$emit('setDefaultActive', true)"
            ><span class="btn">
              <TokenIcon :small="true" :imageName="token.chainToken.icon" />
              <span class="btn-text"> {{ token.chainToken.symbol }}</span>
            </span></span
          >
          <span
            class="btn-wrap border"
            :class="{ active: isActive && !isDefaultActive }"
            @click="$emit('setDefaultActive', false)"
            ><span class="btn">
              <TokenIcon :small="true" :imageName="token.icon" />
              <span class="btn-text"> {{ token.symbol }}</span></span
            ></span
          >
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
const TokenIcon = () => import("@/components/ui/TokenIcon");
export default {
  props: {
    token: {
      type: Object,
      default: () => {},
    },
    isActive: {
      type: Boolean,
    },
    isDefaultActive: {
      type: Boolean,
    },
  },
  computed: {
    mainImg() {
      if (this.token.canBeDefault) return this.token.chainToken.icon;

      return this.token.icon;
    },
    mainSymbol() {
      if (this.token.canBeDefault) return this.token.chainToken.symbol;

      return this.token.symbol;
    },
  },
  components: { TokenIcon },
};
</script>

<style lang="scss">
.pool-item {
  width: 223px;
  height: 223px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 20px;
  position: relative;
  cursor: pointer;
  @media (max-width: 600px) {
    width: 180px;
    height: 180px;
  }
  &__inner {
    width: 205px;
    height: 205px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    &-active {
      background: linear-gradient(to right, #5ac9e5, #194eca);
    }
    @media (max-width: 600px) {
      width: 164px;
      height: 164px;
    }
  }
  &__container {
    width: 203px;
    height: 203px;
    background: #252423;
    box-shadow: 0px 0px 20px #252423;
    border-radius: 12px;
    position: relative;
    padding-top: 55px;
    display: flex;
    flex-direction: column;
    align-items: center;
    @media (max-width: 600px) {
      width: 162px;
      height: 162px;
      padding-top: 40px;
    }
  }

  &__checked {
    display: none;
    position: absolute;
    top: 10px;
    right: 10px;
    &-active {
      display: block;
    }
  }

  &__input {
    position: absolute;
    top: 0;
    right: 0;
  }

  &__name {
    margin: 10px 0 8px;
    font-weight: 600;
    font-size: 16px;
    line-height: 22px;
  }
  &__row {
    display: flex;
    width: 170px;
    justify-content: space-between;
    @media (max-width: 600px) {
      width: 140px;
    }
    .btn-wrap,
    .btn {
      width: 80px;
      height: 30px;

      @media (max-width: 600px) {
        width: 65px;
        height: 24px;
      }
    }
    .btn {
      height: 28px;
      padding: 7px 5px;
      display: flex;
      justify-content: flex-start;
      @media (max-width: 600px) {
        height: 22px;
        padding: 4px;
      }
    }
    .btn-text {
      margin-left: 5px;
      font-weight: 600;
      font-size: 12px;
      line-height: 16px;
    }
  }
}
</style>
