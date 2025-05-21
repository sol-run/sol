"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { ArrowDown, ArrowUp, Calendar, Eye, GripVertical, Star, StarOff } from "lucide-react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { format } from "date-fns"

// Sample blog post data (same as in blog/page.tsx)
const initialBlogPosts = [
  {
    id: 1,
    title: "Getting Started with Digital Product Sales on Sol.Run",
    excerpt:
      "Learn how to set up your first digital product on Sol.Run and start earning with Solana blockchain payments.",
    author: "Sol.Run Team",
    date: "2025-03-20",
    readTime: "5 min read",
    category: "Tutorials",
    tags: ["Getting Started", "Digital Products", "Solana"],
    featured: true,
    featuredOrder: 1,
  },
  {
    id: 2,
    title: "Maximizing Your Affiliate Program Potential",
    excerpt:
      "Discover strategies to grow your affiliate network and increase your passive income through Sol.Run's multi-level marketing structure.",
    author: "Marketing Expert",
    date: "2025-03-15",
    readTime: "8 min read",
    category: "Marketing",
    tags: ["Affiliate Marketing", "MLM", "Passive Income"],
    featured: true,
    featuredOrder: 2,
  },
  {
    id: 3,
    title: "The Future of Digital Commerce on Solana",
    excerpt:
      "Explore how Solana blockchain is revolutionizing digital commerce with instant payments and minimal fees.",
    author: "Blockchain Analyst",
    date: "2025-03-10",
    readTime: "6 min read",
    category: "Blockchain",
    tags: ["Solana", "Blockchain", "Future Trends"],
    featured: false,
    featuredOrder: null,
  },
  {
    id: 4,
    title: "Creating Compelling Digital Products That Sell",
    excerpt:
      "Tips and best practices for creating high-quality digital products that attract customers and generate consistent sales.",
    author: "Product Designer",
    date: "2025-03-05",
    readTime: "7 min read",
    category: "Product Development",
    tags: ["Product Design", "Sales Strategy", "Quality"],
    featured: false,
    featuredOrder: null,
  },
  {
    id: 5,
    title: "Understanding Sol.Run's Payment Structure",
    excerpt:
      "A detailed breakdown of how payments work on Sol.Run, including platform fees, affiliate commissions, and withdrawal processes.",
    author: "Finance Specialist",
    date: "2025-02-28",
    readTime: "4 min read",
    category: "Finance",
    tags: ["Payments", "Fees", "Withdrawals"],
    featured: false,
    featuredOrder: null,
  },
]

