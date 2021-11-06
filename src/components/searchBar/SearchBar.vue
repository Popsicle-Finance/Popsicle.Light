<template>
  <div class="search-bar">
    <div class="wrapper">
      <ViewToggle @toggleView="toggleView" />
      <SortSelect
        :sortValue="sortValue"
        :sortFromTop="sortFromTop"
        :sortOptions="sortOptions"
        @updateFlow="updateFlow"
        @updateSortValue="updateSortValue"
      />
    </div>
    <SearchInput :searchKey="searchKey" @updateInputValue="updateSearchInput" />
  </div>
</template>

<script>
const SearchInput = () => import("@/components/searchBar/SearchInput");
const SortSelect = () => import("@/components/searchBar/SortSelect");
const ViewToggle = () => import("@/components/searchBar/ViewToggle");

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
    searchKey: {
      type: String,
      required: true,
    },
  },

  methods: {
    toggleView() {
      this.$emit("toggleView");
    },

    updateFlow(isFromTop) {
      this.$emit("updateFlow", isFromTop);
    },

    updateSortValue(value) {
      this.$emit("updateSortValue", value);
    },

    updateSearchInput(value) {
      this.$emit("updateSearchInput", value);
    },
    sorted(prop) {
      this.$emit("sorted", prop);
    },
  },

  components: {
    SearchInput,
    SortSelect,
    ViewToggle,
  },
};
</script>

<style lang="scss" scoped>
.search-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.wrapper {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 255px;
  min-height: 44px;
  width: 100%;
}

@media (max-width: 600px) {
  .search-bar {
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
  }

  .wrapper {
    margin-bottom: 15px;
  }
}
</style>
