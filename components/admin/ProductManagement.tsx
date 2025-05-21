"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { formatCurrency } from "@/utils/currency"
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
import { ArrowUpDown } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Product {
  id: number
  name: string
  description: string
  price: number
  sellerUsername: string
  totalSales?: number
  totalCommissionsPaid?: number
  sellerProfit?: number
  affiliateProgramSummary?: string
  createdAt: string
}

interface SellerProfile {
  username: string
  productsListed: number
  totalSalesRevenue: number
  totalSalesProfit: number
  revenueForAffiliates: number
  earnedAsAffiliate: number
  totalEarnedProfitsAndCommissions: number
}

const mockProducts: Product[] = [
  {
    id: 1,
    name: "eBook: Solana Basics",
    description: "Learn the basics of Solana",
    price: 9.99,
    sellerUsername: "John Doe",
    totalSales: 100,
    totalCommissionsPaid: 10,
    sellerProfit: 900,
    createdAt: "2023-07-01T00:00:00Z",
  },
  {
    id: 2,
    name: "Video Course: Advanced Solana",
    description: "Advanced Solana programming techniques",
    price: 49.99,
    sellerUsername: "Jane Smith",
    totalSales: 50,
    totalCommissionsPaid: 5,
    sellerProfit: 2450,
    createdAt: "2023-10-15T00:00:00Z",
  },
  {
    id: 3,
    name: "NFT Collection: Solana Gems",
    description: "Exclusive Solana-themed NFT collection",
    price: 99.99,
    sellerUsername: "Bob Johnson",
    totalSales: 25,
    totalCommissionsPaid: 2.5,
    sellerProfit: 2475,
    createdAt: "2024-01-20T00:00:00Z",
  },
  {
    id: 4,
    name: "Solana DeFi Course",
    description: "Learn DeFi on Solana",
    price: 79.99,
    sellerUsername: "John Doe",
    totalSales: 30,
    totalCommissionsPaid: 3,
    sellerProfit: 2310,
    createdAt: "2024-02-15T00:00:00Z",
  },
  {
    id: 5,
    name: "Solana NFT Masterclass",
    description: "Create and sell NFTs on Solana",
    price: 129.99,
    sellerUsername: "John Doe",
    totalSales: 20,
    totalCommissionsPaid: 2,
    sellerProfit: 2540,
    createdAt: "2024-03-01T00:00:00Z",
  },
]

