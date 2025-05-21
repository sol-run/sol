"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react"
import { formatCurrency } from "@/utils/currency"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface AffiliateProgram {
  productName: string
  salesCount: number
  commissionsEarned: number
}

interface AffiliateData {
  username: string
  totalUnitsSold: number
  totalCommissionsEarned: number
  joinDate: string
  affiliatePrograms: number
  programDetails: AffiliateProgram[]
}

const mockAffiliateData: AffiliateData[] = [
  {
    username: "alice_crypto",
    totalUnitsSold: 150,
    totalCommissionsEarned: 750.5,
    joinDate: "2022-03-15",
    affiliatePrograms: 8,
    programDetails: [
      { productName: "Crypto Trading Course", salesCount: 45, commissionsEarned: 225.0 },
      { productName: "NFT Masterclass", salesCount: 30, commissionsEarned: 150.5 },
      { productName: "DeFi Strategies", salesCount: 25, commissionsEarned: 125.0 },
      { productName: "Blockchain Basics", salesCount: 20, commissionsEarned: 100.0 },
      { productName: "Web3 Development", salesCount: 10, commissionsEarned: 50.0 },
      { productName: "Metaverse Guide", salesCount: 8, commissionsEarned: 40.0 },
      { productName: "Crypto Tax Guide", salesCount: 7, commissionsEarned: 35.0 },
      { productName: "Smart Contract Security", salesCount: 5, commissionsEarned: 25.0 },
    ],
  },
  {
    username: "bob_blockchain",
    totalUnitsSold: 120,
    totalCommissionsEarned: 600.25,
    joinDate: "2022-05-22",
    affiliatePrograms: 5,
    programDetails: [
      { productName: "Blockchain Fundamentals", salesCount: 40, commissionsEarned: 200.0 },
      { productName: "Smart Contract Development", salesCount: 30, commissionsEarned: 150.0 },
      { productName: "Crypto Portfolio Management", salesCount: 25, commissionsEarned: 125.25 },
      { productName: "Web3 Integration", salesCount: 15, commissionsEarned: 75.0 },
      { productName: "Decentralized Apps", salesCount: 10, commissionsEarned: 50.0 },
    ],
  },
  {
    username: "charlie_nft",
    totalUnitsSold: 200,
    totalCommissionsEarned: 1000.75,
    joinDate: "2021-11-10",
    affiliatePrograms: 12,
    programDetails: [
      { productName: "NFT Creation Workshop", salesCount: 50, commissionsEarned: 250.0 },
      { productName: "Digital Art Masterclass", salesCount: 35, commissionsEarned: 175.0 },
      { productName: "NFT Marketplace Guide", salesCount: 30, commissionsEarned: 150.0 },
      { productName: "Crypto Art History", salesCount: 20, commissionsEarned: 100.0 },
      { productName: "Metaverse Real Estate", salesCount: 15, commissionsEarned: 75.0 },
      { productName: "NFT Marketing Strategies", salesCount: 10, commissionsEarned: 50.0 },
      { productName: "Blockchain for Artists", salesCount: 10, commissionsEarned: 50.0 },
      { productName: "NFT Legal Guide", salesCount: 8, commissionsEarned: 40.0 },
      { productName: "Digital Collectibles", salesCount: 7, commissionsEarned: 35.0 },
      { productName: "Virtual Gallery Setup", salesCount: 5, commissionsEarned: 25.0 },
      { productName: "NFT Authentication", salesCount: 5, commissionsEarned: 25.0 },
      { productName: "Web3 for Creators", salesCount: 5, commissionsEarned: 25.75 },
    ],
  },
  {
    username: "david_defi",
    totalUnitsSold: 80,
    totalCommissionsEarned: 400.0,
    joinDate: "2023-01-05",
    affiliatePrograms: 3,
    programDetails: [
      { productName: "DeFi Yield Farming", salesCount: 35, commissionsEarned: 175.0 },
      { productName: "Liquidity Pool Strategies", salesCount: 25, commissionsEarned: 125.0 },
      { productName: "Staking Masterclass", salesCount: 20, commissionsEarned: 100.0 },
    ],
  },
  {
    username: "eve_eth",
    totalUnitsSold: 180,
    totalCommissionsEarned: 900.5,
    joinDate: "2022-08-30",
    affiliatePrograms: 9,
    programDetails: [
      { productName: "Ethereum Development", salesCount: 40, commissionsEarned: 200.0 },
      { productName: "Solidity Programming", salesCount: 35, commissionsEarned: 175.0 },
      { productName: "Gas Optimization", salesCount: 25, commissionsEarned: 125.0 },
      { productName: "ERC-20 Token Creation", salesCount: 20, commissionsEarned: 100.0 },
      { productName: "Ethereum 2.0 Guide", salesCount: 15, commissionsEarned: 75.0 },
      { productName: "Layer 2 Solutions", salesCount: 15, commissionsEarned: 75.0 },
      { productName: "Smart Contract Auditing", salesCount: 12, commissionsEarned: 60.0 },
      { productName: "DApp Development", salesCount: 10, commissionsEarned: 50.0 },
      { productName: "Web3.js Mastery", salesCount: 8, commissionsEarned: 40.5 },
    ],
  },
]

