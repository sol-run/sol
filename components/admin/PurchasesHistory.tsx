"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range"
import { ArrowUpDown, ExternalLink } from "lucide-react"

interface Purchase {
  id: string
  transactionId: string
  date: string
  sellerUsername: string
  affiliateUsername: string | null
  customerUsername: string
  productName: string
  amount: number
  amountUSD: number
  status: "completed" | "pending" | "failed"
}

export function PurchasesHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<keyof Purchase>("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })

  // Mock data
  const mockPurchases: Purchase[] = [
    {
      id: "p1",
      transactionId: "3AbCdEfGhIjKlMnOpQrStUvWxYz1234567890AbCdEfGhIjKlMnOpQrStUvWxYz",
      date: "2023-12-15T16:42:18Z",
      sellerUsername: "alice_creator",
      affiliateUsername: "charlie_affiliate",
      customerUsername: "david_marketer",
      productName: "Advanced Marketing Course",
      amount: 5.75,
      amountUSD: 115,
      status: "completed",
    },
    {
      id: "p2",
      transactionId: "5GhIjKlMnOpQrStUvWxYz1234567890AbCdEfGhIjKlMnOpQrStUvWxYz123456",
      date: "2023-12-15T14:23:05Z",
      sellerUsername: "bob_seller",
      affiliateUsername: null,
      customerUsername: "emma_developer",
      productName: "Web3 Development Masterclass",
      amount: 8.25,
      amountUSD: 165,
      status: "completed",
    },
    {
      id: "p3",
      transactionId: "7KlMnOpQrStUvWxYz1234567890AbCdEfGhIjKlMnOpQrStUvWxYz12345678",
      date: "2023-12-14T11:37:52Z",
      sellerUsername: "frank_coach",
      affiliateUsername: "isabel_mentor",
      customerUsername: "grace_writer",
      productName: "Content Creation Pro",
      amount: 4.5,
      amountUSD: 90,
      status: "completed",
    },
    {
      id: "p4",
      transactionId: "9OpQrStUvWxYz1234567890AbCdEfGhIjKlMnOpQrStUvWxYz1234567890A",
      date: "2023-12-14T09:15:33Z",
      sellerUsername: "henry_designer",
      affiliateUsername: "charlie_affiliate",
      customerUsername: "jack_consultant",
      productName: "UI/UX Design System",
      amount: 6.35,
      amountUSD: 127,
      status: "completed",
    },
    {
      id: "p5",
      transactionId: "2StUvWxYz1234567890AbCdEfGhIjKlMnOpQrStUvWxYz1234567890AbCd",
      date: "2023-12-13T18:29:47Z",
      sellerUsername: "alice_creator",
      affiliateUsername: "bob_seller",
      customerUsername: "karen_student",
      productName: "Advanced Marketing Course",
      amount: 5.75,
      amountUSD: 115,
      status: "completed",
    },
    {
      id: "p6",
      transactionId: "4WxYzAbCdEfGhIjKlMnOpQrStUvWxYz1234567890AbCdEfGhIjKlMnOpQr",
      date: "2023-12-13T15:11:28Z",
      sellerUsername: "frank_coach",
      affiliateUsername: null,
      customerUsername: "liam_entrepreneur",
      productName: "Business Growth Strategies",
      amount: 9.95,
      amountUSD: 199,
      status: "completed",
    },
    {
      id: "p7",
      transactionId: "6AbCdEfGhIjKlMnOpQrStUvWxYz1234567890AbCdEfGhIjKlMnOpQrStUv",
      date: "2023-12-12T13:47:09Z",
      sellerUsername: "emma_developer",
      affiliateUsername: "david_marketer",
      customerUsername: "mia_freelancer",
      productName: "API Integration Guide",
      amount: 3.25,
      amountUSD: 65,
      status: "completed",
    },
    {
      id: "p8",
      transactionId: "8EfGhIjKlMnOpQrStUvWxYz1234567890AbCdEfGhIjKlMnOpQrStUvWxYz",
      date: "2023-12-12T10:33:51Z",
      sellerUsername: "grace_writer",
      affiliateUsername: "isabel_mentor",
      customerUsername: "noah_blogger",
      productName: "SEO Writing Masterclass",
      amount: 4.85,
      amountUSD: 97,
      status: "completed",
    },
    {
      id: "p9",
      transactionId: "1IjKlMnOpQrStUvWxYz1234567890AbCdEfGhIjKlMnOpQrStUvWxYz1234",
      date: "2023-12-11T16:19:32Z",
      sellerUsername: "bob_seller",
      affiliateUsername: "alice_creator",
      customerUsername: "olivia_coach",
      productName: "Web3 Development Masterclass",
      amount: 8.25,
      amountUSD: 165,
      status: "completed",
    },
    {
      id: "p10",
      transactionId: "3MnOpQrStUvWxYz1234567890AbCdEfGhIjKlMnOpQrStUvWxYz12345678",
      date: "2023-12-11T09:05:14Z",
      sellerUsername: "henry_designer",
      affiliateUsername: null,
      customerUsername: "peter_artist",
      productName: "UI/UX Design System",
      amount: 6.35,
      amountUSD: 127,
      status: "completed",
    },
  ]

  // Handle sorting
  const handleSort = (field: keyof Purchase) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  // Filter and sort purchases
  const filteredAndSortedPurchases = mockPurchases
    .filter((purchase) => {
      // Filter by search term
      const matchesSearch =
        purchase.sellerUsername.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (purchase.affiliateUsername && purchase.affiliateUsername.toLowerCase().includes(searchTerm.toLowerCase())) ||
        purchase.customerUsername.toLowerCase().includes(searchTerm.toLowerCase()) ||
        purchase.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        purchase.transactionId.toLowerCase().includes(searchTerm.toLowerCase())

      // Filter by date range
      const purchaseDate = new Date(purchase.date)
      const matchesDateRange =
        (!dateRange.from || purchaseDate >= dateRange.from) && (!dateRange.to || purchaseDate <= dateRange.to)

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

      // Handle null affiliate usernames for sorting
      if (sortField === "affiliateUsername") {
        if (a.affiliateUsername === null && b.affiliateUsername === null) return 0
        if (a.affiliateUsername === null) return sortDirection === "asc" ? -1 : 1
        if (b.affiliateUsername === null) return sortDirection === "asc" ? 1 : -1
      }

      // Default string comparison for other fields
      const aValue = a[sortField] === null ? "" : String(a[sortField])
      const bValue = b[sortField] === null ? "" : String(b[sortField])

      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    })

  // Open transaction on Solscan
  const openOnSolscan = (transactionId: string) => {
    window.open(`https://solscan.io/tx/${transactionId}`, "_blank")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Purchases History</CardTitle>
        {filteredAndSortedPurchases.length > 0 && (
          <div className="text-sm text-muted-foreground mt-1">
            Total: {filteredAndSortedPurchases.reduce((sum, purchase) => sum + purchase.amount, 0).toFixed(4)} SOL (
            {filteredAndSortedPurchases.reduce((sum, purchase) => sum + purchase.amountUSD, 0).toFixed(2)} USD)
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
          <Input
            placeholder="Search by username, product, or transaction ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
        </div>

        <div className="rounded-md border overflow-x-auto">
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
                <TableHead className="cursor-pointer" onClick={() => handleSort("sellerUsername")}>
                  Seller
                  {sortField === "sellerUsername" && (
                    <ArrowUpDown className={`ml-2 h-4 w-4 inline ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                  )}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("affiliateUsername")}>
                  Affiliate
                  {sortField === "affiliateUsername" && (
                    <ArrowUpDown className={`ml-2 h-4 w-4 inline ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                  )}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("customerUsername")}>
                  Customer
                  {sortField === "customerUsername" && (
                    <ArrowUpDown className={`ml-2 h-4 w-4 inline ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                  )}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("productName")}>
                  Product
                  {sortField === "productName" && (
                    <ArrowUpDown className={`ml-2 h-4 w-4 inline ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                  )}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("amount")}>
                  Amount
                  {sortField === "amount" && (
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
              {filteredAndSortedPurchases.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4">
                    No purchases found
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedPurchases.map((purchase) => (
                  <TableRow key={purchase.id}>
                    <TableCell>{new Date(purchase.date).toLocaleString()}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {purchase.transactionId.substring(0, 8)}...
                      {purchase.transactionId.substring(purchase.transactionId.length - 8)}
                    </TableCell>
                    <TableCell>{purchase.sellerUsername}</TableCell>
                    <TableCell>{purchase.affiliateUsername || "-"}</TableCell>
                    <TableCell>{purchase.customerUsername}</TableCell>
                    <TableCell>{purchase.productName}</TableCell>
                    <TableCell>
                      <Button
                        variant="link"
                        className="p-0 h-auto font-normal text-blue-600 hover:text-blue-800"
                        onClick={() => openOnSolscan(purchase.transactionId)}
                      >
                        {purchase.amount.toFixed(4)} SOL ({purchase.amountUSD.toFixed(2)} USD)
                        <ExternalLink className="ml-1 h-3 w-3 inline" />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          purchase.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : purchase.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1)}
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