export function ProductManagement() {
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [newProduct, setNewProduct] = useState({ name: "", description: "", price: 0, sellerUsername: "" })
  const [isManageDialogOpen, setIsManageDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [sortColumn, setSortColumn] = useState<"totalSales" | "totalRevenue" | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [selectedPeriod, setSelectedPeriod] = useState<string>("all")
  const [isSellerProfileOpen, setIsSellerProfileOpen] = useState(false)
  const [selectedSeller, setSelectedSeller] = useState<SellerProfile | null>(null)
  const [isProductListVisible, setIsProductListVisible] = useState(false)

  const filterProductsByPeriod = (products: Product[], period: string) => {
    const now = new Date()
    return products.filter((product) => {
      if (period === "all") return true
      const productDate = new Date(product.createdAt)
      switch (period) {
        case "today":
          return productDate.toDateString() === now.toDateString()
        case "week":
          return now.getTime() - productDate.getTime() <= 7 * 24 * 60 * 60 * 1000
        case "month":
          return now.getMonth() === productDate.getMonth() && now.getFullYear() === productDate.getFullYear()
        case "year":
          return now.getFullYear() === productDate.getFullYear()
        default:
          return true
      }
    })
  }

  const filteredProducts = filterProductsByPeriod(
    products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sellerUsername.toLowerCase().includes(searchTerm.toLowerCase()),
    ),
    selectedPeriod,
  )

  const handleAddProduct = () => {
    setProducts([...products, { ...newProduct, id: products.length + 1, createdAt: new Date().toISOString() }])
    setNewProduct({ name: "", description: "", price: 0, sellerUsername: "" })
    setIsAddProductOpen(false)
  }

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter((product) => product.id !== id))
  }

  const handleManageProduct = (product: Product) => {
    setSelectedProduct(product)
    setIsManageDialogOpen(true)
  }

  const sortProducts = (products: Product[]) => {
    if (!sortColumn) return products
    return [...products].sort((a, b) => {
      if (sortColumn === "totalSales") {
        return sortDirection === "asc"
          ? (a.totalSales || 0) - (b.totalSales || 0)
          : (b.totalSales || 0) - (a.totalSales || 0)
      } else if (sortColumn === "totalRevenue") {
        const revenueA = (a.totalSales || 0) * a.price
        const revenueB = (b.totalSales || 0) * b.price
        return sortDirection === "asc" ? revenueA - revenueB : revenueB - revenueA
      }
      return 0
    })
  }

  const handleSellerClick = (username: string) => {
    // Mock data for the seller's profile
    const mockSellerProfile: SellerProfile = {
      username,
      productsListed: Math.floor(Math.random() * 20) + 1,
      totalSalesRevenue: Math.random() * 10000,
      totalSalesProfit: Math.random() * 8000,
      revenueForAffiliates: Math.random() * 2000,
      earnedAsAffiliate: Math.random() * 1000,
      totalEarnedProfitsAndCommissions: Math.random() * 9000,
    }
    setSelectedSeller(mockSellerProfile)
    setIsSellerProfileOpen(true)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-4">
          <Input
            placeholder="Search products..."
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
              <strong>Total Revenue:</strong>
              <br />
              <span className="font-medium">
                {formatCurrency(
                  filterProductsByPeriod(products, selectedPeriod).reduce(
                    (sum, product) => sum + (product.totalSales || 0) * product.price,
                    0,
                  ),
                )}
              </span>
            </div>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">No.</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Seller</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => {
                  setSortColumn("totalSales")
                  setSortDirection(sortColumn === "totalSales" && sortDirection === "asc" ? "desc" : "asc")
                }}
              >
                Total Sales Count
                <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => {
                  setSortColumn("totalRevenue")
                  setSortDirection(sortColumn === "totalRevenue" && sortDirection === "asc" ? "desc" : "asc")
                }}
              >
                Total Revenue
                <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product, index) => (
              <TableRow key={product.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>
                  <button
                    onClick={() => handleSellerClick(product.sellerUsername)}
                    className="text-blue-600 hover:underline"
                  >
                    {product.sellerUsername}
                  </button>
                </TableCell>
                <TableCell>{product.totalSales || 0}</TableCell>
                <TableCell>{formatCurrency((product.totalSales || 0) * product.price)}</TableCell>
                <TableCell>
                  <Button variant="outline" onClick={() => handleManageProduct(product)}>
                    Manage
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price
              </Label>
              <Input
                id="price"
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: Number.parseFloat(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sellerUsername" className="text-right">
                Seller
              </Label>
              <Input
                id="sellerUsername"
                value={newProduct.sellerUsername}
                onChange={(e) => setNewProduct({ ...newProduct, sellerUsername: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleAddProduct}>
              Add Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isManageDialogOpen} onOpenChange={setIsManageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Product: {selectedProduct?.name}</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold">Product Name:</h3>
                <p>{selectedProduct?.name}</p>
              </div>
              <div>
                <h3 className="font-semibold">Product Preview:</h3>
                <a
                  href={`/product/${selectedProduct?.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Sales Page
                </a>
              </div>
              <div>
                <h3 className="font-semibold">Seller Username:</h3>
                <p>{selectedProduct?.sellerUsername}</p>
              </div>
              <div>
                <h3 className="font-semibold">Price:</h3>
                <p>{formatCurrency(selectedProduct?.price || 0).split(" (")[0]}</p>
                <p className="text-sm text-muted-foreground">
                  ({formatCurrency(selectedProduct?.price || 0).split(" (")[1]}
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Total Sales Count:</h3>
                <p>{selectedProduct?.totalSales || 0}</p>
              </div>
              <div>
                <h3 className="font-semibold">Total Revenue:</h3>
                <p>
                  {formatCurrency((selectedProduct?.totalSales || 0) * (selectedProduct?.price || 0)).split(" (")[0]}
                </p>
                <p className="text-sm text-muted-foreground">
                  ({formatCurrency((selectedProduct?.totalSales || 0) * (selectedProduct?.price || 0)).split(" (")[1]}
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Total Commissions Paid:</h3>
                <p>{formatCurrency(selectedProduct?.totalCommissionsPaid || 0).split(" (")[0]}</p>
                <p className="text-sm text-muted-foreground">
                  ({formatCurrency(selectedProduct?.totalCommissionsPaid || 0).split(" (")[1]}
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Seller's Total Profit:</h3>
                <p>{formatCurrency(selectedProduct?.sellerProfit || 0).split(" (")[0]}</p>
                <p className="text-sm text-muted-foreground">
                  ({formatCurrency(selectedProduct?.sellerProfit || 0).split(" (")[1]}
                </p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold">Affiliate Program Summary:</h3>
              <p>{selectedProduct?.affiliateProgramSummary || "No affiliate program set up for this product."}</p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsManageDialogOpen(false)}>Close</Button>
            <Button
              variant="outline"
              onClick={() => {
                console.log("Edit product:", selectedProduct?.id)
                setIsManageDialogOpen(false)
              }}
            >
              Edit
            </Button>
            <Button variant="destructive" onClick={() => setIsDeleteConfirmOpen(true)}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this product?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (selectedProduct) {
                  handleDeleteProduct(selectedProduct.id)
                  setIsManageDialogOpen(false)
                }
                setIsDeleteConfirmOpen(false)
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Dialog open={isSellerProfileOpen} onOpenChange={setIsSellerProfileOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Seller Profile: {selectedSeller?.username}</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold">Products Listed:</h3>
                <button
                  onClick={() => setIsProductListVisible(!isProductListVisible)}
                  className="text-blue-600 hover:underline"
                >
                  {products.filter((product) => product.sellerUsername === selectedSeller?.username).length} (Click to{" "}
                  {isProductListVisible ? "hide" : "show"} details)
                </button>
                {isProductListVisible && (
                  <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
                    {products
                      .filter((product) => product.sellerUsername === selectedSeller?.username)
                      .map((product, index) => (
                        <div key={product.id} className="border p-2 rounded">
                          <p className="text-sm text-gray-500 mb-1">#{index + 1}</p>
                          <p className="font-semibold">
                            <a
                              href={`/product/${product.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline"
                            >
                              {product.name}
                            </a>
                          </p>
                          <p>Price: {formatCurrency(product.price)}</p>
                          <p>Total Sales: {product.totalSales || 0}</p>
                          <p>Revenue: {formatCurrency((product.totalSales || 0) * product.price)}</p>
                        </div>
                      ))}
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-semibold">Total Sales Revenue:</h3>
                <p>{formatCurrency(selectedSeller?.totalSalesRevenue || 0)}</p>
              </div>
              <div>
                <h3 className="font-semibold">Total Sales Profit:</h3>
                <p>{formatCurrency(selectedSeller?.totalSalesProfit || 0)}</p>
              </div>
              <div>
                <h3 className="font-semibold">Revenue For Affiliates:</h3>
                <p>{formatCurrency(selectedSeller?.revenueForAffiliates || 0)}</p>
              </div>
              <div>
                <h3 className="font-semibold">Earned As Affiliate:</h3>
                <p>{formatCurrency(selectedSeller?.earnedAsAffiliate || 0)}</p>
              </div>
              <div>
                <h3 className="font-semibold">Total Earned Profits & Commissions:</h3>
                <p>
                  {formatCurrency((selectedSeller?.earnedAsAffiliate || 0) + (selectedSeller?.totalSalesProfit || 0))}
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsSellerProfileOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
