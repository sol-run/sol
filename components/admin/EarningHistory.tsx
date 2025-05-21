"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range"
import { ArrowUpDown, ExternalLink } from "lucide-react"

interface Earning {
  id: string
  transactionId: string
  date: string
  username: string
  description: string
  type: "sale" | "level_1" | "level_2" | "level_3"
  amount: number
  amountUSD: number
}

export function EarningHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<keyof Earning>("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })

  // Mock data
  const mockEarnings: Earning[] = [
    {
      id: "e1",
      transactionId: "4AbCdEfGhIjKlMnOpQrStUvWxYz1234567890AbCdEfGhIjKlMnOpQrStUvWxYz",
      date: "2023-12-15T16:42:18Z",
      username: "alice_creator",
      description: "Advanced Marketing Course + Monthly Subscription",
      type: "sale",
      amount: 5.1875,
      amountUSD: 103.75,
    },
    {
      id: "e2",
      transactionId: "4AbCdEfGhIjKlMnOpQrStUvWxYz1234567890AbCdEfGhIjKlMnOpQrStUvWxYz",
      date: "2023-12-15T16:42:18Z",
      username: "charlie_affiliate",
      description: "Advanced Marketing Course + Monthly Subscription",
      type: "level_1",
      amount: 0.575,
      amountUSD: 11.5,
    },
    {
      id: "e3",
      transactionId: "6GhIjKlMnOpQrStUvWxYz1234567890AbCdEfGhIjKlMnOpQrStUvWxYz123456",
      date: "2023-12-15T14:23:05Z",
      username: "bob_seller",
      description: "Web3 Development Masterclass + Annual Subscription",
      type: "sale",
      amount: 7.4375,
      amountUSD: 148.75,
    },
    {
      id: "e4",
      transactionId: "8KlMnOpQrStUvWxYz1234567890AbCdEfGhIjKlMnOpQrStUvWxYz12345678",
      date: "2023-12-14T11:37:52Z",
      username: "frank_coach",
      description: "Content Creation Pro + Lifetime Access",
      type: "sale",
      amount: 4.05,
      amountUSD: 81,
    },
    {
      id: "e5",
      transactionId: "8KlMnOpQrStUvWxYz1234567890AbCdEfGhIjKlMnOpQrStUvWxYz12345678",
      date: "2023-12-14T11:37:52Z",
      username: "isabel_mentor",
      description: "Content Creation Pro + Lifetime Access",
      type: "level_1",
      amount: 0.45,
      amountUSD: 9,
    },
    {
      id: "e6",
      transactionId: "1OpQrStUvWxYz1234567890AbCdEfGhIjKlMnOpQrStUvWxYz1234567890A",
      date: "2023-12-14T09:15:33Z",
      username: "henry_designer",
      description: "UI/UX Design System + Monthly Subscription",
      type: "sale",
      amount: 5.715,
      amountUSD: 114.3,
    },
    {
      id: "e7",
      transactionId: "1OpQrStUvWxYz1234567890AbCdEfGhIjKlMnOpQrStUvWxYz1234567890A",
      date: "2023-12-14T09:15:33Z",
      username: "charlie_affiliate",
      description: "UI/UX Design System + Monthly Subscription",
      type: "level_1",
      amount: 0.635,
      amountUSD: 12.7,
    },
    {
      id: "e8",
      transactionId: "3StUvWxYz1234567890AbCdEfGhIjKlMnOpQrStUvWxYz1234567890AbCd",
      date: "2023-12-13T18:29:47Z",
      username: "alice_creator",
      description: "Advanced Marketing Course + Monthly Subscription",
      type: "sale",
      amount: 5.1875,
      amountUSD: 103.75,
    },
    {
      id: "e9",
      transactionId: "3StUvWxYz1234567890AbCdEfGhIjKlMnOpQrStUvWxYz1234567890AbCd",
      date: "2023-12-13T18:29:47Z",
      username: "bob_seller",
      description: "Advanced Marketing Course + Monthly Subscription",
      type: "level_1",
      amount: 0.575,
      amountUSD: 11.5,
    },
    {
      id: "e10",
      transactionId: "5WxYzAbCdEfGhIjKlMnOpQrStUvWxYz1234567890AbCdEfGhIjKlMnOpQr",
      date: "2023-12-13T15:11:28Z",
      username: "frank_coach",
      description: "Business Growth Strategies + Quarterly Subscription",
      type: "sale",
      amount: 8.955,
      amountUSD: 179.1,
    },
    {
      id: "e11",
      transactionId: "7AbCdEfGhIjKlMnOpQrStUvWxYz1234567890AbCdEfGhIjKlMnOpQrStUv",
      date: "2023-12-12T13:47:09Z",
      username: "emma_developer",
      description: "API Integration Guide + Monthly Subscription",
      type: "sale",
      amount: 2.925,
      amountUSD: 58.5,
    },
    {
      id: "e12",
      transactionId: "7AbCdEfGhIjKlMnOpQrStUvWxYz1234567890AbCdEfGhIjKlMnOpQrStUv",
      date: "2023-12-12T13:47:09Z",
      username: "david_marketer",
      description: "API Integration Guide + Monthly Subscription",
      type: "level_1",
      amount: 0.325,
      amountUSD: 6.5,
    },
  ]

  // Handle sorting
  const handleSort = (field: keyof Earning) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  // Filter and sort earnings
  const filteredAndSortedEarnings = mockEarnings
    .filter((earning) => {
      // Filter by search term
      const matchesSearch =
        earning.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        earning.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        earning.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        earning.type.toLowerCase().includes(searchTerm.toLowerCase())

      // Filter by date range
      const earningDate = new Date(earning.date)
      const matchesDateRange =
        (!dateRange.from || earningDate >= dateRange.from) && (!dateRange.to || earningDate <= dateRange.to)

      return matchesSearch && matchesDateRange
    })
    .sort((a, b) => {
      // Sort by selected field
      if (sortField === "date") {
        return sortDirection === "asc"
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime()
      }

      if (sortField === "amount" || sortField === "amountUSD") {
        return sortDirection === "asc" ? a[sortField] - b[sortField] : b[sortField] - a[sortField]
      }

      // Default string comparison for other fields
      return sortDirection === "asc"
        ? String(a[sortField]).localeCompare(String(b[sortField]))
        : String(b[sortField]).localeCompare(String(a[sortField]))
    })

  // Calculate totals by type
  const totalsByType = filteredAndSortedEarnings.reduce(
    (acc, earning) => {
      if (!acc[earning.type]) {
        acc[earning.type] = { sol: 0, usd: 0 }
      }
      acc[earning.type].sol += earning.amount
      acc[earning.type].usd += earning.amountUSD
      return acc
    },
    {} as Record<string, { sol: number; usd: number }>,
  )

  // Open transaction on Solscan
  const openOnSolscan = (transactionId: string) => {
    window.open(`https://solscan.io/tx/${transactionId}`, "_blank")
  }

  // Format earning type for display
  const formatEarningType = (type: string) => {
    switch (type) {
      case "sale":
        return "Total Direct Sales"
      case "level_1":
        return "Total Commissions: Levels 1 - ∞"
      case "level_2":
        return "Level 2 Commission"
      case "level_3":
        return "Level 3 Commission"
      default:
        return type
    }
  }

  // Format earning type for table display
  const formatEarningTypeForTable = (type: string) => {
    switch (type) {
      case "sale":
        return "Direct Sale"
      case "level_1":
        return "Level 1 Commission"
      case "level_2":
        return "Level 2 Commission"
      case "level_3":
        return "Level 3 Commission"
      default:
        return type
    }
  }

  // Format description by replacing " +" with ":"
  const formatDescription = (description: string) => {
    return description.replace(" +", ":")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Earning History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
          <Input
            placeholder="Search by username, description, or transaction ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
            {Object.entries(totalsByType).map(([type, totals]) => (
              <div key={type}>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{formatEarningType(type)}</h3>
                <p className="text-lg font-bold">
                  {totals.sol.toFixed(4)} SOL ({totals.usd.toFixed(2)} USD)
                </p>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground italic mt-1">
            <span className="font-medium text-blue-600 dark:text-blue-400">Reminder:</span> A "Direct Sale" means the
            Net Sale amount that goes directly to the product owner after Commissions and Fees.
          </p>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer" onClick={() => handleSort("date")}>
                  Transaction Date
                  {sortField === "date" && (
                    <ArrowUpDown className={`ml-2 h-4 w-4 inline ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                  )}
                </TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("username")}>
                  Earning Username
                  {sortField === "username" && (
                    <ArrowUpDown className={`ml-2 h-4 w-4 inline ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                  )}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("description")}>
                  Description
                  {sortField === "description" && (
                    <ArrowUpDown className={`ml-2 h-4 w-4 inline ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                  )}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("type")}>
                  Type
                  {sortField === "type" && (
                    <ArrowUpDown className={`ml-2 h-4 w-4 inline ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                  )}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("amount")}>
                  Amount
                  {sortField === "amount" && (
                    <ArrowUpDown className={`ml-2 h-4 w-4 inline ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                  )}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedEarnings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No earnings found
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedEarnings.map((earning) => (
                  <TableRow key={earning.id}>
                    <TableCell>{new Date(earning.date).toLocaleString()}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {earning.transactionId.substring(0, 8)}...
                      {earning.transactionId.substring(earning.transactionId.length - 8)}
                    </TableCell>
                    <TableCell>{earning.username}</TableCell>
                    <TableCell>{formatDescription(earning.description)}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                          earning.type === "sale"
                            ? "bg-green-100 text-green-800"
                            : earning.type === "level_1"
                              ? "bg-blue-100 text-blue-800"
                              : earning.type === "level_2"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-indigo-100 text-indigo-800"
                        }`}
                      >
                        {formatEarningTypeForTable(earning.type)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="link"
                        className="p-0 h-auto font-normal text-blue-600 hover:text-blue-800"
                        onClick={() => openOnSolscan(earning.transactionId)}
                      >
                        {earning.amount.toFixed(4)} SOL ({earning.amountUSD.toFixed(2)} USD)
                        <ExternalLink className="ml-1 h-3 w-3 inline" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
