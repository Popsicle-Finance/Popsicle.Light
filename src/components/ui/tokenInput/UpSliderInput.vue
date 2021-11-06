<template>
  <div>
    <div class="input">
      <div
        class="input__desc"
        :class="{ clickable: isChooseToken }"
        @click="chooseToken"
      >
        <TokenIcon :imageName="imageName" :itsImgURL="itsImgURL" />
        <p class="input__name">{{ name }}</p>
        <img
          class="input__arrow"
          v-if="isChooseToken"
          @click="chooseToken"
          src="@/assets/images/arrow-down.svg"
          alt=""
        />
      </div>
      <button
        class="input__btn-custom "
        :class="{ 'custom-hover': editInput }"
        @click="toggleCustomInput"
        v-if="itsMobile"
      >
        <img src="@/assets/images/edit.svg" alt="" />
      </button>

      <div class="input__inner">
        <button class="input__max" @click="getMaxBalance">
          Max
        </button>
        <div
          class="swiper-container"
          :id="name"
          :ref="`${name}-container`"
          v-show="!reset && !editInput"
          @slideChange="changeSlide"
        >
          <div class="swiper-wrapper">
            <div
              class="swiper-slide"
              v-for="(slide, index) in slideArray"
              :key="index"
            >
              {{ slide }}
            </div>
          </div>
        </div>
        <div class="input__custom-wrap" v-show="reset || editInput">
          <input
            class="input__custom"
            type="number"
            :value="parentValue"
            @input="enterCustomInput"
            placeholder="0.00"
            ref="customInput"
          />
        </div>
      </div>
    </div>
    <p class="input__error error">{{ error }}</p>
  </div>
</template>

<script>
const TokenIcon = () => import("@/components/ui/TokenIcon");
import Swiper from "swiper";

export default {
  props: {
    name: {
      type: String,
    },

    itsImgURL: {
      type: Boolean,
      default: false,
    },

    imageName: {
      type: String,
    },

    decimals: {
      type: Number,
      default: 18,
    },

    userBalance: {
      require: true,
    },

    error: {
      type: String,
      default: "",
    },

    update: {
      type: Boolean,
      default: false,
    },

    isChooseToken: {
      type: Boolean,
      default: false,
    },

    parentValue: {},
  },

  data() {
    return {
      swiper: null,
      // Цена одного слайда
      steapUserBalance: null,
      // Количество слайдов
      slidesCount: null,
      // Процент цены одного слайда
      percent: 0.05,
      slideArray: [],
      reset: false,
      editInput: true,
      swiperOption: {
        direction: "vertical",
        slidesPerView: 3,
        mousewheel: true,
        centeredSlides: true,
        id: this.name,
      },

      customAmount: "",
      itsMobile: false,
    };
  },

  watch: {
    update() {
      this.getSliderData();
      this.changeSlide();
      this.reset = true;
      setTimeout(() => {
        this.reset = false;
      }, 0);
      this.editInput = false;
    },
  },

  methods: {
    createSwiper() {
      this.swiper = new Swiper(
        this.$refs[`${this.name}-container`],
        this.swiperOption
      );
    },

    getSliderData() {
      this.steapUserBalance = this.userBalance * this.percent || 0.0;

      this.slidesCount =
        Math.round(this.userBalance / this.steapUserBalance) || 1;
    },

    createSlideArray() {
      let re = new RegExp(`^-?\\d+(?:\.\\d{0,` + (this.decimals || -1) + `})?`);
      for (let i = 1; i <= this.slidesCount; i++) {
        let slideAmount = (this.steapUserBalance * i).toFixed(20);
        let parsedAmount = slideAmount.toString().match(re)[0];
        this.slideArray.push(parsedAmount);
      }

      if (+this.userBalance) {
        this.slideArray[this.slideArray.length - 1] = this.userBalance;
      }
    },

    createEventChangeSlider(slider) {
      slider.on("slideChange", (event) => {
        this.$emit("changeInputValue", this.slideArray[event.activeIndex]);
      });
    },

    changeSlide() {
      this.createEventChangeSlider(this.swiper);
    },

    toggleCustomInput() {
      this.editInput = !this.editInput;
      setTimeout(() => {
        if (this.editInput) {
          this.$refs.customInput.focus();
        }
      }, 0);

      if (this.editInput) {
        this.$emit("changeInputValue", this.customAmount || "");
      } else {
        this.$emit(
          "changeInputValue",
          this.slideArray[this.swiper.activeIndex]
        );
      }
    },

    enterCustomInput(event) {
      this.$emit("changeInputValue", event.target.value);
    },

    getMaxBalance() {
      if (this.editInput) {
        this.$emit("changeInputValue", this.userBalance);
      } else {
        this.slideTo();
      }
    },

    slideTo() {
      this.swiper.slideTo(this.slideArray.length);
    },

    chooseToken() {
      if (this.isChooseToken) this.$emit("chooseToken");
    },
  },

  // async created() {
  //   const isMobile = navigator.userAgentData.mobile;
  //   const miniScreen = window.innerWidth <= 800 && window.innerHeight <= 600;

  //   if (isMobile || miniScreen) {
  //     this.itsMobile = true;
  //     this.editInput = false;
  //     await this.getSliderData();
  //     await this.createSlideArray();
  //     await this.createSwiper();
  //     await this.changeSlide();
  //   }
  // },

  components: {
    TokenIcon,
    Swiper,
  },
};
</script>

<style lang="scss" scoped>
.clickable {
  cursor: pointer;
}

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
  @media (max-width: 600px) {
    padding: 15px 10px;
  }
  input[type="number"] {
    -moz-appearance: textfield;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  &__btn-custom {
    position: absolute;
    top: 10px;
    right: 10px;
    background: transparent;
    border: transparent;
    cursor: pointer;
    img {
      width: 20px;
      height: 20px;
      display: block;
    }
  }
  &__custom-wrap {
    max-width: 190px;
    width: 100%;
    text-align: center;
    font-size: 16px;
    line-height: 22px;
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
      color: #868686;
    }
  }
  &__inner {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  &__max {
    position: absolute;
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
    background: transparent;
    border: none;
    font-weight: 600;
    font-size: 16px;
    line-height: 22px;
    color: $clrWhite;
    text-transform: uppercase;
    cursor: pointer;
    @media screen and (max-width: 600px) {
      top: 75%;
      height: 22px;
    }
    @media screen and (max-width: 360px) {
      right: 10px;
      font-size: 14px;
    }
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
      min-width: 80px;
    }
  }
  &__name {
    font-size: 16px;
    line-height: 22px;
    font-weight: 600;
    margin-left: 10px;
    @media (max-width: 600px) {
      margin-left: 5px;
      font-size: 14px;
    }
  }

  &__arrow {
    display: inline-block;
    margin-left: 10px;
    width: 100%;
    cursor: pointer;
  }

  &__error {
    margin-top: 5px;
    height: 12px;
  }
}
.swiper-wrapper {
  height: 75px;
  transition: all 0.2s !important;
  .swiper-container {
    height: 75px;
    @media (max-width: 860px) {
      margin-left: 120px;
    }
    @media (max-width: 768px) {
      margin-left: auto;
    }
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

.custom-hover {
  img {
    filter: invert(67%) sepia(77%) saturate(2357%) hue-rotate(164deg)
      brightness(107%) contrast(103%);
  }
}
</style>
