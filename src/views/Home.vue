<template>
  <div
    class="home"
    :style="{
      'background-image': `url(${require('@/assets/images/home-bg.png')}) `,
    }"
  >
    <div class="home-wrapper">
      <h1 class="home-title">WELCOME TO POPSICLE FINANCE</h1>
      <p class="home-text">
        Popsicle Finance is a multichain yield optimization platform for
        Liquidity Providers. Turn on our auto-pilot, relax, and boost your
        yield.
      </p>
      <router-link
        class="home-btn  btn-wrap border"
        :to="{ name: 'OptimizerV3' }"
      >
        <button class="btn width-100">Join the Adventure</button>
      </router-link>
      <a class="home-link" href="https://docs.popsicle.finance/" target="_blank"
        >Read about us</a
      >
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.home {
  min-height: 460px;
  height: 100vh;
  width: 100%;
  padding: $headerHeight 15px 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
.home-wrapper {
  max-width: 600px;
  width: 100%;
}
.home-title {
  font-weight: 800;
  font-size: 44px;
  line-height: 60px;
  text-align: center;
  text-transform: uppercase;
  margin-bottom: 10px;
}
.home-text {
  font-size: 19px;
  line-height: 1.4;
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 20px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}
.home-btn {
  max-width: 426px;
  width: 100%;
  margin: 0 auto 20px;
}
.home-link {
  display: block;
  width: 100%;
  text-align: center;
  font-weight: 600;
  font-size: 14px;
  line-height: 19px;
}

@media screen and (max-width: 600px) {
  .home-title {
    font-size: 32px;
    line-height: 44px;
  }
  .home-text {
    font-size: 16px;
    line-height: 24px;
  }
}

@media screen and (max-width: 360px) {
  .home-title {
    font-size: 30px;
    line-height: 40px;
  }
  .home-text {
    font-size: 16px;
    line-height: 24px;
  }
}
</style>
