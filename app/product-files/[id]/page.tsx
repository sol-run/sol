"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ProductFilesManager } from "@/components/product-files-manager"
import { ArrowLeft } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

// Mock data for products - in a real app, this would come from an API or database
const mockProducts = [
  {
    id: 1,
    name: "eBook: Solana Basics",
    price: 0.5,
    category: "eBooks",
    description: "Learn the basics of Solana",
    youtubeLink: "https://youtube.com/watch?v=example1",
    images: [],
    pricingOptions: [{ amount: "10", duration: "30", packageName: "1 Month Access" }],
    commissionLevels: [{ level: 1, percentage: "10" }],
    active: true,
    unitsSold: 100,
    totalSales: 50,
    paidToAffiliates: 5,
    totalProfit: 45,
    clientsCount: 25,
    posts: [],
  },
  {
    id: 2,
    name: "Video Course: Advanced Solana",
    price: 2.5,
    category: "Videos",
    description: "Advanced Solana programming techniques",
    youtubeLink: "https://youtube.com/watch?v=example2",
    images: [],
    pricingOptions: [{ amount: "50", duration: "365", packageName: "1 Year Access" }],
    commissionLevels: [
      { level: 1, percentage: "15" },
      { level: 2, percentage: "5" },
    ],
    active: true,
    unitsSold: 50,
    totalSales: 125,
    paidToAffiliates: 25,
    totalProfit: 100,
    clientsCount: 40,
    posts: [],
  },
  {
    id: 3,
    name: "NFT Collection: Solana Gems",
    price: 1.0,
    category: "Images",
    description: "Exclusive Solana-themed NFT collection",
    youtubeLink: "https://youtube.com/watch?v=example3",
    images: [],
    pricingOptions: [{ amount: "20", duration: "0", packageName: "Lifetime Access" }],
    commissionLevels: [{ level: 1, percentage: "20" }],
    active: false,
    unitsSold: 200,
    totalSales: 200,
    paidToAffiliates: 40,
    totalProfit: 160,
    clientsCount: 15,
    posts: [],
  },
]

// Mock seller data - in a real app, this would come from an API or database
const mockSellerData = {
  username: "solana_expert",
  balance: 5.75, // SOL balance
  email: "seller@example.com",
}

// Add a new state variable for the recipients dialog
// const [isRecipientsDialogOpen, setIsRecipientsDialogOpen] = useState(false);

// Add mock recipient data - in a real app, this would come from an API or database
const mockRecipients = [
  { email: "client1@example.com", name: "John Smith", purchaseDate: "2023-10-15" },
  { email: "client2@example.com", name: "Sarah Johnson", purchaseDate: "2023-10-18" },
  { email: "client3@example.com", name: "Michael Brown", purchaseDate: "2023-11-02" },
  { email: "client4@example.com", name: "Emily Davis", purchaseDate: "2023-11-05" },
  { email: "client5@example.com", name: "Robert Wilson", purchaseDate: "2023-11-10" },
  { email: "client6@example.com", name: "Jennifer Taylor", purchaseDate: "2023-11-12" },
  { email: "client7@example.com", name: "David Martinez", purchaseDate: "2023-11-15" },
  { email: "client8@example.com", name: "Lisa Anderson", purchaseDate: "2023-11-20" },
  { email: "client9@example.com", name: "James Thomas", purchaseDate: "2023-11-22" },
  { email: "client10@example.com", name: "Patricia Garcia", purchaseDate: "2023-11-25" },
  { email: "client11@example.com", name: "Richard Rodriguez", purchaseDate: "2023-11-28" },
  { email: "client12@example.com", name: "Elizabeth Lee", purchaseDate: "2023-12-01" },
  { email: "client13@example.com", name: "Charles Walker", purchaseDate: "2023-12-03" },
  { email: "client14@example.com", name: "Susan Hall", purchaseDate: "2023-12-05" },
  { email: "client15@example.com", name: "Joseph Allen", purchaseDate: "2023-12-08" },
  { email: "client16@example.com", name: "Margaret Young", purchaseDate: "2023-12-10" },
  { email: "client17@example.com", name: "Thomas King", purchaseDate: "2023-12-12" },
  { email: "client18@example.com", name: "Nancy Wright", purchaseDate: "2023-12-15" },
  { email: "client19@example.com", name: "Daniel Scott", purchaseDate: "2023-12-18" },
  { email: "client20@example.com", name: "Karen Green", purchaseDate: "2023-12-20" },
  { email: "client21@example.com", name: "Matthew Adams", purchaseDate: "2023-12-22" },
  { email: "client22@example.com", name: "Betty Baker", purchaseDate: "2023-12-25" },
  { email: "client23@example.com", name: "Donald Nelson", purchaseDate: "2023-12-28" },
  { email: "client24@example.com", name: "Dorothy Carter", purchaseDate: "2023-12-30" },
  { email: "client25@example.com", name: "Paul Mitchell", purchaseDate: "2024-01-02" },
]

