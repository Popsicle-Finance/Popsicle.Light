<template>
  <div class="modal" v-if="pool" @click.stop v-click-outside="closeModal">
    <img
      class="close"
      @click="closeModal"
      src="@/components/modals/images/close.svg"
      alt="close"
    />
    <h3 class="title">Unstake from your LP position</h3>
    <div class="input-wrapper">
      <UpSliderInput
        :name="'LP'"
        :imageName="pool.stakingTokenIcon"
        :userBalance="pool.positionBalance"
        :error="amountError"
        :parentValue="amount"
        @changeInputValue="updateValue"
      />
    </div>

    <div class="btn-wrap border width-100" :class="{ disabled: isBtnDisabled }">
      <button class="btn width-100" @click="unstakeHandler">
        {{ actionBtnText }}
      </button>
    </div>
  </div>
</template>

<script>
import UpSliderInput from "@/components/ui/tokenInput/UpSliderInput";

export default {
  data() {
    return {
      amount: "",
    };
  },

  computed: {
    activePoolId() {
      return this.$store.getters.getPopupData;
    },
    pool() {
      return this.$store.getters.getFarmPoolById(this.activePoolId);
    },
    amountError() {
      if (+this.amount && +this.amount > +this.pool.positionBalance) {
        return `The value cannot be more than ${this.pool.positionBalance}`;
      }

      return "";
    },
    isBtnDisabled() {
      if (this.amountError) return true;

      if (!+this.amount) return true;

      return false;
    },
    actionBtnText() {
      return "Unstake";
    },
    account() {
      return this.$store.getters.getWallet.address;
    },
  },

  methods: {
    closeModal() {
      this.$emit("close");
    },
    createNotification(msg) {
      const id = this.$store.getters.getNotificationId;

      const notification = { id, msg };

      this.$store.commit("addNotification", notification);

      return id;
    },
    updateValue(value) {
      this.amount = value;
    },
    async unstakeHandler() {
      if (this.amountError) return false;

      if (!+this.amount) return false;

      const notifyId = this.createNotification("Unstake in progress");

      try {
        const amount = this.$ethers.utils.parseUnits(this.amount, 18);
        const contract = this.pool.contractInstance;
        const poolId = this.pool.poolId;

        this.closeModal();

        await contract.withdraw(poolId, amount);
        this.$store.commit("deleteNotification", notifyId);
      } catch (e) {
        this.$store.commit("deleteNotification", notifyId);
        console.log("stake err", e);
      }
    },
  },
  components: { UpSliderInput },
};
</script>

<style lang="scss" scoped>
.info-block {
  padding: 20px 10px;
  margin: 20px 0;
  background: linear-gradient(
    180deg,
    rgba(145, 255, 232, 0.1) 0%,
    rgba(164, 222, 255, 0.1) 96.16%
  );
  border-radius: 8px;

  .info-item {
    display: flex;
    justify-content: space-between;
    font-weight: 300;
    font-size: 14px;
    line-height: 19px;
    letter-spacing: 0.02em;
  }

  .info-item:not(:last-child) {
    margin-bottom: 10px;
  }
}

.modal {
  max-width: 466px;
  width: 100%;
  background: $clrBg2;
  border-radius: 12px;
  padding: 30px 20px;
  margin: 5px;
  position: relative;
}

.close {
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
  width: 20px;
  height: 20px;
}

.title {
  font-weight: bold;
  font-size: 28px;
  line-height: 38px;
  max-width: 330px;
  margin: 0 auto;
  text-align: center;
}

.input-wrapper {
  margin: 20px 0;
}

@media screen and (max-width: 600px) {
  .modal {
    padding: 30px 10px;
  }

  .close {
    top: 15px;
    right: 15px;
  }

  .title {
    font-size: 24px;
    max-width: 250px;
  }
}
</style>
