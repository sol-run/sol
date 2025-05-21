"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/utils/currency"
import Link from "next/link"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowUp } from "lucide-react"
/* Add this after the imports */
import "./../../app/globals.css"

interface Product {
  id: string
  name: string
  category: string
  price: number
  salesCount: number
  creator: string
}

interface TopEarner {
  id: string
  username: string
  avatar: string
  earnings: number
}

const bestSellers: Product[] = [
  { id: "1", name: "Solana DeFi Mastery", category: "eBook", price: 0.5, salesCount: 120, creator: "defi_guru" },
  {
    id: "2",
    name: "NFT Creation Workshop",
    category: "Video Course",
    price: 1.2,
    salesCount: 95,
    creator: "nft_artist",
  },
  {
    id: "3",
    name: "Rust for Solana Developers",
    category: "eBook",
    price: 0.8,
    salesCount: 88,
    creator: "rust_expert",
  },
  { id: "4", name: "Solana dApp Templates", category: "Software", price: 2.5, salesCount: 72, creator: "dapp_dev" },
]

const additionalBestSellers = [
  {
    id: "5",
    name: "Solana Smart Contract Templates",
    category: "Software",
    price: 2.5,
    salesCount: 85,
    creator: "smart_contract_dev",
  },
  {
    id: "6",
    name: "Crypto Trading Strategies",
    category: "eBook",
    price: 1.5,
    salesCount: 78,
    creator: "crypto_trader",
  },
  {
    id: "7",
    name: "Web3 UX Design Course",
    category: "Video Course",
    price: 3.0,
    salesCount: 72,
    creator: "ux_expert",
  },
  { id: "8", name: "Solana Ecosystem Overview", category: "eBook", price: 0.8, salesCount: 68, creator: "sol_analyst" },
  {
    id: "9",
    name: "NFT Marketing Masterclass",
    category: "Video Course",
    price: 2.2,
    salesCount: 65,
    creator: "nft_marketer",
  },
  { id: "10", name: "DeFi Yield Farming Guide", category: "eBook", price: 1.2, salesCount: 62, creator: "defi_guru" },
  {
    id: "11",
    name: "Blockchain Security Essentials",
    category: "Video Course",
    price: 2.8,
    salesCount: 58,
    creator: "security_expert",
  },
  {
    id: "12",
    name: "Solana dApp Development Kit",
    category: "Software",
    price: 3.5,
    salesCount: 55,
    creator: "dapp_wizard",
  },
  {
    id: "13",
    name: "Crypto Wallet UI Templates",
    category: "Software",
    price: 1.8,
    salesCount: 52,
    creator: "ui_designer",
  },
  {
    id: "14",
    name: "Tokenomics Fundamentals",
    category: "eBook",
    price: 1.0,
    salesCount: 48,
    creator: "token_economist",
  },
  {
    id: "15",
    name: "Solana Validator Setup Guide",
    category: "eBook",
    price: 1.5,
    salesCount: 45,
    creator: "validator_pro",
  },
  {
    id: "16",
    name: "Web3 Social Media Platform Template",
    category: "Software",
    price: 4.0,
    salesCount: 42,
    creator: "social_dev",
  },
  {
    id: "17",
    name: "Crypto Tax Reporting Tool",
    category: "Software",
    price: 2.5,
    salesCount: 38,
    creator: "crypto_accountant",
  },
  {
    id: "18",
    name: "Solana Gaming SDK",
    category: "Software",
    price: 3.2,
    salesCount: 35,
    creator: "blockchain_gamer",
  },
  {
    id: "19",
    name: "NFT Marketplace Template",
    category: "Software",
    price: 3.8,
    salesCount: 32,
    creator: "nft_developer",
  },
  {
    id: "20",
    name: "Decentralized Identity Solutions",
    category: "eBook",
    price: 1.2,
    salesCount: 30,
    creator: "identity_expert",
  },
]

const topEarners: TopEarner[] = [
  { id: "1", username: "defi_guru", avatar: "https://picsum.photos/seed/user1/200", earnings: 12.5 },
  { id: "2", username: "nft_artist", avatar: "https://picsum.photos/seed/user2/200", earnings: 10.8 },
  { id: "3", username: "rust_expert", avatar: "https://picsum.photos/seed/user3/200", earnings: 9.2 },
  { id: "4", username: "dapp_dev", avatar: "https://picsum.photos/seed/user4/200", earnings: 8.7 },
  { id: "5", username: "smart_contract_dev", avatar: "https://picsum.photos/seed/user5/200", earnings: 7.9 },
  { id: "6", username: "crypto_trader", avatar: "https://picsum.photos/seed/user6/200", earnings: 7.5 },
  { id: "7", username: "ux_expert", avatar: "https://picsum.photos/seed/user7/200", earnings: 6.8 },
  { id: "8", username: "sol_analyst", avatar: "https://picsum.photos/seed/user8/200", earnings: 6.2 },
  { id: "9", username: "nft_marketer", avatar: "https://picsum.photos/seed/user9/200", earnings: 5.9 },
  { id: "10", username: "validator_pro", avatar: "https://picsum.photos/seed/user10/200", earnings: 5.5 },
]

// Default avatar path
const DEFAULT_AVATAR = "/images/default-avatar.png"

