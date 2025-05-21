"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/utils/currency"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range"
import { addDays } from "date-fns"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface EarningsData {
  totalSales: {
    thisMonth: number
    lastMonth: number
    allTime: number
  }
  salesProfits: {
    thisMonth: number
    lastMonth: number
    allTime: number
  }
  affiliateEarnings: {
    thisMonth: number
    lastMonth: number
    allTime: number
  }
}

interface UserEarningsProps {
  username: string
  earningsData: EarningsData
  isLoading: boolean
  error: string | null
  onDateRangeChange: (startDate: Date, endDate: Date) => void
}

export function UserEarnings({ username, earningsData, isLoading, error, onDateRangeChange }: UserEarningsProps) {
  const [dateRange, setDateRange] = useState({
    from: addDays(new Date(), -30),
    to: new Date(),
  })

  const handleDateRangeChange = (range: { from: Date | undefined; to: Date | undefined }) => {
    if (range.from && range.to) {
      setDateRange(range)
      onDateRangeChange(range.from, range.to)
    }
  }

  const chartData = [
    {
      name: "Last Month",
      sales: earningsData.totalSales.lastMonth,
      profits: earningsData.salesProfits.lastMonth,
      affiliate: earningsData.affiliateEarnings.lastMonth,
    },
    {
      name: "This Month",
      sales: earningsData.totalSales.thisMonth,
      profits: earningsData.salesProfits.thisMonth,
      affiliate: earningsData.affiliateEarnings.thisMonth,
    },
    {
      name: "All Time",
      sales: earningsData.totalSales.allTime,
      profits: earningsData.salesProfits.allTime,
      affiliate: earningsData.affiliateEarnings.allTime,
    },
  ]

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        <p>Error: {error}</p>
        <Button onClick={() => onDateRangeChange(dateRange.from, dateRange.to)} className="mt-4">
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 pr-4">
      <h2 className="text-2xl font-bold mb-4">Earnings for {username}</h2>

      <div className="mb-4">
        <DatePickerWithRange date={dateRange} setDate={handleDateRangeChange} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Earnings Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#8884d8" name="Total Sales" />
              <Line type="monotone" dataKey="profits" stroke="#82ca9d" name="Sales Profits" />
              <Line type="monotone" dataKey="affiliate" stroke="#ffc658" name="Affiliate Earnings" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-xl font-semibold mb-2">Total Sales</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-normal">{formatCurrency(earningsData.totalSales.thisMonth).split(" (")[0]}</p>
              <p className="text-sm font-normal text-muted-foreground">
                ({formatCurrency(earningsData.totalSales.thisMonth).split(" (")[1]}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Last Month</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-normal">{formatCurrency(earningsData.totalSales.lastMonth).split(" (")[0]}</p>
              <p className="text-sm font-normal text-muted-foreground">
                ({formatCurrency(earningsData.totalSales.lastMonth).split(" (")[1]}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>All Time</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-normal">{formatCurrency(earningsData.totalSales.allTime).split(" (")[0]}</p>
              <p className="text-sm font-normal text-muted-foreground">
                ({formatCurrency(earningsData.totalSales.allTime).split(" (")[1]}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Sales Profits</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-normal">
                {formatCurrency(earningsData.salesProfits.thisMonth).split(" (")[0]}
              </p>
              <p className="text-sm font-normal text-muted-foreground">
                ({formatCurrency(earningsData.salesProfits.thisMonth).split(" (")[1]}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Last Month</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-normal">
                {formatCurrency(earningsData.salesProfits.lastMonth).split(" (")[0]}
              </p>
              <p className="text-sm font-normal text-muted-foreground">
                ({formatCurrency(earningsData.salesProfits.lastMonth).split(" (")[1]}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>All Time</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-normal">{formatCurrency(earningsData.salesProfits.allTime).split(" (")[0]}</p>
              <p className="text-sm font-normal text-muted-foreground">
                ({formatCurrency(earningsData.salesProfits.allTime).split(" (")[1]}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Affiliate Earnings</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-normal">
                {formatCurrency(earningsData.affiliateEarnings.thisMonth).split(" (")[0]}
              </p>
              <p className="text-sm font-normal text-muted-foreground">
                ({formatCurrency(earningsData.affiliateEarnings.thisMonth).split(" (")[1]}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Last Month</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-normal">
                {formatCurrency(earningsData.affiliateEarnings.lastMonth).split(" (")[0]}
              </p>
              <p className="text-sm font-normal text-muted-foreground">
                ({formatCurrency(earningsData.affiliateEarnings.lastMonth).split(" (")[1]}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>All Time</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-normal">
                {formatCurrency(earningsData.affiliateEarnings.allTime).split(" (")[0]}
              </p>
              <p className="text-sm font-normal text-muted-foreground">
                ({formatCurrency(earningsData.affiliateEarnings.allTime).split(" (")[1]}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
