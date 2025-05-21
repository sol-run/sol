"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronLeft, ChevronRight, Download, FileText, ImageIcon, Film } from "lucide-react"

interface ProductFile {
  id: string
  fileName: string
  fileType: string
  fileSize: number
  caption: string
}

interface ProductPost {
  id: string
  timestamp: Date
  files: ProductFile[]
  caption: string
}

interface Product {
  id: number
  name: string
  posts: ProductPost[]
}

// This is a mock function to simulate fetching product data
const fetchProductData = async (id: string): Promise<Product> => {
  // In a real application, this would be an API call
  return {
    id: Number.parseInt(id),
    name: "Sample Product",
    posts: [
      {
        id: "1",
        timestamp: new Date(),
        files: [
          { id: "1", fileName: "document.pdf", fileType: "application/pdf", fileSize: 1024000, caption: "User manual" },
          { id: "2", fileName: "image.jpg", fileType: "image/jpeg", fileSize: 2048000, caption: "Product image" },
        ],
        caption: "Welcome to your product! Here are some files to get you started.",
      },
      {
        id: "2",
        timestamp: new Date(Date.now() - 86400000), // 1 day ago
        files: [
          { id: "3", fileName: "video.mp4", fileType: "video/mp4", fileSize: 10240000, caption: "Tutorial video" },
        ],
        caption: "Check out this tutorial video for more information on how to use the product.",
      },
    ],
  }
}

export default function ProductAccessPage() {
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [currentPostIndex, setCurrentPostIndex] = useState(0)

  useEffect(() => {
    const loadProduct = async () => {
      if (params.id) {
        const productData = await fetchProductData(params.id as string)
        setProduct(productData)
      }
    }
    loadProduct()
  }, [params.id])

  if (!product) {
    return <div>Loading...</div>
  }

  const currentPost = product.posts[currentPostIndex]

  const handlePreviousPost = () => {
    setCurrentPostIndex((prevIndex) => Math.max(0, prevIndex - 1))
  }

  const handleNextPost = () => {
    setCurrentPostIndex((prevIndex) => Math.min(product.posts.length - 1, prevIndex + 1))
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) return <ImageIcon className="h-6 w-6" />
    if (fileType.startsWith("video/")) return <Film className="h-6 w-6" />
    return <FileText className="h-6 w-6" />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Access: {product.name}</h1>
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <Button variant="outline" onClick={handlePreviousPost} disabled={currentPostIndex === 0}>
              <ChevronLeft className="h-4 w-4 mr-2" /> Previous
            </Button>
            <span>{new Date(currentPost.timestamp).toLocaleString()}</span>
            <Button variant="outline" onClick={handleNextPost} disabled={currentPostIndex === product.posts.length - 1}>
              Next <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{currentPost.caption}</p>
          <ScrollArea className="h-[300px] w-full rounded-md border p-4">
            {currentPost.files.map((file) => (
              <div key={file.id} className="flex items-center justify-between mb-4 p-2 border rounded">
                <div className="flex items-center space-x-2">
                  {getFileIcon(file.fileType)}
                  <div>
                    <p className="font-semibold">{file.fileName}</p>
                    <p className="text-sm text-gray-500">{file.caption}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" /> Download
                </Button>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
