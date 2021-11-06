<template>
  <div class="nice" :class="chain && 'nice_notChain'" v-if="load">
    <div class="nice__wrap" v-if="chain">
      <Stake :lockedUntil="lockedUntil" />
      <StakeInfo :token="tokensInfo" />
    </div>
    <div class="nice__chain" v-else>
      <Error :errorText="error" />
    </div>
  </div>
</template>

<script>
const Stake = () => import("@/components/nice/Stake");
const StakeInfo = () => import("@/components/nice/StakeInfo");
const Error = () => import("@/components/ui/Error");
import { mapGetters } from "vuex";
import nIceMixin from "@/mixins/nIce";
import moment from "moment";
export default {
  mixins: [nIceMixin],
  data() {
    return {
      chain: true,
      load: false,
      error: "",
      lockedUntil: false,
      locked: null,
      updateLokedInterval: null,
    };
  },
  computed: {
    ...mapGetters({
      wallet: "getWallet",
      chainId: "getChain",
      tokensInfo: "getNIceStakeObject",
    }),
  },
  methods: {
    async initIceStakePool() {
      if (!this.wallet.address || !this.wallet.signer) {
        this.validateIceStakePool("Please Connect Wallet");
        return false;
      }
      if (this.chainId !== 1) {
        this.validateIceStakePool(
          "nICE is not available on this chain. Please switch to Ethereum Mainnet."
        );
        return false;
      }
      await this.createNIceStakePool();
      this.validateIceStakePool("", true);
    },
    validateIceStakePool(error, chain = false) {
      if (error) {
        this.error = error;
      }
      this.chain = chain;
      this.load = true;
    },
    async getUserLocked() {
      try {
        const userAccount = this.wallet.address;

        const infoResp = await this.tokensInfo.mainToken.contractInstance.users(
          userAccount,
          {
            gasLimit: 1000000,
          }
        );

        const lockTimestamp = infoResp.lockedUntil.toString();

        const currentTimestamp = moment()
          .unix()
          .toString();

        if (lockTimestamp && lockTimestamp > currentTimestamp)
          return lockTimestamp;
        return false;
      } catch (e) {
        console.log("isApprowed err:", e);
      }
    },
  },
  beforeDestroy() {
    clearInterval(this.updateNIceInterval);
  },
  async created() {
    await this.initIceStakePool();
    this.lockedUntil = await this.getUserLocked();

    this.updateNIceInterval = setInterval(async () => {
      await this.initIceStakePool();
      this.lockedUntil = await this.getUserLocked();
    }, 10000);
  },

  components: {
    Stake,
    StakeInfo,
    Error,
  },
};
</script>

<style lang="scss">
.nice {
  max-width: 1125px;
  padding: 0 $containerSidePadding;
  width: 100%;
  margin: 0 auto;
  &_notChain {
    margin: 50px auto;
  }
  &__wrap {
    display: flex;
    justify-content: space-between;
    @media (max-width: 768px) {
      flex-direction: column-reverse;
    }
  }
  &__chain {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80vh;
  }
}
</style>
