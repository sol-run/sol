"use client"

import { useState } from "react"
import { PlusCircle, Search, Edit, Trash2, MoreHorizontal, Star, StarOff, ArrowUpDown, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// Mock data for categories
const mockCategories = [
  {
    id: 1,
    name: "Getting Started",
    slug: "getting-started",
    description: "Guides and tutorials for new users",
    count: 3,
    featured: true,
    color: "#4f46e5", // indigo-600
  },
  {
    id: 2,
    name: "Platform Guide",
    slug: "platform-guide",
    description: "Learn about platform features and capabilities",
    count: 2,
    featured: false,
    color: "#0891b2", // cyan-600
  },
  {
    id: 3,
    name: "Affiliate Marketing",
    slug: "affiliate-marketing",
    description: "Tips and strategies for affiliate success",
    count: 5,
    featured: true,
    color: "#16a34a", // green-600
  },
  {
    id: 4,
    name: "Monetization",
    slug: "monetization",
    description: "Ways to monetize your digital products",
    count: 7,
    featured: true,
    color: "#ca8a04", // yellow-600
  },
  {
    id: 5,
    name: "Product Creation",
    slug: "product-creation",
    description: "How to create successful digital products",
    count: 4,
    featured: false,
    color: "#9333ea", // purple-600
  },
  {
    id: 6,
    name: "Creator Tips",
    slug: "creator-tips",
    description: "Advice for content creators",
    count: 8,
    featured: false,
    color: "#dc2626", // red-600
  },
  {
    id: 7,
    name: "Platform Updates",
    slug: "platform-updates",
    description: "Latest features and improvements",
    count: 2,
    featured: false,
    color: "#2563eb", // blue-600
  },
  {
    id: 8,
    name: "News",
    slug: "news",
    description: "Industry news and announcements",
    count: 3,
    featured: false,
    color: "#db2777", // pink-600
  },
  {
    id: 9,
    name: "Success Stories",
    slug: "success-stories",
    description: "Case studies and success stories",
    count: 6,
    featured: true,
    color: "#ea580c", // orange-600
  },
  {
    id: 10,
    name: "Case Studies",
    slug: "case-studies",
    description: "Detailed analysis of successful strategies",
    count: 4,
    featured: false,
    color: "#0d9488", // teal-600
  },
]

// Color options for categories
const colorOptions = [
  { name: "Slate", value: "#475569" },
  { name: "Gray", value: "#6b7280" },
  { name: "Zinc", value: "#71717a" },
  { name: "Red", value: "#dc2626" },
  { name: "Orange", value: "#ea580c" },
  { name: "Amber", value: "#d97706" },
  { name: "Yellow", value: "#ca8a04" },
  { name: "Lime", value: "#65a30d" },
  { name: "Green", value: "#16a34a" },
  { name: "Emerald", value: "#059669" },
  { name: "Teal", value: "#0d9488" },
  { name: "Cyan", value: "#0891b2" },
  { name: "Sky", value: "#0284c7" },
  { name: "Blue", value: "#2563eb" },
  { name: "Indigo", value: "#4f46e5" },
  { name: "Violet", value: "#7c3aed" },
  { name: "Purple", value: "#9333ea" },
  { name: "Fuchsia", value: "#c026d3" },
  { name: "Pink", value: "#db2777" },
  { name: "Rose", value: "#e11d48" },
]

export function CategoryManagement() {
  const [categories, setCategories] = useState(mockCategories)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortField, setSortField] = useState("name")
  const [sortDirection, setSortDirection] = useState("asc")
  const [selectedCategory, setSelectedCategory] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Filter and sort categories
  const filteredCategories = categories
    .filter((category) => {
      // Search filter
      return (
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })
    .sort((a, b) => {
      if (sortField === "name") {
        return sortDirection === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      } else if (sortField === "count") {
        return sortDirection === "asc" ? a.count - b.count : b.count - a.count
      }
      // Default sort by name
      return sortDirection === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    })

  // Toggle sort direction
  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Handle category creation
  const handleCreateCategory = () => {
    const newCategory = {
      id: categories.length + 1,
      name: "New Category",
      slug: "new-category",
      description: "Description of the new category",
      count: 0,
      featured: false,
      color: "#475569", // Default color
    }

    setSelectedCategory(newCategory)
    setIsEditing(true)
  }

  // Handle category edit
  const handleEditCategory = (category: any) => {
    setSelectedCategory({ ...category })
    setIsEditing(true)
  }

  // Handle category delete
  const handleDeleteClick = (category: any) => {
    setSelectedCategory(category)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    setCategories(categories.filter((category) => category.id !== selectedCategory.id))
    setIsDeleteDialogOpen(false)
  }

  // Handle category save
  const handleSaveCategory = (category: any) => {
    // Generate slug from name if not provided
    if (!category.slug || category.slug === "") {
      category.slug = category.name
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "-")
    }

    if (categories.some((c) => c.id === category.id)) {
      // Update existing category
      setCategories(categories.map((c) => (c.id === category.id ? category : c)))
    } else {
      // Add new category
      setCategories([...categories, category])
    }
    setIsEditing(false)
  }

  // Handle featured toggle
  const toggleFeatured = (categoryId: number) => {
    setCategories(
      categories.map((category) =>
        category.id === categoryId ? { ...category, featured: !category.featured } : category,
      ),
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Category Management</h2>
        <Button onClick={handleCreateCategory}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Category
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Categories</CardTitle>
          <CardDescription>Manage blog categories, edit details, and control visibility.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search categories..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">ID</TableHead>
                  <TableHead className="w-[200px]">
                    <div className="flex items-center cursor-pointer" onClick={() => toggleSort("name")}>
                      Name
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="w-[300px]">Description</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>
                    <div className="flex items-center cursor-pointer" onClick={() => toggleSort("count")}>
                      Posts
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Color</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                      No categories found. Try adjusting your search or create a new category.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>{category.id}</TableCell>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell>{category.description}</TableCell>
                      <TableCell className="font-mono text-sm">{category.slug}</TableCell>
                      <TableCell>{category.count}</TableCell>
                      <TableCell>
                        <div className="w-6 h-6 rounded-full" style={{ backgroundColor: category.color }} />
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => toggleFeatured(category.id)}>
                          {category.featured ? (
                            <Star className="h-4 w-4 text-yellow-500" />
                          ) : (
                            <StarOff className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleEditCategory(category)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteClick(category)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {filteredCategories.length} of {categories.length} categories
          </div>
        </CardFooter>
      </Card>

      {/* Edit Category Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedCategory?.id ? "Edit Category" : "Create New Category"}</DialogTitle>
            <DialogDescription>Make changes to your category here. Click save when you're done.</DialogDescription>
          </DialogHeader>

          {selectedCategory && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={selectedCategory.name}
                  onChange={(e) => setSelectedCategory({ ...selectedCategory, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={selectedCategory.description}
                  onChange={(e) => setSelectedCategory({ ...selectedCategory, description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                    /blog/category/
                  </span>
                  <Input
                    id="slug"
                    value={selectedCategory.slug}
                    onChange={(e) => setSelectedCategory({ ...selectedCategory, slug: e.target.value })}
                    className="rounded-l-none"
                    placeholder="auto-generated-from-name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Category Color</Label>
                <div className="grid grid-cols-10 gap-2">
                  {colorOptions.map((color) => (
                    <Popover key={color.value}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full h-8 p-0 border-2"
                          style={{
                            backgroundColor: color.value,
                            borderColor: selectedCategory.color === color.value ? "white" : color.value,
                          }}
                        />
                      </PopoverTrigger>
                      <PopoverContent side="top" className="w-auto p-2">
                        {color.name}
                      </PopoverContent>
                    </Popover>
                  ))}
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: selectedCategory.color }} />
                  <Input
                    value={selectedCategory.color}
                    onChange={(e) => setSelectedCategory({ ...selectedCategory, color: e.target.value })}
                    className="w-28 font-mono"
                  />
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Palette className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64">
                      <div className="grid grid-cols-5 gap-2">
                        {colorOptions.map((color) => (
                          <Button
                            key={color.value}
                            variant="outline"
                            className="w-full h-8 p-0"
                            style={{ backgroundColor: color.value }}
                            onClick={() => setSelectedCategory({ ...selectedCategory, color: color.value })}
                          />
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={selectedCategory.featured}
                  onCheckedChange={(checked) => {
                    setSelectedCategory({ ...selectedCategory, featured: !!checked })
                  }}
                />
                <Label htmlFor="featured">Featured category</Label>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={() => handleSaveCategory(selectedCategory)}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the "{selectedCategory?.name}" category? This action cannot be undone.
              {selectedCategory?.count > 0 && (
                <p className="mt-2 text-destructive">
                  Warning: This category contains {selectedCategory.count} posts. Deleting it will remove the category
                  from these posts.
                </p>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
