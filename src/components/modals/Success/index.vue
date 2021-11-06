<template>
  <div class="modal" @click.stop v-click-outside="closeModal">
    <button class="modal-close" @click="closeModal"></button>
    <h3 class="modal-title">Success</h3>
    <p class="modal-text">You are joining the position</p>
    <img class="modal-img" src="../images/ilustration.svg" alt="" />
    <div class="modal-btns">
      <div class="btn-wrap" @click="toPosition">
        <button class="btn">My positions</button>
      </div>
      <!-- <router-link class="btn-wrap" to="/">
        <button class="btn">Leverage up</button>
      </router-link> -->
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    toPosition() {
      this.$router.push({ name: "Positions" });
      this.closeModal();
    },
    closeModal() {
      this.$emit("close");
    },
  },
};
</script>

<style lang="scss" scoped>
.modal {
  max-width: 466px;
  width: 100%;
  height: 480px;
  background: #252423 url("./img/bg.svg");
  border-radius: 12px;
  position: relative;
  padding: 30px 20px;
  margin: 0 10px;
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: url("../images/close.svg") center no-repeat;
  background-size: contain;
  width: 16px;
  height: 16px;
  border: none;
  cursor: pointer;
}

.modal-title {
  font-weight: bold;
  font-size: 28px;
  line-height: 38px;
  margin-bottom: 30px;
  text-align: center;
}
.modal-text {
  font-size: 16px;
  line-height: 22px;
  text-align: center;
  margin-bottom: 40px;
}
.modal-img {
  display: block;
  margin: 0 auto 35px;
}
.modal-btns {
  display: flex;
  justify-content: center;
  gap: 5%;

  .btn-wrap {
    max-width: 202px;
    width: 100%;
    background: transparent;
    border: 1px solid #5ac9e5;
  }

  .btn {
    max-width: 200px;
    width: 100%;
    background: transparent;
    border-radius: 12px;
    padding: 0 15px;
  }
}
</style>
