<template>
  <div
    class="burger"
    :class="getMobileMenu && 'burger-active'"
    @click="openMobileMenu"
  >
    <span class="burger__line"></span>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
export default {
  computed: {
    ...mapGetters(["getMobileMenu"]),
  },
  methods: {
    ...mapMutations(["setMobileMenu"]),
    openMobileMenu() {
      this.setMobileMenu(!this.getMobileMenu);
    },
  },
};
</script>

<style lang="scss">
.burger {
  width: 22px;
  height: 18px;
  position: relative;
  z-index: 9;
  margin-left: auto;
  display: none;
  @media (max-width: 1024px) {
    display: flex;
  }

  &:after,
  &:before {
    content: "";
    position: absolute;
    width: 100%;
    height: 3px;
    background-color: #fff;
    transition: all 500ms ease-in-out;
  }

  &:after {
    top: 0;
  }

  &:before {
    bottom: 0;
  }

  &__line {
    position: absolute;
    width: 100%;
    height: 3px;
    background-color: #fff;
    top: 50%;
    transform: translateY(-50%);
  }

  &-active {
    &:after {
      top: 55%;
      transform: rotate(45deg);
    }

    &:before {
      bottom: 30%;
      transform: rotate(-45deg);
    }

    .burger__line {
      opacity: 0;
    }
  }
}
</style>
