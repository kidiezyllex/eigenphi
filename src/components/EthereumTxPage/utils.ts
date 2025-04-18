export function formatValue(value: string): string {
  // Kiểm tra xem value có phải là số rất lớn không
  if (value.length > 10) {
    // Nếu là số rất lớn, chia cho 10^18 để chuyển từ wei sang ETH
    const num = BigInt(value)
    const divisor = BigInt(10 ** 18)
    const whole = num / divisor
    const fraction = num % divisor

    // Định dạng phần thập phân để có 6 chữ số phần thập phân
    const fractionalPart = fraction.toString().padStart(18, "0").substring(0, 6)
    return `${whole.toString()}.${fractionalPart}`
  }

  // Nếu là số nhỏ hơn, giữ nguyên
  return value
}

export function isNullAddress(address: string): boolean {
  return address === "0x0000000000000000000000000000000000000000"
}

export function getTransactionType(label: string | null | undefined): string {
  if (!label) return "None"
  
  switch(label.toUpperCase()) {
    case "ARBITRAGE":
      return "Arbitrage"
    case "SANDWICH":
      return "Sandwich"
    case "LIQUIDATION":
      return "Liquidation"
    default:
      return "None"
  }
} 