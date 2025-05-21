"use client"

import { useState } from "react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Check, Edit, GripVertical, Plus, Save, Trash2, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Mock data for product categories
const initialProductCategories = [
  { id: 1, name: "E-Books", icon: "BookOpen", active: true, required: true },
  { id: 2, name: "Video Courses", icon: "Video", active: true, required: false },
  { id: 3, name: "Software", icon: "Code", active: true, required: false },
  { id: 4, name: "Digital Art", icon: "Image", active: true, required: false },
  { id: 5, name: "Audio Products", icon: "Music", active: true, required: false },
  { id: 6, name: "Templates", icon: "FileText", active: true, required: false },
  { id: 7, name: "Membership", icon: "Users", active: true, required: false },
  { id: 8, name: "Other", icon: "MoreHorizontal", active: true, required: true },
]

// Dashboard types order
const initialDashboardOrder = [
  { id: "seller", name: "Seller Dashboard", active: true, required: true },
  { id: "affiliate", name: "Affiliate Dashboard", active: true, required: false },
  { id: "purchases", name: "Purchases Dashboard", active: true, required: true },
]

// Available icons for selection
const availableIcons = [
  "BarChart",
  "ShoppingBag",
  "DollarSign",
  "Users",
  "Settings",
  "LineChart",
  "Tag",
  "Percent",
  "Link",
  "CreditCard",
  "Grid",
  "Clock",
  "Star",
  "HelpCircle",
  "ShoppingCart",
  "BookOpen",
  "Video",
  "Code",
  "Image",
  "Music",
  "FileText",
  "MoreHorizontal",
]

