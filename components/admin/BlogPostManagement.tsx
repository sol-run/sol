"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import {
  PlusCircle,
  Search,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Tag,
  User,
  MoreHorizontal,
  Star,
  StarOff,
  ArrowUpDown,
} from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table as UITable, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import TipTapUnderline from "@tiptap/extension-underline"
import Image from "@tiptap/extension-image"
import Alignment from "@tiptap/extension-text-align"
import TableExtension from "@tiptap/extension-table"
import TipTapTableRow from "@tiptap/extension-table-row"
import TipTapTableCell from "@tiptap/extension-table-cell"
import TipTapTableHeader from "@tiptap/extension-table-header"
import {
  Bold,
  Italic,
  Underline,
  Link2,
  Heading2,
  Heading3,
  ListOrdered,
  List,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Table,
  ImageIcon,
} from "lucide-react"

// Mock data for blog posts
const mockPosts = [
  {
    id: 1,
    title: "Getting Started with Sol Run: A Comprehensive Guide",
    slug: "getting-started-with-sol-run",
    excerpt:
      "Learn how to make the most of Sol Run's platform with this step-by-step guide for creators and customers.",
    content:
      "<p>Welcome to Sol Run! This guide will help you navigate our platform and make the most of all the features we offer.</p><h2>For Creators</h2><p>As a creator, you can sell digital products, build an audience, and earn through affiliate programs. Here's how to get started:</p><ul><li>Set up your profile</li><li>Create your first product</li><li>Promote your offerings</li></ul><h2>For Customers</h2><p>Discover amazing digital products and support creators directly. Here's how:</p><ul><li>Browse categories</li><li>Purchase securely</li><li>Access your library</li></ul>",
    author: "Sol Run Team",
    authorId: 1,
    publishedAt: new Date("2025-03-15T10:00:00"),
    updatedAt: new Date("2025-03-18T14:30:00"),
    status: "published",
    featured: true,
    categories: ["Getting Started", "Platform Guide"],
    tags: ["beginners", "tutorial", "guide"],
    readTime: 5,
    views: 1245,
    likes: 87,
  },
  {
    id: 2,
    title: "How to Maximize Your Earnings as an Affiliate",
    slug: "maximize-earnings-as-affiliate",
    excerpt: "Discover proven strategies to increase your affiliate earnings on Sol Run with these expert tips.",
    content:
      "<p>Becoming a successful affiliate marketer on Sol Run can be a lucrative opportunity. This article explores the best practices and strategies to maximize your earnings.</p><h2>Understanding the Affiliate Program</h2><p>Sol Run offers competitive commission rates and a user-friendly dashboard to track your performance. Here's what you need to know:</p><ul><li>Commission structure</li><li>Payment methods</li><li>Performance tracking</li></ul><h2>Promotion Strategies</h2><p>Effective promotion is key to affiliate success. Consider these approaches:</p><ul><li>Content marketing</li><li>Social media promotion</li><li>Email marketing</li></ul>",
    author: "Jane Smith",
    authorId: 2,
    publishedAt: new Date("2025-03-10T09:15:00"),
    updatedAt: new Date("2025-03-10T09:15:00"),
    status: "published",
    featured: false,
    categories: ["Affiliate Marketing", "Monetization"],
    tags: ["affiliate", "earnings", "marketing"],
    readTime: 8,
    views: 932,
    likes: 64,
  },
  {
    id: 3,
    title: "Creating Digital Products That Sell: A Creator's Guide",
    slug: "creating-digital-products-that-sell",
    excerpt:
      "Learn the essential elements of successful digital products and how to create offerings that resonate with your audience.",
    content:
      "<p>The digital product market is competitive, but with the right approach, you can create offerings that stand out and generate consistent sales.</p><h2>Market Research</h2><p>Understanding your audience is the first step to creating products they'll want to buy:</p><ul><li>Identify pain points</li><li>Analyze competitors</li><li>Find your unique angle</li></ul><h2>Product Development</h2><p>Once you know what to create, focus on quality execution:</p><ul><li>Set clear learning objectives</li><li>Create engaging content</li><li>Design professional materials</li></ul>",
    author: "Michael Johnson",
    authorId: 3,
    publishedAt: new Date("2025-03-05T11:30:00"),
    updatedAt: new Date("2025-03-07T16:45:00"),
    status: "published",
    featured: true,
    categories: ["Product Creation", "Creator Tips"],
    tags: ["digital products", "creation", "sales"],
    readTime: 10,
    views: 1567,
    likes: 112,
  },
  {
    id: 4,
    title: "Upcoming Platform Features: What's New in 2025",
    slug: "upcoming-platform-features-2025",
    excerpt: "Get a sneak peek at the exciting new features coming to Sol Run in 2025.",
    content:
      "<p>We're constantly working to improve Sol Run and provide the best experience for creators and customers alike. Here's what you can look forward to in 2025.</p><h2>Enhanced Creator Tools</h2><p>We're expanding our suite of creator tools to help you build and sell more effectively:</p><ul><li>Advanced analytics dashboard</li><li>Integrated email marketing</li><li>AI-powered content suggestions</li></ul><h2>Improved Customer Experience</h2><p>We're also enhancing the experience for your customers:</p><ul><li>Personalized recommendations</li><li>Streamlined checkout process</li><li>Enhanced product access interface</li></ul>",
    author: "Sol Run Team",
    authorId: 1,
    publishedAt: new Date("2025-03-01T08:00:00"),
    updatedAt: new Date("2025-03-01T08:00:00"),
    status: "published",
    featured: false,
    categories: ["Platform Updates", "News"],
    tags: ["features", "updates", "roadmap"],
    readTime: 6,
    views: 2103,
    likes: 145,
  },
  {
    id: 5,
    title: "Success Story: How Sarah Made $10,000 in Her First Month",
    slug: "success-story-sarah",
    excerpt:
      "Read about how Sarah leveraged Sol Run to launch her digital product business and generated five figures in her first month.",
    content:
      "<p>Sarah was a graphic designer looking to create passive income streams. With Sol Run, she was able to package her expertise into digital products that resonated with her audience.</p><h2>Finding Her Niche</h2><p>Sarah's journey began with identifying an underserved market:</p><ul><li>Market research process</li><li>Validating her idea</li><li>Defining her unique value proposition</li></ul><h2>Product Development and Launch</h2><p>With her niche identified, Sarah focused on creating high-quality products:</p><ul><li>Creating her flagship course</li><li>Pricing strategy</li><li>Launch marketing plan</li></ul>",
    author: "Emily Wilson",
    authorId: 4,
    publishedAt: new Date("2025-02-25T13:45:00"),
    updatedAt: new Date("2025-02-28T10:20:00"),
    status: "draft",
    featured: false,
    categories: ["Success Stories", "Case Studies"],
    tags: ["success", "case study", "earnings"],
    readTime: 12,
    views: 0,
    likes: 0,
  },
]

