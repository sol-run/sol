"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Download, Filter, RefreshCw } from "lucide-react"
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { format, subDays, subMonths } from "date-fns"

// Mock data for earnings
const generateMockEarnings = (startDate: Date, endDate: Date) => {
  const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  const dataPoints = Math.min(daysDiff, 30) // Cap at 30 data points for readability

  const result = {
    summary: {
      netSales: {
        unitsSold: 0,
        totalSol: 0,
        totalUsd: 0,
      },
      commissions: {
        unitsSold: 0,
        totalSol: 0,
        totalUsd: 0,
      },
      combined: {
        unitsSold: 0,
        totalSol: 0,
        totalUsd: 0,
      },
    },
    transactions: [] as any[],
    timeSeriesData: [] as any[],
    productPerformance: [] as any[],
    earningsBySource: [] as any[],
  }

  const products = [
    "Advanced Marketing Course",
    "Web3 Development Masterclass",
    "Content Creation Pro",
    "Business Growth Strategies",
    "UI/UX Design System",
    "API Integration Guide",
  ]

  const subscriptionTypes = ["Monthly", "Quarterly", "Annual", "Lifetime"]

  // Generate time series data
  for (let i = 0; i < dataPoints; i++) {
    const currentDate = subDays(endDate, Math.floor((i * daysDiff) / dataPoints))
    const dateStr = format(currentDate, "MMM dd")

    const dailySales = Math.random() * 3 + 0.5
    const dailyCommissions = Math.random() * 1.5 + 0.2

    result.timeSeriesData.push({
      date: dateStr,
      sales: Number.parseFloat(dailySales.toFixed(4)),
      commissions: Number.parseFloat(dailyCommissions.toFixed(4)),
      total: Number.parseFloat((dailySales + dailyCommissions).toFixed(4)),
    })

    // Update summary
    result.summary.netSales.totalSol += dailySales
    result.summary.netSales.unitsSold += Math.floor(Math.random() * 3) + 1

    result.summary.commissions.totalSol += dailyCommissions
    result.summary.commissions.unitsSold += Math.floor(Math.random() * 5) + 1
  }

  // Calculate USD values
  result.summary.netSales.totalUsd = result.summary.netSales.totalSol * 20.5
  result.summary.commissions.totalUsd = result.summary.commissions.totalSol * 20.5

  // Calculate combined totals
  result.summary.combined.unitsSold = result.summary.netSales.unitsSold + result.summary.commissions.unitsSold
  result.summary.combined.totalSol = result.summary.netSales.totalSol + result.summary.commissions.totalSol
  result.summary.combined.totalUsd = result.summary.netSales.totalUsd + result.summary.commissions.totalUsd

  // Round values
  result.summary.netSales.totalSol = Number.parseFloat(result.summary.netSales.totalSol.toFixed(4))
  result.summary.netSales.totalUsd = Number.parseFloat(result.summary.netSales.totalUsd.toFixed(2))
  result.summary.commissions.totalSol = Number.parseFloat(result.summary.commissions.totalSol.toFixed(4))
  result.summary.commissions.totalUsd = Number.parseFloat(result.summary.commissions.totalUsd.toFixed(2))
  result.summary.combined.totalSol = Number.parseFloat(result.summary.combined.totalSol.toFixed(4))
  result.summary.combined.totalUsd = Number.parseFloat(result.summary.combined.totalUsd.toFixed(2))

  // Generate transactions
  const numTransactions = Math.min(50, daysDiff * 2)
  for (let i = 0; i < numTransactions; i++) {
    const transactionDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()))

    const product = products[Math.floor(Math.random() * products.length)]
    const subscription = subscriptionTypes[Math.floor(Math.random() * subscriptionTypes.length)]
    const isSale = Math.random() > 0.4

    const amount = isSale ? Math.random() * 5 + 2 : Math.random() * 1.5 + 0.2

    // For commissions, assign a level (1, 2, or 3)
    const commissionLevel = isSale ? null : Math.floor(Math.random() * 3) + 1

    result.transactions.push({
      id: `tx-${i}-${Date.now()}`,
      date: transactionDate,
      product: `${product} (${subscription})`,
      type: isSale ? "sale" : "commission",
      commissionLevel: commissionLevel,
      amount: Number.parseFloat(amount.toFixed(4)),
      amountUsd: Number.parseFloat((amount * 20.5).toFixed(2)),
      txHash: `${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`,
    })
  }

  // Sort transactions by date (newest first)
  result.transactions.sort((a, b) => b.date.getTime() - a.date.getTime())

  // Generate product performance data
  const productMap = new Map()
  result.transactions.forEach((tx) => {
    const productName = tx.product.split(" (")[0]
    if (!productMap.has(productName)) {
      productMap.set(productName, {
        name: productName,
        sales: 0,
        commissions: 0,
        total: 0,
      })
    }

    const entry = productMap.get(productName)
    if (tx.type === "sale") {
      entry.sales += tx.amount
    } else {
      entry.commissions += tx.amount
    }
    entry.total = entry.sales + entry.commissions
  })

  result.productPerformance = Array.from(productMap.values()).map((item) => ({
    ...item,
    sales: Number.parseFloat(item.sales.toFixed(4)),
    commissions: Number.parseFloat(item.commissions.toFixed(4)),
    total: Number.parseFloat(item.total.toFixed(4)),
  }))

  // Generate earnings by source
  result.earningsBySource = [
    { name: "Direct Sales", value: result.summary.netSales.totalSol },
    { name: "Level 1 Commissions", value: result.summary.commissions.totalSol * 0.7 },
    { name: "Level 2 Commissions", value: result.summary.commissions.totalSol * 0.2 },
    { name: "Level 3+ Commissions", value: result.summary.commissions.totalSol * 0.1 },
  ]

  return result
}

