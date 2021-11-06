<template>
  <div>
    <div class="input">
      <div class="input__desc">
        <TokenIcon :imageName="token.imageName" />
        <p class="input__name">{{ token.name }}</p>
      </div>
      <button
        class="input__btn-custom"
        v-if="!disabled"
        @click="toggleCustomInput"
      ></button>

      <div class="input__inner" v-if="!disabled">
        <div class="swiper-wrapper" ref="swiper" v-if="!reset && !editInput">
          <swiper
            class="swiper"
            :options="swiperOption"
            @slideChange="changeValue"
          >
            <swiper-slide
              v-for="(step, index) in token.steapCount"
              :key="index"
            >
              <div class="swiper__slide">
                {{
                  (token.steapBalance * (index + 1)).toFixed(
                    token.decimals || 18
                  )
                }}
              </div>
            </swiper-slide>
          </swiper>
        </div>
        <div class="input__custom-wrap" v-else>
          <!-- <span class="input__plug">0.00</span> -->
          <input
            class="input__custom"
            type="text"
            @input="enterCustom"
            placeholder="0.00"
            ref="customInput"
          />
          <!-- <span class="input__plug">0.00</span> -->
        </div>
      </div>

      <div class="output" v-else>
        <div class="output__item output__disabled">{{ outputEmpty }}</div>
        <div class="output__item">
          {{ token.convertToken.toFixed(token.decimals || 18) }}
        </div>
        <div class="output__item output__disabled">{{ outputEmpty }}</div>
      </div>
    </div>
    <p class="input__error error" v-if="!disabled">{{ error }}</p>
  </div>
</template>

<script>
const TokenIcon = () => import("@/components/ui/TokenIcon");
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
export default {
  data() {
    return {
      reset: false,
      empty: 0,
      editInput: false,
      error: "",
      swiperOption: {
        direction: "vertical",
        slidesPerView: 3,
        mousewheel: true,
        centeredSlides: true,
      },
    };
  },
  watch: {
    action() {
      this.reset = true;
      this.editInput = false;
      this.$emit("changeCustomInput", "");
      setTimeout(() => {
        this.reset = false;
      });
    },
  },
  components: {
    TokenIcon,
    Swiper,
    SwiperSlide,
  },
  props: {
    token: {
      type: Object,
      default: () => {
        return {};
      },
    },
    action: {
      type: String,
      default: "Stake",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    outputEmpty() {
      return Number(0).toFixed(this.token.decimals);
    },
  },
  methods: {
    changeValue(event) {
      this.$emit("changeValue", event.realIndex + 1);
    },
    toggleCustomInput() {
      this.editInput = !this.editInput;
      this.$emit("changeCustomInput", "");
      setTimeout(() => {
        if (this.editInput) {
          this.$refs.customInput.focus();
        }
      }, 0);
    },
    enterCustom(event) {
      let custom = event.target.value;
      if (custom > +this.token.userBalance) {
        this.error = `The value cannot be greater than ${this.token.userBalance}`;
      } else {
        this.error = "";
        this.$emit("changeCustomInput", event.target.value);
      }
    },
  },
};
</script>

<style lang="scss">
.input {
  max-width: 466px;
  width: 100%;
  height: 100px;
  background: $clrBg1;
  border-radius: 12px;
  padding: 15px 20px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  position: relative;
  &__btn-custom {
    position: absolute;
    top: 0;
    right: 0;
    background: url("../../assets/images/edit.svg") center no-repeat;
    width: 26px;
    height: 26px;
    background-size: contain;
    border: transparent;
    cursor: pointer;
  }
  &__custom-wrap {
    max-width: 190px;
    width: 100%;
    text-align: center;
    font-size: 16px;
    line-height: 22px;
  }
  &__plug {
    display: block;
    width: 100%;
    color: #868686;
  }
  input[type="number"] {
    -moz-appearance: textfield;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  &__custom {
    text-align: center;
    display: block;
    margin: 5px 0;
    background: transparent;
    color: #fff;
    outline: transparent;
    border: none;
    height: 24px;
    width: 100%;
    &::placeholder {
      color: #fff;
    }
  }
  &__inner {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  &__desc {
    display: flex;
    align-items: center;
    min-width: 100px;
    position: absolute;
    top: 50%;
    left: 20px;
    transform: translateY(-50%);
    @media (max-width: 600px) {
      position: initial;
      top: initial;
      left: initial;
      transform: translateY(0);
    }
  }
  &__name {
    font-size: 16px;
    line-height: 22px;
    font-weight: 600;
    margin-left: 10px;
  }
  &__input {
    margin-left: 30px;
  }
  &__error {
    margin-top: 5px;
    height: 12px;
  }
}
.swiper-wrapper {
  height: 75px;
  .swiper-container {
    height: 75px;
  }
  .swiper-slide-prev,
  .swiper-slide-next {
    font-size: 16px;
    line-height: 22px;
    color: #868686;
  }
  .swiper-slide {
    color: #868686;
    text-align: center;
    font-size: 16px;
    line-height: 22px;
    &-active {
      color: #fff;
    }
    @media (max-width: 400px) {
      font-size: 14px;
    }
  }
}

.output {
  margin: 0 auto;
  height: 70px;
  overflow: hidden;
  &__item {
    margin-bottom: 4px;
    font-size: 16px;
    line-height: 22px;
    @media (max-width: 400px) {
      font-size: 14px;
    }
  }
  &__disabled {
    color: #868686;
  }
}
</style>
