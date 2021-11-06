<template>
  <div class="form-wrap">
    <div class="pool-v2" v-show="!showSetting">
      <div class="pool-v2__top">
        <h3 class="pool-v2__top-title">Deposit</h3>
        <button class="pool-v2__top-toggle" @click="openSettings">
          Settings
        </button>
      </div>
      <div class="pool-v2__inputs" v-if="!isUserInfoLoading">
        <template v-if="isToken0Choosen">
          <UpSliderInput
            :name="activeToken0.symbol"
            :imageName="activeToken0.icon"
            :decimals="activeToken0.decimals"
            :userBalance="token0Max"
            :isChooseToken="false"
            :error="amount0Error"
            :parentValue="amount0"
            @changeInputValue="updateValue0"
            @chooseToken="chooseToken"
          />
        </template>

        <div
          class="pool-v2__inputs-gap"
          v-if="isToken1Choosen && isToken0Choosen"
        ></div>

        <template v-if="isToken1Choosen">
          <UpSliderInput
            :name="activeToken1.symbol"
            :imageName="activeToken1.icon"
            :decimals="activeToken1.decimals"
            :userBalance="token1Max"
            :isChooseToken="false"
            :error="amount1Error"
            :parentValue="amount1"
            @changeInputValue="updateValue1"
            @chooseToken="chooseToken"
          />
        </template>
      </div>

      <div
        v-if="showDefaultBalanceCheckbox"
        class="checkbox-wrap"
        :class="{ active: !isDefaultChoosen }"
      >
        <div class="checkbox" @click="toggleDefaultBalance">
          <div class="indicator"></div>
        </div>
        <p class="label-text" @click="toggleDefaultBalance">
          Use {{ defaultBalanceSymbol }}
        </p>
      </div>

      <div class="pool-v2__message">
        <p class="pool-v2__message-text">{{ infoMessage }}</p>
      </div>
      <div
        class="btn-wrap border width-100"
        :class="{ disabled: disabledActionBtn }"
      >
        <button class="btn width-100" @click="actionHandler">
          {{ actionBtnText }}
        </button>
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
  </div>
</template>

<script>
const UpSliderInput = () => import("@/components/ui/tokenInput/UpSliderInput");
const SettingBlock = () => import("@/components/pool/PoolSetting");
import fragolaUserInfo from "@/mixins/fragola/fragolaUserInfo";
import { GetAmountForDesired } from "@/utils/sorbetto/libs/AmountsForDesired";
import { ConvertToProportion } from "@/utils/sorbetto/libs/ConvertToProportion";

import axios from "axios";

import abiERC20 from "@/utils/abiERC20";
import swapAbi from "@/utils/sorbetto/swapInterfaceAbi";

