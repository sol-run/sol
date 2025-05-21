"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronLeft, ImageIcon, Video, FileArchive, FileText, Download } from "lucide-react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

// Updated posts data with real files
const postsData = [
  {
    title: "Porsche Cayenne S - Black Edition",
    date: "2023-11-15",
    time: "14:30",
    attachmentsCount: 3,
    description:
      "Explore the sleek and powerful Porsche Cayenne S in stunning black finish with sport package. This luxury SUV combines performance, style, and versatility in one impressive package.",
    attachments: [
      { name: "Porsche Cayenne - Front View", url: "/files/porsche-front.jpg", type: "image" },
      { name: "Porsche Cayenne - Side View", url: "/files/porsche-side.jpg", type: "image" },
      { name: "Porsche Cayenne - Rear View", url: "/files/porsche-rear.jpg", type: "image" },
    ],
  },
  {
    title: "Stop Wasting Your Time - Productivity Masterclass",
    date: "2023-12-05",
    time: "10:00",
    attachmentsCount: 1,
    description:
      "Learn how to maximize your productivity and stop wasting time on activities that don't contribute to your goals. This masterclass provides practical strategies for time management, focus, and achieving more in less time.",
    attachments: [
      { name: "Stop Wasting Your Time.mp4", url: "/files/stop-wasting-your-time.mp4", type: "video" },
      {
        name: "J. Cole - Kevin's Heart.mp3",
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/J.%20Cole%20-%20Kevin%27s%20Heart-h3DJXgsWPnqyf9TdzDCQPrAUnV8fEn.mp3",
        type: "audio",
      },
    ],
  },
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
]

// Mock function to fetch product data
const fetchProductData = async (id: string) => {
  // In a real app, this would be an API call
  return {
    id: Number(id),
    name: "Video Course: Advanced Solana",
  }
}