export default function ProductFilesPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [product, setProduct] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAddingPost, setIsAddingPost] = useState(false)
  const [isUpdateClientsDialogOpen, setIsUpdateClientsDialogOpen] = useState(false)
  const [isEmailPreviewOpen, setIsEmailPreviewOpen] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [isUpdateClientsForPostDialogOpen, setIsUpdateClientsForPostDialogOpen] = useState(false)
  const [selectedPostForClientUpdate, setSelectedPostForClientUpdate] = useState<any>(null)
  const [isRecipientsDialogOpen, setIsRecipientsDialogOpen] = useState(false) // Initialize here
  const { toast } = useToast()

  const getFilesCount = (product) => {
    if (!product || !product.posts) {
      return 0
    }

    if (!Array.isArray(product.posts)) {
      return 0
    }

    let count = 0
    for (const post of product.posts) {
      if (post && post.files && Array.isArray(post.files)) {
        count += post.files.length
      }
    }
    return count
  }

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchProduct = () => {
      setIsLoading(true)
      try {
        // Ensure params.id is a valid number
        const productIdParam = params.id
        if (!productIdParam) {
          console.error("Invalid product ID parameter")
          router.push("/dashboard")
          return
        }

        const productId = Number.parseInt(productIdParam)

        if (isNaN(productId)) {
          console.error("Product ID is not a valid number")
          router.push("/dashboard")
          return
        }

        const foundProduct = mockProducts.find((p) => p.id === productId)

        if (foundProduct) {
          setProduct(foundProduct)
        } else {
          // Product not found, redirect back
          console.error("Product not found with ID:", productId)
          router.push("/dashboard")
        }
      } catch (error) {
        console.error("Error fetching product:", error)
        router.push("/dashboard")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [params.id, router])

  const handleSavePosts = (updatedPosts: any[]) => {
    // In a real app, this would be an API call to update the product
    setProduct((prev) => ({
      ...prev,
      posts: updatedPosts,
    }))

    // Here you would typically save to a database
    console.log("Saving updated posts:", updatedPosts)
  }

  const handleBack = () => {
    router.back()
  }

  const handleAddPost = () => {
    setIsAddingPost(true)
  }

  const handleCancelAddPost = () => {
    setIsAddingPost(false)
  }

  const handleUpdateClientsForPost = (post: any) => {
    setSelectedPostForClientUpdate(post)
    setIsUpdateClientsForPostDialogOpen(true)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center h-64">
              <p>Loading product files...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center h-64">
              <p>Product not found</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isAddingPost) {
    return (
      <div className="container mx-auto py-8">
        <Card className="mb-6 max-w-5xl mx-auto w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center">
              <Button variant="ghost" onClick={handleCancelAddPost} className="mr-2">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Product Files
              </Button>
              <div>
                <CardTitle className="text-2xl">Add New Post</CardTitle>
                <CardDescription>{product.name}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ProductFilesManager
              productId={product.id}
              initialPosts={product.posts || []}
              onSave={handleSavePosts}
              fullPageMode={true}
              onCancel={handleCancelAddPost}
            />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center">
            <Button variant="ghost" onClick={handleBack} className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <CardTitle className="text-2xl">Manage Product Files</CardTitle>
              <CardDescription>{product.name}</CardDescription>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            {product.posts ? product.posts.length : 0} posts | {getFilesCount(product)} files |{" "}
            {product.clientsCount || 0} clients
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center">
            <Button onClick={handleAddPost}>Add New Post</Button>
          </div>
          <ProductFilesManager
            productId={product.id}
            initialPosts={product.posts || []}
            onSave={handleSavePosts}
            fullPageMode={false}
            hideAddButton={true}
            onUpdateClientsForPost={handleUpdateClientsForPost}
          />
        </CardContent>
      </Card>

      {/* Update Clients Dialog */}
      <Dialog open={isUpdateClientsDialogOpen} onOpenChange={setIsUpdateClientsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] md:max-w-[800px] w-[90vw]">
          <DialogHeader>
            <DialogTitle>Update Clients</DialogTitle>
            <DialogDescription>
              Notify your clients about new content in this product. This is a premium feature.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md p-3 mb-2">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                <span className="font-medium">Premium Feature:</span> Email notifications are charged at $0.10 per email
                sent.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Email Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Recipients:</span>
                    <span className="text-sm">{product.clientsCount || 0} clients</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Cost per email:</span>
                    <span className="text-sm">$0.10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Total cost:</span>
                    <span className="text-sm font-bold">
                      {(((product.clientsCount || 0) * 0.1) / 20.5).toFixed(4)} SOL ($
                      {((product.clientsCount || 0) * 0.1).toFixed(2)} USD)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Your Sol.Run balance:</span>
                    <span className="text-sm">
                      {mockSellerData.balance.toFixed(4)} SOL (${(mockSellerData.balance * 20.5).toFixed(2)} USD)
                    </span>
                  </div>

                  <div className="pt-2">
                    <Button variant="outline" size="sm" className="w-full" onClick={() => setIsEmailPreviewOpen(true)}>
                      Preview Email
                    </Button>
                  </div>

                  <div className="pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => setIsRecipientsDialogOpen(true)}
                    >
                      View Recipients
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Email Preview</h3>
                <div className="border rounded-md p-3 bg-white dark:bg-gray-950 h-[200px] overflow-y-auto">
                  <p className="text-sm font-medium">Subject: New Post for "{product.name}": Latest Update</p>
                  <div className="border-t my-2"></div>
                  <p className="text-sm mb-2">Hi [Client Name],</p>
                  <p className="text-sm mb-2">
                    Just a quick heads-up — {mockSellerData.username} has added a new post to the product you purchased
                    on Sol.Run!
                  </p>
                  <p className="text-sm mb-1">
                    🛍️ <strong>Product Name:</strong> {product.name}
                  </p>
                  <p className="text-sm mb-1">
                    📅 <strong>Access Expiry:</strong> [Expiry Date]
                  </p>
                  <p className="text-sm mb-1">
                    📝 <strong>Post Title:</strong> [Post Title]
                  </p>
                  <p className="text-sm mb-1">
                    ✍️ <strong>Word Count:</strong> [Word Count] words
                  </p>
                  <p className="text-sm mb-1">
                    📎 <strong>Total Product Files:</strong> {getFilesCount(product)}
                  </p>
                  <p className="text-sm my-2">
                    You can access the updated content directly here:
                    <br />🔗 <strong>Access URL:</strong> https://sol.run/product-files-view/{product.id}
                  </p>
                  <p className="text-sm mb-2">Enjoy the update!</p>
                  <p className="text-sm mb-1">
                    Warm regards,
                    <br />
                    The Sol.Run Team
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 mt-4">
              <input
                type="checkbox"
                id="confirm-send"
                checked={isConfirmed}
                onChange={(e) => setIsConfirmed(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="confirm-send" className="text-sm">
                I confirm that I want to send this email to all {product.clientsCount || 0} clients and authorize
                Sol.Run to deduct {(((product.clientsCount || 0) * 0.1) / 20.5).toFixed(4)} SOL ($
                {((product.clientsCount || 0) * 0.1).toFixed(2)} USD) from my balance.
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateClientsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={!isConfirmed || (product.clientsCount || 0) * 0.1 > mockSellerData.balance * 20.5}
              onClick={() => {
                toast({
                  title: "Emails Sent Successfully",
                  description: `Notification emails have been sent to ${product.clientsCount || 0} clients. A copy has also been sent to ${mockSellerData.email}.`,
                })
                setIsUpdateClientsDialogOpen(false)
                setIsConfirmed(false)
              }}
            >
              Send Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Clients for Specific Post Dialog */}
      <Dialog open={isUpdateClientsForPostDialogOpen} onOpenChange={setIsUpdateClientsForPostDialogOpen}>
        <DialogContent className="sm:max-w-[700px] md:max-w-[800px] w-[90vw]">
          <DialogHeader>
            <DialogTitle>Update Clients About This Post</DialogTitle>
            <DialogDescription>
              Notify your clients about this specific post in your product. This is a premium feature.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md p-3 mb-2">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                <span className="font-medium">Premium Feature:</span> Email notifications are charged at $0.10 per email
                sent.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Email Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Recipients:</span>
                    <span className="text-sm">{product.clientsCount || 0} clients</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Cost per email:</span>
                    <span className="text-sm">$0.10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Total cost:</span>
                    <span className="text-sm font-bold">
                      {(((product.clientsCount || 0) * 0.1) / 20.5).toFixed(4)} SOL ($
                      {((product.clientsCount || 0) * 0.1).toFixed(2)} USD)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Your Sol.Run balance:</span>
                    <span className="text-sm">
                      {mockSellerData.balance.toFixed(4)} SOL (${(mockSellerData.balance * 20.5).toFixed(2)} USD)
                    </span>
                  </div>

                  <div className="pt-2">
                    <Button variant="outline" size="sm" className="w-full" onClick={() => setIsEmailPreviewOpen(true)}>
                      Preview Email
                    </Button>
                  </div>

                  <div className="pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => setIsRecipientsDialogOpen(true)}
                    >
                      View Recipients
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Email Preview</h3>
                <div className="border rounded-md p-3 bg-white dark:bg-gray-950 h-[200px] overflow-y-auto">
                  <p className="text-sm font-medium">
                    Subject: New Post for "{product.name}": {selectedPostForClientUpdate?.title || "Latest Update"}
                  </p>
                  <div className="border-t my-2"></div>
                  <p className="text-sm mb-2">Hi [Client Name],</p>
                  <p className="text-sm mb-2">
                    Just a quick heads-up — {mockSellerData.username} has added a new post to the product you purchased
                    on Sol.Run!
                  </p>
                  <p className="text-sm mb-1">
                    🛍️ <strong>Product Name:</strong> {product.name}
                  </p>
                  <p className="text-sm mb-1">
                    📅 <strong>Access Expiry:</strong> [Expiry Date]
                  </p>
                  <p className="text-sm mb-1">
                    📝 <strong>Post Title:</strong> {selectedPostForClientUpdate?.title || "[Post Title]"}
                  </p>
                  <p className="text-sm mb-1">
                    ✍️ <strong>Word Count:</strong>{" "}
                    {selectedPostForClientUpdate
                      ? (() => {
                          // Function to strip HTML tags and count words
                          const stripHtml = (html) => {
                            const doc = new DOMParser().parseFromString(html, "text/html")
                            return doc.body.textContent || ""
                          }
                          const plainText = stripHtml(selectedPostForClientUpdate.caption)
                          return plainText.split(/\s+/).filter(Boolean).length
                        })()
                      : 0}{" "}
                    words
                  </p>
                  <p className="text-sm mb-1">
                    📎 <strong>Total Product Files:</strong> {getFilesCount(product)}
                  </p>
                  <p className="text-sm my-2">
                    You can access the updated content directly here:
                    <br />🔗 <strong>Access URL:</strong> https://sol.run/product-files-view/{product.id}
                  </p>
                  <p className="text-sm mb-2">Enjoy the update!</p>
                  <p className="text-sm mb-1">
                    Warm regards,
                    <br />
                    The Sol.Run Team
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 mt-4">
              <input
                type="checkbox"
                id="confirm-send-post"
                checked={isConfirmed}
                onChange={(e) => setIsConfirmed(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="confirm-send-post" className="text-sm">
                I confirm that I want to send this email to all {product.clientsCount || 0} clients and authorize
                Sol.Run to deduct {(((product.clientsCount || 0) * 0.1) / 20.5).toFixed(4)} SOL ($
                {((product.clientsCount || 0) * 0.1).toFixed(2)} USD) from my balance.
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateClientsForPostDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={!isConfirmed || (product.clientsCount || 0) * 0.1 > mockSellerData.balance * 20.5}
              onClick={() => {
                toast({
                  title: "Emails Sent Successfully",
                  description: `Notification emails about "${selectedPostForClientUpdate?.title || "this post"}" have been sent to ${product.clientsCount || 0} clients. A copy has also been sent to ${mockSellerData.email}.`,
                })
                setIsUpdateClientsForPostDialogOpen(false)
                setIsConfirmed(false)
                setSelectedPostForClientUpdate(null)
              }}
            >
              Send Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Email Full Preview Dialog */}
      <Dialog open={isEmailPreviewOpen} onOpenChange={setIsEmailPreviewOpen}>
        <DialogContent className="sm:max-w-[600px] w-[90vw]">
          <DialogHeader>
            <DialogTitle>Email Preview</DialogTitle>
          </DialogHeader>

          <div className="border rounded-md p-4 bg-white dark:bg-gray-950 max-h-[60vh] overflow-y-auto">
            <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded mb-3">
              <p className="text-sm">
                <strong>From:</strong> Sol.Run &lt;notifications@sol.run&gt;
              </p>
              <p className="text-sm">
                <strong>To:</strong> [Client Email]
              </p>
              <p className="text-sm">
                <strong>Cc:</strong> {mockSellerData.email}
              </p>
              <p className="text-sm">
                <strong>Subject:</strong> New Post for "{product.name}": Latest Update
              </p>
            </div>

            <div className="prose-sm dark:prose-invert max-w-none">
              <p>Hi [Client Name],</p>
              <p>
                Just a quick heads-up — {mockSellerData.username} has added a new post to the product you purchased on
                Sol.Run!
              </p>
              <p>
                🛍️ <strong>Product Name:</strong> {product.name}
                <br />📅 <strong>Access Expiry:</strong> [Expiry Date]
                <br />📝 <strong>Post Title:</strong> [Post Title]
                <br />
                ✍️ <strong>Word Count:</strong> [Word Count] words
                <br />📎 <strong>Total Product Files:</strong> {getFilesCount(product)}
              </p>
              <p>
                You can access the updated content directly here:
                <br />🔗 <strong>Access URL:</strong>{" "}
                <a href={`https://sol.run/product-files-view/${product.id}`} className="text-blue-500 hover:underline">
                  https://sol.run/product-files-view/{product.id}
                </a>
              </p>
              <p>Enjoy the update!</p>
              <p>
                Warm regards,
                <br />
                The Sol.Run Team
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setIsEmailPreviewOpen(false)}>Close Preview</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Recipients Dialog */}
      <Dialog open={isRecipientsDialogOpen} onOpenChange={setIsRecipientsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] w-[90vw]">
          <DialogHeader>
            <DialogTitle>Email Recipients</DialogTitle>
            <DialogDescription>
              This email will be sent to the following {mockRecipients.length} clients who purchased "{product.name}".
            </DialogDescription>
          </DialogHeader>

          <div className="border rounded-md p-2 bg-white dark:bg-gray-950 max-h-[50vh] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white dark:bg-gray-950 border-b">
                <tr>
                  <th className="text-left p-2">Username</th>
                  <th className="text-left p-2">Email</th>
                  <th className="text-left p-2">Purchase Date</th>
                </tr>
              </thead>
              <tbody>
                {mockRecipients.map((recipient, index) => (
                  <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="p-2">{recipient.name}</td>
                    <td className="p-2">{recipient.email}</td>
                    <td className="p-2">{new Date(recipient.purchaseDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-muted-foreground">Total: {mockRecipients.length} recipients</div>
            <div className="text-sm font-medium">
              Cost: {((mockRecipients.length * 0.1) / 20.5).toFixed(4)} SOL (${(mockRecipients.length * 0.1).toFixed(2)}{" "}
              USD)
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setIsRecipientsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
