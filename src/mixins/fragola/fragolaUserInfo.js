import { PoolV3Actions } from "@/utils/sorbetto/libs/PoolV3Actions";
import { GetSqrtRatioAtTick } from "@/utils/sorbetto/libs/TickMath";
import { GetLiquidityForAmounts } from "@/utils/sorbetto/libs/LiquidityAmounts";
import { mapGetters } from "vuex";

export default {
    computed: {
        ...mapGetters({ wallet: "getWallet" }),
    },
    methods: {
        async getUserPoolInfo(pool) {
    
            const { address } = this.wallet;
    
            const userChainBalance = await this.web3.eth.getBalance(address);
    
            const token0Balance = await this.getUserTokenBalance(address, pool.token0.contractInstance, pool.token0.decimals);
            const token1Balance = await this.getUserTokenBalance(address, pool.token1.contractInstance, pool.token1.decimals);
    
            const userLpBalance = await this.getUserTokenBalance(address, pool.contractInstance, pool.lpDecimals);
    
            const userLpBalanceParsed = this.parseLpBalance(userLpBalance);
    
            // Vitalik init pools
            const { tokensOwed0, tokensOwed1 } = await this.getUserPendingRewardsLocal(pool.poolContractInstance, pool.contractInstance, address);
            const userLpInUsdLocal = await this.getLpPrice(userLpBalance, pool.contractInstance, pool.poolContractInstance, pool.token0.decimals, pool.token1.decimals, pool.token0.price, pool.token1.price, tokensOwed0, tokensOwed1)
    
            // Vitalik init pools
            // let userLpInUsdLocal = 1

            const token0Allowance = await this.getTokenAllowance(address, pool.address, pool.token0.contractInstance);
            const token1Allowance = await this.getTokenAllowance(address, pool.address, pool.token1.contractInstance);
    
            const token0SwapAllowance = await this.getTokenAllowance(address, pool.swapAddress, pool.token0.contractInstance);
            const token1SwapAllowance = await this.getTokenAllowance(address, pool.swapAddress, pool.token1.contractInstance);
    
            return {
                chainBalance:  this.$ethers.utils.formatUnits(userChainBalance, 18),
                userLpBalance,
                lpBalance: userLpBalanceParsed,
                lpBalancenUsd: userLpInUsdLocal,
    
                token0Info: {
                    balance: token0Balance,
                    allowance: token0Allowance,
                    swapAllowance: token0SwapAllowance
                },
                token1Info: {
                    balance: token1Balance,
                    allowance: token1Allowance,
                    swapAllowance: token1SwapAllowance
                }
            }
    
        },
        async getUserTokenBalance(user, tokenContract, decimals) {
            try {
                const balance = await tokenContract.methods.balanceOf(user).call();
                const parsedResult = this.$ethers.utils.formatUnits(balance, decimals);
    
                if (decimals === 0) {
                    return parseFloat(parsedResult).toFixed(0)
                }
    
                return parsedResult
            } catch (e) {
                console.log("getUserTokenBalance error:", e)
            }
        },
        parseLpBalance(userLpBalance) {
            if (!+userLpBalance) return 0;
    
    
            let re = new RegExp(
                // eslint-disable-next-line no-useless-escape
                `^-?\\d+(?:\.\\d{0,` + (4 || -1) + `})?`
            );
    
            if (+userLpBalance < 0.0001 && +userLpBalance !== 0) {
    
                const start = userLpBalance.slice(0, 1);
                const endToParse = `${userLpBalance.slice(1)}`;
    
                const persedEnd = endToParse.replace(new RegExp(
                    // eslint-disable-next-line no-useless-escape
                    `(?<=\.)[0]*`
                ), '');
    
                return `${start}..${persedEnd.slice(0, 5)}`
            }
    
    
            return userLpBalance.toString().match(re)[0];
        },
        async getUserPendingRewardsLocal(poolContract, fragolaContract, userAccount) {
            try {
                let sim = new PoolV3Actions(poolContract);
                const date = parseFloat(new Date() / 1000).toFixed(0);
    
                let tickLower = await fragolaContract.methods.tickLower().call();
                let tickUpper = await fragolaContract.methods.tickUpper().call();
    
                await sim.Burn(tickLower, tickUpper, this.$ethers.BigNumber.from("0"), fragolaContract._address,
                    date);
    
                const tokensOwed0ContractPercent = this.$ethers.BigNumber.from(sim.CurrentPosition.tokensOwed0).div(10);
                const tokensOwed1ContractPercent = this.$ethers.BigNumber.from(sim.CurrentPosition.tokensOwed1).div(10);
                
    
                // івпекурп
                const tokensOwed0 = this.$ethers.BigNumber.from(sim.CurrentPosition.tokensOwed0).sub(tokensOwed0ContractPercent);
                const tokensOwed1 = this.$ethers.BigNumber.from(sim.CurrentPosition.tokensOwed1).sub(tokensOwed1ContractPercent);
    
                // const result = await GetUserPendingRewards(userAccount, fragolaContract, tokensOwed0, tokensOwed1);
    
                return {tokensOwed0, tokensOwed1};
            } catch (e) {
                console.log("getUserPendingRewardsLocal err: ", e)
            }
        },
        async getLpPrice(amount, fragolaContract, poolContract, token0Decimals, token1Decimals, token0Price, token1Price, tokensOwed0, tokensOwed1) {
            let sim = new PoolV3Actions(poolContract);
            const date = parseFloat(new Date() / 1000).toFixed(0);

            let tickLower = await fragolaContract.methods.tickLower().call();
            let tickUpper = await fragolaContract.methods.tickUpper().call();
            let position = await fragolaContract.methods.position().call();
            let totalBalance = await fragolaContract.methods.totalSupply().call();

            totalBalance = this.$ethers.BigNumber.from(totalBalance);

            amount = this.$ethers.utils.parseUnits(amount, 18);

            if (totalBalance.lte(0) || amount.eq(0) || amount.gt(totalBalance)) {
              return "insufficient amount";
            }

            const slot0Resp= await poolContract.methods.slot0().call();
            const sqrtRatioX96 = this.$ethers.BigNumber.from(slot0Resp.sqrtPriceX96);

            const sqrtRatioAX96 = GetSqrtRatioAtTick(tickLower);
            const sqrtRatioBX96 = GetSqrtRatioAtTick(tickUpper);

            const protocolFees0 = await fragolaContract.methods.protocolFees0().call();
            const protocolFees1 = await fragolaContract.methods.protocolFees1().call();

            const protocolLiquidity = GetLiquidityForAmounts(sqrtRatioX96, sqrtRatioAX96, sqrtRatioBX96, this.$ethers.BigNumber.from(protocolFees0), this.$ethers.BigNumber.from(protocolFees1));


            let liquidityInPool = this.$ethers.BigNumber.from(position.liquidity);
            let liquidity = liquidityInPool.sub(protocolLiquidity).mul(amount).div(totalBalance);
            
            // user pending fees
            const tokensOwed0Local = tokensOwed0.mul(amount).div(totalBalance);
            const tokensOwed1Local = tokensOwed1.mul(amount).div(totalBalance);

            let { token0Amount, token1Amount } = await sim.Burn(tickLower, tickUpper, liquidity, fragolaContract._address,
                date);
            
            // user pending fees + aamounts
            token0Amount = token0Amount.add(tokensOwed0Local)
            token1Amount = token1Amount.add(tokensOwed1Local)

            let token0decimal = this.$ethers.utils.formatUnits(token0Amount, token0Decimals);
            let token1decimal = this.$ethers.utils.formatUnits(token1Amount, token1Decimals);

            let token0InUsd = token0decimal * token0Price;
            let token1InUsd = token1decimal * token1Price;

            const userLpInUsdLocal = parseFloat(token0InUsd + token1InUsd).toFixed(2);
            return userLpInUsdLocal
        },
        async getTokenAllowance(user, sorbettoAddr, tokenContract) {
            try {
                const allowance = await tokenContract.methods.allowance(user, sorbettoAddr).call();

                return allowance;
            } catch (e) {
                console.log("getUserTokenBalance error:", e)
            }
        },
    }
}