<template>
  <button class="view-toggle" @click="toggleView">
    <img
      v-if="!view"
      src="@/assets/images/searchBar/view-list.svg"
      alt="list"
    />
    <img v-else src="@/assets/images/searchBar/view-column.svg" alt="column" />
  </button>
</template>

<script>
export default {
  data() {
    return {
      view: false,
    };
  },
  methods: {
    toggleView() {
      this.view = !this.view;
      this.$emit("toggleView");
    },
  },
};
</script>

<style lang="scss" scoped>
.view-toggle {
  border: none;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 12px;
  width: 44px;
  height: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

@media screen and(max-width: 900px) {
  .view-toggle {
    display: none;
  }
}
</style>
