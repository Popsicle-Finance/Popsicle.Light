<template>
  <div class="popup" @click.stop v-click-outside="closeModal">
    <button class="close" @click="closeModal"></button>
    <h3 class="title">Change browser</h3>
    <p class="text">
      Please use the browser with Metamask support Such as Google Chrome or
      Brave browser
    </p>
    <img class="popup-img" src="./img/change.png" alt="Change browser" />
  </div>
</template>

<script>
export default {
  methods: {
    closeModal() {
      this.$emit("close");
    },
  },
};
</script>

<style lang="scss" scoped>
.popup {
  max-width: 466px;
  width: 100%;
  margin: 0 15px;
  max-height: 420px;
  border-radius: 12px;
  background: url("./img/bg.svg") center no-repeat;
  color: #fff;
  padding: 30px;
  text-align: center;
  position: relative;
}
.close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 16px;
  height: 16px;
  background: url("./img/close.svg") center no-repeat;
  border: transparent;
  cursor: pointer;
}
.title {
  font-weight: bold;
  font-size: 28px;
  line-height: 38px;
  margin-bottom: 10px;
}
.text {
  font-size: 16px;
  line-height: 22px;
  max-width: 260px;
  width: 100%;
  margin: 0 auto 20px;
}
.popup-img {
  max-width: 300px;
  width: 100%;
}
</style>