export default function ProductFilesViewPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<any>(null)
  const [selectedPost, setSelectedPost] = useState<any>(null)
  const [showPostList, setShowPostList] = useState(true)
  const [currentAttachmentIndex, setCurrentAttachmentIndex] = useState(0)
  const [sortOption, setSortOption] = useState("newest")
  const [previewFile, setPreviewFile] = useState<any>(null)
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false)
  const [currentPreviewPost, setCurrentPreviewPost] = useState<any>(null)
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0)

  useEffect(() => {
    const loadProduct = async () => {
      if (params.id) {
        const productData = await fetchProductData(params.id as string)
        setProduct(productData)
      }
    }
    loadProduct()
  }, [params.id])

  const handleNextAttachment = () => {
    if (selectedPost) {
      setCurrentAttachmentIndex((prevIndex) => (prevIndex === selectedPost.attachments.length - 1 ? 0 : prevIndex + 1))
    }
  }

  const handlePreviousAttachment = () => {
    if (selectedPost) {
      setCurrentAttachmentIndex((prevIndex) => (prevIndex === 0 ? selectedPost.attachments.length - 1 : prevIndex - 1))
    }
  }

  const handlePreviewNext = () => {
    if (currentPreviewPost) {
      const nextIndex = (currentPreviewIndex + 1) % currentPreviewPost.attachments.length
      setCurrentPreviewIndex(nextIndex)
      setPreviewFile(currentPreviewPost.attachments[nextIndex])
    }
  }

  const handlePreviewPrevious = () => {
    if (currentPreviewPost) {
      const prevIndex = currentPreviewIndex === 0 ? currentPreviewPost.attachments.length - 1 : currentPreviewIndex - 1
      setCurrentPreviewIndex(prevIndex)
      setPreviewFile(currentPreviewPost.attachments[prevIndex])
    }
  }

  const openPostDetails = (post) => {
    setSelectedPost(post)
    setShowPostList(false)
    setCurrentAttachmentIndex(0)
  }

  const openAttachmentPreview = (post, attachIndex) => {
    setCurrentPreviewPost(post)
    setCurrentPreviewIndex(attachIndex)
    setPreviewFile(post.attachments[attachIndex])
    setPreviewDialogOpen(true)
  }

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case "image":
        return <ImageIcon className="h-6 w-6" />
      case "video":
        return <Video className="h-6 w-6" />
      case "audio":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <path d="M17.5 4H18a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-.5"></path>
            <path d="M6.5 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h.5"></path>
            <rect width="10" height="16" x="7" y="4" rx="2"></rect>
            <circle cx="12" cy="12" r="2"></circle>
          </svg>
        )
      case "zip":
        return <FileArchive className="h-6 w-6" />
      default:
        return <FileText className="h-6 w-6" />
    }
  }

  // Sort posts based on the selected option
  const sortedPosts = [...postsData].sort((a, b) => {
    switch (sortOption) {
      case "newest":
        return new Date(`${b.date} ${b.time}`).getTime() - new Date(`${a.date} ${a.time}`).getTime()
      case "oldest":
        return new Date(`${a.date} ${a.time}`).getTime() - new Date(`${b.date} ${b.time}`).getTime()
      case "mostFiles":
        return b.attachmentsCount - a.attachmentsCount
      case "leastFiles":
        return a.attachmentsCount - b.attachmentsCount
      default:
        return 0
    }
  })

  if (!product) {
    return <div className="container mx-auto py-8">Loading...</div>
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => router.push("/dashboard?tab=purchased")} className="mr-2">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <CardTitle className="text-2xl">Files & Downloads: {product.name}</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            {!showPostList && (
              <Button variant="outline" onClick={() => setShowPostList(true)}>
                Back to List
              </Button>
            )}
            <div className="ml-auto">
              <Select defaultValue="newest" onValueChange={(value) => setSortOption(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="mostFiles">Most Files</SelectItem>
                  <SelectItem value="leastFiles">Least Files</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <ScrollArea className="h-[70vh]">
            {showPostList ? (
              <div className="space-y-4">
                {sortedPosts.map((post, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:bg-accent/5 flex justify-between">
                    <div className="flex-1 pr-4">
                      <h3
                        className="text-lg font-semibold cursor-pointer hover:text-primary hover:underline transition-colors"
                        onClick={() => openPostDetails(post)}
                      >
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Published on {post.date} at {post.time}
                      </p>
                      <p className="text-sm my-2">
                        {post.description.length > 100 ? `${post.description.substring(0, 100)}...` : post.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3 mb-2">
                        {post.attachments.map((attachment, attachIndex) => (
                          <div
                            key={attachIndex}
                            className="w-12 h-12 border rounded flex items-center justify-center cursor-pointer hover:bg-accent/10"
                            onClick={() => {
                              setCurrentPreviewPost(post)
                              setCurrentPreviewIndex(attachIndex)
                              setPreviewFile(attachment)
                              setPreviewDialogOpen(true)
                            }}
                          >
                            {attachment.type === "image" ? (
                              <div className="relative w-10 h-10 overflow-hidden">
                                <Image
                                  src={attachment.url || "/placeholder.svg?height=40&width=40"}
                                  alt={attachment.name}
                                  width={40}
                                  height={40}
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              getFileIcon(attachment.type)
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Button variant="outline" size="sm" onClick={() => openPostDetails(post)}>
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-xl font-bold">{selectedPost.title}</h3>
                <p className="text-sm text-muted-foreground">
                  Published on {selectedPost.date} at {selectedPost.time}
                </p>
                <p>{selectedPost.description}</p>
                <div className="space-y-2">
                  <h4 className="font-semibold">Attachments:</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {selectedPost.attachments.map((attachment, attachIndex) => (
                      <div
                        key={attachIndex}
                        className="border rounded-lg p-3 flex flex-col items-center cursor-pointer hover:bg-accent/10 transition-colors"
                        onClick={() => openAttachmentPreview(selectedPost, attachIndex)}
                      >
                        <div className="w-16 h-16 flex items-center justify-center mb-2">
                          {attachment.type === "image" ? (
                            <div className="relative w-full h-full overflow-hidden rounded">
                              <Image
                                src={attachment.url || "/placeholder.svg?height=64&width=64"}
                                alt={attachment.name}
                                width={64}
                                height={64}
                                className="object-cover"
                              />
                            </div>
                          ) : attachment.type === "video" ? (
                            <div className="bg-accent/10 rounded-full p-3">
                              <Video className="h-8 w-8" />
                            </div>
                          ) : (
                            <div className="bg-accent/10 rounded-full p-3">{getFileIcon(attachment.type)}</div>
                          )}
                        </div>
                        <span className="text-xs text-center font-medium truncate w-full">{attachment.name}</span>
                        <span className="text-xs text-muted-foreground uppercase">{attachment.type}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
      {/* File Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent
          className="sm:max-w-[800px]"
          showNavigation={currentPreviewPost && currentPreviewPost.attachments.length > 1}
          onPrevious={handlePreviewPrevious}
          onNext={handlePreviewNext}
        >
          <DialogHeader>
            <DialogTitle>
              {previewFile?.name}
              {currentPreviewPost && (
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  ({currentPreviewIndex + 1} of {currentPreviewPost.attachments.length})
                </span>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-4">
            {previewFile?.type === "image" ? (
              <div className="relative w-full h-[400px]">
                <Image
                  src={previewFile.url || "/placeholder.svg?height=400&width=600"}
                  alt={previewFile.name}
                  fill
                  className="object-contain"
                />
              </div>
            ) : previewFile?.type === "video" ? (
              <video src={previewFile.url} controls className="max-h-[400px] w-auto" />
            ) : previewFile?.type === "audio" ? (
              <div className="flex flex-col items-center justify-center p-10">
                <div className="bg-accent/10 p-8 rounded-full mb-4">{getFileIcon(previewFile?.type)}</div>
                <p className="text-lg font-medium mb-4">{previewFile?.name}</p>
                <audio src={previewFile.url} controls className="w-full" />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-10">
                <div className="bg-accent/10 p-8 rounded-full mb-4">{getFileIcon(previewFile?.type)}</div>
                <p className="text-lg font-medium">{previewFile?.name}</p>
                <p className="text-sm text-muted-foreground">{previewFile?.type.toUpperCase()} file</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewDialogOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                // Prevent multiple downloads
                if (previewFile?.url) {
                  try {
                    // For videos and images that are already loaded in the browser
                    if (previewFile.type === "video" || previewFile.type === "image") {
                      // Create a temporary anchor element
                      const link = document.createElement("a")
                      link.href = previewFile.url
                      link.download = previewFile.name
                      link.target = "_blank" // Open in new tab if direct download fails
                      link.rel = "noopener noreferrer"

                      // Append to body, click, and remove to prevent memory leaks
                      document.body.appendChild(link)
                      link.click()
                      setTimeout(() => {
                        document.body.removeChild(link)
                      }, 100)
                    } else {
                      // For other file types, open in a new tab
                      window.open(previewFile.url, "_blank", "noopener,noreferrer")
                    }
                  } catch (error) {
                    console.error("Download failed:", error)
                    // Fallback - open in new tab
                    window.open(previewFile.url, "_blank", "noopener,noreferrer")
                  }
                }
              }}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
