// Hàm tạo dữ liệu ngẫu nhiên
function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min: number, max: number, decimals: number = 2): number {
  const rand = Math.random() * (max - min) + min;
  return Number(rand.toFixed(decimals));
}

function getRandomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Tạo dữ liệu mẫu cho flashloan
export async function getMockFlashloanData() {
  // Giả lập delay của API
  await new Promise(resolve => setTimeout(resolve, 1500));

  const now = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  // Dữ liệu summary
  const summary = {
    totalAmount: getRandomFloat(10000, 50000, 2),
    totalTransactions: getRandomNumber(5000, 10000),
    averageAmount: getRandomFloat(5, 20, 2),
    largestAmount: getRandomFloat(1000, 5000, 2),
    activeUsers: getRandomNumber(500, 2000),
    protocols: getRandomNumber(10, 30),
  };

  // Dữ liệu xu hướng
  const trend = {
    labels: Array.from({ length: 30 }, (_, i) => {
      const date = new Date(oneMonthAgo);
      date.setDate(date.getDate() + i);
      return date.toISOString().slice(0, 10);
    }),
    volumes: Array.from({ length: 30 }, () => getRandomFloat(100, 1000, 2)),
    counts: Array.from({ length: 30 }, () => getRandomNumber(50, 200)),
  };

  // Dữ liệu top flashloan
  const topFlashloan = Array.from({ length: 20 }, (_, index) => ({
    id: `tx-${getRandomNumber(1000000, 9999999)}`,
    rank: index + 1,
    timestamp: getRandomDate(oneMonthAgo, now).toISOString(),
    protocol: ['AAVE', 'MakerDAO', 'Compound', 'dYdX', 'Uniswap'][getRandomNumber(0, 4)],
    amount: getRandomFloat(100, 5000, 2),
    amountUSD: getRandomFloat(100, 5000, 2) * 1800, // Giả sử giá ETH là 1800 USD
    tokens: ['ETH', 'USDC', 'USDT', 'DAI', 'WBTC'][getRandomNumber(0, 4)],
    fee: getRandomFloat(0.1, 5, 3),
    user: `0x${Array.from({ length: 40 }, () => "0123456789ABCDEF"[getRandomNumber(0, 15)]).join('')}`,
    txHash: `0x${Array.from({ length: 64 }, () => "0123456789ABCDEF"[getRandomNumber(0, 15)]).join('')}`,
  }));

  // Dữ liệu flashloan mới nhất
  const latestFlashloan = Array.from({ length: 20 }, (_, index) => ({
    id: `tx-${getRandomNumber(1000000, 9999999)}`,
    timestamp: getRandomDate(new Date(now.getTime() - 24 * 60 * 60 * 1000), now).toISOString(),
    protocol: ['AAVE', 'MakerDAO', 'Compound', 'dYdX', 'Uniswap'][getRandomNumber(0, 4)],
    amount: getRandomFloat(100, 5000, 2),
    amountUSD: getRandomFloat(100, 5000, 2) * 1800, // Giả sử giá ETH là 1800 USD
    tokens: ['ETH', 'USDC', 'USDT', 'DAI', 'WBTC'][getRandomNumber(0, 4)],
    fee: getRandomFloat(0.1, 5, 3),
    user: `0x${Array.from({ length: 40 }, () => "0123456789ABCDEF"[getRandomNumber(0, 15)]).join('')}`,
    txHash: `0x${Array.from({ length: 64 }, () => "0123456789ABCDEF"[getRandomNumber(0, 15)]).join('')}`,
  })).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // Dữ liệu protocols
  const protocols = Array.from({ length: 10 }, (_, index) => {
    const name = ['AAVE', 'MakerDAO', 'Compound', 'dYdX', 'Uniswap', 'Balancer', 'Curve', 'SushiSwap', 'Yearn', 'Bancor'][index];
    const totalAmount = getRandomFloat(1000, 10000, 2);
    const transactions = getRandomNumber(100, 1000);
    
    return {
      id: `protocol-${index + 1}`,
      name,
      totalAmount,
      amountUSD: totalAmount * 1800, // Giả sử giá ETH là 1800 USD
      transactions,
      avgAmount: totalAmount / transactions,
      marketShare: getRandomFloat(1, 25, 2),
      change24h: getRandomFloat(-15, 15, 2),
      userCount: getRandomNumber(50, 500),
    };
  }).sort((a, b) => b.totalAmount - a.totalAmount);

  return {
    summary,
    trend,
    topFlashloan,
    latestFlashloan,
    protocols,
  };
} 