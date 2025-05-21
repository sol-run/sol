"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range"
import { ArrowUpDown, ExternalLink } from "lucide-react"

interface Withdrawal {
  id: string
  transactionId: string
  username: string
  date: string
  amount: number
  amountUSD: number
  adminFee: number
  adminFeeUSD: number
  status: "completed" | "pending" | "failed"
}

export function WithdrawalsHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<keyof Withdrawal>("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })

  // Mock data
  const mockWithdrawals: Withdrawal[] = [
    {
      id: "w1",
      transactionId: "5UBnRZrCnxSiN5mZfxHEpkKHuXh8K2qXYcuVnzVTQZXjnEpQiL3aBcDeFgHiJkLmN",
      username: "alice_creator",
      date: "2023-12-15T14:32:45Z",
      amount: 25.5,
      amountUSD: 510,
      adminFee: 0.765,
      adminFeeUSD: 15.3,
      status: "completed",
    },
    {
      id: "w2",
      transactionId: "7WXnYZrAbCdEfGhIjKlMnOpQrStUvWxYzAbCdEfGhIjKlMnOpQrStUvWxYz1234",
      username: "bob_seller",
      date: "2023-12-14T09:17:22Z",
      amount: 12.75,
      amountUSD: 255,
      adminFee: 0.3825,
      adminFeeUSD: 7.65,
      status: "completed",
    },
    {
      id: "w3",
      transactionId: "9AbCdEfGhIjKlMnOpQrStUvWxYz1234567890AbCdEfGhIjKlMnOpQrStUvWxYz",
      username: "charlie_affiliate",
      date: "2023-12-13T18:05:11Z",
      amount: 8.4,
      amountUSD: 168,
      adminFee: 0.252,
      adminFeeUSD: 5.04,
      status: "completed",
    },
    {
      id: "w4",
      transactionId: "2MnOpQrStUvWxYz1234567890AbCdEfGhIjKlMnOpQrStUvWxYz123456789",
      username: "david_marketer",
      date: "2023-12-12T11:42:37Z",
      amount: 42.0,
      amountUSD: 840,
      adminFee: 1.26,
      adminFeeUSD: 25.2,
      status: "completed",
    },
    {
      id: "w5",
      transactionId: "4KlMnOpQrStUvWxYz1234567890AbCdEfGhIjKlMnOpQrStUvWxYz12345678",
      username: "emma_developer",
      date: "2023-12-11T15:29:58Z",
      amount: 15.3,
      amountUSD: 306,
      adminFee: 0.459,
      adminFeeUSD: 9.18,
      status: "completed",
    },
    {
      id: "w6",
      transactionId: "6GhIjKlMnOpQrStUvWxYz1234567890AbCdEfGhIjKlMnOpQrStUvWxYz1234567",
      username: "frank_coach",
      date: "2023-12-10T08:14:26Z",
      amount: 33.75,
      amountUSD: 675,
      adminFee: 1.0125,
      adminFeeUSD: 20.25,
      status: "completed",
    },
    {
      id: "w7",
      transactionId: "8EfGhIjKlMnOpQrStUvWxYz1234567890AbCdEfGhIjKlMnOpQrStUvWxYz123456",
      username: "grace_writer",
      date: "2023-12-09T16:51:03Z",
      amount: 19.8,
      amountUSD: 396,
      adminFee: 0.594,
      adminFeeUSD: 11.88,
      status: "completed",
    },
    {
      id: "w8",
      transactionId: "1YzAbCdEfGhIjKlMnOpQrStUvWxYz1234567890AbCdEfGhIjKlMnOpQrStUvWx",
      username: "henry_designer",
      date: "2023-12-08T13:37:49Z",
      amount: 27.9,
      amountUSD: 558,
      adminFee: 0.837,
      adminFeeUSD: 16.74,
      status: "completed",
    },
    {
      id: "w9",
      transactionId: "3WxYzAbCdEfGhIjKlMnOpQrStUvWxYz1234567890AbCdEfGhIjKlMnOpQrStUv",
      username: "isabel_mentor",
      date: "2023-12-07T10:23:15Z",
      amount: 51.45,
      amountUSD: 1029,
      adminFee: 1.5435,
      adminFeeUSD: 30.87,
      status: "completed",
    },
    {
      id: "w10",
      transactionId: "5UvWxYzAbCdEfGhIjKlMnOpQrStUvWxYz1234567890AbCdEfGhIjKlMnOpQrSt",
      username: "jack_consultant",
      date: "2023-12-06T17:09:32Z",
      amount: 38.25,
      amountUSD: 765,
      adminFee: 1.1475,
      adminFeeUSD: 22.95,
      status: "completed",
    },
  ]

  // Handle sorting
  const handleSort = (field: keyof Withdrawal) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  // Filter and sort withdrawals
  const filteredAndSortedWithdrawals = mockWithdrawals
    .filter((withdrawal) => {
      // Filter by search term
      const matchesSearch =
        withdrawal.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        withdrawal.transactionId.toLowerCase().includes(searchTerm.toLowerCase())

      // Filter by date range
      const withdrawalDate = new Date(withdrawal.date)
      const matchesDateRange =
        (!dateRange.from || withdrawalDate >= dateRange.from) && (!dateRange.to || withdrawalDate <= dateRange.to)

      return matchesSearch && matchesDateRange
    })
    .sort((a, b) => {
      // Sort by selected field
      if (sortField === "date") {
        return sortDirection === "asc"
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime()
      }

      if (
        sortField === "amount" ||
        sortField === "amountUSD" ||
        sortField === "adminFee" ||
        sortField === "adminFeeUSD"
      ) {
        return sortDirection === "asc" ? a[sortField] - b[sortField] : b[sortField] - a[sortField]
      }

      // Default string comparison for other fields
      return sortDirection === "asc"
        ? String(a[sortField]).localeCompare(String(b[sortField]))
        : String(b[sortField]).localeCompare(String(a[sortField]))
    })

  // Open transaction on Solscan
  const openOnSolscan = (transactionId: string) => {
    window.open(`https://solscan.io/tx/${transactionId}`, "_blank")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Withdrawals History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
          <Input
            placeholder="Search by username or transaction ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
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
                <TableHead className="cursor-pointer" onClick={() => handleSort("amount")}>
                  Amount
                  {sortField === "amount" && (
                    <ArrowUpDown className={`ml-2 h-4 w-4 inline ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                  )}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("adminFee")}>
                  Admin Fee Earned
                  {sortField === "adminFee" && (
                    <ArrowUpDown className={`ml-2 h-4 w-4 inline ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                  )}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
                  Status
                  {sortField === "status" && (
                    <ArrowUpDown className={`ml-2 h-4 w-4 inline ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                  )}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedWithdrawals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No withdrawals found
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedWithdrawals.map((withdrawal) => (
                  <TableRow key={withdrawal.id}>
                    <TableCell>{new Date(withdrawal.date).toLocaleString()}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {withdrawal.transactionId.substring(0, 8)}...
                      {withdrawal.transactionId.substring(withdrawal.transactionId.length - 8)}
                    </TableCell>
                    <TableCell>{withdrawal.username}</TableCell>
                    <TableCell>
                      <Button
                        variant="link"
                        className="p-0 h-auto font-normal text-blue-600 hover:text-blue-800"
                        onClick={() => openOnSolscan(withdrawal.transactionId)}
                      >
                        {withdrawal.amount.toFixed(4)} SOL ({withdrawal.amountUSD.toFixed(2)} USD)
                        <ExternalLink className="ml-1 h-3 w-3 inline" />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="link"
                        className="p-0 h-auto font-normal text-blue-600 hover:text-blue-800"
                        onClick={() => openOnSolscan(withdrawal.transactionId)}
                      >
                        {withdrawal.adminFee.toFixed(4)} SOL ({withdrawal.adminFeeUSD.toFixed(2)} USD)
                        <ExternalLink className="ml-1 h-3 w-3 inline" />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          withdrawal.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : withdrawal.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
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
