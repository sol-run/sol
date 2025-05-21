"use client"

import type React from "react"
import { useState, useEffect, useMemo, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DollarSign,
  Users,
  Link,
  Package,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  ImageIcon,
  Video,
  FileArchive,
  FileText,
} from "lucide-react"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { TimeframeSelector } from "./timeframe-selector"
import { formatCurrency } from "@/utils/currency"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from "next/image"
import { useCart } from "@/context/CartContext"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

const affiliateLinkButtonStyles = `
  .affiliate-link-button {
    border-color: purple;
    box-shadow: 0 0 10px rgba(128, 0, 128, 0.5);
    transition: all 0.3s ease;
  }
  .affiliate-link-button:hover:not(:disabled) {
    box-shadow: 0 0 15px rgba(128, 0, 128, 0.8);
  }
  .affiliate-link-button:disabled {
    border-color: rgba(128, 0, 128, 0.5);
    box-shadow: none;
  }
  .dark .affiliate-link-button {
    border-color: #d8b4fe;
    box-shadow: 0 0 10px rgba(216, 180, 254, 0.5);
  }
  .dark .affiliate-link-button:hover:not(:disabled) {
    box-shadow: 0 0 15px rgba(216, 180, 254, 0.8);
  }
  .dark .affiliate-link-button:disabled {
    border-color: rgba(216, 180, 254, 0.5);
    box-shadow: none;
  }
`

type TimeframeOption = "day" | "week" | "month" | "year" | "lifetime"

const calculateTimeLeft = (expiryDate: string) => {
  try {
    // Ensure consistent date format by explicitly parsing year, month, day
    const [year, month, day] = expiryDate.split("-").map((num) => Number.parseInt(num, 10))

    // JavaScript months are 0-indexed, so subtract 1 from month
    const expiry = new Date(year, month - 1, day, 23, 59, 59)
    const now = new Date()

    // Check if the date is valid
    if (isNaN(expiry.getTime())) {
      console.error(`Invalid date format: ${expiryDate}`)
      return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    }

    const difference = expiry.getTime() - now.getTime()
    let timeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    }

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      }
    }

    return timeLeft
  } catch (error) {
    console.error(`Error calculating time left for date: ${expiryDate}`, error)
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }
}

interface TreeNode {
  id: string
  name: string
  children: TreeNode[]
}

const InteractiveTree: React.FC<{ data: TreeNode }> = ({ data }) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const expandAll = (node: TreeNode): Record<string, boolean> => {
      let result: Record<string, boolean> = { [node.id]: true }
      node.children.forEach((child) => {
        result = { ...result, ...expandAll(child) }
      })
      return result
    }
    return expandAll(data)
  })
  const [isAllExpanded, setIsAllExpanded] = useState(true)

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const toggleAll = () => {
    if (isAllExpanded) {
      setExpanded({})
    } else {
      const expandAll = (node: TreeNode): Record<string, boolean> => {
        let result: Record<string, boolean> = { [node.id]: true }
        node.children.forEach((child) => {
          result = { ...result, ...expandAll(child) }
        })
        return result
      }
      setExpanded(expandAll(data))
    }
    setIsAllExpanded(!isAllExpanded)
  }

  const renderNode = (node: TreeNode, level: number) => {
    const hasChildren = node.children && node.children.length > 0
    const isExpanded = expanded[node.id]

    return (
      <div key={node.id} style={{ marginLeft: `${level * 20}px` }}>
        <div className="flex items-center">
          {hasChildren && (
            <Button variant="ghost" size="sm" className="p-0 h-6 w-6" onClick={() => toggleExpand(node.id)}>
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          )}
          <span
            className={`ml-2 ${level === 0 ? "text-blue-600" : level === 1 ? "text-green-600" : "text-yellow-600"}`}
          >
            {node.name}
          </span>
        </div>
        {hasChildren && isExpanded && (
          <div className="mt-2">{node.children.map((child) => renderNode(child, level + 1))}</div>
        )}
      </div>
    )
  }

  return (
    <div className="p-4 border rounded overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Affiliate Network Genealogy</h3>
        <Button variant="outline" size="sm" onClick={toggleAll} className="hover:bg-gray-100">
          {isAllExpanded ? "Minimize All" : "Expand All"}
        </Button>
      </div>
      {renderNode(data, 0)}
      <div className="mt-4 text-sm text-gray-600">
        <p>Blue: You (Level 0)</p>
        <p>Green: Level 1 Referrals: {data.children.length}</p>
        <p>Yellow: Level 2 Referrals: {data.children.reduce((acc, child) => acc + child.children.length, 0)}</p>
        <p>
          All Levels Total:{" "}
          {data.children.length + data.children.reduce((acc, child) => acc + child.children.length, 0)} referrals
        </p>
      </div>
    </div>
  )
}

