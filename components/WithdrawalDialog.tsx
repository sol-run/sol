"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

interface WithdrawalDialogProps {
  isOpen: boolean
  onClose: () => void
  walletBalance: number
}

export function WithdrawalDialog({ isOpen, onClose, walletBalance }: WithdrawalDialogProps) {
  const { toast } = useToast()
  const [amount, setAmount] = useState<string>("")
  const [destinationAddress, setDestinationAddress] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false)

  // Reset confirmation state when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      setShowConfirmation(false)
    }
  }, [isOpen])

  // Calculate USD value whenever amount changes
  const usdValue = amount && !isNaN(Number(amount)) ? `$${(Number(amount) * 20.5).toFixed(2)}` : "$0.00"

  // Calculate withdrawal fee (1%)
  const withdrawalFee = amount && !isNaN(Number(amount)) ? Number(amount) * 0.01 : 0

  // Calculate net amount after fee
  const netAmount = amount && !isNaN(Number(amount)) ? Number(amount) - withdrawalFee : 0

  // Calculate USD value of wallet balance
  const walletBalanceUsd = (walletBalance * 20.5).toFixed(2)

  // Validate form in real-time
  const [isFormValid, setIsFormValid] = useState<boolean>(false)

  useEffect(() => {
    const amountValid = amount && !isNaN(Number(amount)) && Number(amount) > 0 && Number(amount) <= walletBalance
    const addressValid = destinationAddress && destinationAddress.trim().length >= 32
    setIsFormValid(amountValid && addressValid)
  }, [amount, destinationAddress, walletBalance])

  // Function to validate inputs and show confirmation
  const handleShowConfirmation = () => {
    // Validate inputs
    if (!amount || isNaN(Number.parseFloat(amount)) || Number.parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid withdrawal amount",
        variant: "destructive",
      })
      return
    }

    if (Number.parseFloat(amount) > walletBalance) {
      toast({
        title: "Insufficient Balance",
        description: "Withdrawal amount exceeds your available balance",
        variant: "destructive",
      })
      return
    }

    if (!destinationAddress || destinationAddress.trim().length < 32) {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid Solana wallet address",
        variant: "destructive",
      })
      return
    }

    // Show confirmation screen
    setShowConfirmation(true)
  }

  // Function to process the withdrawal
  const handleProcessWithdrawal = async () => {
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Withdrawal Initiated",
        description: `${amount} SOL has been sent to ${destinationAddress.slice(0, 4)}...${destinationAddress.slice(-4)}`,
        variant: "success",
      })

      setAmount("")
      setDestinationAddress("")
      setShowConfirmation(false)
      onClose()
    } catch (error) {
      toast({
        title: "Withdrawal Failed",
        description: "There was an error processing your withdrawal. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Function to go back from confirmation
  const handleGoBack = () => {
    setShowConfirmation(false)
  }

  // Render the confirmation screen
  const renderConfirmationScreen = () => (
    <>
      <div className="p-4 border border-destructive/20 bg-destructive/5 rounded-md mb-4">
        <h4 className="font-semibold text-destructive mb-2">Confirm Withdrawal</h4>
        <p className="text-sm mb-2">
          You are about to withdraw <span className="font-bold">{amount} SOL</span> to:
        </p>
        <p className="text-sm font-mono bg-background p-2 rounded mb-3 break-all">{destinationAddress}</p>
        <p className="text-sm font-medium">
          After the 1% platform fee, you will receive <span className="font-bold">{netAmount.toFixed(4)} SOL</span>.
        </p>
        <p className="text-sm mt-3 text-destructive">
          ⚠️ All withdrawals are final and cannot be reversed once executed.
        </p>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={handleGoBack}>
          Go Back
        </Button>
        <Button onClick={handleProcessWithdrawal} disabled={isLoading} variant="destructive">
          {isLoading ? "Processing..." : "Confirm Withdrawal"}
        </Button>
      </DialogFooter>
    </>
  )

  // Render the input form
  const renderInputForm = () => (
    <>
      <div className="flex flex-col gap-6 py-4">
        {/* Amount Section */}
        <div className="w-full">
          <Label htmlFor="amount" className="text-base font-medium block mb-2">
            Amount
          </Label>
          <div className="w-full">
            <div className="relative">
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                max={walletBalance.toString()}
                value={amount}
                onChange={(e) => {
                  const inputValue = e.target.value
                  // If input value is greater than wallet balance, set to max available
                  if (inputValue && Number(inputValue) > walletBalance) {
                    setAmount(walletBalance.toString())
                    toast({
                      title: "Maximum amount applied",
                      description: "The amount has been adjusted to your maximum available balance.",
                      variant: "default",
                    })
                  } else {
                    setAmount(inputValue)
                  }
                }}
                placeholder="0.00"
                className="pr-20"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-muted-foreground">
                {usdValue}
              </div>
            </div>
            <div className="flex justify-between mt-1">
              <p className="text-xs text-muted-foreground">
                Available: {walletBalance.toFixed(4)} SOL (${walletBalanceUsd} USD)
              </p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-auto p-0 text-xs text-primary hover:text-primary/80"
                onClick={() => setAmount(walletBalance.toString())}
              >
                Use Max
              </Button>
            </div>
          </div>
        </div>

        {/* To Address Section */}
        <div className="w-full pt-4 border-t border-border">
          <Label htmlFor="destination" className="text-base font-medium block mb-2">
            To Address
          </Label>
          <div className="w-full">
            <Input
              id="destination"
              value={destinationAddress}
              onChange={(e) => setDestinationAddress(e.target.value)}
              placeholder="Solana wallet address"
            />
            <p className="text-xs text-muted-foreground mt-1">Enter a valid Solana wallet address</p>
          </div>
        </div>

        {/* Fee Summary */}
        {amount && !isNaN(Number(amount)) && Number(amount) > 0 && (
          <div className="w-full pt-4 border-t border-border">
            <h4 className="text-base font-medium mb-2">Transaction Summary</h4>
            <div className="bg-muted p-3 rounded-md">
              <div className="grid grid-cols-2 gap-1 text-sm">
                <span className="text-muted-foreground">Withdrawal Amount:</span>
                <span className="text-right">{Number(amount).toFixed(4)} SOL</span>

                <span className="text-muted-foreground">Platform Fee (1%):</span>
                <span className="text-right text-destructive">-{withdrawalFee.toFixed(4)} SOL</span>

                <span className="font-medium pt-1 border-t">You will receive:</span>
                <span className="text-right font-bold pt-1 border-t">{netAmount.toFixed(4)} SOL</span>
              </div>
            </div>
          </div>
        )}
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={handleShowConfirmation}
          disabled={
            !amount ||
            isNaN(Number(amount)) ||
            Number(amount) <= 0 ||
            Number(amount) > walletBalance ||
            !destinationAddress ||
            destinationAddress.trim().length < 32
          }
          className="relative"
        >
          {isLoading ? (
            <>
              <span className="opacity-0">Withdraw SOL</span>
              <span className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </span>
            </>
          ) : (
            "Withdraw SOL"
          )}
        </Button>
      </DialogFooter>
    </>
  )

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Withdraw SOL</DialogTitle>
          <DialogDescription>Enter the amount and destination address to withdraw your SOL.</DialogDescription>
        </DialogHeader>

        {showConfirmation ? renderConfirmationScreen() : renderInputForm()}
      </DialogContent>
    </Dialog>
  )
}
