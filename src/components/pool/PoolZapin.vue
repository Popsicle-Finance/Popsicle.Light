<template>
  <div class="zapin-wrap">
    <div class="pool-v2" v-show="!showSetting">
      <div class="pool-v2__top">
        <h3 class="pool-v2__top-title">Deposit</h3>
        <button class="pool-v2__top-toggle" @click="openSettings">
          Settings
        </button>
      </div>
      <div class="pool-v2__inputs" v-if="zapinActiveToken">
        <UpSliderInput
          :error="zapinAmountError"
          :name="zapinActiveToken.symbol"
          :imageName="zapinActiveToken.logoURI"
          :itsImgURL="true"
          :decimals="zapinActiveToken.decimals"
          :userBalance="zapinActiveToken.parsedBalance"
          :isChooseToken="true"
          :parentValue="zapinAmount"
          @changeInputValue="updateZapinAmount"
          @chooseToken="setTokenListPopupState(true)"
          :key="zapinActiveToken.symbol"
        />
      </div>

      <transition name="fade">
        <div class="received-block" v-if="zapinActiveToken.price">
          <p class="block-title">Received</p>
          <div class="received-item">
            <div class="item-info">
              <TokenIcon :imageName="'Token_PLP.svg'" />
              <p class="item-name">PLP</p>
            </div>
            <div class="item-amount">
              <p>~{{ parseFloat(expectedPLPAmount).toFixed(4) }}</p>
            </div>
          </div>
        </div>
      </transition>

      <div class="info-block">
        <div class="info-item">
          <span class="item-title">Minimum PLP Value</span>
          <span class="item-value"
            >~ ${{ parseFloat(expectedPLPAmountInUsd).toFixed(4) }}</span
          >
        </div>
        <!-- <div class="info-item">
          <span class="item-title"
            >Expected Amount of {{ pool.token0.symbol }}</span
          >
          <span class="item-value"
            >~ ${{ parseFloat(expectedToken0Amount).toFixed(4) }}</span
          >
        </div>
        <div class="info-item">
          <span class="item-title"
            >Expected Amount of {{ pool.token1.symbol }}</span
          >
          <span class="item-value"
            >~ ${{ parseFloat(expectedToken1Amount).toFixed(4) }}</span
          >
        </div> -->
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

      <div class="pool-v2__message">
        <p class="pool-v2__message-text">
          Sorbetto Fragola requires users to join their position using the token
          ratio that corresponds to the range in which Fragola is currently
          providing liquidity. Users can also zap-in using a single token, our
          V3 Optimizer will swap them for the exact ratio. Just Select your
          slippage using Settings and join the position. If you do not want to
          Zap-In, please go back and select both assets.
        </p>
      </div>

      <div
        class="btn-wrap border width-100"
        :class="{ disabled: disableActionBtn }"
        @click="joinHandler"
      >
        <button class="btn width-100">Join</button>
      </div>
    </div>
    <SettingBlock
      v-show="showSetting"
      @closeSettings="hiseSettings"
      :slipage="slipage"
      :txSpeed="txSpeed"
      @updateSlipage="updateSlipage"
      @updateTxSpeed="updateTxSpeed"
    />

    <transition name="fade">
      <TokensListPopup
        v-if="tokensList && showTokensListPopup"
        :tokensList="tokensList"
        @closePopup="showTokensListPopup = false"
        @tokenClick="setZapinToken"
      />
    </transition>
  </div>
</template>

<script>
const UpSliderInput = () => import("@/components/ui/tokenInput/UpSliderInput");
const TokensListPopup = () =>
  import("@/components/modals/TokenList/TokenListPopup");
const TokenIcon = () => import("@/components/ui/TokenIcon");
const SettingBlock = () => import("@/components/pool/PoolSetting");
import { ConvertToProportion } from "@/utils/sorbetto/libs/ConvertToProportion";
import { GetSqrtRatioAtTick } from "@/utils/sorbetto/libs/TickMath";
import { GetLiquidityForAmounts } from "@/utils/sorbetto/libs/LiquidityAmounts";

import axios from "axios";

import abiERC20 from "@/utils/abiERC20";
import swapAbi from "@/utils/sorbetto/swapInterfaceAbi";

import { mapMutations } from "vuex";

