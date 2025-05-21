"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardTabs } from "@/components/dashboard-tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, AlertTriangle, BarChart3 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Wallet,
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
  ArrowUpCircle,
  ArrowDownCircle,
  Key,
  CreditCard,
  RefreshCw,
  Shield,
} from "lucide-react"
import { formatCurrency } from "@/utils/currency"
import QRCode from "react-qr-code"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/context/CartContext"
import { WithdrawalDialog } from "@/components/WithdrawalDialog"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Define time period type
type TimePeriod = "all" | "year" | "month" | "week" | "today"

// Define earnings data structure
interface EarningsData {
  netSales: {
    unitsSold: number
    totalEarned: number
  }
  commissions: {
    unitsSold: number
    totalEarned: number
  }
  combined: {
    unitsSold: number
    totalEarned: number
  }
}

// Mock earnings data for different time periods
const mockEarningsData: Record<TimePeriod, EarningsData> = {
  all: {
    netSales: { unitsSold: 127, totalEarned: 42.5 },
    commissions: { unitsSold: 83, totalEarned: 12.75 },
    combined: { unitsSold: 210, totalEarned: 55.25 },
  },
  year: {
    netSales: { unitsSold: 89, totalEarned: 29.8 },
    commissions: { unitsSold: 61, totalEarned: 9.15 },
    combined: { unitsSold: 150, totalEarned: 38.95 },
  },
  month: {
    netSales: { unitsSold: 32, totalEarned: 10.7 },
    commissions: { unitsSold: 24, totalEarned: 3.6 },
    combined: { unitsSold: 56, totalEarned: 14.3 },
  },
  week: {
    netSales: { unitsSold: 8, totalEarned: 2.68 },
    commissions: { unitsSold: 5, totalEarned: 0.75 },
    combined: { unitsSold: 13, totalEarned: 3.43 },
  },
  today: {
    netSales: { unitsSold: 2, totalEarned: 0.67 },
    commissions: { unitsSold: 1, totalEarned: 0.15 },
    combined: { unitsSold: 3, totalEarned: 0.82 },
  },
}