export function AffiliateStatistics() {
  const [affiliates, setAffiliates] = useState<AffiliateData[]>(mockAffiliateData)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortColumn, setSortColumn] = useState<
    "totalUnitsSold" | "totalCommissionsEarned" | "joinDate" | "affiliatePrograms"
  >("totalCommissionsEarned")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [selectedPeriod, setSelectedPeriod] = useState("all")
  const [expandedAffiliate, setExpandedAffiliate] = useState<string | null>(null)
  const [programDetailsPeriod, setProgramDetailsPeriod] = useState("all")

  const filterAffiliatesByPeriod = (affiliates: AffiliateData[], period: string) => {
    const now = new Date()
    return affiliates.map((affiliate) => {
      let factor = 1
      switch (period) {
        case "today":
          factor = 1 / 365
          break
        case "week":
          factor = 7 / 365
          break
        case "month":
          factor = 30 / 365
          break
        case "year":
          factor = 1
          break
        default:
          factor = 1
      }
      return {
        ...affiliate,
        totalUnitsSold: Math.floor(affiliate.totalUnitsSold * factor),
        totalCommissionsEarned: affiliate.totalCommissionsEarned * factor,
        programDetails: affiliate.programDetails.map((program) => ({
          ...program,
          salesCount: Math.floor(program.salesCount * factor),
          commissionsEarned: program.commissionsEarned * factor,
        })),
      }
    })
  }

  const filteredAffiliates = filterAffiliatesByPeriod(affiliates, selectedPeriod).filter((affiliate) =>
    affiliate.username.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalAffiliatesRevenue = filteredAffiliates.reduce(
    (sum, affiliate) => sum + affiliate.totalCommissionsEarned,
    0,
  )

  const handleSort = (column: "totalUnitsSold" | "totalCommissionsEarned" | "joinDate" | "affiliatePrograms") => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("desc")
    }
  }

  const sortedAffiliates = [...filteredAffiliates].sort((a, b) => {
    if (sortColumn === "joinDate") {
      const dateA = new Date(a.joinDate).getTime()
      const dateB = new Date(b.joinDate).getTime()
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA
    } else {
      if (sortDirection === "asc") {
        return a[sortColumn] - b[sortColumn]
      } else {
        return b[sortColumn] - a[sortColumn]
      }
    }
  })

  const toggleExpandAffiliate = (username: string) => {
    if (expandedAffiliate === username) {
      setExpandedAffiliate(null)
    } else {
      setExpandedAffiliate(username)
    }
  }

  const filterProgramDetailsByPeriod = (programs: AffiliateProgram[], period: string) => {
    let factor = 1
    switch (period) {
      case "today":
        factor = 1 / 365
        break
      case "week":
        factor = 7 / 365
        break
      case "month":
        factor = 30 / 365
        break
      case "year":
        factor = 1
        break
      default:
        factor = 1
    }

    return programs.map((program) => ({
      ...program,
      salesCount: Math.floor(program.salesCount * factor),
      commissionsEarned: program.commissionsEarned * factor,
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Affiliate Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <Input
            placeholder="Search affiliates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <div className="flex items-center space-x-4">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-sm">
              <strong>Total Affiliates Revenue:</strong>
              <br />
              <span className="font-medium">{formatCurrency(totalAffiliatesRevenue)}</span>
            </div>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Username</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("joinDate")}>
                Join Date
                <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("affiliatePrograms")}>
                Affiliate Programs
                <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("totalUnitsSold")}>
                Total Units Sold
                <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("totalCommissionsEarned")}>
                Total Commissions Earned
                <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAffiliates.map((affiliate, index) => (
              <>
                <TableRow key={affiliate.username}>
                  <TableCell className="font-medium text-center">{index + 1}</TableCell>
                  <TableCell>{affiliate.username}</TableCell>
                  <TableCell>{new Date(affiliate.joinDate).toLocaleDateString()}</TableCell>
                  <TableCell
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => toggleExpandAffiliate(affiliate.username)}
                  >
                    <div className="flex items-center justify-between">
                      <span>{affiliate.affiliatePrograms}</span>
                      {expandedAffiliate === affiliate.username ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{affiliate.totalUnitsSold}</TableCell>
                  <TableCell>{formatCurrency(affiliate.totalCommissionsEarned)}</TableCell>
                </TableRow>
                {expandedAffiliate === affiliate.username && (
                  <TableRow>
                    <TableCell colSpan={6} className="bg-muted/30 p-4">
                      <div className="mb-3 flex justify-between items-center">
                        <h4 className="font-medium text-sm">Program Details for {affiliate.username}</h4>
                        <RadioGroup
                          className="flex space-x-4"
                          defaultValue={programDetailsPeriod}
                          onValueChange={setProgramDetailsPeriod}
                        >
                          <div className="flex items-center space-x-1">
                            <RadioGroupItem value="all" id="all" />
                            <Label htmlFor="all" className="text-xs">
                              All Time
                            </Label>
                          </div>
                          <div className="flex items-center space-x-1">
                            <RadioGroupItem value="year" id="year" />
                            <Label htmlFor="year" className="text-xs">
                              Year
                            </Label>
                          </div>
                          <div className="flex items-center space-x-1">
                            <RadioGroupItem value="month" id="month" />
                            <Label htmlFor="month" className="text-xs">
                              Month
                            </Label>
                          </div>
                          <div className="flex items-center space-x-1">
                            <RadioGroupItem value="week" id="week" />
                            <Label htmlFor="week" className="text-xs">
                              Week
                            </Label>
                          </div>
                          <div className="flex items-center space-x-1">
                            <RadioGroupItem value="today" id="today" />
                            <Label htmlFor="today" className="text-xs">
                              Today
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Product Name</TableHead>
                            <TableHead>Sales Count</TableHead>
                            <TableHead>Commissions Earned</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filterProgramDetailsByPeriod(affiliate.programDetails, programDetailsPeriod)
                            .sort((a, b) => b.commissionsEarned - a.commissionsEarned)
                            .map((program, index) => (
                              <TableRow key={`${affiliate.username}-${index}`}>
                                <TableCell>{program.productName}</TableCell>
                                <TableCell>{program.salesCount}</TableCell>
                                <TableCell>{formatCurrency(program.commissionsEarned)}</TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
