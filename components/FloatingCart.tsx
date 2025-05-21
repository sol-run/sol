"use client"

import type React from "react"
import { useEffect, useState, useCallback, useRef } from "react"
import { useCart } from "@/context/CartContext"
import { CartItem } from "@/components/CartItem"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Copy, X } from "lucide-react"
import { formatCurrency } from "@/utils/currency"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { ProgressBar } from "@/components/ui/progress-bar"
import QRCode from "react-qr-code"
import { ChevronDown, ChevronUp } from "lucide-react"

// Create a unique ID for this cart instance
const CART_INSTANCE_ID = "floating-cart-singleton"

export const FloatingCart: React.FC = () => {
  const router = useRouter()
  const { cartItems, removeFromCart, clearCart, isCartOpen, setIsCartOpen } = useCart()
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [isCheckoutDialogOpen, setIsCheckoutDialogOpen] = useState(false)
  const [walletBalance, setWalletBalance] = useState(0)
  const [topUpAmount, setTopUpAmount] = useState(0)
  const [countdown, setCountdown] = useState(900) // 15 minutes in seconds
  const [walletAddress] = useState("7X3csFANQe4FHzZFP6kKKGCWHKbEsBAGn1XFGEFKxLxa") // Mock wallet address
  const [showDepositOptions, setShowDepositOptions] = useState(false)
  const [isRendered, setIsRendered] = useState(false)
  const instanceRef = useRef<HTMLDivElement>(null)

  // Check if this is a duplicate cart
  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined") return

    // Check if another cart already exists
    const existingCart = document.getElementById(CART_INSTANCE_ID)

    if (existingCart && existingCart !== instanceRef.current) {
      // This is a duplicate, don't render it
      setIsRendered(false)
      console.warn("Duplicate FloatingCart detected and prevented from rendering")
    } else {
      // This is the first/only instance
      setIsRendered(true)
    }
  }, [])

  const fetchUpdatedWalletBalance = useCallback(() => {
    // Simulating an API call to fetch the updated balance
    const updatedBalance = Math.random() * 20 // Random balance between 0 and 20
    setWalletBalance(updatedBalance)
  }, [])

  useEffect(() => {
    if (!isRendered) return

    setSelectedItems(new Set(cartItems.map((item) => item.id)))
    if (cartItems.length > 0) {
      setIsCartOpen(true)
    }
  }, [cartItems, setIsCartOpen, isRendered])

  useEffect(() => {
    if (!isRendered) return

    let timer: NodeJS.Timeout
    if (isCheckoutDialogOpen && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isCheckoutDialogOpen, countdown, isRendered])

  useEffect(() => {
    if (!isRendered) return

    if (isCheckoutDialogOpen) {
      // Initial balance fetch
      fetchUpdatedWalletBalance()

      // Set up interval to check balance every 15 seconds
      const intervalId = setInterval(fetchUpdatedWalletBalance, 15000)

      // Clean up interval on component unmount or when dialog closes
      return () => clearInterval(intervalId)
    }
  }, [isCheckoutDialogOpen, fetchUpdatedWalletBalance, isRendered])

  useEffect(() => {
    if (!isRendered) return

    const intervalId = setInterval(fetchUpdatedWalletBalance, 15000)
    return () => clearInterval(intervalId)
  }, [fetchUpdatedWalletBalance, isRendered])

  const handleSelectItem = (id: string, isSelected: boolean) => {
    setSelectedItems((prevSelected) => {
      const newSelected = new Set(prevSelected)
      if (isSelected) {
        newSelected.add(id)
      } else {
        newSelected.delete(id)
      }
      return newSelected
    })
  }

  const totalPrice = cartItems.filter((item) => selectedItems.has(item.id)).reduce((sum, item) => sum + item.price, 0)

  const handleCheckout = () => {
    setIsCheckoutDialogOpen(true)
    // Simulating wallet balance fetch
    setWalletBalance(Math.random() * 10)
    setTopUpAmount(Math.max(0, totalPrice * 1.05 - walletBalance))
  }

  const handleCompletePayment = async () => {
    if (walletBalance >= totalPrice) {
      // Process payment
      await clearCart()
      toast({
        title: "Payment Successful",
        description: "Your order has been processed successfully.",
      })
      setIsCheckoutDialogOpen(false)
      router.push("/dashboard") // Redirect to dashboard after successful purchase
    } else {
      // Show top-up instructions
      setTopUpAmount(totalPrice * 1.05 - walletBalance)
    }
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress)
    toast({
      title: "Address copied",
      description: "The wallet address has been copied to your clipboard.",
    })
  }

  const handleCloseDialog = () => {
    setIsCheckoutDialogOpen(false)
    setCountdown(900) // Reset countdown when closing the dialog
  }

  const toggleCart = () => {
    setIsCartOpen((prev) => !prev)
  }

  // Don't render anything if this is a duplicate cart
  if (!isRendered) return null

  return (
    <div
      id={CART_INSTANCE_ID}
      ref={instanceRef}
      className="fixed right-4 bottom-4 z-[1000] w-80 transition-all duration-300 ease-in-out"
      style={{ isolation: "isolate" }}
    >
      <div
        className={`bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg p-4 relative ${
          cartItems.length > 0 ? "animate-pulse-glow" : ""
        }`}
      >
        {cartItems.length > 0 && (
          <span
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs animate-blink z-10 cursor-pointer"
            onClick={toggleCart}
          >
            {cartItems.length}
          </span>
        )}

        <button
          onClick={toggleCart}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 z-20"
        >
          {isCartOpen ? <X className="h-5 w-5" /> : <ShoppingCart className="h-5 w-5" />}
        </button>

        {isCartOpen ? (
          <div className="pt-6">
            <h2 className="text-lg font-semibold mb-4 dark:text-white">Your Cart</h2>
            {cartItems.length > 0 ? (
              <>
                <ScrollArea className="h-96 mb-4">
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <CartItem
                        key={item.id}
                        {...item}
                        onRemove={removeFromCart}
                        isSelected={selectedItems.has(item.id)}
                        onSelect={handleSelectItem}
                      />
                    ))}
                  </div>
                </ScrollArea>
                <div className="sticky bottom-0 bg-white dark:bg-gray-800 p-4 border-t dark:border-gray-700">
                  <div className="flex flex-col mb-2">
                    <p className="text-lg font-bold dark:text-white">
                      Total: {formatCurrency(totalPrice).split(" (")[0]}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      ({formatCurrency(totalPrice).split(" (")[1]}
                    </p>
                  </div>
                  <Button onClick={handleCheckout} className="w-full">
                    Checkout Now
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-2">
                <ShoppingCart className="inline-block h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-500">Cart is empty</span>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center py-2">
            <ShoppingCart className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-sm text-gray-500">{cartItems.length > 0 ? `${cartItems.length} items` : "Cart"}</span>
          </div>
        )}

        <div
          className="mt-4 text-sm text-gray-600 dark:text-gray-400 cursor-pointer"
          onClick={() => setShowDepositOptions(!showDepositOptions)}
        >
          <span className="underline">Click Here</span> To View Deposit Options
          {showDepositOptions ? <ChevronUp className="inline ml-1" /> : <ChevronDown className="inline ml-1" />}
        </div>
        {showDepositOptions && (
          <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
            <p>
              You can buy SOLANA for your Sol.Run wallet with a Credit Card / Apple Pay / Google Pay using any of these
              sites:
            </p>
            <ol className="list-decimal list-inside mt-2">
              <li>
                <a
                  href="https://transak.com/buy/sol"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  https://transak.com/buy/sol
                </a>
              </li>
              <li>
                <a
                  href="https://www.moonpay.com/buy/sol"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  https://www.moonpay.com/buy/sol
                </a>
              </li>
              <li>
                <a
                  href="https://changenow.io/exchange?from=usd&to=sol"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  https://changenow.io/exchange?from=usd&to=sol
                </a>
              </li>
              <li>Buy using an exchange of your choice e.g. Binance / Kucoin / Bitget and more.</li>
            </ol>
            <div className="mt-4 border-t pt-4 dark:border-gray-700">
              <h3 className="text-sm font-semibold mb-2 dark:text-white">Your Wallet</h3>
              <div className="flex flex-col mb-2">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  <span className="font-bold">Address:</span>
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 break-all">{walletAddress}</p>
                <button
                  onClick={copyAddress}
                  className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded mt-1 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  <Copy size={12} className="mr-1" />
                  Copy Address
                </button>
              </div>
              <div className="flex justify-center mb-2">
                <QRCode value={walletAddress} size={100} />
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                <span className="font-bold">Balance:</span> {formatCurrency(walletBalance)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">(refreshes every 15 seconds)</p>
            </div>
          </div>
        )}
      </div>

      <Dialog open={isCheckoutDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Checkout</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <ProgressBar step={3} />
            <div className="text-center">
              <p className="font-bold">Current Wallet Balance:</p>
              <p className="text-2xl">{formatCurrency(walletBalance)}</p>
              <p className="text-sm text-gray-500">(Auto-updating every 15 seconds)</p>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <QRCode value={`solana:${walletAddress}?amount=${totalPrice}`} size={128} />
              <div className="flex flex-col items-center space-y-2">
                <span className="text-sm text-center break-all">{walletAddress}</span>
                <Button variant="outline" size="sm" onClick={copyAddress}>
                  Copy Address
                </Button>
              </div>
            </div>
            <div className="text-center">
              <p className="font-bold">Total Amount Due:</p>
              <p className="text-xl">{formatCurrency(totalPrice)}</p>
              <p className="text-sm text-gray-500">({(totalPrice * 20).toFixed(2)} USD)</p>
            </div>
            <div className="text-center">
              <p className="font-bold">Time Left to Pay:</p>
              <p className="text-xl">
                {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, "0")}
              </p>
            </div>
            {topUpAmount > 0 && (
              <div className="text-center bg-red-50 dark:bg-red-900/30 p-4 rounded-lg border border-red-200 dark:border-red-800">
                <p className="text-red-600 dark:text-red-400 font-semibold">Insufficient Funds</p>
                <p className="text-red-600 dark:text-red-400">
                  Your wallet balance is too low to complete this purchase.
                </p>
                <p className="text-red-600 dark:text-red-400 font-semibold mt-2">
                  Minimum Required: {formatCurrency(totalPrice)}
                </p>
                <p className="text-red-600 dark:text-red-400">Current Balance: {formatCurrency(walletBalance)}</p>
                <p className="text-red-600 dark:text-red-400 font-semibold mt-2">
                  Please top up {formatCurrency(topUpAmount)} to complete your purchase
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              onClick={handleCompletePayment}
              disabled={topUpAmount > 0}
              className={topUpAmount > 0 ? "bg-gray-400 hover:bg-gray-400 cursor-not-allowed" : ""}
            >
              Complete Purchase
            </Button>
            {topUpAmount > 0 && (
              <Button
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                onClick={() => window.open("https://transak.com/buy/sol", "_blank")}
              >
                Top Up Wallet
              </Button>
            )}
            <Button onClick={handleCloseDialog}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