// Mock data for categories
const mockCategories = [
  { id: 1, name: "Getting Started", slug: "getting-started", count: 3 },
  { id: 2, name: "Platform Guide", slug: "platform-guide", count: 2 },
  { id: 3, name: "Affiliate Marketing", slug: "affiliate-marketing", count: 5 },
  { id: 4, name: "Monetization", slug: "monetization", count: 7 },
  { id: 5, name: "Product Creation", slug: "product-creation", count: 4 },
  { id: 6, name: "Creator Tips", slug: "creator-tips", count: 8 },
  { id: 7, name: "Platform Updates", slug: "platform-updates", count: 2 },
  { id: 8, name: "News", slug: "news", count: 3 },
  { id: 9, name: "Success Stories", slug: "success-stories", count: 6 },
  { id: 10, name: "Case Studies", slug: "case-studies", count: 4 },
]

// Mock data for tags
const mockTags = [
  "beginners",
  "tutorial",
  "guide",
  "affiliate",
  "earnings",
  "marketing",
  "digital products",
  "creation",
  "sales",
  "features",
  "updates",
  "roadmap",
  "success",
  "case study",
  "monetization",
  "strategy",
  "tips",
  "howto",
]

// Mock data for authors
const mockAuthors = [
  { id: 1, name: "Sol Run Team", avatar: "/images/default-avatar.png" },
  { id: 2, name: "Jane Smith", avatar: "/images/default-avatar.png" },
  { id: 3, name: "Michael Johnson", avatar: "/images/default-avatar.png" },
  { id: 4, name: "Emily Wilson", avatar: "/images/default-avatar.png" },
  { id: 5, name: "David Brown", avatar: "/images/default-avatar.png" },
]

