"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  PlusCircle,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Eye,
  Trash2,
  Image,
  FileText,
  Globe,
  Settings,
  Upload,
  Download,
  Calendar,
  Folder,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
} from "lucide-react"

// Mock data for pages
const pages = [
  {
    id: 1,
    title: "Home",
    slug: "/",
    lastUpdated: "2023-11-15",
    status: "published",
    template: "Home",
  },
  {
    id: 2,
    title: "About Us",
    slug: "/about",
    lastUpdated: "2023-11-10",
    status: "published",
    template: "Standard",
  },
  {
    id: 3,
    title: "Products",
    slug: "/products",
    lastUpdated: "2023-11-12",
    status: "published",
    template: "Products",
  },
  {
    id: 4,
    title: "Contact",
    slug: "/contact",
    lastUpdated: "2023-11-08",
    status: "published",
    template: "Contact",
  },
  {
    id: 5,
    title: "FAQ",
    slug: "/faq",
    lastUpdated: "2023-11-14",
    status: "published",
    template: "Standard",
  },
]

// Mock data for media
const mediaItems = [
  {
    id: 1,
    name: "hero-banner.jpg",
    type: "image",
    size: "1.2 MB",
    dimensions: "1920x1080",
    uploadedOn: "2023-11-15",
    usedIn: ["Home", "Products"],
  },
  {
    id: 2,
    name: "product-demo.mp4",
    type: "video",
    size: "8.5 MB",
    dimensions: "1280x720",
    uploadedOn: "2023-11-10",
    usedIn: ["Products", "About Us"],
  },
  {
    id: 3,
    name: "logo.png",
    type: "image",
    size: "0.3 MB",
    dimensions: "512x512",
    uploadedOn: "2023-11-01",
    usedIn: ["All Pages"],
  },
  {
    id: 4,
    name: "whitepaper.pdf",
    type: "document",
    size: "2.1 MB",
    dimensions: "N/A",
    uploadedOn: "2023-11-08",
    usedIn: ["Resources"],
  },
  {
    id: 5,
    name: "team-photo.jpg",
    type: "image",
    size: "0.8 MB",
    dimensions: "1200x800",
    uploadedOn: "2023-11-12",
    usedIn: ["About Us"],
  },
]

