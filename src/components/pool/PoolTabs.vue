<template>
  <div class="pool-tabs">
    <div class="pool-tabs__item">1 Choose amounts</div>
    <div class="pool-tabs__item">2 Join pool</div>
    <div class="pool-tabs__item" v-if="poolVersion === 'v3'">3 Join pool</div>
  </div>
</template>

<script>
export default {
  props: {
    poolVersion: {
      type: String,
      default: "v3",
    },
  },
};
</script>

<style lang="scss" scoped>
.pool-tabs {
  height: 70px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  &__item {
    max-width: 150px;
    width: 100%;
    text-align: center;
    font-size: 14px;
    line-height: 19px;
    font-weight: 400;
    background: #303030;
    padding: 10px 0;
    border-radius: 12px;
    margin-right: 20px;
    &:nth-last-child(1) {
      margin-right: 0;
    }
    @media (max-width: 600px) {
      font-size: 12px;
    }
  }
}
</style>
