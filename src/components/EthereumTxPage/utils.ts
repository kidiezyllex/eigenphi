export function formatValue(value: string): string {
  if (value.length > 10) {
    const num = BigInt(value)
    const divisor = BigInt(10 ** 18)
    const whole = num / divisor
    const fraction = num % divisor
    const fractionalPart = fraction.toString().padStart(18, "0").substring(0, 6)
    return `${whole.toString()}.${fractionalPart}`
  }
  return value;
}

export function isNullAddress(address: string): boolean {
  return address === "0x0000000000000000000000000000000000000000"
}

export function getTransactionType(label: string | null | undefined): string {
  if (!label) return "Transaction"
  
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