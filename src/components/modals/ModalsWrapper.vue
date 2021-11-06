<template>
  <div class="modal-wrap" v-if="popupActiveType">
    <ModalChain @close="closeModal" v-if="popupActiveType === 'chain'" />

    <BrowserChange @close="closeModal" v-if="popupActiveType === 'browser'" />

    <Success @close="closeModal" v-if="popupActiveType === 'success'" />

    <ModalFarmStake
      @close="closeModal"
      v-if="popupActiveType === 'farm-stake'"
    />

    <ModalFarmUnstake
      @close="closeModal"
      v-if="popupActiveType === 'farm-unstake'"
    />

    <ModalWithdraw
      @close="closeModal"
      v-if="popupActiveType === 'withdraw'"
      :tokenData="popupActiveData"
    />
  </div>
</template>

<script>
const ModalChain = () => import("@/components/modals/ModalChain");
const BrowserChange = () => import("@/components/modals/BrowserChange");
const Success = () => import("@/components/modals/Success");
const ModalWithdraw = () => import("@/components/modals/Withdraw");
const ModalFarmStake = () => import("@/components/modals/FarmStake");
const ModalFarmUnstake = () => import("@/components/modals/FarmUnstake");

export default {
  computed: {
    popupActiveType() {
      return this.$store.getters.getPopupType;
    },
    popupActiveData() {
      return this.$store.getters.getPopupData;
    },
  },

  methods: {
    closeModal() {
      this.$store.commit("closeModals");
    },
  },

  components: {
    ModalChain,
    BrowserChange,
    Success,
    ModalWithdraw,
    ModalFarmStake,
    ModalFarmUnstake,
  },
};
</script>

<style lang="scss" scoped>
.modal-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 300;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
  padding: $headerHeight 10px 60px;
  background: rgba(0, 0, 0, 0.04);
  backdrop-filter: blur(20px);
}
</style>
