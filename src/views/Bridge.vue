<template>
  <div class="bridge-wrap">
    <div class="bridge-view" v-if="!warningText">
      <div class="bridge-container">
        <!-- <div class="bridge-tabs">
          <div class="btn-wrap" :class="{ active: activeStep === 1 }">
            <p class="btn">1 Choose amounts</p>
          </div>
          <div class="btn-wrap" :class="{ active: activeStep === 2 }">
            <p class="btn">2 Join pool</p>
          </div>
        </div> -->

        <div class="bridge-tab">
          <div class="title-wrap">
            <h3 class="bridge-tab-title">Tokens from Chain to Chain</h3>
          </div>

          <WrapperNetworks
            v-if="bridgeObject"
            :fromChains="bridgeObject.fromChains"
            :toChains="bridgeObject.toChains"
            @changeToChain="updateTargetChain"
          />

          <div class="bridge-tab-slider">
            <template v-if="isUserLocked">
              <LockedTimer :finalTime="this.bridgeObject.lockedUntil" />
            </template>
            <UpSliderInput
              v-if="bridgeObject"
              :name="bridgeObject.tokenInfo.name"
              :imageName="bridgeObject.tokenInfo.icon"
              :decimals="18"
              :userBalance="bridgeObject.balance"
              :error="amountError"
              :parentValue="amount"
              @changeInputValue="updateMainValue"
            />
          </div>

          <div class="bridge-desc" v-if="targetChainInfo">
            <p class="bridge-desc-text">
              Crosschain Fee is <span>{{ targetChainInfo.fee }}%</span>, Minimum
              Crosschain Fee is
              <span>{{ targetChainInfo.feeAmount }} nICE</span>, Maximum
              Crosschain Fee is
              <span>{{ targetChainInfo.feeAmountMax }} nICE</span>
            </p>
            <p class="bridge-desc-text">
              Minimum Crosschain Amount is
              <span>{{ targetChainInfo.minAmount }} nICE</span>
            </p>
            <p class="bridge-desc-text">
              Maximum Crosschain Amount is
              <span>{{ targetChainInfo.maxAmount }} nICE</span>
            </p>
            <p class="bridge-desc-text">
              Estimated Time of Crosschain Arrival is <span>10-30 min</span>
            </p>
            <p class="bridge-desc-text">
              Crosschain amount larger than <span>43 200 nICE</span> could take
              up to <span>12 hours</span>
            </p>
          </div>
          <div
            class="btn-wrap border width-100"
            :class="{ disabled: disableBtn }"
          >
            <button class="btn width-100" @click="actionHandler">
              {{ actionBtnText }}
            </button>
          </div>

          <div class="links-wrap">
            <a
              class="link-item"
              href="https://anyswap.exchange/#/router"
              target="_blank"
              >Powered by Anyswap Network</a
            >
            <a class="link-item" href="#">Need Help?</a>
          </div>
        </div>
      </div>
    </div>
    <div class="error-wrapper" v-if="warningText">
      <Error :errorText="warningText" />
    </div>
  </div>
</template>

<script>
const LockedTimer = () => import("@/components/nice/LockedTimer");
const UpSliderInput = () => import("@/components/ui/tokenInput/UpSliderInput");
const WrapperNetworks = () => import("@/components/Bridge/WrapperNetworks");
const Error = () => import("@/components/ui/Error.vue");

import bridgeMixin from "@/mixins/bridge";
import { mapGetters } from "vuex";

