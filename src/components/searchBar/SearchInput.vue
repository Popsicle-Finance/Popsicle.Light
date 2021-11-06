<template>
  <label class="search-input" :class="{ focus: isFocus }">
    <img
      src="@/assets/images/searchBar/search-icon.svg"
      alt=""
      class="search-icon"
    />
    <input
      :value="searchKey"
      type="text"
      placeholder="Search"
      @input="updateValue"
      @focus="setFocus(true)"
      @blur="setFocus(false)"
    />
  </label>
</template>

<script>
export default {
  props: {
    searchKey: {
      type: String,
    },
  },

  data() {
    return {
      isFocus: false,
    };
  },

  methods: {
    updateValue(e) {
      this.$emit("updateInputValue", e.target.value);
    },

    setFocus(payload) {
      this.isFocus = payload;
    },
  },
};
</script>

<style lang="scss" scoped>
.search-input {
  display: flex;
  position: relative;
  width: 216px;
  align-items: center;
  justify-content: center;
  height: 40px;
  background: #343434;
  border-radius: 12px;

  &.focus {
    background: linear-gradient(to right, #5ac9e5, #194eca);
  }

  .search-icon {
    position: absolute;
    width: 24px;
    height: 24px;
    object-fit: contain;
    top: 50%;
    left: 12px;
    transform: translateY(-50%);
  }

  input {
    display: block;
    width: 214px;
    height: 38px;
    color: #fff;
    font-weight: 600;
    font-size: 14px;
    line-height: 19px;
    background: #343434;
    padding-left: 45px;
    border-radius: 12px;
    border: none;
    outline: none;

    &::placeholder {
      color: #868686;
    }
  }
}

@media screen and (max-width: 600px) {
  .search-input {
    width: 100%;
    input {
      width: 99%;
    }
  }
}
</style>
