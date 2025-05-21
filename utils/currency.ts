const SOL_TO_USD_RATE = 20.5

export function solToUsd(solAmount: number): number {
  return solAmount * SOL_TO_USD_RATE
}

export function usdToSol(usdAmount: number): number {
  return usdAmount / SOL_TO_USD_RATE
}

export function formatCurrency(solAmount: number, solDecimalPlaces = 4): string {
  const usdAmount = solToUsd(solAmount)
  return `${solAmount.toFixed(solDecimalPlaces)} SOL (${usdAmount.toFixed(2)} USD)`
}
