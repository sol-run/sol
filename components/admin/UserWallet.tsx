"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/utils/currency"
import { useState, useEffect } from "react"

interface WalletData {
  address: string
  balance: number
}

interface UserWalletProps {
  username: string
  walletData: WalletData
}

export function UserWallet({ username, walletData }: UserWalletProps) {
  const [formattedBalance, setFormattedBalance] = useState<string>("")

  useEffect(() => {
    try {
      const formatted = formatCurrency(walletData.balance)
      const usdAmount = formatted.split(" (")[1]?.replace(")", "") || ""
      setFormattedBalance(usdAmount)
    } catch (error) {
      console.error("Error formatting currency:", error)
      setFormattedBalance("Unable to format balance")
    }
  }, [walletData.balance])

  const handleViewTransactions = () => {
    console.log(`Viewing transactions for wallet: ${walletData.address}`)
    // Here you would typically call an API or navigate to a transactions page
    // For now, we'll just log the action
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Solana Wallet for {username}</h2>
      <Card>
        <CardHeader>
          <CardTitle>Wallet Address</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-mono break-all">{walletData.address}</p>
        </CardContent>
      </Card>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl font-bold">{walletData.balance} SOL</p>
          <p className="text-sm text-gray-500">{formattedBalance}</p>
        </CardContent>
      </Card>
      <div className="mt-4">
        <Button asChild>
          <a href={`https://solscan.io/account/${walletData.address}`} target="_blank" rel="noopener noreferrer">
            View Transactions
          </a>
        </Button>
      </div>
    </div>
  )
}