export default function DashboardClientPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { cartItems, total, setCartItems, setIsCartOpen } = useCart()
  const [isDemo, setIsDemo] = useState(false)
  const [walletBalance, setWalletBalance] = useState(10.5)
  const [showFullAddress, setShowFullAddress] = useState(false)
  const [walletAddress, setWalletAddress] = useState("7X3csFANQe4FHzZFP6kKKGCWHKbEsBAGn1XFGEFKxLxa")
  const [isWithdrawalDialogOpen, setIsWithdrawalDialogOpen] = useState(false)
  const [isDepositDialogOpen, setIsDepositDialogOpen] = useState(false)
  const [isExportKeyDialogOpen, setIsExportKeyDialogOpen] = useState(false)
  const [twoFACode, setTwoFACode] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [privateKeyVisible, setPrivateKeyVisible] = useState(false)
  const [privateKey, setPrivateKey] = useState("")
  const [isWithdrawalVerificationDialogOpen, setIsWithdrawalVerificationDialogOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<TimePeriod>("all")
  const [isLoadingEarnings, setIsLoadingEarnings] = useState(false)

  // Mock state for 2FA status - in a real app, this would come from the user's profile
  const [is2FAEnabled, setIs2FAEnabled] = useState(false)
  const [setup2FADialogOpen, setSetup2FADialogOpen] = useState(false)
  const [twoFactorQRCode, setTwoFactorQRCode] = useState("/placeholder.svg?height=200&width=200")
  const [twoFactorSecret, setTwoFactorSecret] = useState("ABCDEF123456")
  const [setupCode, setSetupCode] = useState("")

  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const selectedTotal = useMemo(() => {
    return cartItems.filter((item) => selectedItems.includes(item.id)).reduce((sum, item) => sum + item.price, 0)
  }, [cartItems, selectedItems])

  const handleCompletePurchase = () => {
    if (selectedItems.length === 0) {
      toast({
        title: "No items selected",
        description: "Please select at least one item to purchase",
        variant: "destructive",
      })
      return
    }

    if (walletBalance < selectedTotal) {
      toast({
        title: "Insufficient Balance",
        description: "Please deposit more SOL to complete this purchase",
        variant: "destructive",
      })
      return
    }

    // Set loading state
    setIsProcessing(true)

    // Show processing state without storing toast reference
    toast({
      title: "Processing purchase...",
      description: "Please wait while we process your transaction",
      duration: 2000, // Auto-dismiss after 2 seconds
    })

    // Simulate API call with a timeout
    setTimeout(() => {
      try {
        // Get the purchased items
        const purchasedItems = cartItems.filter((item) => selectedItems.includes(item.id))

        // Update wallet balance
        setWalletBalance((prevBalance) => {
          const newBalance = prevBalance - selectedTotal
          return Number.parseFloat(newBalance.toFixed(8)) // Fix to 8 decimal places for SOL
        })

        // Remove purchased items from cart
        const remainingItems = cartItems.filter((item) => !selectedItems.includes(item.id))
        setCartItems(remainingItems)

        // Update localStorage
        const userId = localStorage.getItem("userId")
        if (userId) {
          localStorage.setItem(`cartItems_${userId}`, JSON.stringify(remainingItems))
        }

        // Clear selected items
        setSelectedItems([])

        // Show success message (this will appear after the loading toast auto-dismisses)
        toast({
          title: "Purchase Successful!",
          description: `You've purchased ${purchasedItems.length} item(s)`,
          variant: "success",
          duration: 5000,
        })
      } catch (error) {
        console.error("Purchase error:", error)
        toast({
          title: "Purchase Failed",
          description: "There was an error processing your purchase. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsProcessing(false)
      }
    }, 2000) // 2 second delay to simulate processing
  }

  // Get earnings data based on selected time period
  const earningsData = useMemo(() => {
    return mockEarningsData[selectedTimePeriod]
  }, [selectedTimePeriod])

  const handleTimePeriodChange = (value: TimePeriod) => {
    setIsLoadingEarnings(true)
    // Simulate loading data
    setTimeout(() => {
      setSelectedTimePeriod(value)
      setIsLoadingEarnings(false)
    }, 500)
  }

  const toggleAddressVisibility = () => {
    setShowFullAddress(!showFullAddress)
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress)
    toast({
      title: "Address Copied",
      description: "Wallet address has been copied to clipboard",
      duration: 3000,
      variant: "success",
    })
  }

  const copyPrivateKey = () => {
    navigator.clipboard.writeText(privateKey)
    toast({
      title: "Private Key Copied",
      description: "Private key has been copied to clipboard",
      duration: 3000,
      variant: "success",
    })
  }

  const formatAddress = (address: string) => {
    if (showFullAddress) {
      return address
    }
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    const userRole = localStorage.getItem("userRole")
    const userId = localStorage.getItem("userId")

    if (!isLoggedIn) {
      router.push("/login")
    } else {
      setIsDemo(userRole === "demo")
    }

    if (isLoggedIn && userId) {
      // Load cart items from localStorage on initial render
      const savedCartItems = localStorage.getItem(`cartItems_${userId}`)
      if (savedCartItems) {
        const items = JSON.parse(savedCartItems)

        // Filter out items older than 30 days
        const filteredItems = items.filter((item) => {
          if (!item.addedToCartDate) return true
          const addedDate = new Date(item.addedToCartDate)
          const expiryDate = new Date(addedDate)
          expiryDate.setDate(expiryDate.getDate() + 30)
          return new Date() < expiryDate
        })

        setCartItems(filteredItems)
      }

      // Automatically open cart if there are items
      if (JSON.parse(savedCartItems || "[]").length > 0) {
        setIsCartOpen(true)
      }
    } else {
      // Clear cart items when user is not logged in
      setCartItems([])
      setIsCartOpen(false)
    }
  }, [router, setCartItems, setIsCartOpen])

  // Add this after the existing useEffect
  useEffect(() => {
    // Function to refresh cart data
    const refreshCartData = () => {
      const userId = localStorage.getItem("userId")
      if (!userId) return

      const savedCartItems = localStorage.getItem(`cartItems_${userId}`)
      if (savedCartItems) {
        const items = JSON.parse(savedCartItems)

        // Filter out items older than 30 days
        const filteredItems = items.filter((item) => {
          if (!item.addedToCartDate) return true
          const addedDate = new Date(item.addedToCartDate)
          const expiryDate = new Date(addedDate)
          expiryDate.setDate(expiryDate.getDate() + 30)
          return new Date() < expiryDate
        })

        setCartItems(filteredItems)
      }
    }

    // Set up interval to refresh cart data every 30 seconds
    const intervalId = setInterval(refreshCartData, 30000)

    // Clean up interval on component unmount
    return () => clearInterval(intervalId)
  }, [setCartItems]) // Only re-create interval if setCartItems changes

  const handleCompleteOrder = () => {
    // Implement order completion logic here
    toast({
      title: "Order Completed",
      description: "Your order has been successfully processed.",
      duration: 3000,
      variant: "success",
    })
  }

  const openWithdrawalDialog = () => {
    if (is2FAEnabled) {
      // If 2FA is enabled, open verification dialog first
      setIsWithdrawalVerificationDialogOpen(true)
    } else {
      // If 2FA is not enabled, prompt to set it up
      setSetup2FADialogOpen(true)
      toast({
        title: "2FA Required",
        description: "You must set up two-factor authentication before withdrawing funds.",
        variant: "destructive",
      })
    }
  }

  const closeWithdrawalDialog = () => {
    console.log("Closing withdrawal dialog")
    setIsWithdrawalDialogOpen(false)
  }

  const openDepositDialog = () => {
    setIsDepositDialogOpen(true)
  }

  const closeDepositDialog = () => {
    setIsDepositDialogOpen(false)
  }

  const openExportKeyDialog = () => {
    setIsExportKeyDialogOpen(true)
    setPrivateKeyVisible(false)
    setTwoFACode("")
  }

  const closeExportKeyDialog = () => {
    setIsExportKeyDialogOpen(false)
    setPrivateKeyVisible(false)
    setTwoFACode("")
  }

  const openSetup2FADialog = () => {
    setSetup2FADialogOpen(true)
    setSetupCode("")
  }

  const closeSetup2FADialog = () => {
    setSetup2FADialogOpen(false)
    setSetupCode("")
  }

  const verify2FACode = async () => {
    if (twoFACode.length !== 6 || !/^\d+$/.test(twoFACode)) {
      toast({
        title: "Invalid Code",
        description: "Please enter a valid 6-digit code",
        variant: "destructive",
      })
      return
    }

    setIsVerifying(true)

    try {
      // Simulate API verification
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // For demo purposes, any code "123456" is considered valid
      if (twoFACode === "123456") {
        setPrivateKey("5JfwDgPX4rVxgvhzxrYPgmLsxZvPNsNmBZUEYwrU1LgFbJg2rXF9NmKBLwMMfCpCKYJWKWwfaEpTrKHpGJCU8Vb")
        setPrivateKeyVisible(true)
        toast({
          title: "Verification Successful",
          description: "Your private key has been revealed",
          variant: "success",
        })
      } else {
        toast({
          title: "Verification Failed",
          description: "The code you entered is incorrect",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Verification Error",
        description: "There was an error verifying your code. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsVerifying(false)
    }
  }

  const setup2FA = async () => {
    if (setupCode.length !== 6 || !/^\d+$/.test(setupCode)) {
      toast({
        title: "Invalid Code",
        description: "Please enter a valid 6-digit code",
        variant: "destructive",
      })
      return
    }

    setIsVerifying(true)

    try {
      // Simulate API verification
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // For demo purposes, any code "123456" is considered valid
      if (setupCode === "123456") {
        setIs2FAEnabled(true)
        setSetup2FADialogOpen(false)
        toast({
          title: "2FA Enabled",
          description: "Two-factor authentication has been successfully enabled for your account",
          variant: "success",
        })
      } else {
        toast({
          title: "Verification Failed",
          description: "The code you entered is incorrect",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Setup Error",
        description: "There was an error setting up 2FA. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsVerifying(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to Clipboard",
      description: "Secret key has been copied to clipboard",
      variant: "success",
    })
  }

  const verifyWithdrawal2FA = async () => {
    if (twoFACode.length !== 6 || !/^\d+$/.test(twoFACode)) {
      toast({
        title: "Invalid Code",
        description: "Please enter a valid 6-digit code",
        variant: "destructive",
      })
      return
    }

    setIsVerifying(true)

    try {
      // Simulate API verification
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // For demo purposes, any code "123456" is considered valid
      if (twoFACode === "123456") {
        setIsWithdrawalVerificationDialogOpen(false)
        setIsWithdrawalDialogOpen(true)
        setTwoFACode("")
        toast({
          title: "Verification Successful",
          description: "You can now proceed with your withdrawal",
          variant: "success",
        })
      } else {
        toast({
          title: "Verification Failed",
          description: "The code you entered is incorrect",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Verification Error",
        description: "There was an error verifying your code. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsVerifying(false)
    }
  }

  const closeWithdrawalVerificationDialog = () => {
    setIsWithdrawalVerificationDialogOpen(false)
    setTwoFACode("")
  }

  const addToCart = (item: any) => {
    const itemWithDate = {
      ...item,
      addedToCartDate: new Date().toISOString(),
    }
    setCartItems((prevItems) => [...prevItems, itemWithDate])
  }

  // Helper function to get time period label
  const getTimePeriodLabel = (period: TimePeriod): string => {
    switch (period) {
      case "all":
        return "All Time"
      case "year":
        return "This Year"
      case "month":
        return "This Month"
      case "week":
        return "This Week"
      case "today":
        return "Today"
      default:
        return "All Time"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <DashboardShell>
        <DashboardHeader heading="Dashboard" text="Manage your Sol.Run account, products, and earnings." />
        {isDemo && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Demo Mode</AlertTitle>
            <AlertDescription>
              You are currently viewing the dashboard in demo mode. Some features may be limited.
            </AlertDescription>
          </Alert>
        )}
        <Card className="mb-6">
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
            <div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-0">
                <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <div className="text-2xl font-bold">
                {formatCurrency(walletBalance).split(" (")[0]}
                <span className="text-sm font-normal"> ({formatCurrency(walletBalance).split(" (")[1]}</span>
              </div>
              <div className="mt-2 flex flex-col space-y-2">
                <strong className="text-sm">Solana Address:</strong>
                <div className="flex items-center space-x-2">
                  <span className="text-sm break-all">{formatAddress(walletAddress)}</span>
                  <button onClick={toggleAddressVisibility} className="text-blue-500 hover:text-blue-700">
                    {showFullAddress ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <button onClick={copyAddress} className="text-blue-500 hover:text-blue-700">
                    <Copy size={16} />
                  </button>
                </div>
              </div>
              {showFullAddress && (
                <div className="mt-2">
                  <QRCode value={walletAddress} size={128} level="M" className="mx-auto" />
                  <p className="text-xs text-center mt-1 text-gray-500">Scan with your wallet</p>
                </div>
              )}
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => window.open(`https://solscan.io/account/${walletAddress}`, "_blank")}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View on SolScan
                </Button>
                <Button variant="outline" size="sm" className="w-full" onClick={openDepositDialog}>
                  <ArrowUpCircle className="mr-2 h-4 w-4" />
                  Deposit SOL
                </Button>
                <Button variant="outline" size="sm" className="w-full" onClick={openWithdrawalDialog}>
                  <ArrowDownCircle className="mr-2 h-4 w-4" />
                  Withdraw SOL
                </Button>
                <Button variant="outline" size="sm" className="w-full" onClick={openExportKeyDialog}>
                  <Key className="mr-2 h-4 w-4" />
                  Export Private Key
                </Button>
              </div>
            </div>
            <div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-0">
                <CardTitle className="text-sm font-medium">Earnings Snapshot</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>

              <div className="py-2">
                <div className="mb-3">
                  <Select
                    value={selectedTimePeriod}
                    onValueChange={(value) => handleTimePeriodChange(value as TimePeriod)}
                  >
                    <SelectTrigger className="w-full h-8 text-sm">
                      <SelectValue placeholder="Select time period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="year">This Year</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {isLoadingEarnings ? (
                  <div className="flex justify-center items-center h-[200px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      <div className="bg-muted/50 rounded-lg p-2">
                        <h3 className="text-xs font-semibold">Net Sales</h3>
                        <div className="mt-1">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-[10px] text-muted-foreground">Units</p>
                              <p className="text-sm font-bold">{earningsData.netSales.unitsSold}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] text-muted-foreground">Earned</p>
                              <div>
                                <p className="text-xs font-bold">
                                  {formatCurrency(earningsData.netSales.totalEarned).split(" (")[0]}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  ({formatCurrency(earningsData.netSales.totalEarned).split(" (")[1]}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-muted/50 rounded-lg p-2">
                        <h3 className="text-xs font-semibold">Commissions</h3>
                        <div className="mt-1">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-[10px] text-muted-foreground">Units</p>
                              <p className="text-sm font-bold">{earningsData.commissions.unitsSold}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] text-muted-foreground">Earned</p>
                              <div>
                                <p className="text-xs font-bold">
                                  {formatCurrency(earningsData.commissions.totalEarned).split(" (")[0]}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  ({formatCurrency(earningsData.commissions.totalEarned).split(" (")[1]}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-primary/10 rounded-lg p-2 border border-primary/20">
                        <h3 className="text-xs font-semibold">Combined</h3>
                        <div className="mt-1">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-[10px] text-muted-foreground">Units</p>
                              <p className="text-sm font-bold">{earningsData.combined.unitsSold}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] text-muted-foreground">Earned</p>
                              <div>
                                <p className="text-xs font-bold">
                                  {formatCurrency(earningsData.combined.totalEarned).split(" (")[0]}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  ({formatCurrency(earningsData.combined.totalEarned).split(" (")[1]}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full h-8 text-xs"
                      onClick={() => {
                        setIsLoadingEarnings(true)
                        toast({
                          title: "Loading earnings dashboard...",
                          description: "Please wait while we prepare your detailed earnings report.",
                        })
                        setTimeout(() => {
                          router.push("/dashboard/earnings")
                          setIsLoadingEarnings(false)
                        }, 500)
                      }}
                    >
                      View Detailed Earnings Report
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        <DashboardTabs />
      </DashboardShell>
      <WithdrawalDialog isOpen={isWithdrawalDialogOpen} onClose={closeWithdrawalDialog} walletBalance={walletBalance} />
      <Dialog open={isDepositDialogOpen} onOpenChange={setIsDepositDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Deposit SOL</DialogTitle>
            <DialogDescription>
              Send SOL to your wallet address or purchase using one of the options below.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
              <QRCode value={walletAddress} size={180} level="M" className="mb-4" />
              <div className="flex items-center space-x-2 w-full">
                <Input value={walletAddress} readOnly className="font-mono text-sm" />
                <Button size="sm" variant="outline" onClick={copyAddress}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-center mt-2 text-muted-foreground">
                Send SOL to this address from another wallet
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Buy SOLANA with:</h3>
              <div className="grid grid-cols-1 gap-2">
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => window.open("https://transak.com/buy/sol", "_blank")}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Transak (Credit Card / Apple Pay / Google Pay)
                </Button>
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => window.open("https://www.moonpay.com/buy/sol", "_blank")}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  MoonPay (Credit Card / Apple Pay / Google Pay)
                </Button>
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => window.open("https://changenow.io/exchange?from=usd&to=sol", "_blank")}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  ChangeNOW (USD to SOL)
                </Button>
                <div className="text-xs text-muted-foreground mt-1">
                  You can also buy SOL on exchanges like Binance, Kucoin, Bitget and transfer to your wallet address.
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Private Key Dialog */}
      <Dialog open={isExportKeyDialogOpen} onOpenChange={setIsExportKeyDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Export Private Key</DialogTitle>
            <DialogDescription>
              {is2FAEnabled
                ? "Enter your Google Authenticator code to view your private key."
                : "You need to enable two-factor authentication before you can export your private key."}
            </DialogDescription>
          </DialogHeader>

          {is2FAEnabled ? (
            <div className="flex flex-col space-y-4">
              {!privateKeyVisible ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="2fa-code">Google Authenticator Code</Label>
                    <Input
                      id="2fa-code"
                      placeholder="Enter 6-digit code"
                      value={twoFACode}
                      onChange={(e) => setTwoFACode(e.target.value)}
                      maxLength={6}
                      className="font-mono text-center text-lg tracking-widest"
                    />
                    <p className="text-xs text-muted-foreground">
                      Open your Google Authenticator app and enter the 6-digit code for Sol.Run
                    </p>
                  </div>

                  <Alert variant="warning" className="bg-amber-50 text-amber-800 border-amber-200">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Security Warning</AlertTitle>
                    <AlertDescription className="text-xs">
                      Your private key gives full access to your wallet. Never share it with anyone or enter it on any
                      website.
                    </AlertDescription>
                  </Alert>

                  <Button onClick={verify2FACode} disabled={isVerifying || twoFACode.length !== 6}>
                    {isVerifying ? "Verifying..." : "Verify and Show Private Key"}
                  </Button>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="private-key">Your Private Key</Label>
                    <div className="relative">
                      <Input
                        id="private-key"
                        value={privateKey}
                        readOnly
                        className="font-mono text-xs pr-10 bg-muted"
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute right-1 top-1 h-7 w-7 p-0"
                        onClick={copyPrivateKey}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      This is your wallet's private key. Keep it safe and secure.
                    </p>
                  </div>

                  <Alert variant="destructive" className="bg-red-50 text-red-800 border-red-200">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Critical Security Warning</AlertTitle>
                    <AlertDescription className="text-xs">
                      Anyone with this key can access and transfer all funds from your wallet. Never share it with
                      anyone, store it securely, and close this dialog immediately after use.
                    </AlertDescription>
                  </Alert>
                </>
              )}
            </div>
          ) : (
            <div className="flex flex-col space-y-4">
              <Alert variant="warning" className="bg-amber-50 text-amber-800 border-amber-200">
                <Shield className="h-4 w-4" />
                <AlertTitle>Two-Factor Authentication Required</AlertTitle>
                <AlertDescription className="text-sm">
                  For your security, you must enable two-factor authentication before you can export your private key.
                </AlertDescription>
              </Alert>

              {/* Add this new section for app store links */}
              <div className="flex items-center justify-center space-x-4 my-2">
                <p className="text-xs text-muted-foreground">Download Google Authenticator:</p>
                <a
                  href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-xs text-blue-600 hover:text-blue-800"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4 mr-1"
                  >
                    <path
                      d="M3.609 1.814L13.792 12 3.609 22.186c-.181.181-.29.435-.29.713 0 .278.109.532.29.713.181.181.435.29.713.29.278 0 .532-.109.713-.29L15.33 13.426c.181-.181.29-.435.29-.713 0-.278-.109-.532-.29-.713L5.036 1.814c-.181-.181-.435-.29-.713-.29-.278 0-.532.109-.713.29-.181.181-.29.435-.29.713 0 .278.109.532.29.713z"
                      fill="#5f6368"
                    />
                  </svg>
                  Google Play
                </a>
                <a
                  href="https://apps.apple.com/us/app/google-authenticator/id388492815"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-xs text-blue-600 hover:text-blue-800"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4 mr-1"
                  >
                    <path d="M12.973 2.828c-.52-.182-1.116-.182-1.636 0l-9.998 3.49a1.002 1.002 0 00-.692.922v12.52c0 .461.226.89.608 1.151l9.998 3.49c.52.182 1.116.182 1.636 0l9.998-3.49c.383-.26.608-.69.608-1.151V7.24c0-.461-.226-.89-.608-1.151l-9.998-3.49zM7.5 17.5c0-.414.336-.75.75-.75h1.5c.414 0 .75.336.75.75v1.5c0 .414-.336.75-.75.75h-1.5a.75.75 0 01-.75-.75v-1.5zM12 17.5c0-.414.336-.75.75-.75h1.5c.414 0 .75.336.75.75v1.5c0 .414-.336.75-.75.75h-1.5a.75.75 0 01-.75-.75v-1.5zM16.5 17.5c0-.414.336-.75.75-.75h1.5c.414 0 .75.336.75.75v1.5c0 .414-.336.75-.75.75h-1.5a.75.75 0 01-.75-.75v-1.5zM7.5 12.5c0-.414.336-.75.75-.75h1.5c.414 0 .75.336.75.75v1.5c0 .414-.336.75-.75.75h-1.5a.75.75 0 01-.75-.75v-1.5zM12 12.5c0-.414.336-.75.75-.75h1.5c.414 0 .75.336.75.75v1.5c0 .414-.336.75-.75.75h-1.5a.75.75 0 01-.75-.75v-1.5zM16.5 12.5c0-.414.336-.75.75-.75h1.5c.414 0 .75.336.75.75v1.5c0 .414-.336.75-.75.75h-1.5a.75.75 0 01-.75-.75v-1.5zM7.5 7.5c0-.414.336-.75.75-.75h1.5c.414 0 .75.336.75.75v1.5c0 .414-.336.75-.75.75h-1.5a.75.75 0 01-.75-.75v-1.5zM12 7.5c0-.414.336-.75.75-.75h1.5c.414 0 .75.336.75.75v1.5c0 .414-.336.75-.75.75h-1.5a.75.75 0 01-.75-.75v-1.5zM16.5 7.5c0-.414.336-.75.75-.75h1.5c.414 0 .75.336.75.75v1.5c0 .414-.336.75-.75.75h-1.5a.75.75 0 01-.75-.75v-1.5z" />
                  </svg>
                  App Store
                </a>
              </div>

              <Button onClick={openSetup2FADialog}>Enable Two-Factor Authentication</Button>
            </div>
          )}

          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary" onClick={closeExportKeyDialog}>
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Setup 2FA Dialog */}
      <Dialog open={setup2FADialogOpen} onOpenChange={setSetup2FADialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Setup Two-Factor Authentication</DialogTitle>
            <DialogDescription>
              Scan the QR code with Google Authenticator or enter the secret key, then enter the 6-digit code to enable
              2FA.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col space-y-4">
            <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
              <QRCode value={twoFactorSecret} size={128} level="M" className="mb-4" />
              <p className="text-sm font-medium">Scan this QR code with Google Authenticator</p>
              <div className="flex items-center space-x-2 w-full mt-2">
                <Input value={twoFactorSecret} readOnly className="font-mono text-sm" />
                <Button size="sm" variant="outline" onClick={() => copyToClipboard(twoFactorSecret)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-center mt-2 text-muted-foreground">
                Alternatively, enter this secret key manually in the app
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="setup-code">Google Authenticator Code</Label>
              <Input
                id="setup-code"
                placeholder="Enter 6-digit code"
                value={setupCode}
                onChange={(e) => setSetupCode(e.target.value)}
                maxLength={6}
                className="font-mono text-center text-lg tracking-widest"
              />
              <p className="text-xs text-muted-foreground">Enter the 6-digit code generated by Google Authenticator</p>
            </div>

            <Button onClick={setup2FA} disabled={isVerifying || setupCode.length !== 6}>
              {isVerifying ? "Verifying..." : "Enable Two-Factor Authentication"}
            </Button>
          </div>

          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary" onClick={closeSetup2FADialog}>
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Withdrawal Verification Dialog */}
      <Dialog open={isWithdrawalVerificationDialogOpen} onOpenChange={setIsWithdrawalVerificationDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Withdrawal Verification</DialogTitle>
            <DialogDescription>
              Enter your Google Authenticator code to verify your withdrawal request.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col space-y-4">
            <div className="space-y-2">
              <Label htmlFor="2fa-code">Google Authenticator Code</Label>
              <Input
                id="2fa-code"
                placeholder="Enter 6-digit code"
                value={twoFACode}
                onChange={(e) => setTwoFACode(e.target.value)}
                maxLength={6}
                className="font-mono text-center text-lg tracking-widest"
              />
              <p className="text-xs text-muted-foreground">
                Open your Google Authenticator app and enter the 6-digit code for Sol.Run
              </p>
            </div>

            <Button onClick={verifyWithdrawal2FA} disabled={isVerifying || twoFACode.length !== 6}>
              {isVerifying ? "Verifying..." : "Verify Code"}
            </Button>
          </div>

          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary" onClick={closeWithdrawalVerificationDialog}>
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
