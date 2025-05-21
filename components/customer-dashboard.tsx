"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ChevronLeft, ChevronRight, ImageIcon, Video, FileArchive, FileText } from "lucide-react"
import Image from "next/image"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const calculateTimeLeft = (expiryDate: string) => {
  const difference = +new Date(expiryDate) - +new Date()
  let timeLeft = {}

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    }
  }

  return timeLeft
}

const formatCurrency = (amount: number, decimals: number) => {
  return amount.toFixed(decimals)
}

export function CustomerDashboard() {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft("2025-02-26"))
  const [isFilesDialogOpen, setIsFilesDialogOpen] = useState(false)
  const [isExtendAccessOpen, setIsExtendAccessOpen] = useState(false)
  const [selectedProductForExtension, setSelectedProductForExtension] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isProductFilesDialogOpen, setIsProductFilesDialogOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)
  const [currentAttachmentIndex, setCurrentAttachmentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft("2025-02-26"))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleNextAttachment = () => {
    setCurrentAttachmentIndex((prevIndex) => (prevIndex === selectedPost.attachments.length - 1 ? 0 : prevIndex + 1))
  }

  const handlePreviousAttachment = () => {
    setCurrentAttachmentIndex((prevIndex) => (prevIndex === 0 ? selectedPost.attachments.length - 1 : prevIndex - 1))
  }

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case "image":
        return <ImageIcon className="h-6 w-6" />
      case "video":
        return <Video className="h-6 w-6" />
      case "zip":
        return <FileArchive className="h-6 w-6" />
      default:
        return <FileText className="h-6 w-6" />
    }
  }

  return (
    <div className="space-y-4">
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Purchase History</CardTitle>
          <CardDescription>View your purchased products and their details</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {[
              {
                name: "eBook: Solana Basics",
                earnings: 250.5,
                purchaseDate: "2023-05-15",
                expiryDate: "2023-11-15",
                commissionRate: "20%",
                price: 10,
                joined: false,
                expired: true,
              },
              {
                name: "Video Course: Advanced Solana",
                earnings: 1200.75,
                purchaseDate: "2023-06-01",
                expiryDate: "2024-06-01",
                commissionRate: "25%",
                price: 40,
                joined: true,
                expired: false,
              },
              {
                name: "NFT Collection: Solana Gems",
                earnings: 500.25,
                purchaseDate: "2023-06-20",
                expiryDate: "2024-06-20",
                commissionRate: "15%",
                price: 20,
                joined: false,
                expired: false,
              },
              {
                name: "Solana DApp Templates",
                earnings: 750.0,
                purchaseDate: "2023-07-05",
                expiryDate: "2023-10-05",
                commissionRate: "30%",
                price: 30,
                joined: false,
                expired: true,
              },
            ].map((product, index) => (
              <li
                key={index}
                className={`flex justify-between items-center border-b pb-2 ${product.expired ? "opacity-50" : ""}`}
              >
                <div>
                  <h3 className="font-semibold">
                    {product.name} {product.expired && <span className="text-red-500">(Expired)</span>}
                  </h3>
                  <p className="text-sm text-gray-500">Purchased on: {product.purchaseDate}</p>
                  <p className="text-sm text-gray-500">Total Amount Paid: {formatCurrency(product.price || 0, 4)}</p>
                  <p className="text-sm text-gray-500">
                    Expires on: {product.expiryDate}{" "}
                    {!product.expired &&
                      `(${timeLeft.days} days | ${timeLeft.hours} hrs | ${timeLeft.minutes} min | ${timeLeft.seconds} sec left)`}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    disabled={product.expired}
                    onClick={() => {
                      if (!product.expired) {
                        setSelectedPost({
                          title: "Getting Started with Solana",
                          date: "2023-07-15",
                          time: "14:30",
                          description: "An introduction to Solana blockchain development.",
                          attachments: [
                            { name: "solana-basics.pdf", url: "#", type: "pdf" },
                            { name: "code-samples.zip", url: "#", type: "zip" },
                          ],
                        })
                        setIsProductFilesDialogOpen(true)
                      }
                    }}
                  >
                    Files & Downloads
                  </Button>
                  <Button
                    variant="outline"
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

      <Dialog open={isFilesDialogOpen} onOpenChange={setIsFilesDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Files & Downloads</DialogTitle>
          </DialogHeader>
          <div className="flex justify-between items-center mb-4">
            <Button variant="outline" onClick={() => setSelectedPost(null)}>
              Back to List
            </Button>
          </div>
          <ScrollArea className="h-[60vh]">
            {selectedPost ? (
              <div className="space-y-4">
                <h3 className="text-xl font-bold">{selectedPost.title}</h3>
                <p className="text-sm text-muted-foreground">
                  Published on {selectedPost.date} at {selectedPost.time}
                </p>
                <p>{selectedPost.description}</p>
                <div className="space-y-2">
                  <h4 className="font-semibold">Attachments:</h4>
                  <div className="relative w-full h-64">
                    <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md z-10">
                      {currentAttachmentIndex + 1} of {selectedPost.attachments.length}
                    </div>
                    {selectedPost.attachments.map((attachment, index) => (
                      <div
                        key={index}
                        className={`absolute top-0 left-0 w-full h-full transition-opacity duration-300 ${
                          index === currentAttachmentIndex ? "opacity-100" : "opacity-0 pointer-events-none"
                        }`}
                      >
                        {attachment.type === "image" ? (
                          <Image
                            src={attachment.url || "/placeholder.svg"}
                            alt={attachment.name}
                            layout="fill"
                            objectFit="contain"
                          />
                        ) : attachment.type === "video" ? (
                          <video src={attachment.url} controls className="w-full h-full object-contain" />
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full">
                            {getFileIcon(attachment.type)}
                            <span className="mt-2">{attachment.name}</span>
                          </div>
                        )}
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute top-1/2 left-2 transform -translate-y-1/2"
                      onClick={handlePreviousAttachment}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute top-1/2 right-2 transform -translate-y-1/2"
                      onClick={handleNextAttachment}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>{selectedPost.attachments[currentAttachmentIndex].name}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        console.log(`Downloading ${selectedPost.attachments[currentAttachmentIndex].name}`)
                      }
                    >
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {[
                  {
                    title: "Getting Started with Solana",
                    date: "2023-07-15",
                    time: "14:30",
                    attachmentsCount: 2,
                    description: "An introduction to Solana blockchain development.",
                    attachments: [
                      { name: "solana-basics.pdf", url: "#", type: "pdf" },
                      { name: "code-samples.zip", url: "#", type: "zip" },
                    ],
                  },
                  {
                    title: "Advanced Solana Programming Techniques",
                    date: "2023-07-20",
                    time: "10:00",
                    attachmentsCount: 3,
                    description: "Deep dive into advanced Solana programming concepts.",
                    attachments: [
                      { name: "advanced-techniques.pdf", url: "#", type: "pdf" },
                      { name: "example-project.zip", url: "#", type: "zip" },
                      { name: "presentation-slides.pptx", url: "#", type: "pptx" },
                    ],
                  },
                  // Add more mock posts as needed
                ].map((post, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <h3 className="text-lg font-semibold">{post.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Published on {post.date} at {post.time}
                    </p>
                    <p className="text-sm">Attachments: {post.attachmentsCount}</p>
                    <Button variant="outline" size="sm" onClick={() => setSelectedPost(post)}>
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

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
              <Select onValueChange={(value) => console.log(`Selected extension: ${value}`)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select extension package" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    { name: "Basic Extension", duration: "1 month", priceSOL: 0.5, priceUSD: 10 },
                    { name: "Standard Extension", duration: "3 months", priceSOL: 1.2, priceUSD: 24 },
                    { name: "Premium Extension", duration: "6 months", priceSOL: 2, priceUSD: 40 },
                    { name: "Annual Extension", duration: "1 year", priceSOL: 3.5, priceUSD: 70 },
                  ].map((option) => (
                    <SelectItem key={option.name} value={option.name}>
                      {option.name} - {option.duration} - {option.priceSOL} SOL (${option.priceUSD} USD)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                console.log(`Extending access for ${selectedProductForExtension?.name}`)
                setIsExtendAccessOpen(false)
              }}
            >
              Confirm Extension
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isProductFilesDialogOpen} onOpenChange={setIsProductFilesDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader className="flex justify-between items-center">
            <DialogTitle>Files & Downloads</DialogTitle>
            {selectedPost && (
              <Button variant="outline" size="sm" onClick={() => setSelectedPost(null)}>
                Back to list
              </Button>
            )}
          </DialogHeader>
          {selectedPost ? (
            <div className="space-y-4">
              <h3 className="text-xl font-bold">{selectedPost.title}</h3>
              <p className="text-sm text-muted-foreground">
                Published on {selectedPost.date} at {selectedPost.time}
              </p>
              <p>{selectedPost.description}</p>
              <div className="space-y-2">
                <h4 className="font-semibold">Attachments:</h4>
                {selectedPost.attachments.map((attachment, index) => (
                  <div key={index} className="flex justify-between items-center p-2 border rounded">
                    <span>{attachment.name}</span>
                    <Button variant="outline" size="sm" onClick={() => console.log(`Downloading ${attachment.name}`)}>
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {[
                {
                  title: "Getting Started with Solana",
                  date: "2023-07-15",
                  time: "14:30",
                  attachmentsCount: 2,
                  description: "An introduction to Solana blockchain development.",
                },
                {
                  title: "Advanced Solana Programming Techniques",
                  date: "2023-07-20",
                  time: "10:00",
                  attachmentsCount: 3,
                  description: "Deep dive into advanced Solana programming concepts.",
                },
                // Add more mock posts as needed
              ].map((post, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <h3 className="text-lg font-semibold">{post.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Published on {post.date} at {post.time}
                  </p>
                  <p className="text-sm">Attachments: {post.attachmentsCount}</p>
                  <Button variant="outline" size="sm" onClick={() => setSelectedPost(post)}>
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
