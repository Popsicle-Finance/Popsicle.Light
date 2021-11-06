<template>
  <div class="modal" v-if="pool" @click.stop v-click-outside="closeModal">
    <img class="close" @click="closeModal" src="./img/close.svg" alt="close" />
    <img src="@/assets/images/popups-bg.png" alt="" class="bg-img" />
    <h3 class="title">Withdraw from your PLP position</h3>
    <div class="input-wrapper">
      <UpSliderInput
        :name="'PLP'"
        :imageName="pool.lpIcon"
        :decimals="pool.lpDecimals"
        :userBalance="pool.userPoolInfo.userLpBalance"
        :error="amountError"
        :parentValue="amount"
        @changeInputValue="updateValue"
      />
    </div>

    <div class="info-block">
      <div class="info-item">
        <span class="item-title"
          >Expected Amount of {{ pool.token0.symbol }} received</span
        >
        <span class="item-value"
          >~ {{ parseFloat(expectedToken0AmountInUsd).toFixed(4) }}</span
        >
      </div>

      <div class="info-item">
        <span class="item-title"
          >Expected Amount of {{ pool.token1.symbol }} received</span
        >
        <span class="item-value"
          >~ {{ parseFloat(expectedToken1AmountInUsd).toFixed(4) }}</span
        >
      </div>
    </div>

    <div class="btn-wrap border width-100" :class="{ disabled: isBtnDisabled }">
      <button class="btn width-100" @click="withdrawHandler">
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
      return this.$store.getters.getSorbettoPoolById(this.activePoolId);
    },
    expectedPLPAmountInUsd() {
      if (this.amount) return this.amount * this.pool.plpPrice;

      return 0;
    },
    expectedToken0Amount() {
      if (this.expectedPLPAmountInUsd) {
        return (
          (this.expectedPLPAmountInUsd / 100) *
          this.pool.proportion.token0Percent
        );
      }
      return 0;
    },
    expectedToken1Amount() {
      if (this.expectedPLPAmountInUsd) {
        return (
          (this.expectedPLPAmountInUsd / 100) *
          this.pool.proportion.token1Percent
        );
      }
      return 0;
    },
    expectedToken0AmountInUsd() {
      if (this.expectedToken0Amount) {
        return this.expectedToken0Amount / this.pool.token0.price;
      }
      return 0;
    },
    expectedToken1AmountInUsd() {
      if (this.expectedToken1Amount) {
        return this.expectedToken1Amount / this.pool.token1.price;
      }
      return 0;
    },
    amountError() {
      if (
        +this.amount &&
        +this.amount > +this.pool.userPoolInfo.userLpBalance
      ) {
        return `The value cannot be more than ${this.pool.userPoolInfo.userLpBalance}`;
      }

      return "";
    },
    isBtnDisabled() {
      if (this.amountError) return true;

      if (!+this.amount) return true;

      return false;
    },
    actionBtnText() {
      return "Withdraw";
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
    async withdrawHandler() {
      if (this.amountError) return false;

      if (!+this.amount) return false;

      const notifyId = this.createNotification("Withdraw in progress");

      try {
        const amount = this.$ethers.utils.parseUnits(
          String(this.amount),
          this.pool.lpDecimals
        );
        const account = this.account;
        const contract = this.pool.contractInstance;

        this.closeModal();

        await contract.methods
          .withdraw(String(amount), account)
          .send({ from: account });
        this.$store.commit("deleteNotification", notifyId);
      } catch (e) {
        this.$store.commit("deleteNotification", notifyId);
        console.log("withdraw err", e);
      }
    },
    closePopup() {
      this.$store.commit("hideSorbettoPopups");
    },
  },
  components: { UpSliderInput },
};
</script>

<style lang="scss" scoped>
.info-block {
  padding: 20px 10px;
  margin: 20px 0;
  background: #252423;
  border-radius: 8px;
  position: relative;
  z-index: 1;

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

.btn-wrap {
  position: relative;
  z-index: 1;
}

.modal {
  max-width: 466px;
  width: 100%;
  background: #2c2c2c;
  border-radius: 12px;
  padding: 30px 20px;
  margin: 5px;
  position: relative;
  overflow: hidden;
}

.bg-img {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.close {
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
  width: 20px;
  height: 20px;
  z-index: 2;
}

.title {
  font-weight: bold;
  font-size: 28px;
  line-height: 38px;
  max-width: 330px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 1;
}

.input-wrapper {
  margin: 20px 0;
  position: relative;
  z-index: 1;
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
