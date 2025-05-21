"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatCurrency } from "@/utils/currency"
import Image from "next/image"
import Link from "next/link"
import { ChevronDown, ChevronUp } from "lucide-react"

// Mock data for products
const products = [
  {
    id: 1,
    name: "Solana Basics eBook",
    category: "eBook",
    price: 0.5,
    image: "/placeholder.svg?height=200&width=200",
    creator: "solana_expert",
    salesCount: 100,
  },
  {
    id: 2,
    name: "Advanced Solana Course",
    category: "Video",
    price: 2.5,
    image: "/placeholder.svg?height=200&width=200",
    creator: "blockchain_guru",
    salesCount: 50,
  },
  {
    id: 3,
    name: "Solana NFT Collection",
    category: "NFT",
    price: 1.0,
    image: "/placeholder.svg?height=200&width=200",
    creator: "nft_artist",
    salesCount: 75,
  },
  {
    id: 4,
    name: "Solana DApp Templates",
    category: "Software",
    price: 3.0,
    image: "/placeholder.svg?height=200&width=200",
    creator: "developer_pro",
    salesCount: 25,
  },
  {
    id: 5,
    name: "Solana Trading Strategies",
    category: "eBook",
    price: 1.5,
    image: "/placeholder.svg?height=200&width=200",
    creator: "trading_expert",
    salesCount: 120,
  },
  {
    id: 6,
    name: "Solana Smart Contract Workshop",
    category: "Video",
    price: 4.0,
    image: "/placeholder.svg?height=200&width=200",
    creator: "smart_contract_dev",
    salesCount: 30,
  },
]

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState<"newest" | "bestSelling" | "price">("newest")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  const sortProducts = (products: any[]) => {
    return [...products].sort((a, b) => {
      if (sortBy === "newest") {
        return sortOrder === "desc" ? b.id - a.id : a.id - b.id
      } else if (sortBy === "bestSelling") {
        return sortOrder === "desc" ? b.salesCount - a.salesCount : a.salesCount - b.salesCount
      } else if (sortBy === "price") {
        return sortOrder === "desc" ? b.price - a.price : a.price - b.price
      }
      return 0
    })
  }

  const filteredProducts = sortProducts(
    products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (categoryFilter === "all" || product.category === categoryFilter),
    ),
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Browse Products</h1>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
        <div className="flex items-center space-x-4">
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="eBook">eBooks</SelectItem>
              <SelectItem value="Video">Videos</SelectItem>
              <SelectItem value="NFT">NFTs</SelectItem>
              <SelectItem value="Software">Software</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium">Sort by:</span>
          <Select value={sortBy} onValueChange={(value: "newest" | "bestSelling" | "price") => setSortBy(value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="bestSelling">Best Selling</SelectItem>
              <SelectItem value="price">Price</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
            {sortOrder === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="flex flex-col">
            <CardHeader>
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                width={200}
                height={200}
                className="w-full h-48 object-cover mb-4"
              />
              <CardTitle className="text-lg">{product.name}</CardTitle>
              <Link
                href={`/creator/${product.creator}`}
                className="text-sm text-gray-600 hover:text-purple-600 transition-colors duration-200"
              >
                <strong>Creator / Seller:</strong> {product.creator}
              </Link>
              <p className="text-xs text-gray-500 mt-1">
                <strong>Affiliates Compensation Plan:</strong>
                <br />
                Gross Commissions (20%) | Levels (2)
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">{product.category}</p>
              <p className="text-lg font-bold mt-2">{formatCurrency(product.price)}</p>
            </CardContent>
            <CardFooter className="mt-auto">
              <Link href={`/product/${product.id}`} className="w-full">
                <Button className="w-full">View Details</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
