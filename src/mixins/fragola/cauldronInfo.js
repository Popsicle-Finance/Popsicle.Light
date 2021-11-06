export default {
  computed: {
    account() {
      return this.wallet.address;
    },
  },
  methods: {
    async createCauldronInfo(pool) {
      const signer = this.wallet.signer;

      const masterContract = new this.$ethers.Contract(
        pool.boxContract.address,
        JSON.stringify(pool.boxContract.abi),
        signer
      );

      const oracleContract = new this.$ethers.Contract(
        pool.oracle.address,
        JSON.stringify(pool.oracle.abi),
        signer
      );

      const poolContract = new this.$ethers.Contract(
        pool.contract.address,
        JSON.stringify(pool.contract.abi),
        signer
      );

      const tokenContract = new this.$ethers.Contract(
        pool.token.address,
        JSON.stringify(pool.token.abi),
        signer
      );

      const pairTokenContract = new this.$ethers.Contract(
        pool.pairToken.address,
        JSON.stringify(pool.token.abi),
        signer
      );

      const swapContract = new this.$ethers.Contract(
        pool.swapContractInfo.address,
        JSON.stringify(pool.swapContractInfo.abi),
        signer
      );

      const reverseSwapContract = new this.$ethers.Contract(
        pool.reverseSwapContractInfo.address,
        JSON.stringify(pool.reverseSwapContractInfo.abi),
        signer
      );

      const oracleExchangeRate = await this.getOracleExchangeRateByData(
        oracleContract,
        pool.token.oracleDatas.data
      );

      const contractExchangeRate = await this.getContractExchangeRate(
        poolContract
      );

      let tokenPairRate;
      let askUpdatePrice = false;

      if (
        oracleExchangeRate.toString() > contractExchangeRate.toString() &&
        !contractExchangeRate.eq(0)
      ) {
        tokenPairRate = contractExchangeRate;
        askUpdatePrice = true;
      } else if (contractExchangeRate.eq(0)) {
        tokenPairRate = oracleExchangeRate;
        askUpdatePrice = true;
      } else if (
        oracleExchangeRate.toString() !== contractExchangeRate.toString()
      ) {
        tokenPairRate = oracleExchangeRate;
      } else {
        tokenPairRate = oracleExchangeRate;
      }

      const userBorrowPart = await this.getUserBorrowPart(poolContract);

      const userCollateralShare = await this.getUserCollateralShare(
        masterContract,
        poolContract,
        pool.token.decimals,
        pool.token.address
      );

      let totalCollateralShare;
      try {
        totalCollateralShare = await poolContract.totalCollateralShare();
      } catch (e) {
        console.log("totalCollateralShare Err:", e);
      }

      let totalBorrow;
      try {
        const totalBorrowResp = await poolContract.totalBorrow();
        totalBorrow = this.$ethers.utils.formatUnits(totalBorrowResp.base, 18);
      } catch (e) {
        console.log("totalBorrow Err:", e);
      }

      const dynamicBorrowAmount = await this.getMaxBorrow(
        masterContract,
        pool.contract.address,
        pool.pairToken.address
      );

      let userBalance;
      try {
        userBalance = await tokenContract.balanceOf(this.account, {
          gasLimit: 600000,
        });
      } catch (e) {
        console.log("userBalance Err:", e);
      }

      let userPairBalance;
      try {
        userPairBalance = await pairTokenContract.balanceOf(this.account, {
          gasLimit: 600000,
        });
      } catch (e) {
        console.log("userBalance Err:", e);
      }

      const networkBalance = await signer.getBalance();

      const tokenPairPrice = 1;

      const tokenPrice = Number(
        this.$ethers.utils.formatUnits(tokenPairRate, pool.token.decimals)
      );

      const liquidationPrice = this.getLiquidationPrice(
        userCollateralShare,
        userBorrowPart,
        pool.ltv
      );

      const tvl = this.parseTotalCollateralToUsd(
        totalCollateralShare,
        tokenPairRate,
        pool.token.decimals
      );

      return {
        userBorrowPart,
        userCollateralShare,
        contractInstance: poolContract,
        masterContractInstance: masterContract,
        totalCollateralShare,
        totalBorrow,
        userBalance,
        networkBalance,
        userPairBalance,
        ltv: pool.ltv,
        tvl,
        askUpdatePrice,
        pairToken: pool.pairToken,
        pairTokenContract,
        tokenPairPrice,
        tokenPrice,
        dynamicBorrowAmount,
        liquidationPrice,
        token: {
          contract: tokenContract,
          name: pool.token.name,
          address: pool.token.address,
          decimals: pool.token.decimals,
          oracleExchangeRate: tokenPairRate,
        },
        swapContract,
        reverseSwapContract,
      };
    },
    async getOracleExchangeRateByData(oracleContract, data) {
      try {
        const rate = await oracleContract.peekSpot(data, {
          gasLimit: 300000,
        });

        return rate;
      } catch (e) {
        console.log("getOracleExchangeRate err:", e);
      }
    },
    async getUserBorrowPart(poolContract) {
      try {
        const userBorrowPart = await poolContract.userBorrowPart(this.account);

        const parsedBorrowed = this.$ethers.utils.formatUnits(
          userBorrowPart.toString()
        );
        return parsedBorrowed;
      } catch (e) {
        console.log("getuserBorrowPartNonce err:", e);
      }
    },
    async getUserCollateralShare(
      masterContract,
      poolContract,
      decimals,
      tokenAddr
    ) {
      try {
        const userCollateralShare = await poolContract.userCollateralShare(
          this.account
        );

        const toShare = await masterContract.toShare(
          tokenAddr,
          userCollateralShare,
          false
        );

        const parsedCollateral = this.$ethers.utils.formatUnits(
          toShare.toString(),
          decimals
        );

        return parsedCollateral;
      } catch (e) {
        console.log("getUserCollateralShare err:", e);
      }
    },
    async getMaxBorrow(bentoContract, poolAddr, tokenAddr) {
      try {
        const poolBalance = await bentoContract.balanceOf(tokenAddr, poolAddr, {
          gasLimit: 1000000,
        });

        const toAmount = await bentoContract.toAmount(
          tokenAddr,
          poolBalance,
          false
        );

        const parsedAmount = this.$ethers.utils.formatUnits(toAmount, 18);
        return parsedAmount;
      } catch (e) {
        console.log("getMaxBorrow err:", e);
        return false;
      }
    },
    parseTotalCollateralToUsd(
      totalCollateralShare,
      oracleExchangeRate,
      decimals
    ) {
      const tokenPrice =
        1 / this.$ethers.utils.formatUnits(oracleExchangeRate, decimals);

      const parsedCollateral = this.$ethers.utils.formatUnits(
        totalCollateralShare,
        decimals
      );

      return parsedCollateral * tokenPrice;
    },
    async getContractExchangeRate(contract) {
      try {
        const rate = await contract.exchangeRate({
          gasLimit: 300000,
        });

        return rate;
      } catch (e) {
        console.log("getContractExchangeRate err:", e);
      }
    },
    getLiquidationPrice(userCollateralShare, userBorrowPart, ltv) {
      const liquidationMultiplier = ltv / 100;

      const liquidationPrice =
        userBorrowPart / userCollateralShare / liquidationMultiplier || 0;

      return liquidationPrice;
    },
  },
};
