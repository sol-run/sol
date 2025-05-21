"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range"
import { ArrowUpDown, ExternalLink } from "lucide-react"

interface PlatformFee {
  id: string
  transactionId: string
  date: string
  username: string
  description: string
  feePercentage: number
  amount: number
  amountUSD: number
  type: "product_sale" | "withdrawal"
}

export function PlatformFeesEarned() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<keyof PlatformFee>("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })

  // Mock data
  const mockPlatformFees: PlatformFee[] = [
    {
      id: "f1",
      transactionId: "4AbCdEfGhIjKlMnOpQrStUvWxYz1234567890AbCdEfGhIjKlMnOpQrStUvWxYz",
      date: "2023-12-15T16:42:18Z",
      username: "david_marketer",
      description: "Advanced Marketing Course @ 5.00% Fee",
      feePercentage: 5.0,
      amount: 0.2875,
      amountUSD: 5.75,
      type: "product_sale",
    },
    {
      id: "f2",
      transactionId: "6GhIjKlMnOpQrStUvWxYz1234567890AbCdEfGhIjKlMnOpQrStUvWxYz123456",
      date: "2023-12-15T14:23:05Z",
      username: "emma_developer",
      description: "Web3 Development Masterclass @ 5.00% Fee",
      feePercentage: 5.0,
      amount: 0.4125,
      amountUSD: 8.25,
      type: "product_sale",
    },
    {
      id: "f3",
      transactionId: "5UBnRZrCnxSiN5mZfxHEpkKHuXh8K2qXYcuVnzVTQZXjnEpQiL3aBcDeFgHiJkLmN",
      date: "2023-12-15T14:32:45Z",
      username: "alice_creator",
      description: "Withdrawal @ 3.00% Fee",
      feePercentage: 3.0,
      amount: 0.765,
      amountUSD: 15.3,
      type: "withdrawal",
    },
    {
      id: "f4",
      transactionId: "8KlMnOpQrStUvWxYz1234567890AbCdEfGhIjKlMnOpQrStUvWxYz12345678",
      date: "2023-12-14T11:37:52Z",
      username: "grace_writer",
      description: "Content Creation Pro @ 5.00% Fee",
      feePercentage: 5.0,
      amount: 0.225,
      amountUSD: 4.5,
      type: "product_sale",
    },
    {
      id: "f5",
      transactionId: "1OpQrStUvWxYz1234567890AbCdEfGhIjKlMnOpQrStUvWxYz1234567890A",
      date: "2023-12-14T09:15:33Z",
      username: "jack_consultant",
      description: "UI/UX Design System @ 5.00% Fee",
      feePercentage: 5.0,
      amount: 0.3175,
      amountUSD: 6.35,
      type: "product_sale",
    },
    {
      id: "f6",
      transactionId: "7WXnYZrAbCdEfGhIjKlMnOpQrStUvWxYzAbCdEfGhIjKlMnOpQrStUvWxYz1234",
      date: "2023-12-14T09:17:22Z",
      username: "bob_seller",
      description: "Withdrawal @ 3.00% Fee",
      feePercentage: 3.0,
      amount: 0.3825,
      amountUSD: 7.65,
      type: "withdrawal",
    },
    {
      id: "f7",
      transactionId: "3StUvWxYz1234567890AbCdEfGhIjKlMnOpQrStUvWxYz1234567890AbCd",
      date: "2023-12-13T18:29:47Z",
      username: "karen_student",
      description: "Advanced Marketing Course @ 5.00% Fee",
      feePercentage: 5.0,
      amount: 0.2875,
      amountUSD: 5.75,
      type: "product_sale",
    },
    {
      id: "f8",
      transactionId: "5WxYzAbCdEfGhIjKlMnOpQrStUvWxYz1234567890AbCdEfGhIjKlMnOpQr",
      date: "2023-12-13T15:11:28Z",
      username: "liam_entrepreneur",
      description: "Business Growth Strategies @ 5.00% Fee",
      feePercentage: 5.0,
      amount: 0.4975,
      amountUSD: 9.95,
      type: "product_sale",
    },
    {
      id: "f9",
      transactionId: "9AbCdEfGhIjKlMnOpQrStUvWxYz1234567890AbCdEfGhIjKlMnOpQrStUvWxYz",
      date: "2023-12-13T18:05:11Z",
      username: "charlie_affiliate",
      description: "Withdrawal @ 3.00% Fee",
      feePercentage: 3.0,
      amount: 0.252,
      amountUSD: 5.04,
      type: "withdrawal",
    },
    {
      id: "f10",
      transactionId: "7AbCdEfGhIjKlMnOpQrStUvWxYz1234567890AbCdEfGhIjKlMnOpQrStUv",
      date: "2023-12-12T13:47:09Z",
      username: "mia_freelancer",
      description: "API Integration Guide @ 5.00% Fee",
      feePercentage: 5.0,
      amount: 0.1625,
      amountUSD: 3.25,
      type: "product_sale",
    },
  ]

  // Handle sorting
  const handleSort = (field: keyof PlatformFee) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  // Filter and sort platform fees
  const filteredAndSortedFees = mockPlatformFees
    .filter((fee) => {
      // Filter by search term
      const matchesSearch =
        fee.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fee.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fee.transactionId.toLowerCase().includes(searchTerm.toLowerCase())

      // Filter by date range
      const feeDate = new Date(fee.date)
      const matchesDateRange =
        (!dateRange.from || feeDate >= dateRange.from) && (!dateRange.to || feeDate <= dateRange.to)

      return matchesSearch && matchesDateRange
    })
    .sort((a, b) => {
      // Sort by selected field
      if (sortField === "date") {
        return sortDirection === "asc"
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime()
      }

      if (sortField === "amount" || sortField === "amountUSD" || sortField === "feePercentage") {
        return sortDirection === "asc" ? a[sortField] - b[sortField] : b[sortField] - a[sortField]
      }

      // Default string comparison for other fields
      return sortDirection === "asc"
        ? String(a[sortField]).localeCompare(String(b[sortField]))
        : String(b[sortField]).localeCompare(String(a[sortField]))
    })

  // Calculate totals
  const totalFees = filteredAndSortedFees.reduce((sum, fee) => sum + fee.amount, 0)
  const totalFeesUSD = filteredAndSortedFees.reduce((sum, fee) => sum + fee.amountUSD, 0)

  // Open transaction on Solscan
  const openOnSolscan = (transactionId: string) => {
    window.open(`https://solscan.io/tx/${transactionId}`, "_blank")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform Fees Earned</CardTitle>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Fees (Selected Period)</h3>
              <p className="text-2xl font-bold">
                {totalFees.toFixed(4)} SOL ({totalFeesUSD.toFixed(2)} USD)
              </p>
            </div>
          </div>
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
                  Username
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
                <TableHead className="cursor-pointer" onClick={() => handleSort("feePercentage")}>
                  Fee %
                  {sortField === "feePercentage" && (
                    <ArrowUpDown className={`ml-2 h-4 w-4 inline ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                  )}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("amount")}>
                  Fee Amount
                  {sortField === "amount" && (
                    <ArrowUpDown className={`ml-2 h-4 w-4 inline ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                  )}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("type")}>
                  Type
                  {sortField === "type" && (
                    <ArrowUpDown className={`ml-2 h-4 w-4 inline ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                  )}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedFees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    No platform fees found
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedFees.map((fee) => (
                  <TableRow key={fee.id}>
                    <TableCell>{new Date(fee.date).toLocaleString()}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {fee.transactionId.substring(0, 8)}...{fee.transactionId.substring(fee.transactionId.length - 8)}
                    </TableCell>
                    <TableCell>{fee.username}</TableCell>
                    <TableCell>{fee.description}</TableCell>
                    <TableCell>{fee.feePercentage.toFixed(2)}%</TableCell>
                    <TableCell>
                      <Button
                        variant="link"
                        className="p-0 h-auto font-normal text-blue-600 hover:text-blue-800"
                        onClick={() => openOnSolscan(fee.transactionId)}
                      >
                        {fee.amount.toFixed(4)} SOL ({fee.amountUSD.toFixed(2)} USD)
                        <ExternalLink className="ml-1 h-3 w-3 inline" />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          fee.type === "product_sale" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {fee.type === "product_sale" ? "Product Sale" : "Withdrawal"}
                      </span>
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
