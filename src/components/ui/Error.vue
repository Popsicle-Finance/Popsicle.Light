<template>
  <div class="not-found">
    <img class="not-found__img" src="@/assets/images/error/error.png" alt="" />
    <p class="not-found__text">
      {{ errorText }}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    errorText: {
      type: String,
      default: "",
    },
  },
};
</script>

<style lang="scss" scoped>
.not-found {
  max-width: 450px;
  width: 100%;
  text-align: center;
  position: relative;
  &__img {
    width: 100%;
  }
  &__text {
    max-width: 350px;
    width: 100%;
    margin: 0 auto;
    font-weight: 600;
    font-size: 18px;
    line-height: 30px;
    margin-top: -40px;
  }
}
</style>
