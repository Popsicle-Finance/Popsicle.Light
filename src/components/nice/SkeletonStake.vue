<template>
  <div class="stake">
    <div class="stake__header">
      <div class="stake__header-item">1 Choose amounts</div>
      <div class="stake__header-item">2 Join</div>
    </div>
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
        @changeInputValue="changeInputValue"
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
      />
      <div class="stake__description">
        <p class="stake__description-text">
          Stake your ICE tokens and obtain nICE in order to take part in the fee
          sharing of Popsicle Finance
        </p>
        <p class="stake__description-text">
          10% of the platform profits will be redirected to nICE holders!
        </p>
        <p class="stake__description-text">
          When you unstake your nICE tokens, you will receive all your deposited
          ICE plus any additional fees collected!
        </p>
        <p class="stake__description-text">
          There is a xx hour time lock on deposits to prevent front running.
        </p>
        <p class="stake__description-text">
          Read more about how ICE staking works in our DOCS
        </p>
      </div>
      <div class="stake__btn btn-wrap border">
        <button
          class="stake__btn btn"
          @click="actionHandler"
          :class="action === 'UnStake' && lockedUntil && 'btn-disabled'"
        >
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
      amount: 0,
      tokensRate: 0,
      update: false,
      error: "",
      isNothingToDo: false,
    };
  },

  computed: {
    ...mapGetters({
      tokensInfo: "getNIceStakeObject",
      isApproved: "isTokenApproved",
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
          userBalance: +this.tokensInfo.stakeToken.userBalance,
        };
      }
      if (this.action === "UnStake") {
        return {
          name: this.tokensInfo.mainToken.name,
          imageName: "nIce.svg",
          decimals: +this.tokensInfo.mainToken.decimals,
          userBalance: +this.tokensInfo.mainToken.userBalance,
        };
      }
    },

    toToken() {
      if (this.action === "Stake")
        return {
          name: this.tokensInfo.mainToken.name,
          imageName: "nIce.svg",
          convertToken: +this.convertToken,
          decimals: +this.tokensInfo.mainToken.decimals,
        };
      if (this.action === "UnStake")
        return {
          name: this.tokensInfo.stakeToken.name,
          imageName: "Token_ice.svg",
          convertToken: +this.convertToken,
          decimals: +this.tokensInfo.stakeToken.decimals,
        };
    },

    convertToken() {
      if (this.action === "Stake") {
        return this.parseValue(
          this.amount / +this.tokensRate,
          this.tokensInfo.stakeToken.decimals
        );
      } else if (this.action === "UnStake") {
        return this.parseValue(
          this.amount * +this.tokensRate,
          this.tokensInfo.mainToken.decimals
        );
      }
    },

    actionBtnText() {
      if (!this.isApproved) {
        return "Approved";
      } else if (this.isNothingToDo) {
        return " Nothing to do ";
      } else if (this.action === "Stake" && this.isApproved) {
        return "Stake";
      } else if (this.action === "UnStake" && this.isApproved) {
        return "UnStake";
      }
    },

    isUserLocked() {
      return (
        this.lockedUntil &&
        Number(this.lockedUntil) !== 0 &&
        this.action === "UnStake"
      );
    },
  },

  methods: {
    toggleAction() {
      this.update = !this.update;
      if (this.action === "Stake") {
        this.action = "UnStake";
        return false;
      }
      if (this.action === "UnStake") {
        this.action = "Stake";
        return false;
      }
    },

    changeInputValue(value = 0, balance = 0) {
      this.error = "";
      if (!balance) {
        this.isNothingToDo = true;
      } else {
        this.isNothingToDo = false;
      }

      if (value > balance) {
        this.isNothingToDo = true;
        this.error = `The value cannot be greater than ${Number(
          balance
        ).toFixed(2)}`;
      } else {
        this.amount = value;
      }
    },

    parseValue(value, decimals) {
      const maxAmount = parseFloat(value).toFixed(20);
      let re = new RegExp("^-?\\d+(?:\.\\d{0," + (decimals || -1) + "})?");
      return maxAmount.toString().match(re)[0];
    },

    actionHandler() {
      if (this.isApproved) {
        if (this.isNothingToDo) {
          return false;
        } else if (this.action === "Stake") {
          this.stake();
        } else if (this.action === "UnStake" && !this.lockedUntil) {
          this.unstake();
        }
      } else {
        this.approveToken();
      }
    },

    async approveToken() {
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
        return true;
      } catch (e) {
        console.log("isApprowed err:", e);
        return false;
      }
    },

    async stake() {
      console.log("STAKE", this.amount);
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

        console.log("stake", receipt);
      } catch (e) {
        console.log("stake err:", e);
      }
    },

    async unstake() {
      console.log("UNSTAKE");
      try {
        const amount = this.$ethers.utils.parseEther(this.amount.toString());
        const userAccount = await window.ethereum.selectedAddress;

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

        console.log("Unstake", receipt);
      } catch (e) {
        console.log("Unstake err:", e);
      }
    },
  },

  components: {
    LockedTimer,
    UpSliderInput,
    UpDefaultInput,
  },
};
</script>

<style lang="scss">
.stake {
  background: $clrBg2;
  padding: 0 20px;
  max-width: 710px;
  width: 100%;
  border-radius: 12px;
  position: relative;
  margin-right: 20px;
  @media (max-width: 1024px) {
    max-width: 65%;
  }
  @media (max-width: 768px) {
    max-width: 100%;
  }
  &__header {
    height: 70px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    justify-content: center;
    align-items: center;
    &-item {
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
  }
  &__body {
    padding: 30px 0;
    max-width: 466px;
    width: 100%;
    margin: 0 auto;
  }
  &__row {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 30px;
  }
  &__title {
    font-size: 20px;
    line-height: 27px;
    font-weight: 400;
    text-transform: uppercase;
  }
  &__rates {
    border-radius: 12px;
    border: 0.5px solid rgba(255, 255, 255, 0.2);
    padding: 5px 15px;
    font-size: 14px;
    line-height: 19px;
    font-weight: 600;
  }
  &__change-unstake {
    display: block;
    margin: 5px auto 15px;
    cursor: pointer;
  }
  &__description {
    margin: 10px auto 20px;
    padding: 15px 15px 5px;
    background: #373f40;
    border-radius: 12px;
    &-text {
      text-align: center;
      font-weight: 300;
      font-size: 14px;
      line-height: 19px;
      margin-bottom: 10px;
      letter-spacing: 0.02em;
    }
  }
  &__btn {
    display: block;
    width: 100%;
  }
}
</style>