export function BlogPostManagement() {
  const [posts, setPosts] = useState(mockPosts)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortField, setSortField] = useState("publishedAt")
  const [sortDirection, setSortDirection] = useState("desc")
  const [selectedPost, setSelectedPost] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [activeImageTab, setActiveImageTab] = useState("upload")
  const [isImageLoading, setIsImageLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [openInNewTab, setOpenInNewTab] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      TipTapUnderline,
      Image.configure({
        allowBase64: true,
        inline: false,
        HTMLAttributes: {
          class: "resizable-image",
        },
      }),
      Link.configure({
        openOnClick: false,
      }),
      Alignment.configure({
        types: ["heading", "paragraph"],
        defaultAlignment: "left",
      }),
      TableExtension.configure({
        resizable: true,
      }),
      TipTapTableRow,
      TipTapTableHeader,
      TipTapTableCell,
    ],
    content: selectedPost?.content || "",
    editorProps: {
      attributes: {
        class: "prose-sm max-w-none focus:outline-none min-h-[200px] dark:text-gray-50",
      },
    },
  })

  // Update editor content when selected post changes
  useEffect(() => {
    if (editor && selectedPost) {
      editor.commands.setContent(selectedPost.content)
    }
  }, [editor, selectedPost])

  // Filter and sort posts
  const filteredPosts = posts
    .filter((post) => {
      // Search filter
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.toLowerCase().includes(searchQuery.toLowerCase())

      // Status filter
      const matchesStatus = statusFilter === "all" || post.status === statusFilter

      // Category filter
      const matchesCategory =
        categoryFilter === "all" || post.categories.some((cat) => cat.toLowerCase() === categoryFilter.toLowerCase())

      return matchesSearch && matchesStatus && matchesCategory
    })
    .sort((a, b) => {
      if (sortField === "publishedAt") {
        return sortDirection === "asc"
          ? new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
          : new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      } else if (sortField === "title") {
        return sortDirection === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
      } else if (sortField === "views") {
        return sortDirection === "asc" ? a.views - b.views : b.views - a.views
      } else if (sortField === "likes") {
        return sortDirection === "asc" ? a.likes - b.likes : b.likes - a.likes
      }
      // Default sort by publishedAt
      return sortDirection === "asc"
        ? new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
        : new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    })

  // Toggle sort direction
  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  // Handle post creation
  const handleCreatePost = () => {
    const newPost = {
      id: posts.length + 1,
      title: "New Blog Post",
      slug: "new-blog-post",
      excerpt: "Write a brief description of your post here.",
      content: "<p>Start writing your blog post content here...</p>",
      author: "Sol Run Team",
      authorId: 1,
      publishedAt: new Date(),
      updatedAt: new Date(),
      status: "draft",
      featured: false,
      categories: [],
      tags: [],
      readTime: 5,
      views: 0,
      likes: 0,
    }

    setSelectedPost(newPost)
    setIsEditing(true)
  }

  // Handle post edit
  const handleEditPost = (post: any) => {
    setSelectedPost({ ...post })
    setIsEditing(true)
  }

  // Handle post preview
  const handlePreviewPost = (post: any) => {
    setSelectedPost(post)
    setIsPreviewOpen(true)
  }

  // Handle post delete
  const handleDeleteClick = (post: any) => {
    setSelectedPost(post)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    setPosts(posts.filter((post) => post.id !== selectedPost.id))
    setIsDeleteDialogOpen(false)
  }

  // Handle post save
  const handleSavePost = (post: any) => {
    // Get content from editor if available
    const updatedPost = {
      ...post,
      content: editor?.getHTML() || post.content,
    }

    if (posts.some((p) => p.id === updatedPost.id)) {
      // Update existing post
      setPosts(posts.map((p) => (p.id === updatedPost.id ? updatedPost : p)))
    } else {
      // Add new post
      setPosts([...posts, updatedPost])
    }
    setIsEditing(false)
  }

  // Handle featured toggle
  const toggleFeatured = (postId: number) => {
    setPosts(posts.map((post) => (post.id === postId ? { ...post, featured: !post.featured } : post)))
  }

  // Handle image preview from URL
  useEffect(() => {
    if (imageUrl && activeImageTab === "url") {
      setIsImageLoading(true)
      setImagePreview(null)

      const img = new Image()
      img.onload = () => {
        setImagePreview(imageUrl)
        setIsImageLoading(false)
      }
      img.onerror = () => {
        setImagePreview(null)
        setIsImageLoading(false)
      }
      img.src = imageUrl
    }
  }, [imageUrl, activeImageTab])

  // Reset image dialog state when closed
  useEffect(() => {
    if (!isImageDialogOpen) {
      setImageUrl("")
      setImagePreview(null)
      setActiveImageTab("upload")
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }, [isImageDialogOpen])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsImageLoading(true)

      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setImagePreview(event.target.result as string)
        }
        setIsImageLoading(false)
      }
      reader.onerror = () => {
        setImagePreview(null)
        setIsImageLoading(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleInsertImage = () => {
    if (imagePreview) {
      editor?.chain().focus().setImage({ src: imagePreview }).run()
      setIsImageDialogOpen(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Blog Post Management</h2>
        <Button onClick={handleCreatePost}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Post
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>All Blog Posts</CardTitle>
              <CardDescription>Manage your blog posts, edit content, and control publication status.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search posts..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {mockCategories.map((category) => (
                      <SelectItem key={category.id} value={category.name.toLowerCase()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <UITable>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">ID</TableHead>
                      <TableHead className="w-[300px]">
                        <div className="flex items-center cursor-pointer" onClick={() => toggleSort("title")}>
                          Title
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>
                        <div className="flex items-center cursor-pointer" onClick={() => toggleSort("publishedAt")}>
                          Date
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center cursor-pointer" onClick={() => toggleSort("views")}>
                          Views
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>Featured</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPosts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                          No posts found. Try adjusting your filters or create a new post.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPosts.map((post) => (
                        <TableRow key={post.id}>
                          <TableCell>{post.id}</TableCell>
                          <TableCell className="font-medium">{post.title}</TableCell>
                          <TableCell>
                            <Badge variant={post.status === "published" ? "default" : "secondary"}>
                              {post.status === "published" ? "Published" : "Draft"}
                            </Badge>
                          </TableCell>
                          <TableCell>{format(new Date(post.publishedAt), "MMM dd, yyyy")}</TableCell>
                          <TableCell>{post.views.toLocaleString()}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" onClick={() => toggleFeatured(post.id)}>
                              {post.featured ? (
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
                                <DropdownMenuItem onClick={() => handleEditPost(post)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handlePreviewPost(post)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Preview
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDeleteClick(post)}>
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
                </UITable>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {filteredPosts.length} of {posts.length} posts
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Blog Statistics</CardTitle>
              <CardDescription>Overview of your blog performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-2">Post Status</h3>
                <div className="space-y-2">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm">Published</div>
                      <div className="text-sm text-muted-foreground">
                        {posts.filter((p) => p.status === "published").length}
                      </div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{
                          width: `${(posts.filter((p) => p.status === "published").length / posts.length) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm">Drafts</div>
                      <div className="text-sm text-muted-foreground">
                        {posts.filter((p) => p.status === "draft").length}
                      </div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-secondary rounded-full"
                        style={{
                          width: `${(posts.filter((p) => p.status === "draft").length / posts.length) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Top Categories</h3>
                <div className="space-y-2">
                  {mockCategories.slice(0, 5).map((category) => (
                    <div key={category.id}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm">{category.name}</div>
                        <div className="text-sm text-muted-foreground">{category.count} posts</div>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{
                            width: `${(category.count / Math.max(...mockCategories.map((c) => c.count))) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {mockTags.slice(0, 10).map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Post Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedPost?.id ? "Edit Post" : "Create New Post"}</DialogTitle>
            <DialogDescription>Make changes to your blog post here. Click save when you're done.</DialogDescription>
          </DialogHeader>

          {selectedPost && (
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="seo">SEO & Meta</TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={selectedPost.title}
                    onChange={(e) => setSelectedPost({ ...selectedPost, title: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={selectedPost.excerpt}
                    onChange={(e) => setSelectedPost({ ...selectedPost, excerpt: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <div className="rich-text-editor border rounded-md overflow-hidden bg-white dark:bg-gray-900 dark:border-gray-700 shadow-sm max-h-[400px] overflow-y-auto compact-line-spacing image-resizing-enabled">
                    {/* Toolbar */}
                    <div className="menu-bar flex flex-wrap gap-1 p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                      <div className="flex flex-wrap gap-1 mr-2 pr-2 border-r border-gray-200 dark:border-gray-700">
                        <Button
                          type="button"
                          size="sm"
                          variant={editor?.isActive("bold") ? "secondary" : "ghost"}
                          onClick={() => editor?.chain().focus().toggleBold().run()}
                          className="h-8 w-8 p-0"
                          title="Bold"
                        >
                          <Bold className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant={editor?.isActive("italic") ? "secondary" : "ghost"}
                          onClick={() => editor?.chain().focus().toggleItalic().run()}
                          className="h-8 w-8 p-0"
                          title="Italic"
                        >
                          <Italic className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant={editor?.isActive("underline") ? "secondary" : "ghost"}
                          onClick={() => editor?.chain().focus().toggleUnderline().run()}
                          className="h-8 w-8 p-0"
                          title="Underline"
                        >
                          <Underline className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex flex-wrap gap-1 mr-2 pr-2 border-r border-gray-200 dark:border-gray-700">
                        <Button
                          type="button"
                          size="sm"
                          variant={editor?.isActive("heading", { level: 2 }) ? "secondary" : "ghost"}
                          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                          className="h-8 w-8 p-0"
                          title="Heading 2"
                        >
                          <Heading2 className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant={editor?.isActive("heading", { level: 3 }) ? "secondary" : "ghost"}
                          onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                          className="h-8 w-8 p-0"
                          title="Heading 3"
                        >
                          <Heading3 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex flex-wrap gap-1 mr-2 pr-2 border-r border-gray-200 dark:border-gray-700">
                        <Button
                          type="button"
                          size="sm"
                          variant={editor?.isActive({ textAlign: "left" }) ? "secondary" : "ghost"}
                          onClick={() => editor?.chain().focus().setTextAlign("left").run()}
                          className="h-8 w-8 p-0"
                          title="Align Left"
                        >
                          <AlignLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant={editor?.isActive({ textAlign: "center" }) ? "secondary" : "ghost"}
                          onClick={() => editor?.chain().focus().setTextAlign("center").run()}
                          className="h-8 w-8 p-0"
                          title="Align Center"
                        >
                          <AlignCenter className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant={editor?.isActive({ textAlign: "right" }) ? "secondary" : "ghost"}
                          onClick={() => editor?.chain().focus().setTextAlign("right").run()}
                          className="h-8 w-8 p-0"
                          title="Align Right"
                        >
                          <AlignRight className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex flex-wrap gap-1 mr-2 pr-2 border-r border-gray-200 dark:border-gray-700">
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
                          }}
                          className="h-8 w-8 p-0"
                          title="Insert Table"
                        >
                          <Table className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex flex-wrap gap-1 mr-2 pr-2 border-r border-gray-200 dark:border-gray-700">
                        <Button
                          type="button"
                          size="sm"
                          variant={editor?.isActive("bulletList") ? "secondary" : "ghost"}
                          onClick={() => editor?.chain().focus().toggleBulletList().run()}
                          className="h-8 w-8 p-0"
                          title="Bullet List"
                        >
                          <List className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant={editor?.isActive("orderedList") ? "secondary" : "ghost"}
                          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                          className="h-8 w-8 p-0"
                          title="Numbered List"
                        >
                          <ListOrdered className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setIsLinkDialogOpen(true)
                          }}
                          className="h-8 w-8 p-0"
                          title="Insert Link"
                        >
                          <Link2 className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setIsImageDialogOpen(true)
                          }}
                          className="h-8 w-8 p-0"
                          title="Insert Image"
                        >
                          <ImageIcon className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex flex-wrap gap-1 ml-auto">
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => editor?.chain().focus().undo().run()}
                          disabled={!editor?.can().undo()}
                          className="h-8 w-8 p-0"
                          title="Undo"
                        >
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
                            className="lucide lucide-undo-2"
                          >
                            <path d="M9 14 4 9l5-5" />
                            <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11" />
                          </svg>
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => editor?.chain().focus().redo().run()}
                          disabled={!editor?.can().redo()}
                          className="h-8 w-8 p-0"
                          title="Redo"
                        >
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
                            className="lucide lucide-redo-2"
                          >
                            <path d="m15 14 5-5-5-5" />
                            <path d="M20 9H9.5A5.5 5.5 0 0 0 4 14.5v0A5.5 5.5 0 0 0 9.5 20H13" />
                          </svg>
                        </Button>
                      </div>
                    </div>

                    {/* Editor Content */}
                    <div className="bg-white dark:bg-black min-h-[200px]">
                      <EditorContent
                        editor={editor}
                        className="prose-sm prose-img:max-w-full prose-img:mx-auto dark:prose-invert dark:prose-headings:text-white dark:prose-p:text-gray-100 dark:prose-li:text-gray-100 dark:prose-strong:text-white dark:prose-em:text-gray-100 p-4"
                      />
                    </div>

                    {/* Image resizing initialization script */}
                    {editor && (
                      <script
                        dangerouslySetInnerHTML={{
                          __html: `
        document.addEventListener('DOMContentLoaded', function() {
          const editorElement = document.querySelector('.ProseMirror');
          if (editorElement) {
            // Make images selectable for resizing
            editorElement.addEventListener('click', (e) => {
              if (e.target.tagName === 'IMG') {
                // Create a wrapper for resizing if it doesn't exist
                if (!e.target.parentNode.classList.contains('resizable-image')) {
                  const wrapper = document.createElement('div');
                  wrapper.classList.add('resizable-image');
                  e.target.parentNode.insertBefore(wrapper, e.target);
                  wrapper.appendChild(e.target);
                }
              }
            });

            // Track aspect ratio during resize
            editorElement.addEventListener('mousedown', (e) => {
              const wrapper = e.target.closest('.resizable-image');
              if (wrapper) {
                const img = wrapper.querySelector('img');
                if (img) {
                  // Store original aspect ratio
                  wrapper.dataset.aspectRatio = img.naturalWidth / img.naturalHeight;
                  
                  const resizeObserver = new ResizeObserver(entries => {
                    for (let entry of entries) {
                      const target = entry.target;
                      const aspectRatio = parseFloat(target.dataset.aspectRatio);
                      if (aspectRatio) {
                        // Update image dimensions maintaining aspect ratio
                        img.style.width = '100%';
                        img.style.height = 'auto';
                      }
                    }
                  });
                  
                  resizeObserver.observe(wrapper);
                  
                  // Clean up observer when resize is done
                  document.addEventListener('mouseup', () => {
                    resizeObserver.disconnect();
                  }, { once: true });
                }
              }
            });
          }
        });
      `,
                        }}
                      />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Rich text editor supports formatting, links, images, and tables.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="author">Author</Label>
                    <Select
                      value={selectedPost.authorId.toString()}
                      onValueChange={(value) => {
                        const authorId = Number.parseInt(value)
                        const author = mockAuthors.find((a) => a.id === authorId)
                        setSelectedPost({
                          ...selectedPost,
                          authorId,
                          author: author ? author.name : selectedPost.author,
                        })
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select author" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockAuthors.map((author) => (
                          <SelectItem key={author.id} value={author.id.toString()}>
                            {author.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={selectedPost.status}
                      onValueChange={(value) => setSelectedPost({ ...selectedPost, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Publication Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <Calendar className="mr-2 h-4 w-4" />
                        {format(new Date(selectedPost.publishedAt), "PPP")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={new Date(selectedPost.publishedAt)}
                        onSelect={(date) => date && setSelectedPost({ ...selectedPost, publishedAt: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Categories</Label>
                  <div className="border rounded-md p-4 space-y-2">
                    {mockCategories.map((category) => (
                      <div key={category.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${category.id}`}
                          checked={selectedPost.categories.includes(category.name)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedPost({
                                ...selectedPost,
                                categories: [...selectedPost.categories, category.name],
                              })
                            } else {
                              setSelectedPost({
                                ...selectedPost,
                                categories: selectedPost.categories.filter((c) => c !== category.name),
                              })
                            }
                          }}
                        />
                        <Label htmlFor={`category-${category.id}`} className="text-sm font-normal">
                          {category.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    value={selectedPost.tags.join(", ")}
                    onChange={(e) => {
                      const tagsInput = e.target.value
                      const tagsArray = tagsInput
                        .split(",")
                        .map((tag) => tag.trim())
                        .filter((tag) => tag)
                      setSelectedPost({ ...selectedPost, tags: tagsArray })
                    }}
                    placeholder="Enter tags separated by commas"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={selectedPost.featured}
                    onCheckedChange={(checked) => {
                      setSelectedPost({ ...selectedPost, featured: !!checked })
                    }}
                  />
                  <Label htmlFor="featured">Featured post</Label>
                </div>
              </TabsContent>

              <TabsContent value="seo" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug</Label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                      /blog/
                    </span>
                    <Input
                      id="slug"
                      value={selectedPost.slug}
                      onChange={(e) => setSelectedPost({ ...selectedPost, slug: e.target.value })}
                      className="rounded-l-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="readTime">Read Time (minutes)</Label>
                  <Input
                    id="readTime"
                    type="number"
                    value={selectedPost.readTime}
                    onChange={(e) =>
                      setSelectedPost({ ...selectedPost, readTime: Number.parseInt(e.target.value) || 0 })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metaTitle">Meta Title</Label>
                  <Input
                    id="metaTitle"
                    value={selectedPost.title}
                    onChange={(e) => setSelectedPost({ ...selectedPost, title: e.target.value })}
                    placeholder="SEO title (defaults to post title)"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea
                    id="metaDescription"
                    value={selectedPost.excerpt}
                    onChange={(e) => setSelectedPost({ ...selectedPost, excerpt: e.target.value })}
                    placeholder="SEO description (defaults to post excerpt)"
                    rows={3}
                  />
                </div>
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={() => handleSavePost(selectedPost)}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Post Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Preview: {selectedPost?.title}</DialogTitle>
          </DialogHeader>

          {selectedPost && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold">{selectedPost.title}</h1>
                <div className="flex items-center text-sm text-muted-foreground space-x-4">
                  <div className="flex items-center">
                    <User className="mr-1 h-4 w-4" />
                    {selectedPost.author}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-4 w-4" />
                    {format(new Date(selectedPost.publishedAt), "MMMM d, yyyy")}
                  </div>
                  <div className="flex items-center">
                    <Tag className="mr-1 h-4 w-4" />
                    {selectedPost.readTime} min read
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedPost.categories.map((category: string) => (
                  <Badge key={category} variant="secondary">
                    {category}
                  </Badge>
                ))}
              </div>

              <div
                className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: selectedPost.content }}
              />

              <div className="pt-4 border-t">
                <div className="flex flex-wrap gap-2">
                  {selectedPost.tags.map((tag: string) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedPost?.title}"? This action cannot be undone.
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

      {/* Image Dialog */}
      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Insert Image</DialogTitle>
            <DialogDescription>Upload an image or provide a URL to insert into your content.</DialogDescription>
          </DialogHeader>

          <Tabs value={activeImageTab} onValueChange={setActiveImageTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="upload">Upload from Device</TabsTrigger>
              <TabsTrigger value="url">Image URL</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="image-upload">Upload Image</Label>
                <Input id="image-upload" type="file" accept="image/*" ref={fileInputRef} onChange={handleFileUpload} />
              </div>
            </TabsContent>

            <TabsContent value="url" className="space-y-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="image-url">Image URL</Label>
                <Input
                  id="image-url"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>
            </TabsContent>
          </Tabs>

          {/* Image Preview */}
          <div className="mt-4 border rounded-md p-4 min-h-[200px] flex items-center justify-center">
            {isImageLoading ? (
              <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                <p className="text-sm text-muted-foreground">Loading preview...</p>
              </div>
            ) : imagePreview ? (
              <div className="flex flex-col items-center gap-2">
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Preview"
                  className="max-h-[200px] max-w-full object-contain rounded-md"
                />
                <p className="text-sm text-muted-foreground">Image preview</p>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                <ImageIcon className="mx-auto h-12 w-12 opacity-20 mb-2" />
                <p>No image selected</p>
                <p className="text-sm">Upload an image or enter a URL to see a preview</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImageDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleInsertImage} disabled={!imagePreview}>
              Insert Image
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Link Dialog */}
      <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Insert Link</DialogTitle>
            <DialogDescription>Add a link to the selected text or image.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="link-url" className="col-span-4">
                URL
              </Label>
              <Input
                id="link-url"
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="col-span-4"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="open-new-tab"
                checked={openInNewTab}
                onCheckedChange={(checked) => setOpenInNewTab(!!checked)}
              />
              <Label htmlFor="open-new-tab">Open link in new tab</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLinkDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (linkUrl) {
                  editor
                    ?.chain()
                    .focus()
                    .setLink({
                      href: linkUrl,
                      target: openInNewTab ? "_blank" : null,
                    })
                    .run()
                  setIsLinkDialogOpen(false)
                  setLinkUrl("")
                  setOpenInNewTab(false)
                }
              }}
              disabled={!linkUrl}
            >
              Apply Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rich text editor styles */}
      <style jsx global>{`
        /* Table styles */
        .ProseMirror table {
          border-collapse: collapse;
          margin: 0;
          overflow: hidden;
          table-layout: fixed;
          width: 100%;
        }

        .ProseMirror table td,
        .ProseMirror table th {
          border: 2px solid #ced4da;
          box-sizing: border-box;
          min-width: 1em;
          padding: 3px 5px;
          position: relative;
          vertical-align: top;
        }

        .ProseMirror table th {
          background-color: #f1f3f5;
          font-weight: bold;
          text-align: left;
        }

        .ProseMirror table .selectedCell:after {
          background: rgba(200, 200, 255, 0.4);
          content: "";
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          pointer-events: none;
          position: absolute;
          z-index: 2;
        }

        .ProseMirror table .column-resize-handle {
          background-color: #adf;
          bottom: -2px;
          position: absolute;
          right: -2px;
          pointer-events: none;
          top: 0;
          width: 4px;
        }

        .ProseMirror table p {
          margin: 0;
        }
        
        /* Add compact line spacing for editor content */
        .compact-line-spacing .ProseMirror p {
          margin: 0.5em 0;
        }

        .compact-line-spacing .ProseMirror h1,
        .compact-line-spacing .ProseMirror h2,
        .compact-line-spacing .ProseMirror h3,
        .compact-line-spacing .ProseMirror h4,
        .compact-line-spacing .ProseMirror h5,
        .compact-line-spacing .ProseMirror h6 {
          margin: 0.7em 0 0.3em 0;
        }

        .compact-line-spacing .ProseMirror ul,
        .compact-line-spacing .ProseMirror ol {
          margin: 0.5em 0;
          padding-left: 1.5em;
        }

        .compact-line-spacing .ProseMirror li p {
          margin: 0.2em 0;
        }

        /* Image resizing styles */
        .image-resizing-enabled .ProseMirror img {
          position: relative;
          max-width: 100%;
          height: auto;
          cursor: default;
          transition: box-shadow 0.3s;
          margin: 1rem 0;
        }

        .image-resizing-enabled .ProseMirror img.ProseMirror-selectednode {
          outline: 3px solid #68CEF8;
          outline-offset: 2px;
        }

        .image-resizing-enabled .ProseMirror .resizable-image {
          display: inline-block;
          position: relative;
          margin: 0 auto 1rem;
          resize: both;
          overflow: hidden;
          max-width: 100%;
          height: auto;
        }

        .image-resizing-enabled .ProseMirror .resizable-image:hover {
          box-shadow: 0 0 0 3px rgba(104, 206, 248, 0.25);
        }

        .image-resizing-enabled .ProseMirror .resizable-image::after {
          content: '';
          position: absolute;
          bottom: 0;
          right: 0;
          width: 10px;
          height: 10px;
          background-color: #68CEF8;
          border-radius: 2px 0 0 0;
          cursor: nwse-resize;
        }

        .image-resizing-enabled .ProseMirror .resizable-image.ProseMirror-selectednode::after {
          background-color: #0096dd;
        }

        .image-resizing-enabled .ProseMirror .ProseMirror-hideselection *::selection {
          background: transparent;
        }

        .image-resizing-enabled .ProseMirror img {
          max-width: 100%;
          height: auto;
        }

        .ProseMirror .resize-width {
          width: 100%;
          height: auto;
        }

        .ProseMirror .resize-height {
          height: 100%;
          width: auto;
        }

        /* Handle in all four corners */
        .image-resizing-enabled .ProseMirror .resizable-image::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 10px;
          height: 10px;
          background-color: #68CEF8;
          border-radius: 0 0 2px 0;
          cursor: nwse-resize;
        }
      `}</style>
    </div>
  )
}
