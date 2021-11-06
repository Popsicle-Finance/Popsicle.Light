export default [
    {
      inputs: [{ internalType: "address", name: "_DAO", type: "address" }],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "extraAmount0",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "extraAmount1",
          type: "uint256",
        },
      ],
      name: "ExtraTokens",
      type: "event",
    },
    {
      inputs: [],
      name: "DAO",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "optimizer", type: "address" },
        { internalType: "address", name: "to", type: "address" },
        {
          components: [
            { internalType: "bool", name: "IsUno", type: "bool" },
            {
              internalType: "contract IAggregationExecutor",
              name: "caller",
              type: "address",
            },
            {
              components: [
                {
                  internalType: "contract IERC20",
                  name: "srcToken",
                  type: "address",
                },
                {
                  internalType: "contract IERC20",
                  name: "dstToken",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "srcReceiver",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "dstReceiver",
                  type: "address",
                },
                {
                  internalType: "uint256",
                  name: "amount",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "minReturnAmount",
                  type: "uint256",
                },
                { internalType: "uint256", name: "flags", type: "uint256" },
                { internalType: "bytes", name: "permit", type: "bytes" },
              ],
              internalType: "struct IRouter.SwapDescription",
              name: "desc",
              type: "tuple",
            },
            { internalType: "bytes", name: "data", type: "bytes" },
            { internalType: "bytes32[]", name: "pools", type: "bytes32[]" },
          ],
          internalType: "struct OptimizerZap.TokenData",
          name: "tokenData",
          type: "tuple",
        },
      ],
      name: "DepositInEth",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "tokenIn", type: "address" },
        { internalType: "uint256", name: "amount", type: "uint256" },
        { internalType: "address", name: "optimizer", type: "address" },
        { internalType: "address", name: "to", type: "address" },
        {
          components: [
            { internalType: "bool", name: "IsUno", type: "bool" },
            {
              internalType: "contract IAggregationExecutor",
              name: "caller",
              type: "address",
            },
            {
              components: [
                {
                  internalType: "contract IERC20",
                  name: "srcToken",
                  type: "address",
                },
                {
                  internalType: "contract IERC20",
                  name: "dstToken",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "srcReceiver",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "dstReceiver",
                  type: "address",
                },
                {
                  internalType: "uint256",
                  name: "amount",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "minReturnAmount",
                  type: "uint256",
                },
                { internalType: "uint256", name: "flags", type: "uint256" },
                { internalType: "bytes", name: "permit", type: "bytes" },
              ],
              internalType: "struct IRouter.SwapDescription",
              name: "desc",
              type: "tuple",
            },
            { internalType: "bytes", name: "data", type: "bytes" },
            { internalType: "bytes32[]", name: "pools", type: "bytes32[]" },
          ],
          internalType: "struct OptimizerZap.TokenData",
          name: "token0Data",
          type: "tuple",
        },
        {
          components: [
            { internalType: "bool", name: "IsUno", type: "bool" },
            {
              internalType: "contract IAggregationExecutor",
              name: "caller",
              type: "address",
            },
            {
              components: [
                {
                  internalType: "contract IERC20",
                  name: "srcToken",
                  type: "address",
                },
                {
                  internalType: "contract IERC20",
                  name: "dstToken",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "srcReceiver",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "dstReceiver",
                  type: "address",
                },
                {
                  internalType: "uint256",
                  name: "amount",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "minReturnAmount",
                  type: "uint256",
                },
                { internalType: "uint256", name: "flags", type: "uint256" },
                { internalType: "bytes", name: "permit", type: "bytes" },
              ],
              internalType: "struct IRouter.SwapDescription",
              name: "desc",
              type: "tuple",
            },
            { internalType: "bytes", name: "data", type: "bytes" },
            { internalType: "bytes32[]", name: "pools", type: "bytes32[]" },
          ],
          internalType: "struct OptimizerZap.TokenData",
          name: "token1Data",
          type: "tuple",
        },
      ],
      name: "ZapIn",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "_token", type: "address" },
      ],
      name: "recoverLostToken",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "refundETH",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "nonpayable",
      type: "function",
    },
  ]