export default function EarningsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    from: subMonths(new Date(), 1),
    to: new Date(),
  })
  const [productFilter, setProductFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [earningsData, setEarningsData] = useState<any>(null)

  // Load earnings data
  useEffect(() => {
    setIsLoading(true)

    // Simulate API call delay
    const timer = setTimeout(() => {
      const data = generateMockEarnings(dateRange.from!, dateRange.to!)

      // Sort timeSeriesData by date in ascending order
      data.timeSeriesData.sort((a, b) => {
        // Convert month abbreviations to numbers for proper sorting
        const monthsOrder = {
          Jan: 1,
          Feb: 2,
          Mar: 3,
          Apr: 4,
          May: 5,
          Jun: 6,
          Jul: 7,
          Aug: 8,
          Sep: 9,
          Oct: 10,
          Nov: 11,
          Dec: 12,
        }

        const [aMonth, aDay] = a.date.split(" ")
        const [bMonth, bDay] = b.date.split(" ")

        // Compare months first
        if (monthsOrder[aMonth] !== monthsOrder[bMonth]) {
          return monthsOrder[aMonth] - monthsOrder[bMonth]
        }

        // If months are the same, compare days
        return Number.parseInt(aDay) - Number.parseInt(bDay)
      })

      setEarningsData(data)
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [dateRange])

  // Filter transactions based on selected filters
  const filteredTransactions =
    earningsData?.transactions.filter((tx: any) => {
      if (productFilter !== "all" && !tx.product.toLowerCase().includes(productFilter.toLowerCase())) {
        return false
      }
      if (typeFilter !== "all" && tx.type !== typeFilter) {
        return false
      }
      return true
    }) || []

  // Colors for charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

  // Handle refresh
  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => {
      const data = generateMockEarnings(dateRange.from!, dateRange.to!)
      setEarningsData(data)
      setIsLoading(false)
    }, 800)
  }

  // Handle export
  const handleExport = () => {
    alert("Exporting earnings data as CSV...")
    // In a real implementation, this would generate and download a CSV file
  }

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Earnings Dashboard</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Date Range</CardTitle>
            <CardDescription>Select a date range to view earnings</CardDescription>
          </CardHeader>
          <CardContent>
            <DatePickerWithRange
              date={dateRange}
              setDate={(range) => {
                if (range?.from && range?.to) {
                  setDateRange(range)
                }
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Earnings Summary</CardTitle>
            <CardDescription>Total earnings for selected period</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {isLoading ? (
              <>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </>
            ) : (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">Combined Total</p>
                  <p className="text-2xl font-bold">{earningsData.summary.combined.totalSol.toFixed(4)} SOL</p>
                  <p className="text-sm text-muted-foreground">
                    (${earningsData.summary.combined.totalUsd.toFixed(2)} USD)
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 md:w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="sources">Sources</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Net Sales</CardTitle>
                <CardDescription>Profit from product sales after fees</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-6 w-full mt-2" />
                    <Skeleton className="h-4 w-3/4 mt-2" />
                  </>
                ) : (
                  <>
                    <div className="text-sm text-muted-foreground">Units Sold</div>
                    <div className="text-xl font-semibold">{earningsData.summary.netSales.unitsSold}</div>
                    <div className="mt-2 text-sm text-muted-foreground">Total Earned</div>
                    <div className="text-xl font-semibold">{earningsData.summary.netSales.totalSol.toFixed(4)} SOL</div>
                    <div className="text-sm text-muted-foreground">
                      (${earningsData.summary.netSales.totalUsd.toFixed(2)} USD)
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Commissions</CardTitle>
                <CardDescription>Earnings from affiliate promotions</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-6 w-full mt-2" />
                    <Skeleton className="h-4 w-3/4 mt-2" />
                  </>
                ) : (
                  <>
                    <div className="text-sm text-muted-foreground">Units Sold</div>
                    <div className="text-xl font-semibold">{earningsData.summary.commissions.unitsSold}</div>
                    <div className="mt-2 text-sm text-muted-foreground">Total Earned</div>
                    <div className="text-xl font-semibold">
                      {earningsData.summary.commissions.totalSol.toFixed(4)} SOL
                    </div>
                    <div className="text-sm text-muted-foreground">
                      (${earningsData.summary.commissions.totalUsd.toFixed(2)} USD)
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle>Combined Total</CardTitle>
                <CardDescription>Sum of all earnings</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-6 w-full mt-2" />
                    <Skeleton className="h-4 w-3/4 mt-2" />
                  </>
                ) : (
                  <>
                    <div className="text-sm text-muted-foreground">Units Sold</div>
                    <div className="text-xl font-semibold">{earningsData.summary.combined.unitsSold}</div>
                    <div className="mt-2 text-sm text-muted-foreground">Total Earned</div>
                    <div className="text-xl font-semibold">{earningsData.summary.combined.totalSol.toFixed(4)} SOL</div>
                    <div className="text-sm text-muted-foreground">
                      (${earningsData.summary.combined.totalUsd.toFixed(2)} USD)
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Earnings Over Time</CardTitle>
              <CardDescription>Breakdown of earnings during the selected period</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              {isLoading ? (
                <div className="h-full w-full flex items-center justify-center">
                  <Skeleton className="h-[350px] w-full" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={earningsData.timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number) => [
                        `${value.toFixed(4)} SOL ($${(value * 20.5).toFixed(2)} USD)`,
                        undefined,
                      ]}
                      labelFormatter={(label) => {
                        // Format the date in a more readable format
                        const [month, day] = label.split(" ")
                        const year = new Date().getFullYear()
                        return `Date: ${month} ${day}, ${year}`
                      }}
                      contentStyle={{
                        backgroundColor: "rgba(75, 85, 99, 0.9)",
                        border: "none",
                        borderRadius: "6px",
                        padding: "8px 12px",
                        color: "white",
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="sales" name="Sales" stroke="#0088FE" activeDot={{ r: 8 }} />
                    <Line
                      type="monotone"
                      dataKey="commissions"
                      name="Commissions"
                      stroke="#00C49F"
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="total"
                      name="Total"
                      stroke="#8884d8"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <Card className="flex-1">
              <CardHeader className="pb-2">
                <CardTitle>Filter Transactions</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium mb-1 block">Product</label>
                  <Select value={productFilter} onValueChange={setProductFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Products</SelectItem>
                      <SelectItem value="marketing">Marketing Course</SelectItem>
                      <SelectItem value="web3">Web3 Development</SelectItem>
                      <SelectItem value="content">Content Creation</SelectItem>
                      <SelectItem value="business">Business Growth</SelectItem>
                      <SelectItem value="design">UI/UX Design</SelectItem>
                      <SelectItem value="api">API Integration</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium mb-1 block">Type</label>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="sale">Net Sales</SelectItem>
                      <SelectItem value="commission">Commissions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setProductFilter("all")
                      setTypeFilter("all")
                    }}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Reset Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Detailed list of all earnings transactions</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>TX Hash</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4">
                            No transactions found with the selected filters
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredTransactions.slice(0, 10).map((tx: any) => (
                          <TableRow key={tx.id}>
                            <TableCell>{format(tx.date, "MMM dd, yyyy HH:mm")}</TableCell>
                            <TableCell>{tx.product}</TableCell>
                            <TableCell>
                              <Badge variant={tx.type === "sale" ? "default" : "secondary"}>
                                {tx.type === "sale" ? "Net Sale" : `Level ${tx.commissionLevel} - Commission`}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">{tx.amount.toFixed(4)} SOL</div>
                              <div className="text-xs text-muted-foreground">(${tx.amountUsd.toFixed(2)} USD)</div>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(`https://solscan.io/tx/${tx.txHash}`, "_blank")}
                              >
                                View Solscan
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {Math.min(10, filteredTransactions.length)} of {filteredTransactions.length} transactions
              </div>
              <Button variant="outline" size="sm" disabled={filteredTransactions.length <= 10}>
                View More
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Performance</CardTitle>
              <CardDescription>Earnings breakdown by product</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              {isLoading ? (
                <div className="h-full w-full flex items-center justify-center">
                  <Skeleton className="h-[350px] w-full" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={earningsData.productPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number) => [
                        `${value.toFixed(4)} SOL ($${(value * 20.5).toFixed(2)} USD)`,
                        undefined,
                      ]}
                      contentStyle={{
                        backgroundColor: "rgba(75, 85, 99, 0.9)",
                        border: "none",
                        borderRadius: "6px",
                        padding: "8px 12px",
                        color: "white",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="sales" name="Sales" fill="#0088FE" />
                    <Bar dataKey="commissions" name="Commissions" fill="#00C49F" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
              <CardDescription>Detailed breakdown of earnings by product</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Sales (SOL)</TableHead>
                        <TableHead>Commissions (SOL)</TableHead>
                        <TableHead>Total (SOL)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {earningsData.productPerformance.map((product: any) => (
                        <TableRow key={product.name}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>
                            <div>{product.sales.toFixed(4)} SOL</div>
                            <div className="text-xs text-muted-foreground">
                              (${(product.sales * 20.5).toFixed(2)} USD)
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>{product.commissions.toFixed(4)} SOL</div>
                            <div className="text-xs text-muted-foreground">
                              (${(product.commissions * 20.5).toFixed(2)} USD)
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-bold">{product.total.toFixed(4)} SOL</div>
                            <div className="text-xs text-muted-foreground">
                              (${(product.total * 20.5).toFixed(2)} USD)
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sources Tab */}
        <TabsContent value="sources" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Earnings by Source</CardTitle>
                <CardDescription>Breakdown of earnings by source type</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                {isLoading ? (
                  <div className="h-full w-full flex items-center justify-center">
                    <Skeleton className="h-[350px] w-full" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={earningsData.earningsBySource}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {earningsData.earningsBySource.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => [`${value.toFixed(4)} SOL`, undefined]} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Source Details</CardTitle>
                <CardDescription>Detailed breakdown of earnings by source</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-2">
                    {Array(4)
                      .fill(0)
                      .map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                      ))}
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Source</TableHead>
                          <TableHead>Amount (SOL)</TableHead>
                          <TableHead>Percentage</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {earningsData.earningsBySource.map((source: any, index: number) => {
                          const total = earningsData.earningsBySource.reduce(
                            (sum: number, item: any) => sum + item.value,
                            0,
                          )
                          const percentage = (source.value / total) * 100

                          return (
                            <TableRow key={source.name}>
                              <TableCell>
                                <div className="flex items-center">
                                  <div
                                    className="w-3 h-3 rounded-full mr-2"
                                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                  />
                                  <span className="font-medium">{source.name}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="font-medium">{source.value.toFixed(4)} SOL</div>
                                <div className="text-xs text-muted-foreground">
                                  (${(source.value * 20.5).toFixed(2)} USD)
                                </div>
                              </TableCell>
                              <TableCell>{percentage.toFixed(2)}%</TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  Direct sales represent your product revenue after platform fees. Commission levels represent your
                  earnings from affiliate promotions.
                </p>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Earnings Growth</CardTitle>
              <CardDescription>Track your earnings growth over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              {isLoading ? (
                <div className="h-full w-full flex items-center justify-center">
                  <Skeleton className="h-[350px] w-full" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={earningsData.timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number) => [
                        `${value.toFixed(4)} SOL ($${(value * 20.5).toFixed(2)} USD)`,
                        undefined,
                      ]}
                      labelFormatter={(label) => `Date: ${label}`}
                      contentStyle={{
                        backgroundColor: "rgba(75, 85, 99, 0.9)",
                        border: "none",
                        borderRadius: "6px",
                        padding: "8px 12px",
                        color: "white",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="total"
                      name="Total Earnings"
                      stroke="#8884d8"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                This chart shows your total earnings growth over the selected time period. Use the date range selector
                at the top to adjust the view.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
