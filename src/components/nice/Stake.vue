<template>
  <div class="stake">
    <div class="stake__body">
      <div class="stake__row">
        <h3 class="stake__title">
          <template v-if="action === 'Stake'">Stake</template>
          <template v-else>Unstake</template>
        </h3>
        <div class="stake__rates">
          {{ rateInfo }}
        </div>
      </div>
      <template v-if="isUserLocked">
        <LockedTimer :finalTime="lockedUntil" />
      </template>
      <UpSliderInput
        :name="fromToken.name"
        :imageName="fromToken.imageName"
        :decimals="fromToken.decimals"
        :userBalance="fromToken.userBalance"
        :update="update"
        :error="error"
        :parentValue="amount"
        @changeInputValue="changeInputValue"
        :key="fromToken.name"
      />
      <img
        class="stake__change-unstake"
        src="@/assets/images/nice/change_stake_unstake.svg"
        alt=""
        @click="toggleAction"
      />
      <UpDefaultInput
        :imageName="toToken.imageName"
        :name="toToken.name"
        :amount="toToken.convertToken"
        :decimals="toToken.decimals"
        :disabled="true"
        :key="toToken.name"
      />
      <div class="stake__description">
        <p class="stake__description-text">
          Stake your ICE tokens and obtain nICE in order to take part in the fee
          sharing of Popsicle Finance
        </p>
        <p class="stake__description-text">
          <span>20%</span> of the platform profits will be redirected to nICE
          holders!
        </p>
        <p class="stake__description-text">
          When you Unstake your nICE tokens, you will receive all your deposited
          ICE plus any additional fees collected!
        </p>
        <p class="stake__description-text">
          There is a <span>24 hour</span> time lock on deposits to prevent front
          running.
        </p>
        <p class="stake__description-text">
          Read more about how ICE staking works in our
          <a
            class="stake__description-link"
            target="_blank"
            href="https://docs.popsicle.finance/our-tech/ice-token/nice-tokens"
            >DOCS</a
          >
        </p>
      </div>
      <div
        class="stake__btn btn-wrap border"
        :class="{ disabled: isActionDisabled }"
      >
        <button class="stake__btn btn" @click="actionHandler">
          {{ actionBtnText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
const LockedTimer = () => import("@/components/nice/LockedTimer");
const UpSliderInput = () => import("@/components/ui/tokenInput/UpSliderInput");
const UpDefaultInput = () =>
  import("@/components/ui/tokenInput/UpDefaultInput");
import { mapGetters } from "vuex";
export default {
  props: ["lockedUntil"],

  data() {
    return {
      action: "Stake",
      amount: "",
      tokensRate: 0,
      update: false,
      error: "",
      isNothingToDo: false,
    };
  },

  computed: {
    ...mapGetters({
      tokensInfo: "getNIceStakeObject",
    }),

    rateInfo() {
      if (
        this.tokensInfo.mainToken.userBalance &&
        +this.tokensInfo.mainToken.userBalance > 1
      ) {
        const rate = parseFloat(
          +this.tokensInfo.mainToken.userBalance / this.tokensInfo.tokensRate
        ).toFixed(2);

        const nICEParsed = parseFloat(
          +this.tokensInfo.mainToken.userBalance
        ).toFixed(2);

        return `${nICEParsed} ${
          this.tokensInfo.mainToken.name
        } = ${rate} ${this.tokensInfo.stakeToken.name.toUpperCase()}`;
      }

      const rate = parseFloat(1 / this.tokensInfo.tokensRate).toFixed(4);
      this.tokensRate = rate;

      return `1 ${
        this.tokensInfo.mainToken.name
      } = ${rate} ${this.tokensInfo.stakeToken.name.toUpperCase()}`;
    },

    fromToken() {
      if (this.action === "Stake") {
        return {
          name: this.tokensInfo.stakeToken.name,
          imageName: "Token_ice.svg",
          decimals: +this.tokensInfo.stakeToken.decimals,
          userBalance: this.tokensInfo.stakeToken.userBalance,
        };
      }
      if (this.action === "Unstake") {
        return {
          name: this.tokensInfo.mainToken.name,
          imageName: "nIce.svg",
          decimals: +this.tokensInfo.mainToken.decimals,
          userBalance: this.tokensInfo.mainToken.userBalance,
        };
      }
    },

    toToken() {
      if (this.action === "Stake")
        return {
          name: this.tokensInfo.mainToken.name,
          imageName: "nIce.svg",
          convertToken: this.convertToken,
          decimals: +this.tokensInfo.mainToken.decimals,
        };
      if (this.action === "Unstake")
        return {
          name: this.tokensInfo.stakeToken.name,
          imageName: "Token_ice.svg",
          convertToken: this.convertToken,
          decimals: +this.tokensInfo.stakeToken.decimals,
        };
    },

    convertToken() {
      if (+this.amount === 0) return 0;

      if (this.action === "Stake") {
        return this.parseValue(
          this.amount * +this.tokensInfo.tokensRate,
          this.tokensInfo.stakeToken.decimals
        );
      } else if (this.action === "Unstake") {
        return this.parseValue(
          this.amount / +this.tokensInfo.tokensRate,
          this.tokensInfo.mainToken.decimals
        );
      }
    },

    isActionDisabled() {
      if (this.isUserLocked) return true;
      if (!+this.amount || this.amountError) return true;

      return false;
    },

    actionBtnText() {
      if (
        this.action === "Stake" &&
        !this.tokensInfo.stakeToken.isTokenApprowed
      )
        return "Approve ICE Spending";
      return this.action;
    },

    isUserLocked() {
      return (
        this.lockedUntil &&
        Number(this.lockedUntil) !== 0 &&
        this.action === "Unstake"
      );
    },

    address() {
      return this.$store.getters.getAddress;
    },
  },

  methods: {
    toggleAction() {
      this.update = !this.update;
      this.amount = "";
      if (this.action === "Stake") {
        this.action = "Unstake";
        return false;
      }
      if (this.action === "Unstake") {
        this.action = "Stake";
        return false;
      }
    },

    changeInputValue(value) {
      if (+value > +this.fromToken.userBalance) {
        this.error = `The value cannot be greater than ${this.fromToken.userBalance}`;
        return false;
      }

      this.error = "";
      this.amount = value;
    },

    parseValue(value, decimals) {
      const maxAmount = parseFloat(value).toFixed(20);
      let re = new RegExp("^-?\\d+(?:\.\\d{0," + (decimals || -1) + "})?");
      return maxAmount.toString().match(re)[0];
    },

    async actionHandler() {
      if (this.isUserLocked) return false;
      if (!+this.amount || this.amountError) return false;

      if (this.action === "Stake") {
        if (this.tokensInfo.stakeToken.isTokenApprowed) {
          await this.stake();
          return false;
        }

        const approvedSuccess = await this.approveToken();
        if (approvedSuccess) await this.stake();
      }
      if (this.action === "Unstake") {
        await this.unstake();
      }
    },

    async approveToken() {
      const notifyId = this.createNotification("Approve in progress");
      try {
        const estimateGas = await this.tokensInfo.stakeToken.contractInstance.estimateGas.approve(
          this.tokensInfo.mainToken.contractInstance.address,
          "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
        );

        const gasLimit = 1000 + +estimateGas.toString();

        const tx = await this.tokensInfo.stakeToken.contractInstance.approve(
          this.tokensInfo.mainToken.contractInstance.address,
          "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
          {
            gasLimit,
          }
        );
        const receipt = await tx.wait();

        this.isApproved = true;

        console.log("APPROVE RESP:", receipt);
        this.$store.commit("deleteNotification", notifyId);
        return true;
      } catch (e) {
        console.log("isApprowed err:", e);
        this.$store.commit("deleteNotification", notifyId);
        return false;
      }
    },

    async stake() {
      console.log("STAKE", this.amount);
      const notifyId = this.createNotification("Stake in progress");
      try {
        const amount = this.$ethers.utils.parseEther(this.amount.toString());

        console.log("AMOUNT", amount.toString());

        const estimateGas = await this.tokensInfo.mainToken.contractInstance.estimateGas.mint(
          amount
        );

        const gasLimit = 1000 + +estimateGas.toString();

        console.log("gasLimit:", gasLimit);

        const tx = await this.tokensInfo.mainToken.contractInstance.mint(
          amount,
          {
            gasLimit,
          }
        );
        const receipt = await tx.wait();
        this.$store.commit("deleteNotification", notifyId);
        console.log("stake", receipt);
      } catch (e) {
        this.$store.commit("deleteNotification", notifyId);
        console.log("stake err:", e);
      }
    },

    async unstake() {
      console.log("Unstake");
      const notifyId = this.createNotification("Unstake in progress");
      try {
        const amount = this.$ethers.utils.parseEther(this.amount.toString());
        const userAccount = this.address;

        console.log("AMOUNT", amount.toString());

        const estimateGas = await this.tokensInfo.mainToken.contractInstance.estimateGas.burn(
          userAccount,
          amount
        );

        const gasLimit = 1000 + +estimateGas.toString();

        console.log("gasLimit:", gasLimit);

        const tx = await this.tokensInfo.mainToken.contractInstance.burn(
          userAccount,
          amount,
          {
            gasLimit,
          }
        );

        const receipt = await tx.wait();
        this.$store.commit("deleteNotification", notifyId);
        console.log("Unstake", receipt);
      } catch (e) {
        console.log("Unstake err:", e);
        this.$store.commit("deleteNotification", notifyId);
      }
    },

    createNotification(msg) {
      const id = this.$store.getters.getNotificationId;

      const notification = { id, msg };

      this.$store.commit("addNotification", notification);

      return id;
    },
  },

  components: {
    LockedTimer,
    UpSliderInput,
    UpDefaultInput,
  },
};
</script>

<style lang="scss" scoped>
.stake {
  background: $clrBg2;
  padding: 0 20px;
  max-width: 710px;
  width: 100%;
  border-radius: 12px;
  position: relative;
  margin-right: 20px;
}

.stake__header {
  height: 70px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
}

.stake__header-item {
  max-width: 150px;
  width: 100%;
  text-align: center;
  font-size: 14px;
  line-height: 19px;
  font-weight: 400;
  background: #303030;
  padding: 10px 0;
  border-radius: 12px;
  margin-right: 20px;
  &:nth-last-child(1) {
    margin-right: 0;
  }
}

.stake__body {
  padding: 30px 0;
  max-width: 466px;
  width: 100%;
  margin: 0 auto;
}

.stake__row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 30px;
}

.stake__title {
  font-size: 20px;
  line-height: 27px;
  font-weight: 400;
  text-transform: uppercase;
}

.stake__rates {
  border-radius: 12px;
  border: 0.5px solid rgba(255, 255, 255, 0.2);
  padding: 5px 15px;
  font-size: 14px;
  line-height: 19px;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.04);
}

.stake__change-unstake {
  display: block;
  margin: 5px auto 15px;
  cursor: pointer;
}

.stake__description {
  margin: 10px auto 20px;
  padding: 15px 15px 5px;
  background: #373f40;
  border-radius: 12px;
}

.stake__description-text {
  text-align: center;
  font-weight: 300;
  font-size: 14px;
  line-height: 19px;
  margin-bottom: 10px;
  letter-spacing: 0.02em;

  span {
    font-weight: bold;
  }
}
.stake__description-link {
  text-decoration: underline;
}

.stake__btn {
  display: block;
  width: 100%;
}

@media (max-width: 1024px) {
  .stake {
    max-width: 65%;
  }
}

@media (max-width: 768px) {
  .stake {
    max-width: 100%;
  }
}

@media (max-width: 600px) {
  .stake {
    padding: 0 10px;
  }
}
</style>