export function ContentManagement() {
  const [activeTab, setActiveTab] = useState("pages")
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)

  // Status badge renderer
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      published: { color: "bg-green-100 text-green-800", icon: <CheckCircle2 className="h-3 w-3 mr-1" /> },
      draft: { color: "bg-gray-100 text-gray-800", icon: <Clock className="h-3 w-3 mr-1" /> },
      scheduled: { color: "bg-blue-100 text-blue-800", icon: <Calendar className="h-3 w-3 mr-1" /> },
      archived: { color: "bg-red-100 text-red-800", icon: <XCircle className="h-3 w-3 mr-1" /> },
      review: { color: "bg-yellow-100 text-yellow-800", icon: <AlertCircle className="h-3 w-3 mr-1" /> },
    }

    const config = statusConfig[status] || statusConfig.draft

    return (
      <Badge variant="outline" className={`flex items-center ${config.color}`}>
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  // Handle creating a new post
  const handleCreateContent = () => {
    // In a real app, this would send data to your API
    console.log("Creating new content for:", activeTab)
    setIsCreateDialogOpen(false)
  }

  // Filter pages based on search query
  const filteredPages = pages.filter(
    (page) =>
      page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Filter media items based on search query
  const filteredMediaItems = mediaItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Content Management</CardTitle>
        <CardDescription>Manage all website content including blog posts, pages, and media.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pages" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="pages" className="flex items-center">
                <Globe className="h-4 w-4 mr-2" />
                Pages
              </TabsTrigger>
              <TabsTrigger value="media" className="flex items-center">
                <Image className="h-4 w-4 mr-2" />
                Media Library
              </TabsTrigger>
              <TabsTrigger value="seo" className="flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                SEO
              </TabsTrigger>
            </TabsList>

            <Button onClick={() => setIsCreateDialogOpen(true)} className="flex items-center">
              <PlusCircle className="h-4 w-4 mr-2" />
              Create New
            </Button>
          </div>

          {/* Search and filter bar */}
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search content..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>All Content</DropdownMenuItem>
                <DropdownMenuItem>Published</DropdownMenuItem>
                <DropdownMenuItem>Drafts</DropdownMenuItem>
                <DropdownMenuItem>Scheduled</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Sort by Date</DropdownMenuItem>
                <DropdownMenuItem>Sort by Title</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Pages Tab */}
          <TabsContent value="pages" className="space-y-4">
            <ScrollArea className="h-[calc(100vh-300px)] pr-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[30px]">
                      <Checkbox />
                    </TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead className="hidden md:table-cell">URL</TableHead>
                    <TableHead className="hidden md:table-cell">Template</TableHead>
                    <TableHead className="hidden md:table-cell">Last Updated</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPages.map((page) => (
                    <TableRow key={page.id}>
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{page.title}</div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <code className="bg-muted px-1 py-0.5 rounded text-sm">{page.slug}</code>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{page.template}</TableCell>
                      <TableCell className="hidden md:table-cell">{page.lastUpdated}</TableCell>
                      <TableCell>
                        <StatusBadge status={page.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="flex items-center">
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center">
                              <Eye className="h-4 w-4 mr-2" />
                              Preview
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="flex items-center text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </TabsContent>

          {/* Media Library Tab */}
          <TabsContent value="media" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex space-x-2">
                <Button variant="outline" className="flex items-center">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
                <Button variant="outline" className="flex items-center">
                  <Folder className="h-4 w-4 mr-2" />
                  New Folder
                </Button>
              </div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <ScrollArea className="h-[calc(100vh-350px)] pr-4">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredMediaItems.map((item) => (
                  <div key={item.id} className="border rounded-md overflow-hidden flex flex-col">
                    <div className="bg-muted h-24 flex items-center justify-center">
                      {item.type === "image" ? (
                        <Image className="h-12 w-12 text-muted-foreground" />
                      ) : item.type === "video" ? (
                        <FileText className="h-12 w-12 text-muted-foreground" />
                      ) : (
                        <FileText className="h-12 w-12 text-muted-foreground" />
                      )}
                    </div>
                    <div className="p-2">
                      <div className="text-sm font-medium truncate" title={item.name}>
                        {item.name}
                      </div>
                      <div className="text-xs text-muted-foreground flex justify-between">
                        <span>{item.size}</span>
                        <span>{item.uploadedOn}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* SEO Tab */}
          <TabsContent value="seo" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Site-wide SEO Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="site-title">Site Title</Label>
                      <Input id="site-title" defaultValue="Sol.Run - Digital Product Marketplace" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="site-description">Site Description</Label>
                      <Textarea
                        id="site-description"
                        defaultValue="Sol.Run is a digital product marketplace where creators can sell their products and earn cryptocurrency."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="keywords">Keywords</Label>
                      <Input id="keywords" defaultValue="digital products, marketplace, cryptocurrency, solana" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Social Media</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="og-title">Open Graph Title</Label>
                      <Input id="og-title" defaultValue="Sol.Run - Digital Product Marketplace" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="og-description">Open Graph Description</Label>
                      <Textarea
                        id="og-description"
                        defaultValue="Buy and sell digital products with cryptocurrency on Sol.Run"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="og-image">Open Graph Image</Label>
                      <div className="flex items-center space-x-2">
                        <Input id="og-image" defaultValue="og-image.jpg" readOnly />
                        <Button variant="outline" size="sm">
                          Select
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      {/* Create New Content Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {activeTab === "pages"
                ? "Create New Page"
                : activeTab === "media"
                  ? "Upload Media"
                  : "Create New SEO Rule"}
            </DialogTitle>
            <DialogDescription>
              {activeTab === "pages"
                ? "Create a new page for your website."
                : activeTab === "media"
                  ? "Upload new media files to your library."
                  : "Create a new SEO rule for specific content."}
            </DialogDescription>
          </DialogHeader>

          {activeTab === "pages" && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="page-title">Page Title</Label>
                <Input id="page-title" placeholder="Enter page title" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input id="slug" placeholder="page-url-slug" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="template">Template</Label>
                <Select defaultValue="standard">
                  <SelectTrigger>
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="home">Home</SelectItem>
                    <SelectItem value="contact">Contact</SelectItem>
                    <SelectItem value="products">Products</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {activeTab === "media" && (
            <div className="space-y-4 py-4">
              <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-1">Drag and drop files here or click to browse</p>
                <p className="text-xs text-muted-foreground">Supports images, videos, documents, and audio files</p>
                <Button variant="outline" className="mt-4">
                  Select Files
                </Button>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateContent}>
              {activeTab === "pages" ? "Create Page" : activeTab === "media" ? "Upload Files" : "Create Rule"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