export function FeaturedPostsSelection() {
  const [blogPosts, setBlogPosts] = useState(initialBlogPosts)
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false)
  const [currentPost, setCurrentPost] = useState<any>(null)

  const featuredPosts = blogPosts
    .filter((post) => post.featured)
    .sort((a, b) => (a.featuredOrder || 999) - (b.featuredOrder || 999))

  const nonFeaturedPosts = blogPosts
    .filter((post) => !post.featured)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const handleDragEnd = (result) => {
    if (!result.destination) return

    const items = Array.from(featuredPosts)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Update the featuredOrder for all items
    const updatedItems = items.map((item, index) => ({
      ...item,
      featuredOrder: index + 1,
    }))

    // Update the blogPosts state with the new order
    setBlogPosts(
      blogPosts.map((post) => {
        const updatedItem = updatedItems.find((item) => item.id === post.id)
        return updatedItem || post
      }),
    )
  }

  const toggleFeatured = (postId) => {
    const post = blogPosts.find((p) => p.id === postId)
    if (!post) return

    if (post.featured) {
      // Remove from featured
      setBlogPosts(blogPosts.map((p) => (p.id === postId ? { ...p, featured: false, featuredOrder: null } : p)))
    } else {
      // Add to featured
      const nextOrder = featuredPosts.length + 1
      setBlogPosts(blogPosts.map((p) => (p.id === postId ? { ...p, featured: true, featuredOrder: nextOrder } : p)))
    }
  }

  const moveUp = (postId) => {
    const postIndex = featuredPosts.findIndex((p) => p.id === postId)
    if (postIndex <= 0) return // Already at the top

    const newOrder = featuredPosts[postIndex].featuredOrder - 1
    const swapWithId = featuredPosts[postIndex - 1].id

    setBlogPosts(
      blogPosts.map((p) => {
        if (p.id === postId) {
          return { ...p, featuredOrder: newOrder }
        }
        if (p.id === swapWithId) {
          return { ...p, featuredOrder: newOrder + 1 }
        }
        return p
      }),
    )
  }

  const moveDown = (postId) => {
    const postIndex = featuredPosts.findIndex((p) => p.id === postId)
    if (postIndex >= featuredPosts.length - 1) return // Already at the bottom

    const newOrder = featuredPosts[postIndex].featuredOrder + 1
    const swapWithId = featuredPosts[postIndex + 1].id

    setBlogPosts(
      blogPosts.map((p) => {
        if (p.id === postId) {
          return { ...p, featuredOrder: newOrder }
        }
        if (p.id === swapWithId) {
          return { ...p, featuredOrder: newOrder - 1 }
        }
        return p
      }),
    )
  }

  const openPreviewDialog = (post) => {
    setCurrentPost(post)
    setIsPreviewDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Featured Posts Selection</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Featured Posts</CardTitle>
            <CardDescription>These posts will be highlighted on the blog homepage. Drag to reorder.</CardDescription>
          </CardHeader>
          <CardContent>
            {featuredPosts.length === 0 ? (
              <div className="text-center py-8 border border-dashed rounded-md">
                <p className="text-muted-foreground">No featured posts selected</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Select posts from the list on the right to feature them
                </p>
              </div>
            ) : (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="featured-posts">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                      {featuredPosts.map((post, index) => (
                        <Draggable key={post.id} draggableId={post.id.toString()} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`p-3 rounded-md border ${snapshot.isDragging ? "bg-accent" : "bg-card"}`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div {...provided.dragHandleProps} className="cursor-move">
                                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                                  </div>
                                  <div>
                                    <p className="font-medium">{post.title}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {post.category} • {format(new Date(post.date), "MMM d, yyyy")}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => moveUp(post.id)}
                                    disabled={index === 0}
                                  >
                                    <ArrowUp className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => moveDown(post.id)}
                                    disabled={index === featuredPosts.length - 1}
                                  >
                                    <ArrowDown className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" onClick={() => toggleFeatured(post.id)}>
                                    <StarOff className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" onClick={() => openPreviewDialog(post)}>
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">Featured posts are limited to {featuredPosts.length}/4</p>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Available Posts</CardTitle>
            <CardDescription>Select posts to feature on the blog homepage</CardDescription>
          </CardHeader>
          <CardContent>
            {nonFeaturedPosts.length === 0 ? (
              <div className="text-center py-8 border border-dashed rounded-md">
                <p className="text-muted-foreground">All posts are currently featured</p>
              </div>
            ) : (
              <div className="space-y-2">
                {nonFeaturedPosts.map((post) => (
                  <div key={post.id} className="p-3 rounded-md border bg-card">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{post.title}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="outline">{post.category}</Badge>
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {format(new Date(post.date), "MMM d, yyyy")}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleFeatured(post.id)}
                          disabled={featuredPosts.length >= 4}
                        >
                          <Star className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openPreviewDialog(post)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Preview Dialog */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Post Preview</DialogTitle>
          </DialogHeader>

          {currentPost && (
            <div className="py-4">
              <div className="mb-4">
                <h1 className="text-2xl font-bold">{currentPost.title}</h1>
                <div className="flex items-center text-sm text-muted-foreground mt-2">
                  <span>{currentPost.author}</span>
                  <span className="mx-2">•</span>
                  <span>{format(new Date(currentPost.date), "MMMM d, yyyy")}</span>
                  <span className="mx-2">•</span>
                  <span>{currentPost.readTime}</span>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  {currentPost.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="bg-gray-100 text-gray-800">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <p className="mt-4">{currentPost.excerpt}</p>
              </div>

              <div className="mt-6">
                <p className="text-muted-foreground italic">
                  This is just a preview showing the post metadata. The full content would be displayed here.
                </p>
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Featured Status:</p>
                    <p className="text-sm text-muted-foreground">
                      {currentPost.featured ? `Featured (Position: ${currentPost.featuredOrder})` : "Not Featured"}
                    </p>
                  </div>
                  <Button
                    variant={currentPost.featured ? "outline" : "default"}
                    onClick={() => {
                      toggleFeatured(currentPost.id)
                      setIsPreviewDialogOpen(false)
                    }}
                  >
                    {currentPost.featured ? (
                      <>
                        <StarOff className="mr-2 h-4 w-4" /> Remove from Featured
                      </>
                    ) : (
                      <>
                        <Star className="mr-2 h-4 w-4" /> Add to Featured
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setIsPreviewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
