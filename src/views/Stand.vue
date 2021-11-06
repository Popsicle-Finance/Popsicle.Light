<template>
  <div class="home">
    <template>
      <div class="container">
        <Tabs />
      </div>
    </template>

    <div class="container">
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>

<script>
const Tabs = () => import("@/components/ui/Tabs");

export default {
  name: "Home",
  components: {
    Tabs,
  },
  data: () => ({
    activeTab: 1,
  }),
};
</script>

<style lang="scss" scoped>
.home {
  margin-top: 100px;
}

@media screen and (max-width: 500px) {
  .home {
    margin-top: 50px;
  }
}
</style>
