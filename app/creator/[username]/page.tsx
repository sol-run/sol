"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/utils/currency"
import Link from "next/link"
import Image from "next/image"

// Mock data for creator's products
const creatorProducts = [
  {
    id: "1",
    name: "Solana DeFi Mastery",
    category: "eBook",
    price: 0.5,
    salesCount: 120,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "2",
    name: "Advanced Solana Programming",
    category: "Video Course",
    price: 1.5,
    salesCount: 80,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "3",
    name: "Solana Smart Contract Templates",
    category: "Software",
    price: 0.8,
    salesCount: 95,
    image: "/placeholder.svg?height=100&width=100",
  },
]

export default function CreatorProfile() {
  const params = useParams()
  const username = params.username as string

  // Mock data for creator stats
  const creatorStats = {
    totalProductsListed: 15,
    totalSalesRevenue: 2500,
    totalPaidToAffiliates: 250,
    totalEarningsAsAffiliate: 750,
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Creator Profile: @{username}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Total Products Listed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base font-normal">{creatorStats.totalProductsListed}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Total Sales Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base font-normal">{formatCurrency(creatorStats.totalSalesRevenue).split(" (")[0]}</p>
            <p className="text-sm text-muted-foreground">
              ({formatCurrency(creatorStats.totalSalesRevenue).split(" (")[1]}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Total Paid To Affiliates</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base font-normal">{formatCurrency(creatorStats.totalPaidToAffiliates).split(" (")[0]}</p>
            <p className="text-sm text-muted-foreground">
              ({formatCurrency(creatorStats.totalPaidToAffiliates).split(" (")[1]}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Total Earnings As Affiliate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base font-normal">
              {formatCurrency(creatorStats.totalEarningsAsAffiliate).split(" (")[0]}
            </p>
            <p className="text-sm text-muted-foreground">
              ({formatCurrency(creatorStats.totalEarningsAsAffiliate).split(" (")[1]}
            </p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Products by @{username}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {creatorProducts.map((product) => (
          <Card key={product.id} className="flex flex-col">
            <div className="relative h-40 w-full">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                fill
                style={{ objectFit: "cover" }}
                className="rounded-t-lg"
              />
            </div>
            <CardHeader>
              <CardTitle className="text-lg">{product.name}</CardTitle>
              <Badge variant="secondary">{product.category}</Badge>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-base text-purple-600">
                <span className="font-bold">{formatCurrency(product.price, 4).split(" (")[0]}</span>
                <span className="font-normal"> ({formatCurrency(product.price).split(" (")[1]}</span>
              </p>
              <p className="text-sm text-gray-600">{product.salesCount} sales</p>
            </CardContent>
            <div className="p-4 pt-0">
              <Link href={`/product/${product.id}`} className="w-full">
                <Button className="w-full">View Product</Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
