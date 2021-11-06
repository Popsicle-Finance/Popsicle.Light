<template>
  <div>
    <div class="input">
      <div class="input__desc">
        <TokenIcon :imageName="imageName" />
        <p class="input__name">{{ name }}</p>
      </div>
      <div class="output">
        <input
          class="output__input"
          :class="{ output__disabled: disabled }"
          type="text"
          :value="amount"
          :disabled="disabled"
          v-if="disabled"
        />
        <input
          class="output__input"
          type="text"
          placeholder="0.00"
          @input="changeDefaultInput"
          v-else
        />
      </div>
    </div>
    <p class="input__error error">{{ error }}</p>
  </div>
</template>

<script>
const TokenIcon = () => import("@/components/ui/TokenIcon");
export default {
  props: {
    imageName: {
      type: String,
      require: true,
    },
    name: {
      type: String,
    },
    amount: {
      default: "0",
    },
    decimals: {},
    error: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    changeDefaultInput(event) {
      this.$emit("changeDefaultInput", event.target.value);
    },
  },
  components: {
    TokenIcon,
  },
};
</script>

<style lang="scss" scoped>
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
  &__error {
    margin-top: 5px;
    height: 12px;
  }
}

.output {
  margin: 0 auto;
  height: 70px;
  overflow: hidden;
  display: flex;
  align-items: center;

  input[type="number"] {
    -moz-appearance: textfield;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  &__input {
    background: transparent;
    font-size: 16px;
    line-height: 22px;
    color: #fff;
    border: none;
    outline: none;
    text-align: center;
  }
  &__disabled {
    color: #868686;
  }
}
@media (max-width: 860px) {
  .output {
    margin: 0 auto 0 120px;
  }
}
@media (max-width: 768px) {
  .output {
    margin: 0 auto;
  }
}
@media (max-width: 600px) {
  .output__input {
    font-size: 14px;
  }
}
</style>