export function UserDashboardManagement() {
  const [activeTab, setActiveTab] = useState("product-categories")
  const [productCategories, setProductCategories] = useState(initialProductCategories)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [dashboardOrder, setDashboardOrder] = useState(initialDashboardOrder)

  // Function to handle drag and drop for reordering
  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    if (activeTab === "product-categories") {
      const items = Array.from(productCategories)
      const [reorderedItem] = items.splice(result.source.index, 1)
      items.splice(result.destination.index, 0, reorderedItem)
      setProductCategories(items)
    }
  }

  // Function to handle dashboard type reordering
  const handleDashboardOrderDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(dashboardOrder)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)
    setDashboardOrder(items)
  }

  // Function to toggle category/tab activation
  const toggleActive = (id: number | string, type: string) => {
    if (type === "category") {
      setProductCategories(productCategories.map((cat) => (cat.id === id ? { ...cat, active: !cat.active } : cat)))
    }
  }

  // Function to toggle dashboard type visibility
  const toggleDashboardActive = (id: string) => {
    setDashboardOrder(dashboardOrder.map((dash) => (dash.id === id ? { ...dash, active: !dash.active } : dash)))
  }

  // Function to add a new category
  const addNewCategory = () => {
    setEditingCategory({
      id: Date.now(),
      name: "",
      icon: "FileText",
      active: true,
      required: false,
    })
    setIsDialogOpen(true)
  }

  // Function to edit a category
  const editCategory = (category: any) => {
    setEditingCategory(category)
    setIsDialogOpen(true)
  }

  // Function to save a category
  const saveCategory = () => {
    if (!editingCategory?.name) return

    if (productCategories.some((c) => c.id === editingCategory.id)) {
      setProductCategories(productCategories.map((cat) => (cat.id === editingCategory.id ? editingCategory : cat)))
    } else {
      setProductCategories([...productCategories, editingCategory])
    }

    setIsDialogOpen(false)
    setEditingCategory(null)
  }

  // Function to delete a category
  const deleteCategory = (id: number) => {
    setProductCategories(productCategories.filter((cat) => cat.id !== id))
  }

  // Function to save all changes
  const saveChanges = () => {
    // In a real app, this would send data to the server
    console.log("Saving product categories:", productCategories)
    console.log("Saving dashboard order:", dashboardOrder)

    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">User Dashboard Management</h2>
        <Button onClick={saveChanges}>
          <Save className="mr-2 h-4 w-4" />
          Save All Changes
        </Button>
      </div>

      {saveSuccess && (
        <Alert className="bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-100 border-green-200 dark:border-green-800">
          <Check className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>Your changes have been saved successfully.</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="product-categories" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="product-categories">Product Categories</TabsTrigger>
          <TabsTrigger value="dashboard-types">Dashboard Type Order</TabsTrigger>
        </TabsList>

        <TabsContent value="product-categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Categories</CardTitle>
              <CardDescription>
                Manage the categories that sellers can choose when listing their products.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end mb-4">
                <Button onClick={addNewCategory}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Category
                </Button>
              </div>

              <div className="rounded-md border">
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="categories">
                    {(provided) => (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[50px]">Order</TableHead>
                            <TableHead className="w-[50px]">Icon</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead className="w-[100px]">Status</TableHead>
                            <TableHead className="w-[150px]">Required</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody {...provided.droppableProps} ref={provided.innerRef}>
                          {productCategories.map((category, index) => (
                            <Draggable key={category.id.toString()} draggableId={category.id.toString()} index={index}>
                              {(provided) => (
                                <TableRow ref={provided.innerRef} {...provided.draggableProps}>
                                  <TableCell>
                                    <div className="cursor-move flex items-center" {...provided.dragHandleProps}>
                                      <GripVertical className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                  </TableCell>
                                  <TableCell>{category.icon}</TableCell>
                                  <TableCell className="font-medium">{category.name}</TableCell>
                                  <TableCell>
                                    <Switch
                                      checked={category.active}
                                      onCheckedChange={() => toggleActive(category.id, "category")}
                                      disabled={category.required}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    {category.required ? (
                                      <Badge variant="secondary">Required</Badge>
                                    ) : (
                                      <Badge variant="outline">Optional</Badge>
                                    )}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex justify-end space-x-2">
                                      <Button variant="ghost" size="icon" onClick={() => editCategory(category)}>
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      {!category.required && (
                                        <Button variant="ghost" size="icon" onClick={() => deleteCategory(category.id)}>
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      )}
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </TableBody>
                      </Table>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Drag and drop to change the order. Required categories cannot be deactivated.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="dashboard-types" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dashboard Type Order</CardTitle>
              <CardDescription>
                Configure the order and visibility of dashboard types for users with multiple roles.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <DragDropContext onDragEnd={handleDashboardOrderDragEnd}>
                  <Droppable droppableId="dashboard-types">
                    {(provided) => (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[50px]">Order</TableHead>
                            <TableHead>Dashboard Type</TableHead>
                            <TableHead className="w-[100px]">Visible</TableHead>
                            <TableHead className="w-[150px]">Required</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody {...provided.droppableProps} ref={provided.innerRef}>
                          {dashboardOrder.map((dashboard, index) => (
                            <Draggable key={dashboard.id} draggableId={dashboard.id} index={index}>
                              {(provided) => (
                                <TableRow ref={provided.innerRef} {...provided.draggableProps}>
                                  <TableCell>
                                    <div className="cursor-move flex items-center" {...provided.dragHandleProps}>
                                      <GripVertical className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                  </TableCell>
                                  <TableCell className="font-medium">{dashboard.name}</TableCell>
                                  <TableCell>
                                    <Switch
                                      checked={dashboard.active}
                                      onCheckedChange={() => toggleDashboardActive(dashboard.id)}
                                      disabled={dashboard.required}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    {dashboard.required ? (
                                      <Badge variant="secondary">Required</Badge>
                                    ) : (
                                      <Badge variant="outline">Required</Badge>
                                    )}
                                  </TableCell>
                                </TableRow>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </TableBody>
                      </Table>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Drag and drop to change the order. This determines which dashboard a user with multiple roles sees
                first.
              </p>
            </CardFooter>
          </Card>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Important</AlertTitle>
            <AlertDescription>
              All users have access to all three roles (Seller, Affiliate, Customer) under a single account. This order
              determines which dashboard they see first when logging in, and the sequence of tabs in the dashboard
              navigation.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>

      {/* Dialog for adding/editing categories or tabs */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory?.id && productCategories.some((c) => c.id === editingCategory.id)
                ? "Edit Category"
                : activeTab === "product-categories"
                  ? "Add New Category"
                  : "Add New Menu Item"}
            </DialogTitle>
            <DialogDescription>
              {activeTab === "product-categories"
                ? "Configure details for this product category."
                : "Configure details for this dashboard menu item."}
            </DialogDescription>
          </DialogHeader>

          {editingCategory && (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="item-name">Name</Label>
                <Input
                  id="item-name"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  placeholder="Enter name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="item-icon">Icon</Label>
                <Select
                  value={editingCategory.icon}
                  onValueChange={(value) => setEditingCategory({ ...editingCategory, icon: value })}
                >
                  <SelectTrigger id="item-icon">
                    <SelectValue placeholder="Select an icon" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableIcons.map((icon) => (
                      <SelectItem key={icon} value={icon}>
                        {icon}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="item-active"
                    checked={editingCategory.active}
                    onCheckedChange={(checked) => setEditingCategory({ ...editingCategory, active: checked })}
                  />
                  <Label htmlFor="item-active">Active</Label>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="item-required"
                    checked={editingCategory.required}
                    onCheckedChange={(checked) => setEditingCategory({ ...editingCategory, required: checked })}
                  />
                  <Label htmlFor="item-required">Required</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Required items cannot be deactivated by admins or hidden from users.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={activeTab === "product-categories" ? saveCategory : null}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
