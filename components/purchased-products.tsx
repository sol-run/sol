"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { formatCurrency } from "@/utils/currency"
import { useCart } from "@/context/CartContext"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import Link from "next/link"

const calculateTimeLeft = (expiryDate: string) => {
  try {
    // Parse the date components
    const [year, month, day] = expiryDate.split("-").map((num) => Number.parseInt(num, 10))

    // Create date object (month is 0-indexed in JavaScript)
    const expiry = new Date(year, month - 1, day, 23, 59, 59)
    const now = new Date()

    // Validate the date
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

const getTimeLeftForProduct = (expiryDate: string) => {
  return calculateTimeLeft(expiryDate)
}

export function PurchasedProducts() {
  const router = useRouter()
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft("2025-02-26"))
  const [isExtendAccessOpen, setIsExtendAccessOpen] = useState(false)
  const [selectedProductForExtension, setSelectedProductForExtension] = useState(null)
  const [selectedPriceOption, setSelectedPriceOption] = useState("") // Added state for selected price option

  const { addToCart } = useCart()

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft("2025-06-01"))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="space-y-4">
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Purchased Products</CardTitle>
          <CardDescription>View your purchased products and their details</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {[
              {
                id: 1,
                name: "eBook: Solana Basics",
                purchaseDate: "2023-05-15",
                expiryDate: "2023-11-15",
                price: 10,
                expired: true,
                postsCount: 2,
                filesCount: 5,
              },
              {
                id: 2,
                name: "Video Course: Advanced Solana",
                purchaseDate: "2023-06-01",
                expiryDate: "2025-06-01",
                price: 40,
                expired: false,
                postsCount: 8,
                filesCount: 24,
              },
              {
                id: 3,
                name: "NFT Collection: Solana Gems",
                purchaseDate: "2023-06-20",
                expiryDate: "2025-05-07",
                price: 20,
                expired: false,
                postsCount: 4,
                filesCount: 12,
              },
              {
                id: 4,
                name: "Solana DApp Templates",
                purchaseDate: "2023-07-05",
                expiryDate: "2023-10-05",
                price: 30,
                expired: true,
                postsCount: 6,
                filesCount: 18,
              },
            ].map((product, index) => (
              <li
                key={index}
                className={`flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 gap-4 ${product.expired ? "opacity-50" : ""}`}
              >
                <div className="w-full">
                  <h3 className="font-semibold">
                    {product.name} {product.expired && <span className="text-red-500">(Expired)</span>}
                  </h3>
                  <p className="text-sm text-gray-500">
                    <span className="font-bold">Purchased on:</span> {product.purchaseDate}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-bold">Total Amount Paid:</span> {formatCurrency(product.price || 0, 4)}
                  </p>
                  <div className="flex flex-wrap gap-x-4 text-sm text-gray-500">
                    <p>
                      <span className="font-bold">Posts</span>:{" "}
                      <span className="font-medium">{product.postsCount}</span>
                    </p>
                    <p>
                      <span className="font-bold">Files</span>:{" "}
                      <span className="font-medium">{product.filesCount}</span>
                    </p>
                  </div>
                  <p className="text-sm text-gray-500">
                    <span className="font-bold">Expires on:</span> {product.expiryDate}{" "}
                    {!product.expired &&
                      (() => {
                        const productTimeLeft = getTimeLeftForProduct(product.expiryDate)
                        return `(${productTimeLeft.days} days | ${productTimeLeft.hours} hrs | ${productTimeLeft.minutes} min | ${productTimeLeft.seconds} sec left)`
                      })()}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full sm:w-auto">
                  {product.expired ? (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled
                      className="whitespace-normal text-center h-auto min-h-[2.5rem] py-2"
                    >
                      Files & Downloads
                    </Button>
                  ) : (
                    <Link
                      href={`/product-files-view/${product.id}`}
                      className="inline-flex items-center justify-center whitespace-normal text-center h-auto min-h-[2.5rem] py-2 px-4 rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                    >
                      Files & Downloads
                    </Link>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="whitespace-normal text-center h-auto min-h-[2.5rem] py-2"
                    onClick={() => {
                      setSelectedProductForExtension(product)
                      setIsExtendAccessOpen(true)
                    }}
                  >
                    Renew / Extend Access
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

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
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select extension package" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    { name: "Basic Extension - 0.5 SOL - 10 USD", duration: "1 month", priceSOL: 0.5, priceUSD: 10 },
                    {
                      name: "Standard Extension - 1.2 SOL - 24 USD",
                      duration: "3 months",
                      priceSOL: 1.2,
                      priceUSD: 24,
                    },
                    { name: "Premium Extension - 2 SOL - 40 USD", duration: "6 months", priceSOL: 2, priceUSD: 40 },
                    { name: "Annual Extension - 3.5 SOL - 70 USD", duration: "1 year", priceSOL: 3.5, priceUSD: 70 },
                  ].map((option) => (
                    <SelectItem key={option.name} value={option.name}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                if (selectedProductForExtension) {
                  console.log(`Extending access for ${selectedProductForExtension.name}`)
                  addToCart({
                    id: selectedProductForExtension.id,
                    name: `${selectedProductForExtension.name} (Extension)`,
                    thumbnail: "/placeholder.svg",
                    sellerUsername: "Original Seller",
                    price: Number(selectedPriceOption.split(" - ")[1].split(" ")[0]),
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
    </div>
  )
}
