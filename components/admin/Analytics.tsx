"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"
import { formatCurrency } from "@/utils/currency"
import { DollarSign, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const formatNumber = (value: number): string => {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true,
    groupingSeparator: "'",
  })
}

const formatNumber2 = (value: number): string => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'")
  return value.toString()
}

const Analytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("7d")
  const [visibleLines, setVisibleLines] = useState({
    users: true,
    unitsSold: true,
    revenueSol: true,
    revenueUsd: true,
  })
  const [sortColumn, setSortColumn] = useState<"unitsSold" | "totalSales" | null>(null)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [sortBy, setSortBy] = useState<"unitsSold" | "totalSales">("unitsSold")
  const [affiliateSortBy, setAffiliateSortBy] = useState<"unitsSold" | "totalEarned">("totalEarned")
  const [isManageUserOpen, setIsManageUserOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [userDetails, setUserDetails] = useState<{
    email: string
    registrationDate: string
    productListings: any[]
    earnings: any
    walletBalance: number
    walletAddress: string
  } | null>(null)
  const [currentView, setCurrentView] = useState<"details" | "products" | "earnings" | "wallet" | "email">("details")
  const [isLoading, setIsLoading] = useState(false)
  const [emailContent, setEmailContent] = useState({ subject: "", body: "" })
  const [isSuspendConfirmOpen, setIsSuspendConfirmOpen] = useState(false)
  const [emailAttachments, setEmailAttachments] = useState<File[]>([])
  const [selectedProductPeriod, setSelectedProductPeriod] = useState<"all" | "year" | "month" | "week" | "today">(
    "month",
  )
  const [selectedAffiliatePeriod, setSelectedAffiliatePeriod] = useState<"all" | "year" | "month" | "week" | "today">(
    "month",
  )

  const handleSort = (column: "unitsSold" | "totalSales") => {
    setSortBy(column)
    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
  }

  const handleManageUser = async (username: string) => {
    setSelectedUser(username)
    setIsManageUserOpen(true)
    setCurrentView("details")
    setIsLoading(true)

    try {
      // Simulating API call to fetch user details
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setUserDetails({
        email: `${username}@example.com`,
        registrationDate: "2023-01-01",
        productListings: [
          { id: 1, name: "Product A", price: 10, status: "Active" },
          { id: 2, name: "Product B", price: 20, status: "Inactive" },
        ],
        earnings: {
          totalSales: 1000,
          commissions: 100,
          netProfit: 900,
        },
        walletBalance: 50,
        walletAddress: "7X3csFANQe4FHzZFP6kKKGCWHKbEsBAGn1XFGEFKxLxa",
      })
    } catch (error) {
      console.error("Error fetching user details:", error)
      toast({
        title: "Error",
        description: "Failed to fetch user details. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewProductListings = () => setCurrentView("products")
  const handleViewEarnings = () => setCurrentView("earnings")
  const handleViewWallet = () => setCurrentView("wallet")
  const handleEmailUser = () => setCurrentView("email")

  const handleSuspendAccount = async () => {
    setIsLoading(true)
    try {
      // Simulating API call to suspend account
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Account Suspended",
        description: `${selectedUser}'s account has been suspended.`,
      })
      setIsManageUserOpen(false)
    } catch (error) {
      console.error("Error suspending account:", error)
      toast({
        title: "Error",
        description: "Failed to suspend account. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendEmail = async () => {
    setIsLoading(true)
    try {
      // Simulating API call to send email
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Email Sent",
        description: `Email sent to ${selectedUser} with ${emailAttachments.length} attachment(s).`,
      })
      setEmailContent({ subject: "", body: "" })
      setEmailAttachments([])
      setCurrentView("details")
    } catch (error) {
      console.error("Error sending email:", error)
      toast({
        title: "Error",
        description: "Failed to send email. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const SOL_TO_USD_RATE = 20 // Assuming 1 SOL = $20 USD

  const data = Array.from({ length: 1095 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - 1094 + i)
    const revenueSol = Number.parseFloat((Math.random() * 100 + 10).toFixed(2)) // Random revenue between 10 and 110 SOL
    return {
      date,
      users: Math.floor(Math.random() * 5000) + 1000,
      unitsSold: Math.floor(Math.random() * 1000) + 100,
      revenueSol,
      revenueUsd: revenueSol * SOL_TO_USD_RATE,
    }
  })

  const topSellingProducts = [
    {
      name: "Solana Basics eBook",
      listingDate: "2023-05-15",
      sellerUsername: "crypto_guru",
      unitsSold: 1250,
      totalSales: 6250,
    },
    {
      name: "DeFi Mastery Course",
      listingDate: "2023-06-01",
      sellerUsername: "defi_expert",
      unitsSold: 980,
      totalSales: 19600,
    },
    {
      name: "NFT Creation Workshop",
      listingDate: "2023-06-15",
      sellerUsername: "nft_artist",
      unitsSold: 750,
      totalSales: 7500,
    },
    {
      name: "Smart Contract Templates",
      listingDate: "2023-07-01",
      sellerUsername: "sol_dev",
      unitsSold: 620,
      totalSales: 3100,
    },
    {
      name: "Crypto Trading Strategies",
      listingDate: "2023-07-15",
      sellerUsername: "trade_master",
      unitsSold: 580,
      totalSales: 11600,
    },
    {
      name: "Blockchain Fundamentals",
      listingDate: "2023-08-01",
      sellerUsername: "block_teacher",
      unitsSold: 520,
      totalSales: 2600,
    },
    {
      name: "Solana dApp Bootcamp",
      listingDate: "2023-08-15",
      sellerUsername: "dapp_builder",
      unitsSold: 490,
      totalSales: 24500,
    },
    {
      name: "Crypto Security Guide",
      listingDate: "2023-09-01",
      sellerUsername: "security_expert",
      unitsSold: 450,
      totalSales: 2250,
    },
    {
      name: "Web3 UX Design",
      listingDate: "2023-09-15",
      sellerUsername: "ux_designer",
      unitsSold: 420,
      totalSales: 8400,
    },
    {
      name: "Solana Ecosystem Overview",
      listingDate: "2023-10-01",
      sellerUsername: "sol_enthusiast",
      unitsSold: 400,
      totalSales: 2000,
    },
  ]

  const topEarningAffiliates = [
    { username: "crypto_influencer", joinDate: "2023-04-01", unitsSold: 2800, totalEarned: 14000 },
    { username: "blockchain_guru", joinDate: "2023-04-15", unitsSold: 2500, totalEarned: 12500 },
    { username: "defi_promoter", joinDate: "2023-05-01", unitsSold: 2200, totalEarned: 11000 },
    { username: "nft_marketer", joinDate: "2023-05-15", unitsSold: 2000, totalEarned: 10000 },
    { username: "sol_advocate", joinDate: "2023-06-01", unitsSold: 1800, totalEarned: 9000 },
    { username: "web3_networker", joinDate: "2023-06-15", unitsSold: 1600, totalEarned: 8000 },
    { username: "crypto_youtuber", joinDate: "2023-07-01", unitsSold: 1400, totalEarned: 7000 },
    { username: "blockchain_writer", joinDate: "2023-07-15", unitsSold: 1200, totalEarned: 6000 },
    { username: "defi_researcher", joinDate: "2023-08-01", unitsSold: 1000, totalEarned: 5000 },
    { username: "sol_developer", joinDate: "2023-08-15", unitsSold: 800, totalEarned: 4000 },
  ]

  const periodData = useMemo(
    () => ({
      "7d": data.slice(-7),
      "30d": data.slice(-30),
      "90d": data.slice(-90),
      "1y": data,
      "3y": data.slice(-1095), // 3 years * 365 days
    }),
    [data],
  )

  const sortedProducts = [...topSellingProducts].sort((a, b) => b[sortBy] - a[sortBy])
  const sortedAffiliates = [...topEarningAffiliates].sort((a, b) => b[affiliateSortBy] - a[affiliateSortBy])

  const renderUserManagementContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )
    }

    if (!userDetails) {
      return <p>No user details available.</p>
    }

    switch (currentView) {
      case "details":
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">User Details</h3>
              <p>Username: {selectedUser}</p>
              <p>Email: {userDetails.email}</p>
              <p>Registration Date: {userDetails.registrationDate}</p>
              <div className="mt-4 p-3 bg-muted rounded-md">
                <h4 className="font-medium mb-2">Financial Overview</h4>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Sales Revenue</p>
                    <p className="font-medium">{formatCurrency(userDetails.earnings?.totalSales || 0)} SOL</p>
                    <p className="text-xs text-muted-foreground">
                      ${((userDetails.earnings?.totalSales || 0) * 20).toFixed(2)} USD
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Commissions Earned</p>
                    <p className="font-medium">{formatCurrency(userDetails.earnings?.commissions || 0)} SOL</p>
                    <p className="text-xs text-muted-foreground">
                      ${((userDetails.earnings?.commissions || 0) * 20).toFixed(2)} USD
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Actions</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Button onClick={handleViewProductListings} className="w-full">
                  View Product Listings
                </Button>
                <Button onClick={handleViewEarnings} className="w-full">
                  View Earnings
                </Button>
                <Button onClick={handleViewWallet} className="w-full">
                  View Solana Wallet
                </Button>
                <Button onClick={handleEmailUser} className="w-full">
                  Email User
                </Button>
                <Button variant="destructive" onClick={() => setIsSuspendConfirmOpen(true)} className="w-full">
                  Suspend Account
                </Button>
              </div>
            </div>
          </div>
        )
      case "products":
        return (
          <div>
            <h3 className="text-lg font-semibold mb-2">Product Listings</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userDetails.productListings.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.id}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{formatCurrency(product.price)}</TableCell>
                    <TableCell>{product.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )
      case "earnings":
        return (
          <div>
            <h3 className="text-lg font-semibold mb-2">Earnings</h3>
            <p>Total Sales: {formatCurrency(userDetails.earnings.totalSales)}</p>
            <p>Commissions: {formatCurrency(userDetails.earnings.commissions)}</p>
            <p>Net Profit: {formatCurrency(userDetails.earnings.netProfit)}</p>
          </div>
        )
      case "wallet":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Solana Wallet</h3>
            <p>
              <strong>Balance:</strong> {formatCurrency(userDetails.walletBalance)}
            </p>
            <p>
              <strong>Address:</strong> {userDetails.walletAddress}
            </p>
            <a
              href={`https://solscan.io/account/${userDetails.walletAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              View on Solscan
            </a>
          </div>
        )
      case "email":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-2">Email User</h3>
            <Input
              placeholder="Subject"
              value={emailContent.subject}
              onChange={(e) => setEmailContent({ ...emailContent, subject: e.target.value })}
            />
            <Textarea
              placeholder="Email body"
              value={emailContent.body}
              onChange={(e) => setEmailContent({ ...emailContent, body: e.target.value })}
              rows={5}
            />
            <div className="space-y-2">
              <Input
                type="file"
                onChange={(e) => {
                  const files = Array.from(e.target.files || [])
                  setEmailAttachments((prev) => [...prev, ...files])
                }}
                multiple
                className="mb-2"
              />
              {emailAttachments.length > 0 && (
                <div>
                  <p>Attachments:</p>
                  <ul>
                    {emailAttachments.map((file, index) => (
                      <li key={index}>{file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <Button onClick={handleSendEmail}>Send Email</Button>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium">Today (24hrs)</div>
                <div className="text-base font-bold">1'234</div>
              </div>
              <div>
                <div className="text-sm font-medium">This Month</div>
                <div className="text-base font-bold">28'756</div>
              </div>
              <div>
                <div className="text-sm font-medium">All Time</div>
                <div className="text-base font-bold">102'482</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Product Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium">Listings</div>
                <div className="text-base font-bold">1'234</div>
              </div>
              <div>
                <div className="text-sm font-medium">Sales (Month)</div>
                <div className="text-base font-bold">1'111</div>
              </div>
              <div>
                <div className="text-sm font-medium">Sales (All Time)</div>
                <div className="text-base font-bold">1'111</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Breakdown</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <div className="text-sm font-medium">Total Sales</div>
                <div className="text-base font-bold">{formatNumber2(2345.67)} SOL</div>
                <p className="text-xs text-muted-foreground">($46'913.40 USD)</p>
              </div>
              <div>
                <div className="text-sm font-medium">Total Commissions</div>
                <div className="text-base font-bold">{formatNumber2(234.56)} SOL</div>
                <p className="text-xs text-muted-foreground">($4'691.20 USD)</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Profits</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <div className="text-sm font-medium">This Month</div>
                <div className="text-base font-bold">{formatNumber(615.28)} SOL</div>
                <p className="text-xs text-muted-foreground">($12'305.60 USD)</p>
              </div>
              <div>
                <div className="text-sm font-medium">All Time</div>
                <div className="text-base font-bold">{formatNumber(12345.67)} SOL</div>
                <p className="text-xs text-muted-foreground">($246'913.40 USD)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="col-span-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Overview</CardTitle>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
              <SelectItem value="3y">Last 3 years</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={periodData[selectedPeriod]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => {
                  const d = new Date(date)
                  switch (selectedPeriod) {
                    case "7d":
                    case "30d":
                      return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
                    case "90d":
                      return d.toLocaleDateString("en-US", { month: "short" })
                    case "1y":
                      return d.toLocaleDateString("en-US", { month: "short", year: "2-digit" })
                    case "3y":
                      return d.toLocaleDateString("en-US", { year: "numeric" })
                  }
                }}
                ticks={periodData[selectedPeriod]
                  .filter((_, i) => {
                    const interval =
                      selectedPeriod === "3y"
                        ? Math.floor(periodData[selectedPeriod].length / 6)
                        : Math.floor(periodData[selectedPeriod].length / 5)
                    return i % interval === 0
                  })
                  .map((d) => d.date)}
              />
              <YAxis
                tickFormatter={(value) => {
                  if (value >= 1000000) return `${(value / 1000000).toFixed(0)}M`
                  if (value >= 1000) return `${(value / 1000).toFixed(0)}k`
                  return value.toFixed(0)
                }}
              />
              <Tooltip
                formatter={(value, name, props) => {
                  if (name === "revenueSol") {
                    const solAmount = Number.parseFloat(value as string)
                    return [`${solAmount.toFixed(2)} SOL`, "Revenue (SOL)"]
                  }
                  if (name === "revenueUsd") {
                    const usdAmount = Number.parseFloat(value as string)
                    return [`$${usdAmount.toFixed(2)} USD`, "Revenue (USD)"]
                  }
                  if (name === "unitsSold") return [value, "Units Sold"]
                  if (name === "users") return [value, "Users"]
                  return [value, name]
                }}
                labelFormatter={(label) =>
                  new Date(label).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                }
              />
              <Legend
                content={({ payload }) => (
                  <div className="flex justify-center items-center space-x-4">
                    {payload.map((entry, index) => (
                      <div key={`item-${index}`} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={visibleLines[entry.dataKey]}
                          onChange={() =>
                            setVisibleLines((prev) => ({ ...prev, [entry.dataKey]: !prev[entry.dataKey] }))
                          }
                          className="mr-2"
                        />
                        <span style={{ color: entry.color }}>
                          {entry.dataKey === "users"
                            ? "Users"
                            : entry.dataKey === "unitsSold"
                              ? "Units Sold"
                              : entry.dataKey === "revenueSol"
                                ? "Revenue (SOL)"
                                : entry.dataKey === "revenueUsd"
                                  ? "Revenue (USD)"
                                  : entry.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              />
              <Line type="monotone" dataKey="users" name="Users" stroke="#8884d8" hide={!visibleLines.users} />
              <Line
                type="monotone"
                dataKey="unitsSold"
                name="Units Sold"
                stroke="#82ca9d"
                hide={!visibleLines.unitsSold}
              />
              <Line
                type="monotone"
                dataKey="revenueSol"
                name="Revenue (SOL)"
                stroke="#ffc658"
                hide={!visibleLines.revenueSol}
              />
              <Line
                type="monotone"
                dataKey="revenueUsd"
                name="Revenue (USD)"
                stroke="#ff7300"
                hide={!visibleLines.revenueUsd}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="flex flex-row items-center justify-between mb-4">
            <CardTitle>Top 10 Best Selling Products</CardTitle>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium">Sort by:</span>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={sortBy === "unitsSold"}
                  onChange={() => setSortBy("unitsSold")}
                  className="form-checkbox h-4 w-4 text-primary"
                />
                <span className="text-sm">Units Sold</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={sortBy === "totalSales"}
                  onChange={() => setSortBy("totalSales")}
                  className="form-checkbox h-4 w-4 text-primary"
                />
                <span className="text-sm">Total Sales</span>
              </label>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium mr-2">Period:</span>
            <div className="flex flex-wrap gap-2">
              <label className="flex items-center space-x-1">
                <input
                  type="radio"
                  name="productPeriod"
                  value="all"
                  checked={selectedProductPeriod === "all"}
                  onChange={() => setSelectedProductPeriod("all")}
                  className="form-radio h-3.5 w-3.5 text-primary"
                />
                <span className="text-sm">All Time</span>
              </label>
              <label className="flex items-center space-x-1">
                <input
                  type="radio"
                  name="productPeriod"
                  value="year"
                  checked={selectedProductPeriod === "year"}
                  onChange={() => setSelectedProductPeriod("year")}
                  className="form-radio h-3.5 w-3.5 text-primary"
                />
                <span className="text-sm">Year</span>
              </label>
              <label className="flex items-center space-x-1">
                <input
                  type="radio"
                  name="productPeriod"
                  value="month"
                  checked={selectedProductPeriod === "month"}
                  onChange={() => setSelectedProductPeriod("month")}
                  className="form-radio h-3.5 w-3.5 text-primary"
                />
                <span className="text-sm">Month</span>
              </label>
              <label className="flex items-center space-x-1">
                <input
                  type="radio"
                  name="productPeriod"
                  value="week"
                  checked={selectedProductPeriod === "week"}
                  onChange={() => setSelectedProductPeriod("week")}
                  className="form-radio h-3.5 w-3.5 text-primary"
                />
                <span className="text-sm">Week</span>
              </label>
              <label className="flex items-center space-x-1">
                <input
                  type="radio"
                  name="productPeriod"
                  value="today"
                  checked={selectedProductPeriod === "today"}
                  onChange={() => setSelectedProductPeriod("today")}
                  className="form-radio h-3.5 w-3.5 text-primary"
                />
                <span className="text-sm">Today</span>
              </label>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No.</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Listing Date</TableHead>
                <TableHead>Seller Username</TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("unitsSold")}>
                  Units Sold (
                  {selectedProductPeriod === "all"
                    ? "All Time"
                    : selectedProductPeriod === "year"
                      ? "Year"
                      : selectedProductPeriod === "month"
                        ? "Month"
                        : selectedProductPeriod === "week"
                          ? "Week"
                          : "Today"}
                  ) {sortColumn === "unitsSold" && (sortOrder === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("totalSales")}>
                  Total Sales (
                  {selectedProductPeriod === "all"
                    ? "All Time"
                    : selectedProductPeriod === "year"
                      ? "Year"
                      : selectedProductPeriod === "month"
                        ? "Month"
                        : selectedProductPeriod === "week"
                          ? "Week"
                          : "Today"}
                  ) {sortColumn === "totalSales" && (sortOrder === "asc" ? "↑" : "↓")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedProducts.map((product, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.listingDate}</TableCell>
                  <TableCell>
                    <span
                      className="cursor-pointer text-blue-600 hover:underline"
                      onClick={() => handleManageUser(product.sellerUsername)}
                    >
                      {product.sellerUsername}
                    </span>
                  </TableCell>
                  <TableCell>{formatNumber(product.unitsSold)}</TableCell>
                  <TableCell>
                    <div>{formatNumber(product.totalSales)} SOL</div>
                    <div className="text-sm text-muted-foreground">(${formatNumber(product.totalSales * 20)} USD)</div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="flex flex-row items-center justify-between mb-4">
            <CardTitle>Top 10 Earning Affiliates</CardTitle>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium">Sort by:</span>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={affiliateSortBy === "unitsSold"}
                  onChange={() => setAffiliateSortBy("unitsSold")}
                  className="form-checkbox h-4 w-4 text-primary"
                />
                <span className="text-sm">Units Sold</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={affiliateSortBy === "totalEarned"}
                  onChange={() => setAffiliateSortBy("totalEarned")}
                  className="form-checkbox h-4 w-4 text-primary"
                />
                <span className="text-sm">Total Earned</span>
              </label>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium mr-2">Period:</span>
            <div className="flex flex-wrap gap-2">
              <label className="flex items-center space-x-1">
                <input
                  type="radio"
                  name="affiliatePeriod"
                  value="all"
                  checked={selectedAffiliatePeriod === "all"}
                  onChange={() => setSelectedAffiliatePeriod("all")}
                  className="form-radio h-3.5 w-3.5 text-primary"
                />
                <span className="text-sm">All Time</span>
              </label>
              <label className="flex items-center space-x-1">
                <input
                  type="radio"
                  name="affiliatePeriod"
                  value="year"
                  checked={selectedAffiliatePeriod === "year"}
                  onChange={() => setSelectedAffiliatePeriod("year")}
                  className="form-radio h-3.5 w-3.5 text-primary"
                />
                <span className="text-sm">Year</span>
              </label>
              <label className="flex items-center space-x-1">
                <input
                  type="radio"
                  name="affiliatePeriod"
                  value="month"
                  checked={selectedAffiliatePeriod === "month"}
                  onChange={() => setSelectedAffiliatePeriod("month")}
                  className="form-radio h-3.5 w-3.5 text-primary"
                />
                <span className="text-sm">Month</span>
              </label>
              <label className="flex items-center space-x-1">
                <input
                  type="radio"
                  name="affiliatePeriod"
                  value="week"
                  checked={selectedAffiliatePeriod === "week"}
                  onChange={() => setSelectedAffiliatePeriod("week")}
                  className="form-radio h-3.5 w-3.5 text-primary"
                />
                <span className="text-sm">Week</span>
              </label>
              <label className="flex items-center space-x-1">
                <input
                  type="radio"
                  name="affiliatePeriod"
                  value="today"
                  checked={selectedAffiliatePeriod === "today"}
                  onChange={() => setSelectedAffiliatePeriod("today")}
                  className="form-radio h-3.5 w-3.5 text-primary"
                />
                <span className="text-sm">Today</span>
              </label>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Affiliate Username</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>
                  Units Sold (
                  {selectedAffiliatePeriod === "all"
                    ? "All Time"
                    : selectedAffiliatePeriod === "year"
                      ? "Year"
                      : selectedAffiliatePeriod === "month"
                        ? "Month"
                        : selectedAffiliatePeriod === "week"
                          ? "Week"
                          : "Today"}
                  )
                </TableHead>
                <TableHead>
                  Total Earned (
                  {selectedAffiliatePeriod === "all"
                    ? "All Time"
                    : selectedAffiliatePeriod === "year"
                      ? "Year"
                      : selectedAffiliatePeriod === "month"
                        ? "Month"
                        : selectedAffiliatePeriod === "week"
                          ? "Week"
                          : "Today"}
                  )
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAffiliates.map((affiliate, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <span
                      className="cursor-pointer text-blue-600 hover:underline"
                      onClick={() => handleManageUser(affiliate.username)}
                    >
                      {affiliate.username}
                    </span>
                  </TableCell>
                  <TableCell>{affiliate.joinDate}</TableCell>
                  <TableCell>{affiliate.unitsSold}</TableCell>
                  <TableCell>{formatCurrency(affiliate.totalEarned)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Dialog open={isManageUserOpen} onOpenChange={setIsManageUserOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage User: {selectedUser}</DialogTitle>
          </DialogHeader>
          <div className="py-4">{renderUserManagementContent()}</div>
          <DialogFooter>
            {currentView !== "details" && <Button onClick={() => setCurrentView("details")}>Back to Details</Button>}
            <Button onClick={() => setIsManageUserOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog open={isSuspendConfirmOpen} onOpenChange={setIsSuspendConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to suspend this account?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will prevent the user from accessing their account. It can be reversed later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleSuspendAccount()
                setIsSuspendConfirmOpen(false)
              }}
            >
              Confirm Suspension
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default Analytics