// Add this component before the AffiliateDashboard component
const CountdownDisplay: React.FC<{ expiryDate: string }> = ({ expiryDate }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(expiryDate))

  useEffect(() => {
    // Update the countdown every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(expiryDate))
    }, 1000)

    // Clean up the interval on component unmount
    return () => clearInterval(timer)
  }, [expiryDate])

  return (
    <span>
      ({timeLeft.days} days | {timeLeft.hours} hrs | {timeLeft.minutes} min | {timeLeft.seconds} sec left)
    </span>
  )
}

export default function AffiliateDashboard() {
  useEffect(() => {
    const styleElement = document.createElement("style")
    styleElement.innerHTML = affiliateLinkButtonStyles
    document.head.appendChild(styleElement)
    return () => {
      document.head.removeChild(styleElement)
    }
  }, [])
  const [timeframe, setTimeframe] = useState<TimeframeOption>("month")
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [selectedProductDetails, setSelectedProductDetails] = useState(null)
  const [isTransactionsOpen, setIsTransactionsOpen] = useState(false)
  const [transactions, setTransactions] = useState([
    {
      date: "2023-07-01",
      time: "14:30:22",
      commission: 0.5,
      level: 1,
      productName: "Solana Basics eBook",
      transactionHash: "3X3csFANQe4FHzZFP6kKKGCWHKbEsBAGn1XFGEFKxLxa",
    },
    {
      date: "2023-07-02",
      time: "09:15:47",
      commission: 0.75,
      level: 2,
      productName: "Advanced Solana Course",
      transactionHash: "7Y2bsFBMRe5GHzZFP7kKKGCWHKbEsBAGn2YFGEFKxLxb",
    },
    {
      date: "2023-07-03",
      time: "18:45:03",
      commission: 0.25,
      level: 1,
      productName: "Solana NFT Collection",
      transactionHash: "9Z1asFCLSe6IHzZFP8kKKGCWHKbEsBAGn3ZFGEFKxLxc",
    },
  ])
  const [isListGenealogy, setIsListGenealogy] = useState(false)
  const [activeTab, setActiveTab] = useState<"genealogy">("genealogy")
  const [isExtendAccessOpen, setIsExtendAccessOpen] = useState(false)
  const [selectedProductForExtension, setSelectedProductForExtension] = useState(null)
  const [referredSales, setReferredSales] = useState({ count: 154, percentage: 30.1 })
  const [isFilesDialogOpen, setIsFilesDialogOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)
  const [currentAttachmentIndex, setCurrentAttachmentIndex] = useState(0)
  const [isMaximized, setIsMaximized] = useState(false)
  const [selectedPriceOption, setSelectedPriceOption] = useState(null) // Added state for selected price option
  const affiliateProgramsRef = useRef<HTMLDivElement>(null)
  const { addToCart } = useCart()
  const [visibleLines, setVisibleLines] = useState({
    unitsSold: true,
    commissionsSOL: true,
    commissionsUSD: true,
  })

  const router = useRouter()

  const calculateReferredSales = (period: string) => {
    // This is a mock calculation. In a real app, you'd fetch this data from an API.
    const salesData = {
      day: { count: 5, percentage: 10.5 },
      week: { count: 35, percentage: 15.2 },
      month: { count: 154, percentage: 30.1 },
      year: { count: 1872, percentage: 45.6 },
      lifetime: { count: 5420, percentage: 60.8 },
    }
    return salesData[period] || { count: 0, percentage: 0 }
  }

  const generatePerformanceData = useMemo(() => {
    return (timeframe: TimeframeOption) => {
      // This is a placeholder function. In a real application, you would fetch this data from an API.
      switch (timeframe) {
        case "day":
          return Array.from({ length: 24 }, (_, i) => {
            const date = new Date()
            date.setHours(i, 0, 0, 0)
            return {
              time: date.toISOString(),
              unitsSold: Math.floor(Math.random() * 50),
              commissionsSOL: Math.random() * 2.5,
              commissionsUSD: Math.random() * 50,
            }
          })
        case "week":
          return Array.from({ length: 7 }, (_, i) => ({
            time: new Date(Date.now() - (6 - i) * 86400000).toLocaleDateString("en-US", {
              year: "numeric",
              month: "numeric",
              day: "numeric",
            }),
            unitsSold: Math.floor(Math.random() * 250),
            commissionsSOL: Math.random() * 12.5,
            commissionsUSD: Math.random() * 250,
          }))
        case "month":
          return Array.from({ length: 30 }, (_, i) => ({
            time: new Date(Date.now() - (29 - i) * 86400000).toLocaleDateString("en-US", {
              year: "numeric",
              month: "numeric",
              day: "numeric",
            }),
            unitsSold: Math.floor(Math.random() * 1000),
            commissionsSOL: Math.random() * 50,
            commissionsUSD: Math.random() * 1000,
          }))
        case "year":
          return Array.from({ length: 12 }, (_, i) => ({
            time: new Date(Date.now() - (11 - i) * 2592000000).toLocaleDateString("en-US", {
              year: "numeric",
              month: "numeric",
              day: "numeric",
            }),
            unitsSold: Math.floor(Math.random() * 10000),
            commissionsSOL: Math.random() * 500,
            commissionsUSD: Math.random() * 10000,
          }))
        case "lifetime":
          return Array.from({ length: 5 }, (_, i) => ({
            time: new Date(Date.now() - (4 - i) * 31536000000).toLocaleDateString("en-US", {
              year: "numeric",
              month: "numeric",
              day: "numeric",
            }),
            unitsSold: Math.floor(Math.random() * 50000),
            commissionsSOL: Math.random() * 2500,
            commissionsUSD: Math.random() * 50000,
          }))
        default:
          return []
      }
    }
  }, [])

  const performanceData = useMemo(() => {
    const solToUsdRate = 20 // Assuming 1 SOL = $20 USD
    return generatePerformanceData(timeframe).map((data) => ({
      ...data,
      commissionsUSD: data.commissionsSOL * solToUsdRate,
    }))
  }, [generatePerformanceData, timeframe])
  const totalEarnings = useMemo(() => {
    const periodData = performanceData.filter((data) => {
      const dataDate = new Date(data.time)
      const now = new Date()
      switch (timeframe) {
        case "day":
          return (
            dataDate.getDate() === now.getDate() &&
            dataDate.getMonth() === now.getMonth() &&
            dataDate.getFullYear() === now.getFullYear()
          )
        case "week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          return dataDate >= weekAgo
        case "month":
          return dataDate.getMonth() === now.getMonth() && dataDate.getFullYear() === now.getFullYear()
        case "year":
          return dataDate.getFullYear() === now.getFullYear()
        case "lifetime":
        default:
          return true
      }
    })
    return periodData.reduce((sum, data) => sum + data.commissionsSOL, 0)
  }, [performanceData, timeframe])

  const handleViewDetails = (product) => {
    setSelectedProductDetails({
      name: product.name,
      totalEarned: product.earnings || 0,
      totalUnitsSold: Math.floor(Math.random() * 100) + 1, // Mock data
      averageEarningsPerSale: (product.earnings || 0) / (Math.floor(Math.random() * 100) + 1),
    })
    setIsDetailsOpen(true)
  }

  const [affiliateLink, setAffiliateLink] = useState("https://sol.run/ref/username")

  const genealogyData: TreeNode = {
    id: "you",
    name: "You",
    children: [
      {
        id: "user1",
        name: "user1",
        children: [
          { id: "user3", name: "user3", children: [] },
          { id: "user4", name: "user4", children: [] },
        ],
      },
      {
        id: "user2",
        name: "user2",
        children: [
          { id: "user5", name: "user5", children: [] },
          { id: "user6", name: "user6", children: [] },
        ],
      },
    ],
  }

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case "image":
        return <ImageIcon className="h-6 w-6" />
      case "video":
        return <Video className="h-6 w-6" />
      case "zip":
        return <FileArchive className="h-6 w-6" />
      default:
        return <FileText className="h-6 w-6" />
    }
  }

  const handleNextAttachment = () => {
    setCurrentAttachmentIndex((prevIndex) => (prevIndex === selectedPost.attachments.length - 1 ? 0 : prevIndex + 1))
  }

  const handlePreviousAttachment = () => {
    setCurrentAttachmentIndex((prevIndex) => (prevIndex === 0 ? selectedPost.attachments.length - 1 : prevIndex - 1))
  }

  return (
    <div className="w-full space-y-6 flex flex-col">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="hidden">
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-md p-3 mb-4 text-blue-700 dark:text-blue-300 text-sm">
            <strong>Note:</strong> You can only be an affiliate for a product that you have purchased and are currently
            an active client for.
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  Total Earnings
                  <Select
                    value={timeframe}
                    onValueChange={(value) => {
                      setTimeframe(value as TimeframeOption)
                      setReferredSales(calculateReferredSales(value))
                    }}
                  >
                    <SelectTrigger className="h-6 w-24">
                      <SelectValue placeholder="Period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day">Day</SelectItem>
                      <SelectItem value="week">Week</SelectItem>
                      <SelectItem value="month">Month</SelectItem>
                      <SelectItem value="year">Year</SelectItem>
                      <SelectItem value="lifetime">Lifetime</SelectItem>
                    </SelectContent>
                  </Select>
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {useMemo(() => {
                    const formattedCurrency = formatCurrency(totalEarnings, 4)
                    const [solAmount, usdAmount] = formattedCurrency.split(" (")
                    return (
                      <>
                        {solAmount}
                        <br />
                        <span className="text-sm font-normal">({usdAmount}</span>
                      </>
                    )
                  }, [totalEarnings])}
                </div>
                <p className="text-xs text-muted-foreground">+15.2% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Referred Sales</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+{referredSales.count}</div>
                <p className="text-xs text-muted-foreground">
                  +{referredSales.percentage.toFixed(1)}% from last {timeframe}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">+3 since last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Affiliate Links</CardTitle>
                <Link className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full"
                  onClick={() => affiliateProgramsRef.current?.scrollIntoView({ behavior: "smooth" })}
                >
                  Get Affiliate Links
                </Button>
              </CardContent>
            </Card>
          </div>
          <Card className="w-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Performance Overview</CardTitle>
                  <CardDescription>Sales and commissions for the selected timeframe</CardDescription>
                </div>
                <TimeframeSelector
                  value={timeframe}
                  onChange={(value) => {
                    setTimeframe(value as TimeframeOption)
                  }}
                />
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <ChartContainer
                config={{
                  unitsSold: {
                    label: "Units Sold",
                    color: "hsl(var(--chart-1))",
                  },
                  commissionsSOL: {
                    label: "Commissions (SOL)",
                    color: "hsl(var(--chart-2))",
                  },
                  commissionsUSD: {
                    label: "Commissions (USD)",
                    color: "hsl(var(--chart-3))",
                  },
                }}
                className="h-[400px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="time"
                      tickFormatter={(value) => {
                        const date = new Date(value)
                        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                      }}
                      ticks={performanceData
                        .filter((_, i) => i % Math.floor(performanceData.length / 5) === 0)
                        .map((d) => d.time)}
                    />
                    <YAxis yAxisId="left" tickFormatter={(value) => `${value.toFixed(2)}`} />
                    <YAxis yAxisId="right" orientation="right" tick={false} axisLine={false} />
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
                              <span style={{ color: entry.color }}>{entry.value}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="unitsSold"
                      name="Units Sold"
                      stroke="var(--color-unitsSold)"
                      strokeWidth={2}
                      hide={!visibleLines.unitsSold}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="commissionsSOL"
                      name="Commissions (SOL)"
                      stroke="var(--color-commissionsSOL)"
                      strokeWidth={2}
                      hide={!visibleLines.commissionsSOL}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="commissionsUSD"
                      name="Commissions (USD)"
                      stroke="var(--color-commissionsUSD)"
                      strokeWidth={2}
                      hide={!visibleLines.commissionsUSD}
                    />
                    <ChartTooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="flex flex-col">
                                  <span className="text-[0.70rem] uppercase text-muted-foreground">Date</span>
                                  <span className="font-bold text-muted-foreground">
                                    {new Date(label).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    })}
                                  </span>
                                </div>
                                {payload.map((entry, index) => (
                                  <div key={`item-${index}`} className="flex flex-col">
                                    <span className="text-[0.70rem] uppercase text-muted-foreground">{entry.name}</span>
                                    <span className="font-bold">
                                      {entry.name === "Units Sold"
                                        ? entry.value
                                        : entry.name === "Commissions (SOL)"
                                          ? `${entry.value.toFixed(4)} SOL`
                                          : `$${entry.value.toFixed(2)} USD`}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card className="mt-6" ref={affiliateProgramsRef}>
            <CardHeader>
              <CardTitle>Purchased Products + Affiliate Programs</CardTitle>
              <CardDescription>View your earnings for each product you've purchased and promoted</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {[
                  {
                    id: "ebook-solana-basics", // Added ID for product
                    name: "eBook: Solana Basics",
                    earnings: 250.5,
                    purchaseDate: "2023-05-15",
                    expiryDate: "2023-11-15",
                    commissionRate: "20%",
                    price: 10,
                    joined: false,
                    expired: true,
                  },
                  {
                    id: "video-course-advanced-solana", // Added ID for product
                    name: "Video Course: Advanced Solana",
                    earnings: 1200.75,
                    purchaseDate: "2023-06-01",
                    expiryDate: "2025-06-01",
                    commissionRate: "25%",
                    price: 40,
                    joined: true,
                    expired: false,
                  },
                  {
                    id: "nft-collection-solana-gems", // Added ID for product
                    name: "NFT Collection: Solana Gems",
                    earnings: 500.25,
                    purchaseDate: "2023-06-20",
                    expiryDate: "2025-05-07",
                    commissionRate: "15%",
                    price: 20,
                    joined: false,
                    expired: false,
                  },
                  {
                    id: "solana-dapp-templates", // Added ID for product
                    name: "Solana DApp Templates",
                    earnings: 750.0,
                    purchaseDate: "2023-07-05",
                    expiryDate: "2023-10-05",
                    commissionRate: "30%",
                    price: 30,
                    joined: false,
                    expired: true,
                  },
                ].map((product, index) => (
                  <li
                    key={index}
                    className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4 ${product.expired ? "opacity-50" : ""}`}
                  >
                    <div className="w-full">
                      <h3 className="font-semibold">
                        {product.name} {product.expired && <span className="text-red-500">(Expired)</span>}
                      </h3>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-1 mb-2">
                        <span className="font-bold">
                          <span>Posts:</span> {index === 0 ? 12 : index === 1 ? 24 : index === 2 ? 8 : 16}
                        </span>
                        <span className="font-bold">
                          <span>Files:</span> {index === 0 ? 5 : index === 1 ? 18 : index === 2 ? 10 : 7}
                        </span>
                      </div>
                      <p className="text-sm text-green-600">
                        <span className="font-bold">Total Earned Commissions:</span>{" "}
                        {formatCurrency(product.earnings || 0, 4)}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-bold">Purchased on:</span> {product.purchaseDate}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-bold">Total Amount Paid:</span> {formatCurrency(product.price || 0, 4)}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-bold">Expires on:</span> {product.expiryDate}{" "}
                        {!product.expired && <CountdownDisplay expiryDate={product.expiryDate} />}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-bold">Accumulative Commissions:</span> 45% total (3-Level Structure: L1:
                        20% | L2: 15% | L3: 10%)
                      </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedProductDetails({
                            name: product.name,
                            totalEarned: product.earnings || 0,
                            totalUnitsSold: Math.floor(Math.random() * 100) + 1,
                            averageEarningsPerSale: (product.earnings || 0) / (Math.floor(Math.random() * 100) + 1),
                          })
                          setIsDetailsOpen(true)
                        }}
                        className="whitespace-normal text-center h-auto py-2 min-h-[2.5rem]"
                      >
                        View Details
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={product.expired}
                        onClick={() => {
                          // Logic for affiliate link
                        }}
                        className="affiliate-link-button whitespace-normal text-center h-auto py-2 min-h-[2.5rem]"
                      >
                        Affiliate Link
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={product.expired}
                        onClick={() => setIsTransactionsOpen(true)}
                        className="whitespace-normal text-center h-auto py-2 min-h-[2.5rem]"
                      >
                        Transactions
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={product.expired}
                        onClick={() => setIsListGenealogy(true)}
                        className="whitespace-normal text-center h-auto py-2 min-h-[2.5rem]"
                      >
                        List & Genealogy
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={product.expired}
                        onClick={() => router.push(`/product-files-view/${product.id}`)}
                        className="whitespace-normal text-center h-auto py-2 min-h-[2.5rem]"
                      >
                        Files & Downloads
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedProductForExtension(product)
                          setIsExtendAccessOpen(true)
                        }}
                        className="whitespace-normal text-center h-auto py-2 min-h-[2.5rem]"
                      >
                        Renew / Extend Access
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
              {selectedProduct && (
                <div className="mt-4 p-4 border rounded-md">
                  <h4 className="font-semibold mb-2">Details for {selectedProduct.name}</h4>
                  <p>Total Earnings: {formatCurrency(selectedProduct.earnings, 4)}</p>
                  <p>Purchase Date: {selectedProduct.purchaseDate}</p>
                  <Button variant="outline" size="sm" onClick={() => setSelectedProduct(null)} className="mt-2">
                    Close Details
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedProductDetails?.name} Details</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Total Earned: {formatCurrency(selectedProductDetails?.totalEarned || 0, 4)}</p>
            <p>Total Units Sold: {selectedProductDetails?.totalUnitsSold}</p>
            <p>Total Units Sold: {selectedProductDetails?.totalUnitsSold}</p>
            <p>Units Sold: {selectedProductDetails?.totalUnitsSold}</p>
            <p>UnitsSold: {selectedProductDetails?.totalUnitsSold}</p>
            <p>
              Average Earnings Per Sale:{" "}
              {formatCurrency(
                (selectedProductDetails?.totalEarned || 0) / (selectedProductDetails?.totalUnitsSold || 1),
                4,
              )}
            </p>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={isTransactionsOpen} onOpenChange={setIsTransactionsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Commission Transactions for eBook: Solana Basics</DialogTitle>
          </DialogHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Commission Earned</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Transaction Hash</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction, index) => (
                <TableRow key={index}>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{transaction.time}</TableCell>
                  <TableCell>{formatCurrency(transaction.commission, 4)}</TableCell>
                  <TableCell>{transaction.level}</TableCell>
                  <TableCell>
                    <a
                      href={`https://solscan.io/tx/${transaction.transactionHash}`}
                      target="_blank"
                      rel="noreferrer noopenernoreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {transaction.transactionHash.slice(0, 8)}...
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
      <Dialog open={isListGenealogy} onOpenChange={setIsListGenealogy}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>List & Genealogy</DialogTitle>
          </DialogHeader>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "genealogy")}>
            <TabsList>
              <TabsTrigger value="customers">Customers List</TabsTrigger>
              <TabsTrigger value="genealogy">Genealogy</TabsTrigger>
            </TabsList>
            <TabsContent value="customers">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Purchase Date</TableHead>
                    <TableHead>Sale Amount</TableHead>
                    <TableHead>Commission Amount</TableHead>
                    <TableHead>Level</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { username: "user1", purchaseDate: "2023-07-01", saleAmount: 100, commissionAmount: 20, level: 1 },
                    { username: "user2", purchaseDate: "2023-07-02", saleAmount: 150, commissionAmount: 30, level: 2 },
                    { username: "user3", purchaseDate: "2023-07-03", saleAmount: 200, commissionAmount: 40, level: 1 },
                  ].map((customer, index) => (
                    <TableRow key={index}>
                      <TableCell>{customer.username}</TableCell>
                      <TableCell>{customer.purchaseDate}</TableCell>
                      <TableCell>{formatCurrency(customer.saleAmount)}</TableCell>
                      <TableCell>{formatCurrency(customer.commissionAmount)}</TableCell>
                      <TableCell>{customer.level}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="genealogy">
              <InteractiveTree data={genealogyData} />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
      <Dialog open={isExtendAccessOpen} onOpenChange={setIsExtendAccessOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Extend Access for {selectedProductForExtension?.name}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="extensionPeriod" className="text-right">
                Extension Period
              </Label>
              <Select
                onValueChange={(value) => {
                  setSelectedPriceOption(value)
                  console.log(`Selected extension: ${value}`)
                }}
              >
                {" "}
                {/* Update to handle selectedPriceOption */}
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select extension package" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    { name: "Basic Extension", duration: "1 month", priceSOL: 0.5, priceUSD: 10 },
                    { name: "Standard Extension", duration: "3 months", priceSOL: 1.2, priceUSD: 24 },
                    { name: "Premium Extension", duration: "6 months", priceSOL: 2, priceUSD: 40 },
                    { name: "Annual Extension", duration: "1 year", priceSOL: 3.5, priceUSD: 70 },
                  ].map((option) => (
                    <SelectItem
                      key={option.name}
                      value={`${option.name} - ${option.priceSOL} SOL - ${option.priceUSD} USD`}
                    >
                      {" "}
                      {/* Update value to include price */}
                      {option.name} - {option.duration} - {option.priceSOL} SOL (${option.priceUSD} USD)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                if (selectedProductForExtension && selectedPriceOption) {
                  const [, priceSOL] = selectedPriceOption.split(" - ")
                  addToCart({
                    id: `${selectedProductForExtension.id}-extension`,
                    name: `${selectedProductForExtension.name} (Extension)`,
                    thumbnail: "/placeholder.svg",
                    sellerUsername: "Original Seller",
                    price: Number.parseFloat(priceSOL),
                  })
                  setIsExtendAccessOpen(false)
                  toast({
                    title: "Product Added to Cart",
                    description: `${selectedProductForExtension.name} extension has been added to your cart.`,
                  })
                }
              }}
            >
              Confirm Extension
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isFilesDialogOpen} onOpenChange={setIsFilesDialogOpen}>
        <DialogContent className={`max-w-4xl ${isMaximized ? "w-screen h-screen max-h-screen" : "max-h-[80vh]"}`}>
          <DialogHeader>
            <DialogTitle>Files & Downloads</DialogTitle>
          </DialogHeader>
          <div className="flex justify-between items-center mb-4">
            {selectedPost && (
              <Button variant="outline" onClick={() => setSelectedPost(null)}>
                Back to List
              </Button>
            )}
            <Button variant="outline" onClick={() => setIsMaximized(!isMaximized)}>
              {isMaximized ? "Minimize" : "Maximize"}
            </Button>
          </div>
          <ScrollArea className={isMaximized ? "h-[calc(100vh-120px)]" : "h-[60vh]"}>
            {selectedPost ? (
              <div className="space-y-4">
                <h3 className="text-xl font-bold">{selectedPost.title}</h3>
                <p className="text-sm text-muted-foreground">
                  Published on {selectedPost.date} at {selectedPost.time}
                </p>
                <p>{selectedPost.description}</p>
                <div className="space-y-2">
                  <h4 className="font-semibold">Attachments:</h4>
                  <div className="relative w-full h-64">
                    <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md z-10">
                      {currentAttachmentIndex + 1} of {selectedPost.attachments.length}
                    </div>
                    {selectedPost.attachments.map((attachment, index) => (
                      <div
                        key={index}
                        className={`absolute top-0 left-0 w-full h-full transition-opacity duration-300 ${
                          index === currentAttachmentIndex ? "opacity-100" : "opacity-0 pointer-events-none"
                        }`}
                      >
                        {attachment.type === "image" ? (
                          <Image
                            src={attachment.url || "/placeholder.svg"}
                            alt={attachment.name}
                            layout="fill"
                            objectFit="contain"
                          />
                        ) : attachment.type === "video" ? (
                          <video src={attachment.url} controls className="w-full h-full object-contain" />
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full">
                            {getFileIcon(attachment.type)}
                            <span className="mt-2">{attachment.name}</span>
                          </div>
                        )}
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute top-1/2 left-2 transform -translate-y-1/2"
                      onClick={handlePreviousAttachment}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute top-1/2 right-2 transform -translate-y-1/2"
                      onClick={handleNextAttachment}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>{selectedPost.attachments[currentAttachmentIndex].name}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        console.log(`Downloading ${selectedPost.attachments[currentAttachmentIndex].name}`)
                      }
                    >
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {[
                  {
                    title: "Getting Started with Solana",
                    date: "2023-07-15",
                    time: "14:30",
                    attachmentsCount: 2,
                    description: "An introduction to Solana blockchain development.",
                    attachments: [
                      { name: "solana-basics.pdf", url: "#", type: "pdf" },
                      { name: "code-samples.zip", url: "#", type: "zip" },
                    ],
                  },
                  {
                    title: "Advanced Solana Programming Techniques",
                    date: "2023-07-20",
                    time: "10:00",
                    attachmentsCount: 3,
                    description: "Deep dive into advanced Solana programming concepts.",
                    attachments: [
                      { name: "advanced-techniques.pdf", url: "#", type: "pdf" },
                      { name: "example-project.zip", url: "#", type: "zip" },
                      { name: "presentation-slides.pptx", url: "#", type: "pptx" },
                    ],
                  },
                  // Add more mock posts as needed
                ].map((post, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <h3 className="text-lg font-semibold">{post.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Published on {post.date} at {post.time}
                    </p>
                    <p className="text-sm">Attachments: {post.attachmentsCount}</p>
                    <Button variant="outline" size="sm" onClick={() => setSelectedPost(post)}>
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export { AffiliateDashboard }