export default function BestSellers() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer) return

    let animationFrameId: number
    let scrollPosition = 0
    const scrollSpeed = 0.5 // pixels per frame

    const scroll = () => {
      if (!isPaused && scrollContainer) {
        scrollPosition += scrollSpeed
        if (scrollPosition >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
          scrollPosition = 0
        }
        scrollContainer.scrollLeft = scrollPosition
      }
      animationFrameId = requestAnimationFrame(scroll)
    }

    animationFrameId = requestAnimationFrame(scroll)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [isPaused])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }
  return (
    <>
      <section className="py-16 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl">
            <div className="relative pb-[56.25%] h-0">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/1jzROE6EhxM"
                title="Platform Overview Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-2 text-gray-800 dark:text-white">Top Earners</h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
            All-time rankings based on total earnings since registration
          </p>
          <div className="relative">
            <div
              ref={scrollContainerRef}
              className="overflow-x-auto pb-6"
              style={{
                paddingTop: "10px",
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(113, 113, 122, 0.2) transparent",
              }}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <style jsx>{`
                div::-webkit-scrollbar {
                  height: 8px;
                }
                div::-webkit-scrollbar-track {
                  background: transparent;
                }
                div::-webkit-scrollbar-thumb {
                  background-color: rgba(113, 113, 122, 0.2);
                  border-radius: 20px;
                }
              `}</style>
              <div className="flex space-x-10 min-w-max px-8 py-6">
                {topEarners.map((earner, index) => (
                  <div key={earner.id} className="flex-none w-72 relative mt-6 ml-2">
                    <div className="absolute -left-2 -top-4 w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold shadow-lg z-10 border-2 border-white dark:border-gray-800">
                      {index + 1}
                    </div>
                    <Card className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="relative h-16 w-16 rounded-full overflow-hidden">
                            <Image
                              src={index === 0 ? DEFAULT_AVATAR : earner.avatar || DEFAULT_AVATAR}
                              alt={`${earner.username}'s avatar`}
                              fill
                              style={{ objectFit: "cover" }}
                              className="rounded-full"
                            />
                          </div>
                          <div>
                            <Link
                              href={`/creator/${earner.username}`}
                              className="text-base font-semibold hover:underline text-gray-900 dark:text-white"
                            >
                              @{earner.username}
                            </Link>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xl font-bold text-gray-900 dark:text-white">
                            {earner.earnings.toFixed(2)} SOL
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{formatCurrency(earner.earnings)}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-16 bg-[#F3F4F6] dark:bg-gray-800">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 dark:text-white mb-6 md:mb-8">
            Best Selling Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {bestSellers.map((product) => (
              <Card key={product.id} className="flex flex-col dark:bg-gray-700 h-full">
                <div className="relative h-32 sm:h-40 w-full">
                  <Image
                    src={`https://picsum.photos/seed/${product.id}/400/300`}
                    alt={product.name}
                    fill
                    style={{ objectFit: "cover" }}
                    className="rounded-t-lg"
                  />
                </div>
                <CardHeader className="p-3 md:p-6">
                  <CardTitle className="text-base md:text-lg dark:text-white line-clamp-2">{product.name}</CardTitle>
                  <Link
                    href={`/creator/${product.creator}`}
                    className="text-xs md:text-sm text-blue-600 hover:underline dark:text-blue-400 text-left w-full"
                  >
                    Owner: @{product.creator}
                  </Link>
                  <Badge variant="secondary" className="dark:bg-gray-600 dark:text-gray-200 text-xs">
                    {product.category}
                  </Badge>
                </CardHeader>
                <CardContent className="p-3 md:p-6 pt-0 md:pt-0">
                  <p className="text-xs md:text-sm text-gray-500 dark:text-gray-300">{product.category}</p>
                  <p className="text-base md:text-lg mt-2 dark:text-white">
                    <span className="font-bold">{formatCurrency(product.price).split(" (")[0]}</span>
                    <span className="text-xs md:text-sm font-normal">
                      {" "}
                      ({formatCurrency(product.price).split(" (")[1]}
                    </span>
                  </p>
                </CardContent>
                <CardFooter className="mt-auto p-3 md:p-6 pt-0 md:pt-0">
                  <Link href={`/product/${product.id}`} className="w-full">
                    <Button className="w-full h-9 text-sm dark:bg-purple-600 dark:text-white dark:hover:bg-purple-700">
                      View Details
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="text-center mt-6 md:mt-8">
            <Button onClick={() => setIsDialogOpen(true)} className="h-10 px-4 py-2 text-sm md:text-base">
              View More (Top 20)
            </Button>
          </div>
          <Dialog open={isDialogOpen}>
            <DialogContent className="max-w-[95vw] md:max-w-4xl max-h-[80vh] overflow-y-auto p-4 md:p-6">
              <DialogHeader>
                <DialogTitle className="text-lg md:text-xl">Top 20 Best Sellers This Month</DialogTitle>
              </DialogHeader>
              <div className="overflow-x-auto -mx-4 md:mx-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">Rank</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead className="hidden md:table-cell">Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead className="hidden md:table-cell">Sales</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bestSellers.concat(additionalBestSellers).map((product, index) => (
                      <TableRow key={product.id}>
                        <TableCell className="text-center">{index + 1}</TableCell>
                        <TableCell className="max-w-[120px] md:max-w-none">
                          <div className="truncate">{product.name}</div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{product.category}</TableCell>
                        <TableCell>
                          <div className="text-xs md:text-sm">{formatCurrency(product.price).split(" (")[0]}</div>
                          <div className="text-xs text-muted-foreground hidden md:block">
                            ({formatCurrency(product.price).split(" (")[1]}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{product.salesCount}</TableCell>
                        <TableCell>
                          <Link href={`/product/${product.id}`} passHref>
                            <Button size="sm" className="h-8 text-xs px-2">
                              View
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </DialogContent>
          </Dialog>
          {showBackToTop && (
            <Button
              className="fixed bottom-4 right-4 rounded-full p-2 z-50 shadow-lg"
              onClick={scrollToTop}
              aria-label="Back to top"
            >
              <ArrowUp className="h-5 w-5" />
            </Button>
          )}
        </div>
      </section>
    </>
  )
}