export default {
  mixins: [bridgeMixin],
  data() {
    return {
      activeStep: 1,
      isCorectNetwork: true,
      amount: "",
      amountError: "",
      toChainId: null,
      warningText: "",
    };
  },
  computed: {
    ...mapGetters({ bridgeObject: "getBridgeObject" }),

    actionBtnText() {
      if (!this.bridgeObject?.isTokenApprove && this.chainId === 1)
        return "Approve nICE Spending";

      return "Bridge";
    },

    disableBtn() {
      if (!this.bridgeObject?.isTokenApprove && this.chainId === 1)
        return false;
      if (+this.amount === 0) return true;
      if (this.amountError) return true;
      if (this.isUserLocked) return true;

      return false;
    },

    targetChainId() {
      if (this.toChainId) return this.toChainId;
      return this.bridgeObject?.chainsInfo[0].chainId;
    },

    targetChainInfo() {
      return this.bridgeObject?.chainsInfo.find(
        (item) => item.chainId === this.targetChainId
      );
    },

    isUserLocked() {
      return (
        this.bridgeObject?.lockedUntil && Number(this.bridgeObject?.lockedUntil)
      );
    },
  },

  watch: {
    toChainId() {
      this.updateMainValue(this.amount);
    },
  },

  methods: {
    createNotification(msg) {
      const id = this.$store.getters.getNotificationId;

      const notification = { id, msg };

      this.$store.commit("addNotification", notification);

      return id;
    },

    updateTargetChain(chainId) {
      this.toChainId = chainId;
    },

    async actionHandler() {
      if (!this.bridgeObject.isTokenApprove && this.chainId === 1) {
        await this.approveToken(
          this.bridgeObject.tokenContractInstance,
          this.bridgeObject.contractInstance.address
        );

        return false;
      }

      this.bridge();
    },

    async bridge() {
      const notifyId = this.createNotification("Bridge transfer in progress");
      try {
        let re = new RegExp(`^-?\\d+(?:\.\\d{0,` + (18 || -1) + `})?`);
        const parsedAmount = this.amount.toString().match(re)[0];

        const amount = this.$ethers.utils.parseUnits(parsedAmount, 18);

        const toChainId = this.$ethers.BigNumber.from(this.targetChainId);

        const contract = this.bridgeObject.contractInstance;
        const methodName = this.bridgeObject.methodName;

        const tokenAddr = this.targetChainInfo.tokenAddr;

        console.log("amount", amount);
        console.log("amount", +amount);
        console.log("toChainId", toChainId);
        console.log("methodName", methodName);
        console.log("tokenAddr", tokenAddr);

        const estimateGas = await contract.estimateGas[methodName](
          tokenAddr,
          this.account,
          amount,
          toChainId
        );

        const gasLimit = 1000 + +estimateGas.toString();

        const result = await contract[methodName](
          tokenAddr,
          this.account,
          amount,
          toChainId,
          {
            value: 0,
            gasLimit,
          }
        );

        this.$store.commit("deleteNotification", notifyId);

        console.log(result);

        console.log("gasLimit:", gasLimit);
      } catch (e) {
        console.log("SWAP ERR:", e);
        this.$store.commit("deleteNotification", notifyId);
      }
    },

    updateMainValue(value) {
      this.amountError = "";

      if (Number(value) > Number(this.bridgeObject.balance)) {
        this.amountError = `The value cannot be greater than ${this.bridgeObject.balance}`;
        return false;
      }

      if (Number(value) > Number(this.targetChainInfo.maxAmount)) {
        this.amountError = `The value cannot be greater than ${this.targetChainInfo.maxAmount}`;
        return false;
      }

      if (
        Number(value) &&
        Number(value) < Number(this.targetChainInfo.minAmount)
      ) {
        this.amountError = `Minimum bridge requirement not met`;
        return false;
      }

      this.amount = value;
    },
  },

  async created() {
    const isConnected = this.$store.getters.getWallet.address;

    if (!isConnected) {
      this.warningText = "Please connect to use Bridge";
      return false;
    }

    const acceptedNetworks = ["43114", "1", "250", "56", "42161"];

    if (!acceptedNetworks.includes(this.chainId.toString())) {
      this.warningText = "No Bridge on this network";
      this.isCorectNetwork = false;
    } else {
      await this.createBridgeConfig();
    }
  },

  components: {
    WrapperNetworks,
    UpSliderInput,
    Error,
    LockedTimer,
  },
};
</script>

<style lang="scss" scoped>
.bridge-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
}

.links-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 30px;

  .link-item {
    font-size: 12px;
    line-height: 1;
    transition: all 0.3s ease;
    color: #868686;

    &:hover {
      color: #2bd2f7;
      text-decoration: underline;
    }
  }
}

.bridge-view {
  margin: 50px auto;
}

.bridge-container {
  background: $clrBg2;
  padding: 0 20px;
  max-width: 710px;
  min-height: 605px;
  width: 100%;
  border-radius: 12px;
  position: relative;
  margin: 0 auto;
}

.bridge-tabs {
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;

  .btn-wrap {
    width: 150px;
    margin: 5px;
  }

  .btn {
    width: 100%;
    text-align: center;
    font-size: 14px;
    line-height: 19px;
    font-weight: 400;
    background: #303030;
    padding: 10px 0;
  }
}

.bridge-tab {
  padding: 30px 0;
  max-width: 466px;
  width: 100%;
  margin: 0 auto;
}

.title-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.bridge-tab-title {
  font-size: 20px;
  line-height: 27px;
  font-weight: 400;
  margin-bottom: 40px;
}

.bridge-tab-slider {
  margin: 30px 0;
}

.bridge-desc {
  margin: 10px auto 20px;
  padding: 15px 15px 5px;
  background: #373f40;
  border-radius: 12px;
}

.bridge-desc-text {
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

.error-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

@media (max-width: 600px) {
  .bridge-container {
    padding: 0 10px;
  }

  .bridge-tab {
    padding: 20px 0;
  }

  .bridge-tab-title {
    margin-bottom: 20px;
  }
}
</style>
