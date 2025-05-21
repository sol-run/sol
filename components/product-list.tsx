"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency, solToUsd, usdToSol } from "@/utils/currency"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"

// Mock data for products
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
    clientsAffiliates: [
      { username: "user1", email: "user1@example.com", spent: 10, earned: 2 },
      { username: "user2", email: "user2@example.com", spent: 20, earned: 0 },
      { username: "affiliate1", email: "affiliate1@example.com", spent: 0, earned: 3 },
    ],
    posts: [{ id: 1, title: "Post 1", files: [] }],
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
    clientsAffiliates: [
      { username: "user3", email: "user3@example.com", spent: 50, earned: 10 },
      { username: "user4", email: "user4@example.com", spent: 75, earned: 15 },
    ],
    posts: [{ id: 2, title: "Post 2", files: [] }],
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
    clientsAffiliates: [
      { username: "user5", email: "user5@example.com", spent: 20, earned: 4 },
      { username: "affiliate2", email: "affiliate2@example.com", spent: 0, earned: 36 },
    ],
    posts: [],
  },
]

export function ProductList() {
  const [products, setProducts] = useState(mockProducts)
  const [editingProduct, setEditingProduct] = useState<null | { id: number; name: string; price: number }>(null)
  const [editedName, setEditedName] = useState("")
  const [editedPrice, setEditedPrice] = useState("")
  const [managedProduct, setManagedProduct] = useState<null | any>(null)
  const [clientsAffiliatesDialogOpen, setClientsAffiliatesDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"username" | "email" | "spent" | "earned">("username")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false)
  const [productToDeactivate, setProductToDeactivate] = useState<any>(null)
  const [isActivateDialogOpen, setIsActivateDialogOpen] = useState(false)
  const [productToActivate, setProductToActivate] = useState<any>(null)
  const router = useRouter()

  const getProductPostsCount = (product) => {
    if (!product || !product.posts || !Array.isArray(product.posts)) {
      return 0
    }
    return product.posts.length
  }

  const handleEdit = (product: { id: number; name: string; price: number }) => {
    setEditingProduct(product)
    setEditedName(product.name)
    setEditedPrice(solToUsd(product.price).toFixed(2))
  }

  const handleSaveEdit = () => {
    if (editingProduct) {
      const updatedProducts = products.map((p) =>
        p.id === editingProduct.id ? { ...p, name: editedName, price: usdToSol(Number.parseFloat(editedPrice)) } : p,
      )
      setProducts(updatedProducts)
      setEditingProduct(null)
    }
  }

  const handleDelete = (id: number) => {
    setProducts(products.filter((p) => p.id !== id))
  }

  // Replace the handleManage function with this updated version that uses a more reliable approach
  const handleManage = (product: any) => {
    if (!product || !product.id) {
      console.error("Invalid product data", product)
      return
    }

    try {
      // Format the product data for navigation
      const formattedProduct = {
        ...product,
        mediaItems: product.images
          ? product.images
              .map((img) => ({ type: "image" as const, src: img, preview: img }))
              .concat(
                product.youtubeLink
                  ? [
                      {
                        type: "video" as const,
                        src: product.youtubeLink,
                        preview: `/placeholder.svg?height=100&width=100`,
                      },
                    ]
                  : [],
              )
          : [],
        // Ensure posts are properly formatted
        posts: product.posts || [],
      }

      // Log the data being stored to help with debugging
      console.log("Storing product data in sessionStorage:", formattedProduct)

      // Store the product data in sessionStorage
      sessionStorage.setItem("editingProduct", JSON.stringify(formattedProduct))

      // Navigate to the edit product page with the product ID
      router.push(`/edit-product/${product.id}`)
    } catch (error) {
      console.error("Error navigating to edit product page:", error)
      toast({
        title: "Navigation Error",
        description: "There was a problem opening the product editor. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSaveManage = (updatedProduct: any) => {
    const updatedProducts = products.map((p) => (p.id === updatedProduct.id ? { ...p, ...updatedProduct } : p))
    setProducts(updatedProducts)
    setManagedProduct(null)
  }

  const handleViewSalesPage = (product: any) => {
    const url = `/product/${product.id}`
    console.log("Opening sales page URL:", url)
    window.open(url, "_blank")
  }

  const handleToggleActive = (product: any) => {
    if (product.active) {
      setProductToDeactivate(product)
      setIsDeactivateDialogOpen(true)
    } else {
      // Check if product has at least one post before allowing activation
      const postCount = product.posts?.length || 0
      if (postCount < 1) {
        toast({
          title: "Cannot Activate Product",
          description: "You need to add at least one product post before activating this product.",
          variant: "destructive",
        })
      } else {
        setProductToActivate(product)
        setIsActivateDialogOpen(true)
      }
    }
  }

  const updateProductStatus = (product: any, isActive: boolean) => {
    // If trying to activate, ensure product has at least one post
    if (isActive && (!product.posts || product.posts.length === 0)) {
      toast({
        title: "Cannot Activate Product",
        description: "You need to add at least one product post before activating this product.",
        variant: "destructive",
      })
      return
    }

    const updatedProducts = products
      .map((p) => (p.id === product.id ? { ...p, active: isActive } : p))
      .sort((a, b) => {
        if (a.active === b.active) return 0
        return a.active ? -1 : 1
      })
    setProducts(updatedProducts)
  }

  const handleViewClientsAffiliates = (product: any) => {
    setSelectedProduct(product)
    setClientsAffiliatesDialogOpen(true)
  }

  const handleSort = (column: "username" | "email" | "spent" | "earned") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("asc")
    }
  }

  const handleProductFiles = (product: any) => {
    // More comprehensive validation
    if (!product) {
      console.error("Invalid product: Product is null or undefined")
      return
    }

    if (typeof product.id === "undefined" || product.id === null) {
      console.error("Invalid product: Missing product ID", product)
      return
    }

    try {
      router.push(`/product-files/${product.id}`)
    } catch (error) {
      console.error("Navigation error:", error)
    }
  }

  const filteredAndSortedClientsAffiliates = (product: any) => {
    if (!product || !product.clientsAffiliates) return []
    return product.clientsAffiliates
      .filter(
        (ca: any) =>
          ca.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ca.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .sort((a: any, b: any) => {
        if (a[sortBy] < b[sortBy]) return sortOrder === "asc" ? -1 : 1
        if (a[sortBy] > b[sortBy]) return sortOrder === "asc" ? 1 : -1
        return 0
      })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Products</CardTitle>
        <CardDescription>Manage your listed products</CardDescription>
      </CardHeader>
      <CardContent>
        {products.map((product) => (
          <Card key={product.id} className="mb-4">
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
              <CardDescription className="font-bold">
                {formatCurrency(product.price)}
                <div className="mt-1 flex gap-3">
                  <span className="font-bold text-sm">Posts: {product.posts?.length || 0}</span>
                  <span className="font-bold text-sm">
                    Files: {product.posts?.reduce((total, post) => total + (post.files?.length || 0), 0) || 0}
                  </span>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                <span className="font-bold">Units Sold:</span> {product.unitsSold} <span className="font-bold">|</span>{" "}
                <span className="font-bold">Total Sales:</span> {formatCurrency(product.totalSales)}{" "}
                <span className="font-bold">|</span> <span className="font-bold">Paid To Affiliates:</span>{" "}
                {formatCurrency(product.paidToAffiliates)} <span className="font-bold">|</span>{" "}
                <span className="font-bold">Total Profit:</span> {formatCurrency(product.totalProfit)}
              </p>
            </CardContent>
            {(!product.posts || product.posts.length === 0) && (
              <div className="px-6 py-2 bg-yellow-50 dark:bg-yellow-900/30 border-t border-b border-yellow-200 dark:border-yellow-800">
                <p className="text-sm text-yellow-800 dark:text-yellow-200 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <span>This product is deactivated. Add at least one product post to enable activation.</span>
                </p>
              </div>
            )}
            <CardFooter className="flex justify-between flex-wrap gap-2">
              <Button variant="secondary" onClick={() => handleManage(product)}>
                Manage
              </Button>
              <Button variant="secondary" onClick={() => handleProductFiles(product)}>
                Product Posts ({product.posts?.length || 0})
              </Button>
              <Button variant="outline" onClick={() => handleViewClientsAffiliates(product)}>
                View Clients / Affiliates ({product.clientsCount})
              </Button>
              <Button variant="outline" onClick={() => handleViewSalesPage(product)}>
                View Sales Page
              </Button>
              <Button variant={product.active ? "default" : "ghost"} onClick={() => handleToggleActive(product)}>
                {product.active ? "Deactivate" : "Activate"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </CardContent>

      <Dialog open={editingProduct !== null} onOpenChange={() => setEditingProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Make changes to your product here. Click save when you're done.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price (USD)
              </Label>
              <Input
                id="price"
                type="number"
                value={editedPrice}
                onChange={(e) => setEditedPrice(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Price (SOL)</Label>
              <div className="col-span-3">
                {editedPrice ? formatCurrency(usdToSol(Number.parseFloat(editedPrice))) : "N/A"}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSaveEdit}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={clientsAffiliatesDialogOpen} onOpenChange={setClientsAffiliatesDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Clients / Affiliates for {selectedProduct?.name}</DialogTitle>
            <DialogDescription>View and manage clients and affiliates for this product.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Search by username or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-4"
            />
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("username")}>
                    <div className="flex items-center">
                      Username
                      {sortBy === "username" && (
                        <span className="ml-1">
                          {sortOrder === "asc" ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-chevron-up"
                            >
                              <path d="m18 15-6-6-6 6" />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-chevron-down"
                            >
                              <path d="m6 9 6 6 6-6" />
                            </svg>
                          )}
                        </span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("email")}>
                    <div className="flex items-center">
                      Email
                      {sortBy === "email" && (
                        <span className="ml-1">
                          {sortOrder === "asc" ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-chevron-up"
                            >
                              <path d="m18 15-6-6-6 6" />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-chevron-down"
                            >
                              <path d="m6 9 6 6 6-6" />
                            </svg>
                          )}
                        </span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("spent")}>
                    <div className="flex items-center">
                      Total Spent
                      {sortBy === "spent" && (
                        <span className="ml-1">
                          {sortOrder === "asc" ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-chevron-up"
                            >
                              <path d="m18 15-6-6-6 6" />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-chevron-down"
                            >
                              <path d="m6 9 6 6 6-6" />
                            </svg>
                          )}
                        </span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("earned")}>
                    <div className="flex items-center">
                      Total Earned as Affiliate
                      {sortBy === "earned" && (
                        <span className="ml-1">
                          {sortOrder === "asc" ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-chevron-up"
                            >
                              <path d="m18 15-6-6-6 6" />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-chevron-down"
                            >
                              <path d="m6 9 6 6 6-6" />
                            </svg>
                          )}
                        </span>
                      )}
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedClientsAffiliates(selectedProduct).map((ca: any) => (
                  <TableRow key={ca.username}>
                    <TableCell>{ca.username}</TableCell>
                    <TableCell>{ca.email}</TableCell>
                    <TableCell>{formatCurrency(ca.spent)}</TableCell>
                    <TableCell>{formatCurrency(ca.earned)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
      <AlertDialog open={isDeactivateDialogOpen} onOpenChange={setIsDeactivateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to deactivate this product?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will move the product to the bottom of the list and make it inactive.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (productToDeactivate) {
                  updateProductStatus(productToDeactivate, false)
                }
                setIsDeactivateDialogOpen(false)
              }}
            >
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={isActivateDialogOpen} onOpenChange={setIsActivateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to activate this product?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will move the product to the top of the list and make it active.
              {productToActivate && (!productToActivate.posts || productToActivate.posts.length === 0) && (
                <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-md">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    Warning: This product has no posts. You should add at least one post before activating.
                  </p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (productToActivate) {
                  if (!productToActivate.posts || productToActivate.posts.length === 0) {
                    toast({
                      title: "Cannot Activate Product",
                      description: "You need to add at least one product post before activating this product.",
                      variant: "destructive",
                    })
                    setIsActivateDialogOpen(false)
                    return
                  }
                  updateProductStatus(productToActivate, true)
                }
                setIsActivateDialogOpen(false)
              }}
            >
              Activate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
