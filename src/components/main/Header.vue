<template>
  <header
    :class="{
      'header-transparent': isTransparentBackground,
      'open-mobile-menu': isMobileMenu,
    }"
  >
    <div class="header container">
      <router-link class="logo" to="/">
        <img
          src="@/assets/images/main-logo.svg"
          @click="closeMobileMenu"
          alt="Logo"
        />
      </router-link>

      <a href="https://pro.popsicle.finance/" class="btn pro-link">
        <p>TO PRO MODE</p>
      </a>
      <Burger />

      <div
        class="wrapper"
        :style="isMobileMenu && 'top:80px; visibility: visible;'"
      >
        <nav>
          <a href="https://pro.popsicle.finance/" class="btn pro-link">
            <p>TO PRO MODE</p>
          </a>
          <router-link
            class="nav-item btn-wrap border"
            :to="{ name: 'OptimizerV3' }"
          >
            <button class="btn" @click="closeMobileMenu">Products</button>
          </router-link>
          <router-link class="nav-item btn-wrap border" :to="{ name: 'Nice' }">
            <button class="btn" @click="closeMobileMenu">Stake</button>
          </router-link>
          <Dropdown :dropdownOptions="dropdown" v-if="!isMobileMenu" />
          <template v-else>
            <router-link
              class="nav-item btn-wrap border"
              :to="{ name: 'Bridge' }"
            >
              <button class="btn" @click="closeMobileMenu">Bridge</button>
            </router-link>
            <!-- <router-link
              class="nav-item btn-wrap border"
              :to="{ name: 'Nice' }"
            >
              <button class="btn" @click="closeMobileMenu">Analytics</button>
            </router-link> -->
          </template>

          <div class="nav-item btn-wrap border">
            <button class="btn btn-wallet" @click="handleConnect">
              {{ connectBtnText }}
            </button>
          </div>
        </nav>

        <div class="wrapper-network" @click="setMobileMenu(false)">
          <NetwortBtn />
        </div>

        <!-- <div class="wrapper-token">
          <AddTokenBtn tokenName="ice" />
          <AddTokenBtn tokenName="nIce" />
        </div> -->
      </div>
    </div>
  </header>
</template>

<script>
// const AddTokenBtn = () => import("@/components/ui/AddToken");
const NetwortBtn = () => import("@/components/ui/NetworkBtn");
const Burger = () => import("@/components/ui/Burger");
const Dropdown = () => import("@/components/ui/Dropdown");

import { mapGetters, mapMutations } from "vuex";

export default {
  props: {
    isTransparentBackground: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      address: "",
      dropdown: ["Bridge"],
    };
  },

  computed: {
    ...mapGetters({
      wallet: "getWallet",
      isMobileMenu: "getMobileMenu",
    }),

    connectBtnText() {
      const address =
        this.wallet && this.wallet.address
          ? this.wallet.address.toString()
          : "";

      if (!address || address.length < 42) {
        return "Connect";
      }

      if (address && address.length === 42) {
        const str1 = String(address).slice(0, 6);
        const str2 = String(address).slice(address.length - 4, address.length);

        return `${str1}...${str2}`;
      }
    },
  },

  methods: {
    ...mapMutations(["setMobileMenu"]),

    handleConnect() {
      if (this.wallet && this.wallet.address && this.wallet.provider)
        return this.closeMobileMenu();

      this.$connectWallet();
    },

    closeMobileMenu() {
      if (window.innerWidth <= 1024) {
        this.setMobileMenu(false);
      }
      return false;
    },
  },

  components: {
    // AddTokenBtn,
    NetwortBtn,
    Burger,
    Dropdown,
  },
};
</script>

<style lang="scss">
header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: $headerHeight;
  background: $clrBg1;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 100;
  transition: all 00ms ease-in-out;

  .pro-link {
    padding: 0 30px;
    font-weight: 600;
    font-size: 14px;
    margin-left: 40px;
    position: relative;
    height: $btnHeight - 2px;
    @media (max-width: 1024px) {
      display: none;
    }
    @media (max-width: 600px) {
      margin-left: 20px;
      padding: 0 15px;
    }

    &::before {
      content: "";
      position: absolute;
      top: -1px;
      bottom: -1px;
      left: -1px;
      right: -1px;
      background: linear-gradient(to right, #5ac9e5, #5b89ff);
      border-radius: 12px;
      z-index: -1;
    }

    p {
      background: linear-gradient(to right, #5ac9e5, #5b89ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  .wrapper {
    display: flex;
    align-items: center;
    height: 100%;
    margin-left: auto;
    .pro-link {
      display: none;
    }
    @media (max-width: 1024px) {
      transition: all 300ms ease-in-out;
      padding: 16px;
      left: 0;
      background: $clrBg1;
      width: 100%;
      height: calc(100vh - 80px);
      position: fixed;
      flex-direction: column;
      top: -100%;
      visibility: hidden;
      .pro-link {
        display: flex;
        width: 100%;
        margin: 0 auto;
        margin-bottom: 15px;
      }
    }
  }

  .wrapper-token {
    display: flex;
    @media (max-width: 1024px) {
      order: -1;
      margin-bottom: 16px;
    }
  }

  .wrapper-network {
    width: 100%;
    @media (max-width: 1024px) {
      .btn-wrap {
        width: 100%;
        margin-left: 0;
      }
      .btn {
        width: 100%;
      }
    }
  }

  nav {
    display: flex;
    align-items: center;
    margin-left: auto;
    @media (max-width: 1024px) {
      flex-direction: column;
      width: 100%;
      margin-left: 0;
    }

    .nav-item {
      margin-left: 10px;
      @media (max-width: 1024px) {
        margin-left: 0;
        margin-bottom: 16px;
      }

      .btn {
        padding: 0 30px;
        @media (max-width: 1024px) {
          width: 100%;
        }
      }

      .btn-wallet {
        position: relative;
        overflow: hidden;

        &:hover {
          &::after {
            position: absolute;
            content: var(--address);
            z-index: 1;

            width: 100%;
            height: 100%;

            display: flex;
            align-items: center;
            justify-content: center;

            background: inherit;
          }
        }
      }
    }
  }

  .btn-wrap {
    @media (max-width: 1024px) {
      width: 100%;
    }
  }

  .logo {
    text-decoration: none;

    img {
      width: 115px;
      height: auto;
      @media (max-width: 600px) {
        width: 100px;
      }
    }
  }

  .container {
    display: flex;
    align-items: center;
    height: 100%;
  }
}

.header-transparent {
  background: transparent;

  .btn {
    background: #2e4957;
  }

  .dropdown-inner {
    background: #2e4957 !important;
  }

  .pro-link {
    background: #323a3e;
  }
}

.open-mobile-menu {
  background: #252423;

  .btn,
  .dropdown-inner {
    background: #2e2d2c;
  }

  .pro-link {
    background: #2e2d2c;
  }
}
</style>
