import farmPools from "@/utils/farmPools/pools";
import { tokenPrices, numberWithCommas } from "@/utils/helpers.js";

import erc20Abi from "@/utils/abiERC20";

export default {
  data() {
    return {
      prices: {
        spellPrice: null,
        mimPrice: null,
        icePrice: null,
        wethPrice: null,
        ohmPrice: null,
        timePrice: null,
      },
    };
  },
  computed: {
    chainId() {
      return this.$store.getters.getChain;
    },
    signer() {
      return this.$store.getters.getSigner;
    },
    account() {
      return this.$store.getters.getAddress;
    },
  },
  methods: {
    async createFarmPools() {
      const chainPools = farmPools.filter(
        (pool) => pool.contractChain === this.chainId
      );

      try {
        const pools = await Promise.all(
          chainPools.map((pool) => this.createFarmPool(pool))
        );

        console.log("STAND CREATED FARMS POOLS:", pools);

        this.$store.commit("setFarmPools", pools);
        this.$store.commit("setFarmPoolsLoading", false);
      } catch (e) {
        console.log("createFarmPools err", e);
      }
    },
    async createFarmPool(farmPoolInfo) {
      const contractInstance = new this.$ethers.Contract(
        farmPoolInfo.contract.address,
        JSON.stringify(farmPoolInfo.contract.abi),
        this.signer
      );

      let poolInfo;

      try {
        poolInfo = await contractInstance.poolInfo(farmPoolInfo.poolId, {
          gasLimit: 600000,
        });
      } catch (e) {
        console.log("pool infi err:", e);
      }

      const erc20ContractInstance = new this.$ethers.Contract(
        poolInfo.stakingToken,
        JSON.stringify(erc20Abi),
        this.signer
      );

      let tokenContractInstance = new this.$ethers.Contract(
        farmPoolInfo.token.address,
        JSON.stringify(erc20Abi),
        this.signer
      );

      let tokenPrice = await this.getTokenPrice(farmPoolInfo.token.name);

      let { lpYield, lpPrice } = await this.getLPYield(
        poolInfo.stakingToken,
        tokenContractInstance,
        erc20ContractInstance,
        tokenPrice
      );

      let poolYield = await this.getYield(
        contractInstance,
        lpYield,
        poolInfo.stakingTokenTotalAmount,
        poolInfo.allocPoint,
        poolInfo.accIcePerShare
      );

      let poolRoi = await this.getRoi(poolYield, tokenPrice);

      const tvl = await this.getTVL(
        poolInfo.stakingTokenTotalAmount,
        lpPrice
      );

      const allowance = await this.getAllowance(
        erc20ContractInstance,
        farmPoolInfo.contract.address
      );

      const userInfo = await contractInstance.userInfo(
        farmPoolInfo.poolId,
        this.account
      );

      const positionBalance = this.$ethers.utils.formatEther(
        userInfo?.amount
      );

      const userReward = await contractInstance.pendingIce(
        farmPoolInfo.poolId,
        this.account
      );

      const parsedReward = this.$ethers.utils.formatEther(
        userReward
      );

      const lpBalance = await this.getBalance(erc20ContractInstance);

      return {
        name: farmPoolInfo.name,
        nameSubtitle: farmPoolInfo.nameSubtitle,
        stakingTokenLink: farmPoolInfo.stakingTokenLink,
        poolIcon: farmPoolInfo.poolIcon,
        stakingTokenIcon: farmPoolInfo.stakingTokenIcon,
        id: farmPoolInfo.id,
        poolId: farmPoolInfo.poolId,
        contractInstance,
        stakingTokenName: farmPoolInfo.stakingTokenName,
        stakingTokenType: farmPoolInfo.stakingTokenType,
        lpPrice,
        contractAddress: farmPoolInfo.contract.address,
        poolInfo,
        userInfo,
        userReward,
        parsedReward,
        tokenPrice,
        erc20ContractInstance,
        tokenPrice,
        poolYield,
        poolRoi,
        poolTvl: numberWithCommas(parseInt(tvl)),
        poolNumberTvl: tvl,
        tokenName: farmPoolInfo.token.name,
        allowance,
        lpBalance,
        positionBalance
      };
    },
    async getYield(
      contractInstance,
      amount = 1000,
      stakingTokenTotalAmount,
      allocPoint,
      accIcePerShare
    ) {
      try {
        const divide = +this.$ethers.utils.formatEther(stakingTokenTotalAmount.toString()) + amount;

        const multiplier = 86400;

        const icePerSecondResp = await contractInstance.icePerSecond();
        const icePerSecond = +icePerSecondResp;

        const totalAllocPointResp = await contractInstance.totalAllocPoint();
        const totalAllocPoint = +totalAllocPointResp;

        let iceReward =
          (+multiplier * +icePerSecond * +allocPoint) / +totalAllocPoint;

        let loacalAccIcePerShare =
          +accIcePerShare +
          (+iceReward * Math.pow(10, 12)) / +divide;

        const accIcePerShareConst =
          +loacalAccIcePerShare +
          (+iceReward * Math.pow(10, 12)) / +divide;

        const rewardDebt =
          (+amount * +loacalAccIcePerShare) /
          Math.pow(10, 12);

        const pending =
          (+amount * +accIcePerShareConst) /
            Math.pow(10, 12) -
          +rewardDebt;

        const result = parseFloat(
          this.$ethers.utils.formatUnits(pending.toLocaleString("fullwide", { useGrouping: false }))
        ).toFixed(2);
        return result;
      } catch (error) {
        console.log("getYield", error);
        return 0;
      }
    },
    async getLPYield(stakingToken, iceInstance, erc20, tokenPrice) {
      try {
        let IceInSlpTotal = await iceInstance.balanceOf(stakingToken);
        let totalTokensSLPMinted = await erc20.totalSupply();

        let icePerLp;
        if (+IceInSlpTotal > 0) {
          icePerLp = +totalTokensSLPMinted / +IceInSlpTotal;
        }
        if (+IceInSlpTotal === 0) {
          icePerLp = 0;
        }
        const lpPrice =
          (+IceInSlpTotal /
            +totalTokensSLPMinted) *
          +tokenPrice *
          2;

        let IcePer1000Bucks;
        if (+tokenPrice > 0) IcePer1000Bucks = 1000 / +tokenPrice;
        if (+tokenPrice === 0) IcePer1000Bucks = 0;

        let res = (+IcePer1000Bucks * +icePerLp) / 2; // for LP pool

        console.log("res", res)

        return { lpYield: res, lpPrice };
      } catch (error) {
        console.log(error);
      }
    },
    async getRoi(value, price) {
      try {
        const dollarPerDay =
          ((parseFloat(value) * parseFloat(price) * 100) / 1000) * 365;

        return parseFloat(dollarPerDay).toFixed(2);
      } catch (error) {
        console.log("getRoi", error);
      }
    },
    async getTVL(stakingTokenTotalAmount, price) {
      try {
        const ttl = parseFloat(
          this.$ethers.utils.formatEther(stakingTokenTotalAmount.toString())
        ).toFixed(2);

        const tvl = parseFloat(ttl.toString()) * parseFloat(price.toString());

        return tvl;
      } catch (error) {
        console.log(error);
      }
    },
    async getAllowance(contractInstance, allowAddrr) {
      try {
        const result = await contractInstance.allowance(
          this.account,
          allowAddrr
        );

        return +result > 0 ? true : false;
      } catch (error) {
        console.log("getAllowance:", error);
      }
    },
    async getTokenPrice(token) {
      if (token.toUpperCase() === "ICE") {
        if (this.prices.icePrice) return this.prices.icePrice;

        const priceResp = await tokenPrices(["ice"]);
        this.prices.icePrice = priceResp.ice;
        return priceResp.ice;
      }
    },
    async getBalance(tokenContract) {
      try {
        const balance = await tokenContract.balanceOf(
          this.account
        );

        const userBalanceParsed = this.$ethers.utils.formatEther(
          balance.toString()
        );

        return userBalanceParsed
      } catch (error) {
        console.log(error);
      }
    },
  },
};
