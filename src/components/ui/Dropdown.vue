<template>
  <div class="dropdown">
    <div
      class="dropdown-wrapper"
      :class="{ 'show-dropdown': showDropdown }"
      @click="toggleDropdown"
      v-click-outside="closeDropdown"
    >
      <div class="dropdown-inner">
        <div class="dropdown-title">
          Tools
          <img
            class="dropdown-icon"
            :class="{ 'dropdown-icon_open': showDropdown }"
            src="@/assets/images/arrow-down.svg"
            alt="Arrow down"
          />
        </div>
        <div v-if="showDropdown">
          <router-link
            class="dropdown-link"
            v-for="(link, index) in dropdownOptions"
            :key="index"
            :to="{ name: 'Bridge' }"
          >
            {{ link }}</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    dropdownOptions: {
      type: Array,
      require: true,
    },
  },

  data() {
    return {
      showDropdown: false,
    };
  },

  methods: {
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },

    closeDropdown() {
      this.showDropdown = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.dropdown {
  min-width: 88px;
  width: 100%;
  position: relative;
  height: 41px;
  margin-left: 10px;
  font-weight: 600;
  font-size: 14px;
  line-height: 19px;
}

.dropdown-wrapper {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
  max-width: 200px;
  width: 100%;
  height: 41px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover {
    background: linear-gradient(to right, #5ac9e5, #194eca);
  }
  &.show-dropdown {
    height: 82px;
    background: linear-gradient(to right, #5ac9e5, #194eca);

    .dropdown-inner {
      height: 80px;
    }
  }
}

.dropdown-inner {
  max-width: 198px;
  width: 86px;
  height: 39px;
  border-radius: 12px;
  background: $clrBg2;
  position: absolute;
  left: 1px;
}

.dropdown-title {
  height: 41px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dropdown-icon {
  display: inline-block;
  margin-left: 5px;
  transition: all 200ms ease-in-out;
  &_open {
    transform: rotate(180deg);
  }
}

.dropdown-link {
  height: 39px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: normal;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  &:last-child {
    border-radius: 0 0 12px 12px;
  }
}
</style>
