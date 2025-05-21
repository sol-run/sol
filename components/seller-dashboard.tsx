"use client"

import { useState, useCallback, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, DollarSign, Users, Package } from "lucide-react"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { TimeframeSelector } from "./timeframe-selector"
import { formatCurrency } from "@/utils/currency"
import { ProductList } from "./product-list"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

type TimeframeOption = "day" | "week" | "month" | "year" | "lifetime"

const generateRevenueData = (
  timeframe: TimeframeOption,
): { time: Date; revenue: number; revenueUSD: number; unitsSold: number }[] => {
  const currentDate = new Date()
  const data = []

  switch (timeframe) {
    case "day":
      for (let i = 0; i < 24; i++) {
        const date = new Date(currentDate)
        date.setHours(i, 0, 0, 0)
        const revenue = Math.random() * 50
        data.push({
          time: date,
          revenue,
          revenueUSD: revenue * 20, // Assuming 1 SOL = $20 USD
          unitsSold: Math.floor(Math.random() * 100),
        })
      }
      break
    case "week":
      for (let i = 6; i >= 0; i--) {
        const date = new Date(currentDate)
        date.setDate(date.getDate() - i)
        const revenue = Math.random() * 500
        data.push({
          time: date,
          revenue,
          revenueUSD: revenue * 20,
          unitsSold: Math.floor(Math.random() * 1000),
        })
      }
      break
    case "month":
      for (let i = 29; i >= 0; i--) {
        const date = new Date(currentDate)
        date.setDate(date.getDate() - i)
        const revenue = Math.random() * 2500
        data.push({
          time: date,
          revenue,
          revenueUSD: revenue * 20,
          unitsSold: Math.floor(Math.random() * 5000),
        })
      }
      break
    case "year":
      for (let i = 11; i >= 0; i--) {
        const date = new Date(currentDate)
        date.setMonth(date.getMonth() - i)
        const revenue = Math.random() * 25000
        data.push({
          time: date,
          revenue,
          revenueUSD: revenue * 20,
          unitsSold: Math.floor(Math.random() * 50000),
        })
      }
      break
    case "lifetime":
      for (let i = 4; i >= 0; i--) {
        const date = new Date(currentDate)
        date.setFullYear(date.getFullYear() - i)
        const revenue = Math.random() * 250000
        data.push({
          time: date,
          revenue,
          revenueUSD: revenue * 20,
          unitsSold: Math.floor(Math.random() * 500000),
        })
      }
      break
  }
  return data
}

export function SellerDashboard() {
  const [revenueData, setRevenueData] = useState(() => generateRevenueData("month"))
  const [timeframe, setTimeframe] = useState<TimeframeOption>("month")
  const router = useRouter()
  const [visibleLines, setVisibleLines] = useState({
    revenue: true,
    revenueUSD: true,
    unitsSold: true,
  })

  const handleTimeframeChange = (newTimeframe: TimeframeOption) => {
    setTimeframe(newTimeframe)
    setRevenueData(generateRevenueData(newTimeframe))
  }

  const totalRevenue = revenueData.reduce((sum, data) => sum + data.revenue, 0)

  const handleCreateProduct = useCallback((productData: any) => {
    console.log("New product data:", productData)
    // Here you would typically send this data to your backend API
    // and then update your local state with the new product
    //setIsCreateProductModalOpen(false)
  }, [])

  return (
    <div className="w-full space-y-6 flex flex-col">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              Total Revenue
              <Select value={timeframe} onValueChange={(value) => handleTimeframeChange(value as TimeframeOption)}>
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
            <div className="flex flex-col">
              <div className="text-2xl font-bold">{formatCurrency(totalRevenue, 4).split(" (")[0]}</div>
              <div className="text-sm text-muted-foreground">({formatCurrency(totalRevenue, 4).split(" (")[1]}</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products Sold</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {useMemo(() => {
                const productsSold = {
                  day: 150,
                  week: 850,
                  month: 2350,
                  year: 28000,
                  lifetime: 125000,
                }[timeframe]
                return `+${productsSold.toLocaleString()}`
              }, [timeframe])}
            </div>
            <p className="text-xs text-muted-foreground">
              {useMemo(() => {
                const percentageChange = {
                  day: 15.5,
                  week: 42.3,
                  month: 180.1,
                  year: 220.5,
                  lifetime: 350.0,
                }[timeframe]
                return `+${percentageChange.toFixed(1)}% from last ${timeframe === "lifetime" ? "year" : timeframe}`
              }, [timeframe])}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Affiliates</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">+201 since last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Add New Product</CardTitle>
            <PlusCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => router.push("/create-product")}>
              Create Product
            </Button>
          </CardContent>
        </Card>
      </div>
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>Revenue for the selected timeframe</CardDescription>
            </div>
            <TimeframeSelector
              value={timeframe}
              onChange={(value) => handleTimeframeChange(value as TimeframeOption)}
            />
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <ChartContainer
            config={{
              revenue: {
                label: "Revenue (SOL)",
                color: "hsl(var(--chart-1))",
              },
              revenueUSD: {
                label: "Revenue (USD)",
                color: "hsl(var(--chart-2))",
              },
              unitsSold: {
                label: "Units Sold",
                color: "hsl(var(--chart-3))",
              },
            }}
            className="h-[400px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="time"
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
                  }}
                  ticks={revenueData.filter((_, i) => i % Math.floor(revenueData.length / 5) === 0).map((d) => d.time)}
                />
                <YAxis yAxisId="left" />
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
                  dataKey="revenue"
                  name="Revenue (SOL)"
                  stroke="var(--color-revenue)"
                  strokeWidth={2}
                  hide={!visibleLines.revenue}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenueUSD"
                  name="Revenue (USD)"
                  stroke="var(--color-revenueUSD)"
                  strokeWidth={2}
                  hide={!visibleLines.revenueUSD}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="unitsSold"
                  name="Units Sold"
                  stroke="var(--color-unitsSold)"
                  strokeWidth={2}
                  hide={!visibleLines.unitsSold}
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
                                  {entry.name === "Revenue (SOL)"
                                    ? `${entry.value.toFixed(4)} SOL`
                                    : entry.name === "Revenue (USD)"
                                      ? `$${entry.value.toFixed(2)} USD`
                                      : entry.value}
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
      <ProductList />
    </div>
  )
}
