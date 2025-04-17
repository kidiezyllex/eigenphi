export interface TokenIcon {
    symbol: string
    iconUrl: string
  }
  
  export interface Transaction {
    txHash: string
    timestamp: number
    blockNumber: number
    position?: number
    tokens: TokenIcon[]
    from: string
    contract: string
    profit: number
    cost: number
    revenue: number
    type: string
  }
  
// Mock data based on the provided HTML
export async function getMevTransactions(): Promise<Transaction[]> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  return [
    {
      txHash: "0x92f078f13cbf6ffc4f50623d8e64d819cd732d73f34149643519fe8f69edae1b",
      timestamp: Date.now() - 5000, // Just now
      blockNumber: 22289420,
      position: 96,
      tokens: [
        { symbol: "UNI", iconUrl: "/images/sample-img.png" },
        { symbol: "fwUNI", iconUrl: "/images/sample-img.png" },
        { symbol: "fwWBTC", iconUrl: "/images/sample-img.png" },
        { symbol: "USDT", iconUrl: "/images/sample-img.png" },
        { symbol: "WBTC", iconUrl: "/images/sample-img.png" },
        { symbol: "WETH", iconUrl: "/images/sample-img.png" },
        { symbol: "ETH", iconUrl: "/images/sample-img.png" },
      ],
      from: "0x0Bd84ff786",
      contract: "0x81463B0f960f247f704377661ec81C1fd65b5128",
      profit: 0.21,
      cost: 1.09,
      revenue: 1.31,
      type: "Arbitrage",
    },
    {
      txHash: "0xc569ab35e3cf493ea7051d84866485720fab3d7bc33c00d6fb0210fed59c858b",
      timestamp: Date.now() - 10000, // Just now
      blockNumber: 22289420,
      position: 4,
      tokens: [
        { symbol: "TALK", iconUrl: "/images/sample-img.png" },
        { symbol: "Pin", iconUrl: "/images/sample-img.png" },
        { symbol: "WETH", iconUrl: "/images/sample-img.png" },
        { symbol: "ETH", iconUrl: "/images/sample-img.png" },
      ],
      from: "0xae2FaE13",
      contract: "0x1f2F10D1C40777AE1Da742455c65828FF36Df387",
      profit: -0.01,
      cost: 5.21,
      revenue: 5.21,
      type: "Sandwich",
    },
    {
      txHash: "0x875b143710137b914bda9f963683f754955b07a2654ab84217ba7480f90e7c4a",
      timestamp: Date.now() - 15000, // Just now
      blockNumber: 22289419,
      position: 54,
      tokens: [
        { symbol: "TALK", iconUrl: "/images/sample-img.png" },
        { symbol: "WETH", iconUrl: "/images/sample-img.png" },
        { symbol: "ETH", iconUrl: "/images/sample-img.png" },
      ],
      from: "0x007744192",
      contract: "0xF9B6E59D6900b200700039ff6cbBaDB000007600",
      profit: 0.001,
      cost: 0.46,
      revenue: 0.46,
      type: "Arbitrage",
    },
    {
      txHash: "0x6d7ae8d621ee4e42d965702a39a409e34c29dee1fcc73b3787259ad2ec50d0f5",
      timestamp: Date.now() - 20000, // Just now
      blockNumber: 22289419,
      position: 2,
      tokens: [
        { symbol: "USDC", iconUrl: "/images/sample-img.png" },
        { symbol: "WETH", iconUrl: "/images/sample-img.png" },
        { symbol: "ETH", iconUrl: "/images/sample-img.png" },
      ],
      from: "0xC44313E3",
      contract: "0x89653d53Ece2C3F7d67d09a3916a02Bfd44c6180",
      profit: 0.09,
      cost: 4.38,
      revenue: 4.47,
      type: "Arbitrage",
    },
    {
      txHash: "0x57b9755104ad1901a297d11809153a15799232057bdb7b343db63a4805383abf",
      timestamp: Date.now() - 25000, // Just now
      blockNumber: 22289417,
      position: 184,
      tokens: [
        { symbol: "crvUSD", iconUrl: "/images/sample-img.png" },
        { symbol: "USDC", iconUrl: "/images/sample-img.png" },
        { symbol: "WETH", iconUrl: "/images/sample-img.png" },
        { symbol: "ETH", iconUrl: "/images/sample-img.png" },
      ],
      from: "0xe7546B0D",
      contract: "0x00000000009E50a7dDb7a7B0e2ee6604fd120E49",
      profit: 0.001,
      cost: 0.67,
      revenue: 0.67,
      type: "Arbitrage",
    },
    {
      txHash: "0x3433b50164151d64ca4a1401f25a058c099b6fca7405dbff6161f56c118d87b7",
      timestamp: Date.now() - 30000, // Just now
      blockNumber: 22289417,
      position: 2,
      tokens: [
        { symbol: "aEthWBTC", iconUrl: "/images/sample-img.png" },
        { symbol: "variableDebtEthwstETH", iconUrl: "/images/sample-img.png" },
        { symbol: "wstETH", iconUrl: "/images/sample-img.png" },
        { symbol: "aEthLidowstETH", iconUrl: "/images/sample-img.png" },
        { symbol: "waEthLidowstETH", iconUrl: "/images/sample-img.png" },
        { symbol: "waEthLidoWETH", iconUrl: "/images/sample-img.png" },
        { symbol: "aEthLidoWETH", iconUrl: "/images/sample-img.png" },
        { symbol: "sfrxETH", iconUrl: "/images/sample-img.png" },
        { symbol: "frxETH", iconUrl: "/images/sample-img.png" },
        { symbol: "WBTC", iconUrl: "/images/sample-img.png" },
        { symbol: "WETH", iconUrl: "/images/sample-img.png" },
        { symbol: "ETH", iconUrl: "/images/sample-img.png" },
      ],
      from: "0xae2FaE13",
      contract: "0x1f2F10D1C40777AE1Da742455c65828FF36Df387",
      profit: 0.001,
      cost: 85.25,
      revenue: 85.26,
      type: "Sandwich",
    },
    {
      txHash: "0x40bb4c338c75c43beb9c292fe1f045404dac2e6bca9616a43742aa2d76c6f77f",
      timestamp: Date.now() - 60000, // 1 min
      blockNumber: 22289416,
      position: 53,
      tokens: [
        { symbol: "AURA", iconUrl: "/images/sample-img.png" },
        { symbol: "WETH", iconUrl: "/images/sample-img.png" },
        { symbol: "ETH", iconUrl: "/images/sample-img.png" },
      ],
      from: "0x5CbD26FA",
      contract: "0x2d5805A423D6CE771f06972Ad4499f120902631a",
      profit: 0.02,
      cost: 0.62,
      revenue: 0.64,
      type: "Arbitrage",
    },
    {
      txHash: "0xc109bfa9561c4fd149f39c0f99f449a5b1d4920feb38bf7f9508aee1e927b418",
      timestamp: Date.now() - 65000, // 1 min
      blockNumber: 22289407,
      position: 6,
      tokens: [
        { symbol: "CABAL", iconUrl: "/images/sample-img.png" },
        { symbol: "WETH", iconUrl: "/images/sample-img.png" },
        { symbol: "ETH", iconUrl: "/images/sample-img.png" },
      ],
      from: "0x276e33FA",
      contract: "0x828AE1566824A9835Acb6F565E1E9eA22BfB883A",
      profit: 0.001,
      cost: 3.66,
      revenue: 3.66,
      type: "Arbitrage",
    },
    {
      txHash: "0x469df15058dcd5ff651d0465e06bf045de50c569c05e608d58e129d896c3136a",
      timestamp: Date.now() - 120000, // 2 mins
      blockNumber: 22289406,
      position: 9,
      tokens: [
        { symbol: "KARRAT", iconUrl: "/images/sample-img.png" },
        { symbol: "USDC", iconUrl: "/images/sample-img.png" },
        { symbol: "WETH", iconUrl: "/images/sample-img.png" },
        { symbol: "ETH", iconUrl: "/images/sample-img.png" },
      ],
      from: "0xa8532108",
      contract: "0x997d1c9f17E685F28fff1dEB758453945C42ED64",
      profit: 0.44,
      cost: 3.65,
      revenue: 4.08,
      type: "Sandwich",
    },
    {
      txHash: "0x613107c06dd11e250a570f2b389f7531bd28717710aec5024d6cf81d7b4efff2",
      timestamp: Date.now() - 180000, // 3 mins
      blockNumber: 22289401,
      position: 86,
      tokens: [
        { symbol: "NU", iconUrl: "/images/sample-img.png" },
        { symbol: "T", iconUrl: "/images/sample-img.png" },
        { symbol: "WETH", iconUrl: "/images/sample-img.png" },
        { symbol: "ETH", iconUrl: "/images/sample-img.png" },
      ],
      from: "0xc0f4235E",
      contract: "0xB87f72A8F8d724Caedbb036252082165b037842c",
      profit: 0.05,
      cost: 0.6,
      revenue: 0.65,
      type: "Arbitrage",
    },
    {
      txHash: "0xb74a750d2dc56aff3e78700047f3786659909efc539c21a6994ad458ab450981",
      timestamp: Date.now() - 420000, // 7 mins
      blockNumber: 22289378,
      position: 185,
      tokens: [
        { symbol: "Compounding Open Dollar", iconUrl: "/images/sample-img.png" },
        { symbol: "USDC", iconUrl: "/images/sample-img.png" },
        { symbol: "ETH", iconUrl: "/images/sample-img.png" },
      ],
      from: "0x2e5857e2",
      contract: "0x0000000000bbF5c5Fd284e657F01Bd000933C96D",
      profit: 1501.12,
      cost: 0.96,
      revenue: 1502.08,
      type: "Arbitrage",
    },
  ]
}