export default {
  props: {
    pool: {
      type: Object,
      required: true,
    },
    tokensList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      showSetting: false,

      slipage: 1,

      zapinAmount: "",
      zapinTokenAddress: "",

      showTokensListPopup: false,

      zeroAddress: "0x0000000000000000000000000000000000000000",

      proportionAmount0: "",
      proportionAmount1: "",

      plpAmount: 0,

      txSpeed: 1,

      txFeeDate: null,

      feeDateInterval: null,
    };
  },
  computed: {
    updatedFeeData() {
      if (this.txFeeDate) {
        if (this.txSpeed === 0.8) {
          return {
            gasPrice: this.txFeeDate.gasPrice.sub(
              this.txFeeDate.gasPrice.div(2)
            ),
            maxFeePerGas: this.txFeeDate.maxFeePerGas.sub(
              this.txFeeDate.maxFeePerGas.div(2)
            ),
            maxPriorityFeePerGas: this.txFeeDate.maxPriorityFeePerGas.sub(
              this.txFeeDate.maxPriorityFeePerGas.div(3)
            ),
          };
        }

        if (this.txSpeed === 1) {
          return {
            gasPrice: this.txFeeDate.gasPrice.sub(
              this.txFeeDate.gasPrice.div(4)
            ),
            maxFeePerGas: this.txFeeDate.maxFeePerGas.sub(
              this.txFeeDate.maxFeePerGas.div(4)
            ),
            maxPriorityFeePerGas: this.txFeeDate.maxPriorityFeePerGas.sub(
              this.txFeeDate.maxPriorityFeePerGas.div(4)
            ),
          };
        }

        return this.txFeeDate;
      }

      return false;
    },
    zapinAmountPrice() {
      if (this.zapinActiveToken?.price) {
        return this.zapinActiveToken.price * +this.zapinAmount || 0;
      }

      return false;
    },
    expectedPLPAmount() {
      if (this.zapinAmountPrice) {
        const slipageMultiplyer = (100 - +this.slipage) / 100;

        return (this.zapinAmountPrice / this.pool.plpPrice) * slipageMultiplyer;
      }

      return 0;
    },
    expectedPLPAmountInUsd() {
      if (this.expectedPLPAmount)
        return this.expectedPLPAmount * this.pool.plpPrice;

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
    account() {
      return this.$store.getters.getWallet.address;
    },
    zapinActiveToken() {
      if (this.zapinTokenAddress)
        return this.tokensList.find(
          (item) => item.address === this.zapinTokenAddress
        );

      return this.tokensList[0];
    },
    zapinAmountError() {
      if (
        this.zapinAmount &&
        this.zapinAmount > +this.zapinActiveToken.parsedBalance
      ) {
        return `The value cannot be more than ${this.zapinActiveToken.parsedBalance}`;
      }

      return "";
    },
    disableActionBtn() {
      if (this.zapinAmountError) return true;
      if (+this.zapinAmount === 0) return true;

      return false;
    },
    itsToken0() {
      return this.zapinActiveToken.symbol == this.pool.token0.symbol;
    },
    itsToken1() {
      return this.zapinActiveToken.symbol == this.pool.token1.symbol;
    },
    provider() {
      return this.$store.getters.getWallet.provider;
    },
    chainId() {
      return this.$store.getters.getChain;
    },
  },
  methods: {
    ...mapMutations(["setModalState"]),
    updateTxSpeed(value) {
      this.txSpeed = value;
    },
    updateSlipage(value) {
      this.slipage = value;
    },
    openSettings() {
      this.showSetting = true;
    },
    hiseSettings() {
      this.showSetting = false;
    },
    createNotification(msg, isError) {
      const id = this.$store.getters.getNotificationId;

      const notification = { id, msg, isError };

      this.$store.commit("addNotification", notification);

      return id;
    },
    setZapinToken(address) {
      this.zapinTokenAddress = address;
      this.showTokensListPopup = false;
      this.zapinAmount = "";
    },
    setTokenListPopupState(payload) {
      this.showTokensListPopup = payload;
    },
    updateZapinAmount(value) {
      this.zapinAmount = value;
    },
    async joinHandler() {
      try {
        if (this.zapinActiveToken.symbol !== "ETH") {
          const swapTokenAbi = abiERC20;
          const swapTokenAddress = this.zapinActiveToken.address;

          const tokenContract = new this.web3.eth.Contract(
            swapTokenAbi,
            swapTokenAddress
          );

          const allowance = await this.getTokenAllowance(
            this.account,
            this.pool.swapAddress,
            tokenContract
          );

          console.log("allowance", allowance);

          if (!+allowance) {
            await this.approveToken(this.pool.swapAddress, tokenContract);
            return false;
          }
        }

        if (this.itsToken0 || this.itsToken1) {
          this.ZapIn(this.itsToken0, this.itsToken1);
          return false;
        }

        this.joinWithAnotherToken();
      } catch (e) {
        console.log("joinHandler err:", e);
      }
    },
    async ZapIn(itsToken0, itsToken1) {
      const notifyId = this.createNotification("Zappin and Join in Progress");
      try {
        let dataAmount;
        let tokenOutAddr;

        let tokenInAddr;
        let amount;
        let optimizerAddr = this.pool.address;
        let swapperAddr = this.pool.swapAddress;
        let toAddr = this.account;

        let value = 0;

        const {
          proportionAmount0,
          proportionAmount1,
        } = await this.fetchProportion();

        if (itsToken0) {
          tokenInAddr = this.pool.token0.address;
          tokenOutAddr = this.pool.token1.address;

          amount = this.$ethers.utils.parseUnits(
            String(this.zapinAmount),
            this.pool.token0.decimals
          );

          console.log("amount", amount);

          dataAmount = +amount - +proportionAmount0;

          console.log("dataAmount", dataAmount);
        }

        if (itsToken1) {
          tokenInAddr = this.pool.token1.address;
          tokenOutAddr = this.pool.token0.address;

          amount = this.$ethers.utils.parseUnits(
            String(this.zapinAmount),
            this.pool.token1.decimals
          );

          dataAmount = +amount - +proportionAmount1;

          console.log("dataAmount", dataAmount);
        }

        dataAmount = this.web3.utils
          .toBN(dataAmount.toLocaleString("fullwide", { useGrouping: false }))
          .toString();

        const tokenDataRequestPayload = {
          fromTokenAddress: tokenInAddr,
          toTokenAddress: tokenOutAddr,
          amount: dataAmount,
          fromAddress: this.account,
          slippage: this.slipage,
          disableEstimate: true,
          destReceiver: swapperAddr,
        };

        console.log("tokenDataRequestPayload", tokenDataRequestPayload);

        const tokensData = await this.getTokensData(tokenDataRequestPayload);

        // TEMP remove abi import
        const dataInterface = new this.$ethers.utils.Interface(swapAbi);

        console.log("tokensData", tokensData.tx);

        const methodByte = tokensData.tx.data.substr(0, 10);

        let decodeResult;
        let isUno = false;

        let token0Data;
        let token1Data;

        if (methodByte === "0x2e95b6c8") {
          console.log("----0x2e95b6c8----");

          decodeResult = dataInterface.decodeFunctionData(
            "unoswap",
            tokensData.tx.data
          );
          isUno = true;

          console.log("decodeResult", decodeResult);

          if (itsToken0) {
            token0Data = [
              false, //isUno
              this.zeroAddress, //IAggregationExecutor
              [
                tokenInAddr, //srcToken
                this.pool.token0.address, //dstToken
                this.zeroAddress, //srcReceiver
                this.zeroAddress, //dstReceiver
                proportionAmount0, //amount
                0, //minReturnAmount
                0, //flags
                "0x00", //permit
              ],
              "0x00", // bytes data
              [], // pools
            ];

            token1Data = [
              true, //isUno
              this.zeroAddress, //IAggregationExecutor
              [
                decodeResult.srcToken, //srcToken
                this.pool.token1.address, //dstToken
                this.zeroAddress, //srcReceiver
                this.zeroAddress, //dstReceiver
                decodeResult.amount, //amount
                decodeResult.minReturn, //minReturnAmount (decodeResult.minReturn TEMP)
                0, //flags
                "0x00", //permit
              ],
              "0x00", // bytes data
              decodeResult[3], // pools
            ];
          }

          if (itsToken1) {
            console.log(decodeResult);
            token0Data = [
              true, //isUno
              this.zeroAddress, //IAggregationExecutor
              [
                decodeResult.srcToken, //srcToken
                this.pool.token0.address, //dstToken
                this.zeroAddress, //srcReceiver
                this.zeroAddress, //dstReceiver
                decodeResult.amount, //amount
                decodeResult.minReturn, //minReturnAmount (decodeResult.minReturn TEMP)
                0, //flags
                "0x00", //permit
              ],
              "0x00", // bytes data
              decodeResult[3], // pools
            ];

            token1Data = [
              false, //isUno
              this.zeroAddress, //IAggregationExecutor
              [
                tokenInAddr, //srcToken
                this.pool.token1.address, //dstToken
                this.zeroAddress, //srcReceiver
                this.zeroAddress, //dstReceiver
                proportionAmount1, //amount
                0, //minReturnAmount
                0, //flags
                "0x00", //permit
              ],
              "0x00", // bytes data
              [], // pools
            ];
          }
        }

        if (methodByte === "0x7c025200") {
          console.log("----0x7c025200----");

          decodeResult = dataInterface.decodeFunctionData(
            "swap",
            tokensData.tx.data
          );
          console.log("decodeResult DATA", decodeResult.data);

          isUno = false;

          if (itsToken0) {
            token1Data = [
              isUno, //isUno
              decodeResult.caller, //IAggregationExecutor
              [
                decodeResult.desc.srcToken, //srcToken
                decodeResult.desc.dstToken, //dstToken
                decodeResult.desc.srcReceiver, //srcReceiver
                decodeResult.desc.dstReceiver, //"0xc9755077348D1FDB438914Ed94ECDbF4601999F7",
                decodeResult.desc.amount, //amount
                decodeResult.desc.minReturnAmount, //minReturnAmount decodeResult.desc.minReturnAmount
                decodeResult.desc.flags, //flags
                decodeResult.desc.permit, //permit
              ],
              decodeResult.data, // bytes data
              [], // pools
            ];

            const amountToken0 = +amount - +decodeResult.desc.amount;

            token0Data = [
              isUno, //isUno
              this.zeroAddress, //IAggregationExecutor
              [
                tokenInAddr, //srcToken
                this.pool.token0.address, //dstToken
                this.zeroAddress, //srcReceiver
                this.zeroAddress, //dstReceiver
                this.$ethers.BigNumber.from(
                  amountToken0.toLocaleString("fullwide", {
                    useGrouping: false,
                  })
                ), //amount
                0, //minReturnAmount
                0, //flags
                "0x00", //permit
              ],
              "0x00", // bytes data
              [], // pools
            ];
          }

          if (itsToken1) {
            token0Data = [
              isUno, //isUno
              decodeResult.caller, //IAggregationExecutor
              [
                decodeResult.desc.srcToken, //srcToken
                decodeResult.desc.dstToken, //dstToken
                decodeResult.desc.srcReceiver, //srcReceiver
                decodeResult.desc.dstReceiver, //"0xc9755077348D1FDB438914Ed94ECDbF4601999F7",
                decodeResult.desc.amount, //amount
                decodeResult.desc.minReturnAmount, //minReturnAmount decodeResult.desc.minReturnAmount
                decodeResult.desc.flags, //flags
                decodeResult.desc.permit, //permit
              ],
              decodeResult.data, // bytes data
              [], // pools
            ];

            const amountToken1 = +amount - +decodeResult.desc.amount;

            token1Data = [
              isUno, //isUno
              this.zeroAddress, //IAggregationExecutor
              [
                tokenInAddr, //srcToken
                this.pool.token1.address, //dstToken
                this.zeroAddress, //srcReceiver
                this.zeroAddress, //dstReceiver
                this.$ethers.BigNumber.from(
                  amountToken1.toLocaleString("fullwide", {
                    useGrouping: false,
                  })
                ), //amount
                0, //minReturnAmount
                0, //flags
                "0x00", //permit
              ],
              "0x00", // bytes data
              [], // pools
            ];
          }
        }

        let options = {
          from: this.account,
          value,
        };

        if (this.updatedFeeData) {
          options = { ...options, ...this.updatedFeeData };
        }

        console.log("OPTIONS", options);
        console.log("PARAMS", {
          tokenInAddr,
          amount,
          optimizerAddr,
          toAddr,
          token0Data,
          token1Data,
        });

        if (!+options.value) {
          try {
            const estimateGas = await this.pool.swapContract.methods
              .ZapIn(
                tokenInAddr,
                amount,
                optimizerAddr,
                toAddr,
                token0Data,
                token1Data
              )
              .estimateGas(options);

            console.log("estimateGas", estimateGas);
          } catch (e) {
            this.$store.commit("deleteNotification", notifyId);

            if (
              String(e).indexOf(
                "Invalid transaction params: params specify an EIP-1559 transaction but the current network does not support EIP-1559"
              ) !== -1
            ) {
              this.createNotification(
                "Trezor is currently not supported due to metamask limitations.",
                true
              );
              return false;
            }

            if (String(e).indexOf("MTS: execution reverted") !== -1) {
              this.createNotification(
                "This pool has currently reached its TVL limit. Please wait for this limit to be increased to deposit more funds.",
                true
              );
              return false;
            }

            this.createNotification(
              "The chosen Asset is currently experiencing high volatility. Please try again in a few minutes or select a different asset.",
              true
            );

            return false;
          }
        }

        const swapStaticTx = await this.pool.swapContract.methods
          .ZapIn(
            tokenInAddr,
            amount,
            optimizerAddr,
            toAddr,
            token0Data,
            token1Data
          )
          .send(options);

        console.log("swapStaticTx", swapStaticTx);
        this.$store.commit("deleteNotification", notifyId);

        this.setModalState({
          type: "success",
          isShow: true,
        });
      } catch (e) {
        console.log("optInTEST err:", e);
        this.$store.commit("deleteNotification", notifyId);

        if (
          String(e).indexOf(
            "Invalid transaction params: params specify an EIP-1559 transaction but the current network does not support EIP-1559"
          ) !== -1
        ) {
          this.createNotification(
            "Trezor is currently not supported due to metamask limitations.",
            true
          );
          return false;
        }

        if (String(e).indexOf("MTS: execution reverted") !== -1) {
          this.createNotification(
            "This pool has currently reached its TVL limit. Please wait for this limit to be increased to deposit more funds.",
            true
          );
          return false;
        }
      }
    },
    async joinWithAnotherToken() {
      const notifyId = this.createNotification("Zappin and Join in Progress");
      try {
        const swapTokenAddress = this.zapinActiveToken.address;
        const swapperAddr = this.pool.swapAddress;
        const optimizerAddr = this.pool.address;
        const toAddr = this.account;

        const amountIn = this.$ethers.utils.parseUnits(
          this.zapinAmount,
          this.zapinActiveToken.decimals
        );

        let value = 0;

        if (this.zapinActiveToken.symbol === "ETH") {
          value = amountIn;
        }

        console.log("amountIn", this.web3.utils.toBN(amountIn).toString());

        const amountIn0 = +parseFloat(
          (+amountIn / 100) * this.pool.proportion.token0Percent
        ).toFixed(0);

        const amountIn0Final = this.web3.utils
          .toBN(amountIn0.toLocaleString("fullwide", { useGrouping: false }))
          .toString();

        const amountIn1 = amountIn.sub(amountIn0Final);

        const amountIn1Final = this.web3.utils.toBN(amountIn1).toString();

        console.log("amountIn0Final", amountIn0Final);
        console.log("amountIn1Final", amountIn1Final);

        const tokenOut0Address = this.pool.token0.address;
        const tokenOut1Address = this.pool.token1.address;

        const tokenDataRequestPayload0 = {
          fromTokenAddress: swapTokenAddress,
          toTokenAddress: tokenOut0Address,
          amount: amountIn0Final,
          fromAddress: this.account,
          slippage: this.slipage,
          disableEstimate: true,
          destReceiver: swapperAddr,
        };

        const tokenDataRequestPayload1 = {
          fromTokenAddress: swapTokenAddress,
          toTokenAddress: tokenOut1Address,
          amount: amountIn1Final,
          fromAddress: this.account,
          slippage: this.slipage,
          disableEstimate: true,
          destReceiver: swapperAddr,
        };

        console.log("tokenDataRequestPayload0", tokenDataRequestPayload0);
        console.log("tokenDataRequestPayload1", tokenDataRequestPayload1);

        const tokensData0 = await this.getTokensData(tokenDataRequestPayload0);
        const tokensData1 = await this.getTokensData(tokenDataRequestPayload1);

        // TEMP remove abi import
        const dataInterface = new this.$ethers.utils.Interface(swapAbi);

        console.log("tokensData0", tokensData0.tx);
        console.log("tokensData1", tokensData1.tx);

        const methodByte0 = tokensData0.tx.data.substr(0, 10);

        let token0Data;

        if (methodByte0 === "0x2e95b6c8") {
          console.log("----TOKEN0 - 0x2e95b6c8----");

          const decodeResult0 = dataInterface.decodeFunctionData(
            "unoswap",
            tokensData0.tx.data
          );

          console.log("decodeResult TOKEN0", decodeResult);

          token0Data = [
            true, //isUno
            this.zeroAddress, //IAggregationExecutor
            [
              decodeResult0.srcToken, //srcToken
              tokenOut0Address, //dstToken
              this.zeroAddress, //srcReceiver
              this.zeroAddress, //dstReceiver
              decodeResult0.amount, //amount
              decodeResult0.minReturn, //minReturnAmount (decodeResult.minReturn TEMP)
              0, //flags
              "0x00", //permit
            ],
            "0x00", // bytes data
            decodeResult0[3], // pools
          ];
        }

        if (methodByte0 === "0x7c025200") {
          console.log("----0x7c025200----");

          const decodeResult0 = dataInterface.decodeFunctionData(
            "swap",
            tokensData0.tx.data
          );
          console.log("decodeResult DATA", decodeResult0.data);

          token0Data = [
            false, //isUno
            decodeResult0.caller, //IAggregationExecutor
            [
              decodeResult0.desc.srcToken, //srcToken
              decodeResult0.desc.dstToken, //dstToken
              decodeResult0.desc.srcReceiver, //srcReceiver
              decodeResult0.desc.dstReceiver, //"0xc9755077348D1FDB438914Ed94ECDbF4601999F7",
              decodeResult0.desc.amount, //amount
              decodeResult0.desc.minReturnAmount, //minReturnAmount decodeResult.desc.minReturnAmount
              decodeResult0.desc.flags, //flags
              decodeResult0.desc.permit, //permit
            ],
            decodeResult0.data, // bytes data
            [], // pools
          ];
        }

        const methodByte1 = tokensData0.tx.data.substr(0, 10);
        let token1Data;

        if (methodByte1 === "0x2e95b6c8") {
          console.log("----TOKEN0 - 0x2e95b6c8----");

          const decodeResult1 = dataInterface.decodeFunctionData(
            "unoswap",
            tokensData1.tx.data
          );

          console.log("decodeResult TOKEN0", decodeResult);

          token1Data = [
            true, //isUno
            this.zeroAddress, //IAggregationExecutor
            [
              decodeResult1.srcToken, //srcToken
              tokenOut1Address, //dstToken
              this.zeroAddress, //srcReceiver
              this.zeroAddress, //dstReceiver
              decodeResult1.amount, //amount
              decodeResult1.minReturn, //minReturnAmount (decodeResult.minReturn TEMP)
              0, //flags
              "0x00", //permit
            ],
            "0x00", // bytes data
            decodeResult1[3], // pools
          ];
        }

        if (methodByte1 === "0x7c025200") {
          console.log("----0x7c025200----");

          const decodeResult1 = dataInterface.decodeFunctionData(
            "swap",
            tokensData1.tx.data
          );
          console.log("decodeResult DATA", decodeResult1.data);

          token1Data = [
            false, //isUno
            decodeResult1.caller, //IAggregationExecutor
            [
              decodeResult1.desc.srcToken, //srcToken
              decodeResult1.desc.dstToken, //dstToken
              decodeResult1.desc.srcReceiver, //srcReceiver
              decodeResult1.desc.dstReceiver, //"0xc9755077348D1FDB438914Ed94ECDbF4601999F7",
              decodeResult1.desc.amount, //amount
              decodeResult1.desc.minReturnAmount, //minReturnAmount decodeResult.desc.minReturnAmount
              decodeResult1.desc.flags, //flags
              decodeResult1.desc.permit, //permit
            ],
            decodeResult1.data, // bytes data
            [], // pools
          ];
        }

        let options = {
          from: this.account,
          value,
        };

        if (this.updatedFeeData) {
          options = { ...options, ...this.updatedFeeData };
        }

        console.log("OPTIONS", options);
        console.log("PARAMS", {
          swapTokenAddress,
          amountIn,
          optimizerAddr,
          toAddr,
          token0Data,
          token1Data,
        });

        if (!+options.value) {
          try {
            const estimateGas = await this.pool.swapContract.methods
              .ZapIn(
                swapTokenAddress,
                amountIn,
                optimizerAddr,
                toAddr,
                token0Data,
                token1Data
              )
              .estimateGas(options);

            console.log("estimateGas", estimateGas);
          } catch (e) {
            this.$store.commit("deleteNotification", notifyId);

            if (
              String(e).indexOf(
                "Invalid transaction params: params specify an EIP-1559 transaction but the current network does not support EIP-1559"
              ) !== -1
            ) {
              this.createNotification(
                "Trezor is currently not supported due to metamask limitations.",
                true
              );
              return false;
            }

            if (String(e).indexOf("MTS: execution reverted") !== -1) {
              this.createNotification(
                "This pool has currently reached its TVL limit. Please wait for this limit to be increased to deposit more funds.",
                true
              );
              return false;
            }

            this.createNotification(
              "The chosen Asset is currently experiencing high volatility. Please try again in a few minutes or select a different asset.",
              true
            );

            return false;
          }
        }

        const swapStaticTx = await this.pool.swapContract.methods
          .ZapIn(
            swapTokenAddress,
            amountIn,
            optimizerAddr,
            toAddr,
            token0Data,
            token1Data
          )
          .send(options);
        this.$store.commit("deleteNotification", notifyId);
        console.log("swapStaticTx", swapStaticTx);

        this.setModalState({
          type: "success",
          isShow: true,
        });
      } catch (e) {
        this.$store.commit("deleteNotification", notifyId);

        if (
          String(e).indexOf(
            "Invalid transaction params: params specify an EIP-1559 transaction but the current network does not support EIP-1559"
          ) !== -1
        ) {
          this.createNotification(
            "Trezor is currently not supported due to metamask limitations.",
            true
          );
          return false;
        }

        if (String(e).indexOf("MTS: execution reverted") !== -1) {
          this.createNotification(
            "This pool has currently reached its TVL limit. Please wait for this limit to be increased to deposit more funds.",
            true
          );
          return false;
        }
        console.log("joinWithAnotherToken err: ", e);
      }
    },
    async getTokensData(payload) {
      try {
        const url = `https://api.1inch.exchange/v3.0/${this.chainId}/swap`;

        const response = await axios.get(url, { params: payload });

        return response.data;
      } catch (e) {
        console.log("fetchUserPendingRewards error:", e);
      }
    },
    async getTokenAllowance(user, spenderAddr, tokenContract) {
      try {
        const allowance = await tokenContract.methods
          .allowance(user, spenderAddr)
          .call();

        return allowance;
      } catch (e) {
        console.log("getUserTokenBalance error:", e);
      }
    },
    async approveToken(spenderAddr, tokenContract) {
      const notifyId = this.createNotification("Approve in progress");

      try {
        const resp = await tokenContract.methods
          .approve(
            spenderAddr,
            "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
          )
          .send({ from: this.account });
        console.log(resp);
        this.$store.commit("deleteNotification", notifyId);
        return true;
      } catch (e) {
        console.log("approveToken error", e);
        this.$store.commit("deleteNotification", notifyId);

        if (
          String(e).indexOf(
            "Invalid transaction params: params specify an EIP-1559 transaction but the current network does not support EIP-1559"
          ) !== -1
        ) {
          this.createNotification(
            "Trezor is currently not supported due to metamask limitations.",
            true
          );
          return false;
        }

        return false;
      }
    },
    async getLPAmount() {
      const amount0 = this.proportionAmount0;
      const amount1 = this.proportionAmount1;

      let tickLower = await this.pool.contractInstance.methods
        .tickLower()
        .call();
      let tickUpper = await this.pool.contractInstance.methods
        .tickUpper()
        .call();
      let position = await this.pool.contractInstance.methods.position().call();
      let totalBalance = await this.pool.contractInstance.methods
        .totalSupply()
        .call();

      totalBalance = this.$ethers.BigNumber.from(totalBalance);

      const slot0Resp = await this.pool.poolContractInstance.methods
        .slot0()
        .call();
      const sqrtRatioX96 = this.$ethers.BigNumber.from(slot0Resp.sqrtPriceX96);

      const sqrtRatioAX96 = GetSqrtRatioAtTick(tickLower);
      const sqrtRatioBX96 = GetSqrtRatioAtTick(tickUpper);

      const protocolLiquidity = GetLiquidityForAmounts(
        sqrtRatioX96,
        sqrtRatioAX96,
        sqrtRatioBX96,
        this.$ethers.BigNumber.from(amount0),
        this.$ethers.BigNumber.from(amount1)
      );

      let liquidityInPool = this.$ethers.BigNumber.from(position.liquidity);

      const shares =
        +totalBalance == 0
          ? protocolLiquidity.mul(1e5)
          : protocolLiquidity
              .mul(1e5)
              .mul(totalBalance)
              .div(liquidityInPool.mul(1e5));

      console.log("shares", shares, +shares);

      const plpAmount = this.$ethers.utils.formatUnits(shares, 18);

      console.log("plpAmount", plpAmount);

      return plpAmount;
    },
    async fetchProportion() {
      let amount0Zapin = this.itsToken0 ? this.zapinAmount : "0";
      let amount1Zapin = this.itsToken1 ? this.zapinAmount : "0";

      if (!this.itsToken0 && !this.itsToken1) {
        amount0Zapin = "1";
        amount1Zapin = "1";
      }

      const desiredAmount0 = String(
        this.$ethers.utils.parseUnits(
          amount0Zapin || "0",
          this.pool.token0.decimals
        )
      );
      const desiredAmount1 = String(
        this.$ethers.utils.parseUnits(
          amount1Zapin || "0",
          this.pool.token1.decimals
        )
      );

      const response = await ConvertToProportion(
        desiredAmount0,
        desiredAmount1,
        this.pool.contractInstance,
        this.pool.poolContractInstance
      );

      let { amount0, amount1 } = response;

      this.proportionAmount0 = amount0 || this.proportionAmount0;
      this.proportionAmount1 = amount1 || this.proportionAmount1;

      return {
        proportionAmount0: this.proportionAmount0,
        proportionAmount1: this.proportionAmount1,
      };
    },
  },
  beforeDestroy() {
    clearInterval(this.feeDateInterval);
  },
  async created() {
    if (!this.account) console.log("NO ACCOUNT");

    this.txFeeDate = await this.provider.getFeeData();

    this.feeDateInterval = setInterval(async () => {
      this.txFeeDate = await this.provider.getFeeData();
    });
  },
  components: {
    UpSliderInput,
    TokensListPopup,
    TokenIcon,
    SettingBlock,
  },
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

.received-block {
  margin: 10px 0;

  .item-info {
    display: flex;
    align-items: center;

    .item-name {
      padding-left: 10px;
    }
  }

  .block-title {
    font-weight: 300;
    font-size: 14px;
    line-height: 19px;
    letter-spacing: 0.02em;
    margin-bottom: 10px;
  }

  .received-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    border: 0.2px solid #a4deff;
    border-radius: 8px;

    font-size: 14px;
    line-height: 1.5;
  }
}

.pool-v2 {
  padding: 30px 0;
  max-width: 466px;
  width: 100%;
  margin: 0 auto;
  &__top {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 30px;
    @media (max-width: 600px) {
      justify-content: inherit;
      align-items: inherit;
      flex-direction: column;
      margin-bottom: 10px;
    }
    &-title {
      font-size: 20px;
      line-height: 27px;
      font-weight: 400;
    }
    &-toggle {
      border: none;
      background: transparent;
      font-weight: 600;
      font-size: 14px;
      line-height: 19px;
      text-align: right;
      color: #2bd2f7;
      cursor: pointer;
      @media (max-width: 600px) {
        margin-top: 10px;
      }
    }
  }
  &__inputs {
    &-gap {
      margin-bottom: 20px;
    }
  }
  &__message {
    margin: 10px auto 20px;
    padding: 20px 10px;
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
}
</style>
