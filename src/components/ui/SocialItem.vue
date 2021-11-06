<template>
  <div class="social-wrapper">
    <div class="btn-wrap border" v-if="!mobile">
      <div class="toggle-btn" @click="toggleMenu">
        <img src="@/assets/images/menu-icon.svg" alt="" />
      </div>
    </div>

    <transition name="fade">
      <div class="social-block" v-if="showMenu">
        <div class="social-items-wrap">
          <a
            class="social-item"
            v-for="(social, idx) in socialItems"
            :key="idx"
            :href="social.link"
            target="_blank"
          >
            <img :src="social.icon" :alt="social.title" />
          </a>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      showMenu: false,
      mobile: false,
    };
  },

  computed: {
    ...mapGetters({ socialItems: "getSocialItems" }),
  },

  methods: {
    toggleMenu() {
      this.showMenu = !this.showMenu;
    },
    resize() {
      if (window.innerWidth <= 1024) {
        this.showMenu = true;
        console.log(this.showMenu);
        this.mobile = true;
      } else {
        this.showMenu = false;
        this.mobile = false;
      }
    },
  },

  created() {
    this.resize();
    window.addEventListener("resize", this.resize);
  },

  destroyed() {
    window.removeEventListener("resize", this.resize);
  },
};
</script>

<style lang="scss" scoped>
.social-wrapper {
  margin-left: 10px;
  position: relative;
  @media (max-width: 1024px) {
    width: 100%;
  }

  .social-block {
    position: absolute;
    top: calc(100% + 30px);
    right: 0;
    width: 170px;
    height: auto;
    background: #2c2c2c;
    box-shadow: 0px 0px 20px #252423;
    border-radius: 12px;
    z-index: 300;
    @media (max-width: 1024px) {
      left: 0;
      top: 0;
      margin: 0 auto;
      box-shadow: none;
      width: 194px;
      background: transparent;
    }
  }

  .social-items-wrap {
    padding-top: 25px;
    padding-bottom: 25px;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }

  .social-item {
    width: 40px;
    height: 40px;
    margin: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    background: rgba(255, 255, 255, 0.04);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    @media (max-width: 1024px) {
      margin: 12px;
    }

    &:hover {
      background: #2bd2f7;
    }

    img {
      max-width: 100%;
      height: auto;
    }
  }

  .toggle-btn {
    width: 40px;
    height: 40px;
    background: #2e2d2c;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;

    img {
      width: 16px;
      height: auto;
      object-fit: contain;
    }
  }
}
</style>
