// Constants for SOL to USD conversion
const SOL_TO_USD_RATE = 150 // Example rate: 1 SOL = $150 USD

/**
 * Format a currency value with the specified currency symbol and decimal places
 */
export function formatCurrency(amount: number, currency = "USD", decimalPlaces = 2): string {
  return `${currency} ${amount.toFixed(decimalPlaces)}`
}

/**
 * Convert SOL amount to USD
 */
export function solToUsd(solAmount: number): number {
  return solAmount * SOL_TO_USD_RATE
}

/**
 * Convert USD amount to SOL
 */
export function usdToSol(usdAmount: number): number {
  return usdAmount / SOL_TO_USD_RATE
}

/**
 * Format SOL amount with USD equivalent
 */
export function formatSolWithUsd(solAmount: number, solDecimalPlaces = 2): string {
  const usdAmount = solToUsd(solAmount)
  return `${solAmount.toFixed(solDecimalPlaces)} SOL (${usdAmount.toFixed(2)} USD)`
}
