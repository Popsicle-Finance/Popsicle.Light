<template>
  <div
    class="sort-select"
    :class="{ show: showList }"
    @click="toggleSort"
    v-click-outside="hideSortList"
  >
    <div class="wrapper">
      <div class="sort-header">
        <img
          class="sort-icon"
          :class="{ 'sort-icon-rotate': rotate }"
          src="@/assets/images/searchBar/sort-down.svg"
          alt="Sort Icon"
          @click.stop="toggleFlow"
        />
        <span>Sorted by {{ sortValue }}</span>
      </div>
      <div v-if="showList">
        <div
          class="sort-item"
          v-for="(sortItem, index) in sortOptions"
          :key="index"
          @click="enterSorted(sortItem)"
        >
          {{ sortItem }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    sortValue: {
      type: String,
      required: true,
    },
    sortFromTop: {
      type: Boolean,
    },
    sortOptions: {
      type: Array,
      require: true,
    },
  },

  data() {
    return {
      showList: false,
      rotate: false,
    };
  },

  methods: {
    toggleSort() {
      this.showList = !this.showList;
    },

    hideSortList() {
      this.showList = false;
      this.rotate = false;
    },

    toggleFlow() {
      this.rotate = !this.rotate;
      this.$emit("updateFlow", !this.sortFromTop);
    },

    enterSorted(value) {
      this.$emit("updateSortValue", value);
    },
  },
};
</script>

<style lang="scss" scoped>
.sort-select {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
  max-width: 200px;
  width: 100%;
  height: 44px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &.show {
    height: 180px;
    background: linear-gradient(to right, #5ac9e5, #194eca);

    .wrapper {
      height: 178px;
    }
  }
}

@media screen and (max-width: 900px) {
  .sort-select {
    right: auto;
    left: 0;
  }
}

.wrapper {
  max-width: 198px;
  width: 100%;
  height: 42px;
  border-radius: 12px;
  background: $clrBg2;
}

.sort-header {
  height: 44px;
  display: flex;
  align-items: center;
  padding-left: 20px;
}

.sort-icon {
  display: block;
  margin-right: 10px;
}
.sort-icon-rotate {
  transform: rotate(180deg);
}

.sort-item {
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
}
</style>
