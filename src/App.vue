<template>
  <div id="app">
    <Header :isTransparentBackground="isTransparentBackground" />
    <div
      class="main-wrapper"
      :class="{ 'main-wrapper_not-padding': isTransparentBackground }"
      v-if="!checkInProcess"
    >
      <transition name="fade" mode="out-in">
        <router-view />
      </transition>
    </div>

    <Banner v-if="showBanner" />

    <Footer
      v-if="isFooter"
      :isTransparentBackground="isTransparentBackground"
    />

    <ModalsWrapper />

    <NotificationContainer />
  </div>
</template>

<script>
const Header = () => import("@/components/main/Header");
const Footer = () => import("@/components/main/Footer");
const Banner = () => import("@/components/ui/Banner");
const ModalsWrapper = () => import("@/components/modals/ModalsWrapper");
const NotificationContainer = () =>
  import("@/components/notifications/NotificationContainer");

import { mapGetters } from "vuex";

import swapAbi from "@/utils/sorbetto/swapInterfaceAbi";

export default {
  data() {
    return {
      path: ["OptimizerV3", "Positions", "Home", "FarmStand"],
      bannetPath: ["OptimizerV3", "Positions", "FarmStand"],
      transparentBg: ["Home"],
    };
  },

  computed: {
    ...mapGetters({
      wallet: "getWallet",
      checkInProcess: "getWalletCheckInProccess",
    }),

    showBanner() {
      if (this.bannetPath.includes(this.$route.name)) {
        return true;
      }
      return false;
    },

    isFooter() {
      if (this.path.includes(this.$route.name)) {
        return true;
      }
      return false;
    },

    isTransparentBackground() {
      if (this.transparentBg.includes(this.$route.name)) {
        return true;
      }
      return false;
    },
  },

  methods: {
    decodeData() {
      console.log("DECODE DATA");
      const dataInterface = new this.$ethers.utils.Interface(swapAbi);

      const decodeResult = dataInterface.decodeFunctionData(
        "unoswap",
        "0x2e95b6c8000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000009b6e64a8ec60000000000000000000000000000000000000000000000000001277a02f99fa357190000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000180000000000000003b6d03400c365789dbbb94a29f8720dc465554c587e897dbe26b9977"
      );

      console.log("decodeResult", decodeResult);
      console.log("decodeResult", JSON.stringify(decodeResult));

      console.log("___________________________________");
    },
  },

  created() {
    // this.decodeData();
  },

  watch: {
    wallet(wallet) {
      if (wallet && wallet.address && wallet.provider) {
        console.log(`%cWallet Connected.`, "font-weight: bold; color: green;");
        console.log(
          `Address: %c${wallet.address}`,
          "font-weight: bold; color: orange;"
        );
        console.log(wallet.provider);
      }
    },
  },

  components: {
    Header,
    Footer,
    NotificationContainer,
    ModalsWrapper,
    Banner,
  },
};
</script>

<style lang="scss" src="@/styles/main.scss"></style>
