export default [
    {
      inputs: [
        {
          internalType: "contract IBentoBoxV1",
          name: "bentoBox_",
          type: "address",
        },
        {
          internalType: "contract IERC20",
          name: "magicInternetMoney_",
          type: "address",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint128",
          name: "accruedAmount",
          type: "uint128",
        },
      ],
      name: "LogAccrue",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "share",
          type: "uint256",
        },
      ],
      name: "LogAddCollateral",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "part",
          type: "uint256",
        },
      ],
      name: "LogBorrow",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "rate",
          type: "uint256",
        },
      ],
      name: "LogExchangeRate",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "newFeeTo",
          type: "address",
        },
      ],
      name: "LogFeeTo",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "share",
          type: "uint256",
        },
      ],
      name: "LogRemoveCollateral",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "part",
          type: "uint256",
        },
      ],
      name: "LogRepay",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "feeTo",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "feesEarnedFraction",
          type: "uint256",
        },
      ],
      name: "LogWithdrawFees",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "previousOwner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "OwnershipTransferred",
      type: "event",
    },
    {
      inputs: [],
      name: "BORROW_OPENING_FEE",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "COLLATERIZATION_RATE",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "LIQUIDATION_MULTIPLIER",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "accrue",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "accrueInfo",
      outputs: [
        { internalType: "uint64", name: "lastAccrued", type: "uint64" },
        { internalType: "uint128", name: "feesEarned", type: "uint128" },
        {
          internalType: "uint64",
          name: "INTEREST_PER_SECOND",
          type: "uint64",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "to", type: "address" },
        { internalType: "bool", name: "skim", type: "bool" },
        { internalType: "uint256", name: "share", type: "uint256" },
      ],
      name: "addCollateral",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "bentoBox",
      outputs: [
        { internalType: "contract IBentoBoxV1", name: "", type: "address" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "to", type: "address" },
        { internalType: "uint256", name: "amount", type: "uint256" },
      ],
      name: "borrow",
      outputs: [
        { internalType: "uint256", name: "part", type: "uint256" },
        { internalType: "uint256", name: "share", type: "uint256" },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "claimOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "collateral",
      outputs: [{ internalType: "contract IERC20", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint8[]", name: "actions", type: "uint8[]" },
        { internalType: "uint256[]", name: "values", type: "uint256[]" },
        { internalType: "bytes[]", name: "datas", type: "bytes[]" },
      ],
      name: "cook",
      outputs: [
        { internalType: "uint256", name: "value1", type: "uint256" },
        { internalType: "uint256", name: "value2", type: "uint256" },
      ],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [],
      name: "exchangeRate",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "feeTo",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "bytes", name: "data", type: "bytes" }],
      name: "init",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address[]", name: "users", type: "address[]" },
        {
          internalType: "uint256[]",
          name: "maxBorrowParts",
          type: "uint256[]",
        },
        { internalType: "address", name: "to", type: "address" },
        {
          internalType: "contract ISwapper",
          name: "swapper",
          type: "address",
        },
      ],
      name: "liquidate",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "magicInternetMoney",
      outputs: [{ internalType: "contract IERC20", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "masterContract",
      outputs: [
        {
          internalType: "contract CauldronV2Flat",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "oracle",
      outputs: [{ internalType: "contract IOracle", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "oracleData",
      outputs: [{ internalType: "bytes", name: "", type: "bytes" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "pendingOwner",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
      name: "reduceSupply",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "to", type: "address" },
        { internalType: "uint256", name: "share", type: "uint256" },
      ],
      name: "removeCollateral",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "to", type: "address" },
        { internalType: "bool", name: "skim", type: "bool" },
        { internalType: "uint256", name: "part", type: "uint256" },
      ],
      name: "repay",
      outputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "newFeeTo", type: "address" }],
      name: "setFeeTo",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "totalBorrow",
      outputs: [
        { internalType: "uint128", name: "elastic", type: "uint128" },
        { internalType: "uint128", name: "base", type: "uint128" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "totalCollateralShare",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "newOwner", type: "address" },
        { internalType: "bool", name: "direct", type: "bool" },
        { internalType: "bool", name: "renounce", type: "bool" },
      ],
      name: "transferOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "updateExchangeRate",
      outputs: [
        { internalType: "bool", name: "updated", type: "bool" },
        { internalType: "uint256", name: "rate", type: "uint256" },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "", type: "address" }],
      name: "userBorrowPart",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "", type: "address" }],
      name: "userCollateralShare",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "withdrawFees",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];
  