import { mapMutations } from "vuex";
export default {
  mixins: [fragolaUserInfo],
  props: {
    pool: {
      type: Object,
      required: true,
    },
    isToken0Choosen: {
      type: Boolean,
    },
    isToken1Choosen: {
      type: Boolean,
    },
    isDefaultChoosen: {
      type: Boolean,
    },
  },
  data() {
    return {
      isUserInfoLoading: true,
      showSetting: false,

      amount0: "",
      amount1: "",

      proportion: "",

      loadingProportion: false,

      loadingTicker: 0,

      proportionAmount0: "",
      proportionAmount1: "",

      slipage: 1,

      userPoolInfoLocal: null,

      zeroAddress: "0x0000000000000000000000000000000000000000",

      txSpeed: 1,

      txFeeDate: null,

      feeDateInterval: null,
    };
  },

  computed: {
    chainId() {
      return this.$store.getters.getChain;
    },
    defaultBalanceSymbol() {
      if (this.pool.token0.canBeDefault) return this.pool.token0.symbol;
      if (this.pool.token1.canBeDefault) return this.pool.token1.symbol;
      return "";
    },
    showDefaultBalanceCheckbox() {
      if (this.pool.token0.canBeDefault && this.isToken0Choosen) return true;
      if (this.pool.token1.canBeDefault && this.isToken1Choosen) return true;

      return false;
    },
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
    infoMessage() {
      if (this.isToken0Choosen === false || this.isToken1Choosen === false) {
        return `Sorbetto Fragola requires users to join their position using the token
          ratio that corresponds to the range in which Fragola is currently
          providing liquidity. Users can also zap-in using a single token, our
          V3 Optimizer will swap them for the exact ratio. Just Select your
          slippage using Settings and join the position. If you do not want to Zap-In, please go back and select both
            assets.`;
      }

      return `Sorbetto Fragola requires users to join their position using the token
          ratio that corresponds to the range in which Fragola is currently
          providing liquidity. Users can also zap-in using a single token, our
          V3 Optimizer will swap them for the exact ratio. Just Select your
          slippage using Settings and join the position.`;
    },
    userPoolInfo() {
      if (this.pool.userPoolInfo) return this.pool.userPoolInfo;

      return userPoolInfoLocal;
    },
    account() {
      return this.$store.getters.getWallet.address;
    },
    activeToken0() {
      if (!this.isDefaultChoosen) {
        return this.pool.token0;
      }

      if (this.pool.token0.canBeDefault && this.isDefaultChoosen) {
        return this.pool.chainToken;
      }

      return this.pool.token0;
    },
    activeToken1() {
      if (!this.isDefaultChoosen) {
        console.log("111111");
        return this.pool.token1;
      }

      if (this.pool.token1.canBeDefault && this.isDefaultChoosen) {
        console.log("2222222");
        return this.pool.chainToken;
      }
      console.log("3333333");
      return this.pool.token1;
    },
    amount0Error() {
      if (+this.amount0 && +this.amount0 > +this.token0Max) {
        return `The value cannot be more than ${this.token0Max}`;
      }

      return "";
    },
    amount1Error() {
      if (+this.amount1 && +this.amount1 > +this.token1Max) {
        return `The value cannot be more than ${this.token1Max}`;
      }

      return "";
    },
    token0Max() {
      if (this.activeToken0.symbol === "ETH")
        return this.userPoolInfo.chainBalance;
      return this.userPoolInfo.token0Info.balance;
    },
    token1Max() {
      if (this.activeToken1.symbol === "ETH")
        return this.userPoolInfo.chainBalance;
      return this.userPoolInfo.token1Info.balance;
    },
    token0Allowance() {
      if (this.activeToken0.symbol !== "ETH")
        return this.userPoolInfo.token0Info.allowance;

      return 1;
    },
    token1Allowance() {
      if (this.activeToken1.symbol !== "ETH")
        return this.userPoolInfo.token1Info.allowance;

      return 1;
    },
    token0SwapAllowance() {
      if (this.activeToken0.symbol !== "ETH")
        return this.userPoolInfo.token0Info.swapAllowance;

      return 1;
    },
    token1SwapAllowance() {
      if (this.activeToken1.symbol !== "ETH")
        return this.userPoolInfo.token1Info.swapAllowance;

      return 1;
    },
    disabledActionBtn() {
      if (this.amount0Error || this.amount1Error) {
        return true;
      }

      if (+this.amount0 === 0 && +this.amount1 === 0) {
        return true;
      }

      return false;
    },
    actionBtnText() {
      if (this.amount0Error || this.amount1Error) {
        return "Open Position";
      }

      if (+this.amount0 && +this.amount1) {
        if (!this.isDefaultChoosen) {
          if (+this.token0Allowance == 0) {
            return `Approve ${this.activeToken0.symbol} Spending`;
          }

          if (+this.token1Allowance == 0) {
            return `Approve ${this.activeToken1.symbol} Spending`;
          }

          return "Open Position";
        }

        if (+this.token0SwapAllowance == 0) {
          return `Approve ${this.activeToken0.symbol} Spending`;
        }

        if (+this.token1SwapAllowance == 0) {
          return `Approve ${this.activeToken1.symbol} Spending`;
        }

        return "Open Position";
      }

      if (+this.amount0 || +this.amount1) {
        // return "Zap";

        if (this.amount0 && this.token0SwapAllowance == 0)
          return `Approve ${this.pool.token0.symbol} Spending`;
        if (this.amount1 && this.token1SwapAllowance == 0)
          return `Approve ${this.pool.token1.symbol} Spending`;

        if (this.amount0 && this.token0SwapAllowance > 0) {
          if (this.loadingProportion) return "Calculating Proportions";
          return "Zap";
        }
        if (this.amount1 && this.token1SwapAllowance > 0) {
          if (this.loadingProportion) return "Calculating Proportions";
          return "Zap";
        }
      }
      return "Open Position";
    },

    provider() {
      return this.$store.getters.getWallet.provider;
    },
  },

  methods: {
    ...mapMutations(["setModalState"]),
    toggleDefaultBalance() {
      this.$emit("updateDefault", !this.isDefaultChoosen);
    },
    updateTxSpeed(value) {
      this.txSpeed = value;
    },
    openSettings() {
      this.showSetting = true;
    },
    hiseSettings() {
      this.showSetting = false;
    },
    updateSlipage(value) {
      this.slipage = value;
    },
    updateValue0(value) {
      this.amount0 = value;

      if (this.isToken1Choosen && this.isToken0Choosen && +value) {
        const toProportion = +value / +this.proportion;

        const fixedProportion = parseFloat(toProportion).toFixed(20);

        let re = new RegExp(
          // eslint-disable-next-line no-useless-escape
          `^-?\\d+(?:\.\\d{0,` + (this.pool.token1.decimals || -1) + `})?`
        );

        this.amount1 = fixedProportion.toString().match(re)[0];

        return false;
      }

      this.fetchProportion();
    },
    updateValue1(value) {
      this.amount1 = value;

      if (this.isToken1Choosen && this.isToken0Choosen && +value) {
        const toProportion = +value * +this.proportion;

        const fixedProportion = parseFloat(toProportion).toFixed(20);

        let re = new RegExp(
          // eslint-disable-next-line no-useless-escape
          `^-?\\d+(?:\.\\d{0,` + (this.activeToken0.decimals || -1) + `})?`
        );

        this.amount0 = fixedProportion.toString().match(re)[0];
        return false;
      }

      this.fetchProportion();
    },
    chooseToken() {
      console.log("chooseToken");
    },
    createNotification(msg, isError) {
      const id = this.$store.getters.getNotificationId;

      const notification = { id, msg, isError };

      this.$store.commit("addNotification", notification);

      return id;
    },
    async actionHandler() {
      if (this.amount0Error || this.amount1Error) {
        return false;
      }

      if (+this.amount0 && +this.amount1) {
        if (!this.isDefaultChoosen) {
          if (+this.token0Allowance == 0) {
            await this.approveToken(
              this.pool.address,
              this.pool.token0.contractInstance
            );
            return false;
          }

          if (+this.token1Allowance == 0) {
            await this.approveToken(
              this.pool.address,
              this.pool.token1.contractInstance
            );
            return false;
          }

          await this.joinHandler();
          return false;
        }

        await this.depositInEthTEST();
        return false;
      }

      if (+this.amount0 || +this.amount1) {
        // this.$emit("changeTab", 3);

        if (this.amount0 && +this.token0SwapAllowance == 0) {
          await this.approveToken(
            this.pool.swapAddress,
            this.pool.token0.contractInstance
          );
          return false;
        }

        if (this.amount1 && +this.token1SwapAllowance == 0) {
          await this.approveToken(
            this.pool.swapAddress,
            this.pool.token1.contractInstance
          );
          return false;
        }

        if (this.amount0 && +this.token0SwapAllowance > 0) {
          if (this.loadingProportion) return false;
          await this.optInTEST();
          return false;
        }
        if (this.amount1 && +this.token1SwapAllowance > 0) {
          if (this.loadingProportion) return false;
          await this.optInTEST();
          return false;
        }
      }
    },
    async joinHandler() {
      const { amount0, amount1 } = await this.fetchDesiredAmounts();

      let value = "0";

      if (this.activeToken0.symbol === "ETH") value = amount0;
      if (this.activeToken1.symbol === "ETH") value = amount1;

      const notifyId = this.createNotification("Join position in progress");

      try {
        const options = {
          from: this.account,
          value,
        };

        console.log(options);

        const resp = await this.pool.contractInstance.methods
          .deposit(amount0, amount1, this.account)
          .send(options);
        this.$store.commit("deleteNotification", notifyId);

        this.setModalState({
          type: "success",
          isShow: true,
        });
        console.log(resp);
      } catch (e) {
        console.log("!!error:", e);
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
    async depositInEthTEST() {
      if (+this.token0SwapAllowance == 0) {
        await this.approveToken(
          this.pool.swapAddress,
          this.pool.token0.contractInstance
        );
        return false;
      }

      if (+this.token1SwapAllowance == 0) {
        await this.approveToken(
          this.pool.swapAddress,
          this.pool.token1.contractInstance
        );
        return false;
      }

      const notifyId = this.createNotification("Join position in progress");
      try {
        const optimizerAddr = this.pool.address;
        const IAggregationExecutor = this.zeroAddress;

        let srcToken;
        if (this.activeToken0.symbol === "ETH")
          srcToken = this.activeToken1.address;
        if (this.activeToken1.symbol === "ETH")
          srcToken = this.activeToken0.address;

        const dstToken = srcToken;
        const srcReceiver = this.zeroAddress;
        const dstReceiver = this.zeroAddress;
        const { amount0, amount1 } = await this.fetchDesiredAmounts();

        console.log(amount0, amount1);

        let amount;
        if (this.activeToken0.symbol !== "ETH") amount = amount0;
        if (this.activeToken1.symbol !== "ETH") amount = amount1;

        let value;
        if (this.activeToken0.symbol === "ETH") value = amount0;
        if (this.activeToken1.symbol === "ETH") value = amount1;

        const minReturnAmount = 0;
        const flags = 0;
        const permit = "0x00";

        const SwapDescription = this.$ethers.utils.defaultAbiCoder.encode(
          [
            "address",
            "address",
            "address",
            "address",
            "uint256",
            "uint256",
            "uint256",
            "bytes",
          ],
          [
            srcToken,
            dstToken,
            srcReceiver,
            dstReceiver,
            amount,
            minReturnAmount,
            flags,
            permit,
          ]
        );

        console.log("a", amount, minReturnAmount);

        const bytes = "0x00";

        const TokenData = this.$ethers.utils.defaultAbiCoder.encode(
          ["address", "bytes", "bytes"],
          [IAggregationExecutor, SwapDescription, bytes]
        );

        console.log("TokenData", TokenData);

        let options = {
          from: this.account,
          value,
        };

        if (this.updatedFeeData) {
          options = { ...options, ...this.updatedFeeData };
        }

        console.log("optimizerAddr", optimizerAddr);
        console.log("this.pool.swapContract", this.pool.swapContract);

        const swapStaticTx = await this.pool.swapContract.methods
          .DepositInEth(optimizerAddr, this.account, [
            false, // bool IsUno; false only here
            IAggregationExecutor,
            [
              srcToken,
              dstToken,
              srcReceiver,
              dstReceiver,
              amount,
              minReturnAmount,
              flags,
              permit,
            ],
            bytes,
            [], // pools
          ])
          .send(options);
        this.$store.commit("deleteNotification", notifyId);
        console.log("swapStaticTx", swapStaticTx);

        this.setModalState({
          type: "success",
          isShow: true,
        });
      } catch (e) {
        console.log("depositInEthTEST err:", e);
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
    async optInTEST() {
      if (+this.amount0 && +this.amount1) return false;

      if (+this.token0SwapAllowance == 0 && +this.amount0) {
        await this.approveToken(
          this.pool.swapAddress,
          this.pool.token0.contractInstance
        );
        return false;
      }

      if (+this.token1SwapAllowance == 0 && +this.amount1) {
        await this.approveToken(
          this.pool.swapAddress,
          this.pool.token1.contractInstance
        );
        return false;
      }

      const notifyId = this.createNotification(
        "Swap and Join position in progress"
      );
      try {
        let dataAmount;
        let tokenOutAddr;

        let tokenInAddr;
        let amount;
        let optimizerAddr = this.pool.address;
        let swapperAddr = this.pool.swapAddress;
        let toAddr = this.account;

        let value = 0;

        if (+this.amount0 && !+this.amount1) {
          tokenInAddr = this.pool.token0.address;
          tokenOutAddr = this.pool.token1.address;

          amount = this.$ethers.utils.parseUnits(
            String(this.amount0),
            this.activeToken0.decimals
          );

          if (!this.useDefaultBalance && this.activeToken0.symbol === "ETH") {
            console.log("here");
            tokenInAddr = this.activeToken0.address;
            value = amount;
          }

          console.log("amount", amount);

          dataAmount = +amount - +this.proportionAmount0;

          console.log("dataAmount", dataAmount);
        }

        if (!+this.amount0 && +this.amount1) {
          tokenInAddr = this.pool.token1.address;
          tokenOutAddr = this.pool.token0.address;

          amount = this.amount1;

          amount = this.$ethers.utils.parseUnits(
            String(this.amount1),
            this.activeToken1.decimals
          );

          if (!this.useDefaultBalance && this.activeToken1.symbol === "ETH") {
            console.log("here");
            tokenInAddr = this.activeToken1.address;
            value = amount;
          }

          console.log("amount", amount);

          dataAmount = +amount - +this.proportionAmount1;

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

          if (+this.amount0 && !+this.amount1) {
            token0Data = [
              false, //isUno
              this.zeroAddress, //IAggregationExecutor
              [
                tokenInAddr, //srcToken
                this.pool.token0.address, //dstToken
                this.zeroAddress, //srcReceiver
                this.zeroAddress, //dstReceiver
                this.proportionAmount0, //amount
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

          if (!+this.amount0 && +this.amount1) {
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
                this.proportionAmount1, //amount
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

          if (+this.amount0 && !+this.amount1) {
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

          if (!+this.amount0 && +this.amount1) {
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
    async getTokensData(payload) {
      try {
        const url = `https://api.1inch.exchange/v3.0/${this.chainId}/swap`;

        const response = await axios.get(url, { params: payload });

        return response.data;
      } catch (e) {
        console.log("fetchUserPendingRewards error:", e);
      }
    },
    async fetchProportion() {
      this.loadingProportion = true;

      if (!+this.amount0 && !+this.amount1) {
        this.loadingProportion = false;
        return false;
      }

      const desiredAmount0 = String(
        this.$ethers.utils.parseUnits(
          this.amount0 || "0",
          this.activeToken0.decimals
        )
      );
      const desiredAmount1 = String(
        this.$ethers.utils.parseUnits(
          this.amount1 || "0",
          this.activeToken1.decimals
        )
      );

      let ticker = this.loadingTicker;

      const response = await ConvertToProportion(
        desiredAmount0,
        desiredAmount1,
        this.pool.contractInstance,
        this.pool.poolContractInstance
      );

      if (ticker !== this.loadingTicker) return false;

      this.loadingTicker++;

      let { amount0, amount1 } = response;

      this.proportionAmount0 = amount0 || this.proportionAmount0;
      this.proportionAmount1 = amount1 || this.proportionAmount1;

      this.loadingProportion = false;
    },
    async fetchDesiredAmounts() {
      const amount0 = this.amount0 || 0;
      const amount1 = this.amount1 || 0;

      let re0 = new RegExp(
        // eslint-disable-next-line no-useless-escape
        `^-?\\d+(?:\.\\d{0,` + (this.activeToken0.decimals || -1) + `})?`
      );

      let re1 = new RegExp(
        // eslint-disable-next-line no-useless-escape
        `^-?\\d+(?:\.\\d{0,` + (this.activeToken1.decimals || -1) + `})?`
      );

      const amount0Format = amount0.toString().match(re0)[0];
      const amount1Format = amount1.toString().match(re1)[0];

      const desiredAmount0 = String(
        this.$ethers.utils.parseUnits(
          String(amount0Format),
          this.activeToken0.decimals
        )
      );
      const desiredAmount1 = String(
        this.$ethers.utils.parseUnits(
          String(amount1Format),
          this.activeToken1.decimals
        )
      );

      const response = await GetAmountForDesired(
        desiredAmount0,
        desiredAmount1,
        this.pool.contractInstance,
        this.pool.poolContractInstance
      );

      return response;
    },
    async getProportion() {
      const desiredAmount0 = String(
        this.$ethers.utils.parseUnits("1", this.activeToken0.decimals)
      );
      const desiredAmount1 = String(
        this.$ethers.utils.parseUnits("1", this.activeToken1.decimals)
      );

      const response = await ConvertToProportion(
        desiredAmount0,
        desiredAmount1,
        this.pool.contractInstance,
        this.pool.poolContractInstance
      );

      let { amount0, amount1 } = response;

      const proportionAmount0 = this.$ethers.utils.formatUnits(
        amount0,
        this.activeToken0.decimals
      );
      const proportionAmount1 = this.$ethers.utils.formatUnits(
        amount1,
        this.activeToken1.decimals
      );
      const proportion = proportionAmount0 / proportionAmount1;

      return proportion;
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
    async getProportion() {
      const desiredAmount0 = String(
        this.$ethers.utils.parseUnits("1", this.activeToken0.decimals)
      );
      const desiredAmount1 = String(
        this.$ethers.utils.parseUnits("1", this.activeToken1.decimals)
      );

      const response = await ConvertToProportion(
        desiredAmount0,
        desiredAmount1,
        this.pool.contractInstance,
        this.pool.poolContractInstance
      );

      let { amount0, amount1 } = response;

      const proportionAmount0 = this.$ethers.utils.formatUnits(
        amount0,
        this.activeToken0.decimals
      );
      const proportionAmount1 = this.$ethers.utils.formatUnits(
        amount1,
        this.activeToken1.decimals
      );
      const proportion = proportionAmount0 / proportionAmount1;

      return proportion;
    },
  },
  beforeDestroy() {
    clearInterval(this.feeDateInterval);
  },
  async created() {
    if (this.pool.userPoolInfo) {
      this.isUserInfoLoading = false;
      this.proportion = await this.getProportion();
      return false;
    }

    this.userPoolInfoLocal = await this.getUserPoolInfo(this.pool);
    this.proportion = await this.getProportion();
    this.isUserInfoLoading = false;

    this.txFeeDate = await this.provider.getFeeData();

    this.feeDateInterval = setInterval(async () => {
      this.txFeeDate = await this.provider.getFeeData();
    });
  },
  components: {
    UpSliderInput,
    SettingBlock,
  },
};
</script>

<style lang="scss" scoped>
.pool-v2 {
  padding: 30px 0;
  max-width: 466px;
  width: 100%;
  margin: 0 auto;

  .checkbox-wrap {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    &.active {
      .checkbox {
        border: 1px solid #2bd2f7;

        .indicator {
          opacity: 1;
        }
      }
    }

    .checkbox {
      border: 1px solid #868686;
      border-radius: 6px;
      width: 24px;
      height: 24px;
      margin-right: 10px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;

      .indicator {
        opacity: 0;
        width: 50%;
        height: 50%;
        border-radius: 3px;
        background-color: #2bd2f7;
        transition: all 0.3s ease;
      }
    }

    .label-text {
      cursor: pointer;
      font-size: 14px;
    }
  }

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
