"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PlusCircle, Trash2, FileText, ImageIcon, Film, Save, Download } from "lucide-react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { useToast } from "@/components/ui/use-toast"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import { Label } from "@/components/ui/label"
import { Bold, Italic, Underline, Link2, Heading2, Heading3, ListOrdered, List } from "lucide-react"
import TipTapUnderline from "@tiptap/extension-underline"
import Image from "@tiptap/extension-image"
import { AlignLeft, AlignCenter, AlignRight, Table } from "lucide-react"
import Alignment from "@tiptap/extension-text-align"
import TableExtension from "@tiptap/extension-table"
import TableRow from "@tiptap/extension-table-row"
import TableCell from "@tiptap/extension-table-cell"
import TableHeader from "@tiptap/extension-table-header"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Custom extension for resizable images
const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: (element) => element.getAttribute("width"),
        renderHTML: (attributes) => {
          if (!attributes.width) {
            return {}
          }
          return {
            width: attributes.width,
          }
        },
      },
      height: {
        default: null,
        parseHTML: (element) => element.getAttribute("height"),
        renderHTML: (attributes) => {
          if (!attributes.height) {
            return {}
          }
          return {
            height: attributes.height,
          }
        },
      },
      dataAspectRatio: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-aspect-ratio"),
        renderHTML: (attributes) => {
          if (!attributes.dataAspectRatio) {
            return {}
          }
          return {
            "data-aspect-ratio": attributes.dataAspectRatio,
          }
        },
      },
    }
  },
  addNodeView() {
    return ({ node, editor, getPos }) => {
      // Validate required parameters
      if (!node || !editor || typeof getPos !== "function") {
        console.error("Missing required parameters for node view")
        // Return a minimal node view that won't cause errors
        const fallbackContainer = document.createElement("div")
        fallbackContainer.textContent = "[Image Error]"
        return { dom: fallbackContainer }
      }

      // Create container and elements
      const container = document.createElement("div")
      container.classList.add("resizable-image-container")

      const imageElement = document.createElement("img")
      imageElement.src = node.attrs?.src || ""
      imageElement.alt = node.attrs?.alt || ""

      // Apply stored dimensions if available
      if (node.attrs?.width) {
        imageElement.width = node.attrs.width
        imageElement.style.width = `${node.attrs.width}px`
      }

      if (node.attrs?.height) {
        imageElement.height = node.attrs.height
        imageElement.style.height = `${node.attrs.height}px`
      }

      // Add resize indicator
      const resizeIndicator = document.createElement("div")
      resizeIndicator.classList.add("resize-indicator")
      resizeIndicator.textContent = `${imageElement.width || 0} × ${imageElement.height || 0}px`
      resizeIndicator.style.display = "none"

      // Set up aspect ratio if not already set
      if (!node.attrs?.dataAspectRatio) {
        const img = new window.Image()
        img.crossOrigin = "anonymous"
        img.onload = () => {
          if (img.width && img.height) {
            const aspectRatio = img.width / img.height

            // Update the node attributes with correct dimensions and aspect ratio
            editor.commands.updateAttributes("image", {
              dataAspectRatio: aspectRatio,
              width: img.width,
              height: img.height,
            })

            // Update the image element with natural dimensions
            imageElement.width = img.width
            imageElement.height = img.height
            imageElement.style.width = `${img.width}px`
            imageElement.style.height = `${img.height}px`

            // Update the resize indicator
            updateResizeIndicator()
          }
        }
        img.onerror = () => {
          console.warn("Failed to load image for aspect ratio calculation")
        }
        img.src = node.attrs?.src || ""
      }

      container.appendChild(imageElement)
      container.appendChild(resizeIndicator)

      // Function to update the resize indicator
      const updateResizeIndicator = () => {
        resizeIndicator.textContent = `${Math.round(imageElement.width || 0)} × ${Math.round(imageElement.height || 0)}px`
      }

      // Add resize handles
      const handles = ["nw", "ne", "sw", "se", "n", "s", "e", "w"]
      handles.forEach((direction) => {
        const handle = document.createElement("div")
        handle.classList.add("resize-handle", `resize-handle-${direction}`)
        container.appendChild(handle)

        let startX = 0
        let startY = 0
        let startWidth = 0
        let startHeight = 0
        let aspectRatio = node.attrs?.dataAspectRatio || 1
        let isResizing = false

        // Improved mouse down handler with proper null checks
        const onMouseDown = (event) => {
          if (!event) return
          event.preventDefault()
          event.stopPropagation()

          isResizing = true
          container.classList.add("resizing")
          resizeIndicator.style.display = "block"

          startX = event.clientX
          startY = event.clientY
          startWidth = imageElement.width || imageElement.offsetWidth
          startHeight = imageElement.height || imageElement.offsetHeight
          aspectRatio = node.attrs?.dataAspectRatio || startWidth / startHeight

          document.addEventListener("mousemove", onMouseMove)
          document.addEventListener("mouseup", onMouseUp)
        }

        // Improved touch start handler with proper null checks
        const onTouchStart = (event) => {
          if (!event || !event.touches || event.touches.length === 0) return
          event.preventDefault()

          isResizing = true
          container.classList.add("resizing")
          resizeIndicator.style.display = "block"

          const touch = event.touches[0]
          if (!touch) return

          startX = touch.clientX
          startY = touch.clientY
          startWidth = imageElement.width || imageElement.offsetWidth
          startHeight = imageElement.height || imageElement.offsetHeight
          aspectRatio = node.attrs?.dataAspectRatio || startWidth / startHeight

          document.addEventListener("touchmove", onTouchMove, { passive: false })
          document.addEventListener("touchend", onMouseUp)
        }

        // Improved mouse move handler with better updates
        const onMouseMove = (event) => {
          if (!event || !isResizing) return
          event.preventDefault()

          // Request animation frame for smoother updates
          window.requestAnimationFrame(() => {
            resizeImage(event.clientX, event.clientY, direction, aspectRatio)
            updateResizeIndicator()
          })
        }

        // Improved touch move handler with better updates
        const onTouchMove = (event) => {
          if (!event || !event.touches || event.touches.length === 0 || !isResizing) return
          event.preventDefault()

          const touch = event.touches[0]
          if (!touch) return

          // Request animation frame for smoother updates
          window.requestAnimationFrame(() => {
            resizeImage(touch.clientX, touch.clientY, direction, aspectRatio)
            updateResizeIndicator()
          })
        }

        // Improved resize function
        const resizeImage = (clientX, clientY, dir, ratio) => {
          if (typeof clientX !== "number" || typeof clientY !== "number" || !ratio) return

          const deltaX = clientX - startX
          const deltaY = clientY - startY

          let newWidth = startWidth
          let newHeight = startHeight

          // Handle different resize directions with improved aspect ratio handling
          if (dir.includes("e")) {
            newWidth = Math.max(50, startWidth + deltaX)
            newHeight = newWidth / ratio
          } else if (dir.includes("w")) {
            newWidth = Math.max(50, startWidth - deltaX)
            newHeight = newWidth / ratio
          } else if (dir.includes("s")) {
            newHeight = Math.max(50, startHeight + deltaY)
            newWidth = newHeight * ratio
          } else if (dir.includes("n")) {
            newHeight = Math.max(50, startHeight - deltaY)
            newWidth = newHeight * ratio
          } else if (dir === "nw") {
            // For corner handles, prioritize width change and calculate height
            newWidth = Math.max(50, startWidth - deltaX)
            newHeight = newWidth / ratio
          } else if (dir === "ne") {
            newWidth = Math.max(50, startWidth + deltaX)
            newHeight = newWidth / ratio
          } else if (dir === "sw") {
            newWidth = Math.max(50, startWidth - deltaX)
            newHeight = newWidth / ratio
          } else if (dir === "se") {
            newWidth = Math.max(50, startWidth + deltaX)
            newHeight = newWidth / ratio
          }

          // Apply new dimensions with both the attribute and style for cross-browser compatibility
          imageElement.width = Math.round(newWidth)
          imageElement.height = Math.round(newHeight)
          imageElement.style.width = `${Math.round(newWidth)}px`
          imageElement.style.height = `${Math.round(newHeight)}px`
        }

        // Improved mouse up handler with immediate node update
        const onMouseUp = () => {
          document.removeEventListener("mousemove", onMouseMove)
          document.removeEventListener("mouseup", onMouseUp)
          document.removeEventListener("touchmove", onTouchMove)
          document.removeEventListener("touchend", onMouseUp)

          isResizing = false
          container.classList.remove("resizing")
          resizeIndicator.style.display = "none"

          // Update the node attributes with new dimensions
          try {
            // Use setTimeout to ensure we don't interfere with ProseMirror events
            setTimeout(() => {
              editor.commands.updateAttributes("image", {
                width: Math.round(imageElement.width),
                height: Math.round(imageElement.height),
              })
            }, 0)
          } catch (error) {
            console.error("Error updating image attributes:", error)
          }
        }

        // Add event listeners
        handle.addEventListener("mousedown", onMouseDown)
        handle.addEventListener("touchstart", onTouchStart, { passive: false })
      })

      // Add selection indicator
      imageElement.addEventListener("click", () => {
        container.classList.add("selected")
      })

      // Remove selection when clicking elsewhere
      editor.on("selectionUpdate", () => {
        if (!editor.isActive("image")) {
          container.classList.remove("selected")
        }
      })

      return {
        dom: container,
        update: (updatedNode) => {
          if (!updatedNode) return true

          if (updatedNode.attrs?.src !== node.attrs?.src) {
            imageElement.src = updatedNode.attrs?.src || ""
          }
          if (updatedNode.attrs?.alt !== node.attrs?.alt) {
            imageElement.alt = updatedNode.attrs?.alt || ""
          }

          // Ensure both width and height are applied correctly
          if (updatedNode.attrs?.width) {
            imageElement.width = updatedNode.attrs.width
            imageElement.style.width = `${updatedNode.attrs.width}px`
          }
          if (updatedNode.attrs?.height) {
            imageElement.height = updatedNode.attrs.height
            imageElement.style.width = `${updatedNode.attrs.height}px`
          }

          return true
        },
        destroy: () => {
          // Clean up event listeners
          const handles = container.querySelectorAll(".resize-handle")
          handles.forEach((handle) => {
            const newHandle = handle.cloneNode(true)
            if (handle.parentNode) {
              handle.parentNode.replaceChild(newHandle, handle)
            }
          })

          // Remove editor event listeners
          editor.off("selectionUpdate")
        },
      }
    }
  },
})

type ProductFile = {
  id: string
  fileName: string
  fileType: string
  fileSize: number
  caption: string
}

type ProductPost = {
  id: string
  timestamp: Date
  files: ProductFile[]
  caption: string
  title: string // Added title to ProductPost interface
}

type ProductFilesManagerProps = {
  productId: number
  initialPosts: ProductPost[]
  onSave: (posts: ProductPost[]) => void
  fullPageMode?: boolean
  hideAddButton?: boolean
  onCancel?: () => void
  onUpdateClientsForPost?: (post: ProductPost) => void
}

export function ProductFilesManager({
  productId,
  initialPosts,
  onSave,
  fullPageMode = false,
  hideAddButton = false,
  onCancel,
  onUpdateClientsForPost,
}: ProductFilesManagerProps) {
  const [posts, setPosts] = useState<ProductPost[]>(initialPosts)
  const [isAddingPost, setIsAddingPost] = useState(false)
  const [newPostFiles, setNewPostFiles] = useState<ProductFile[]>([])
  const [newLink, setNewLink] = useState("")
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false)
  const [isLinkInsertDialogOpen, setIsLinkInsertDialogOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [linkOpenInNewTab, setLinkOpenInNewTab] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [draftPost, setDraftPost] = useState<{
    title: string // Added title to draftPost interface
    caption: string
    files: ProductFile[]
  } | null>(null)
  const [isDraftSaved, setIsDraftSaved] = useState(false)
  const [newPostTitle, setNewPostTitle] = useState("") // Added newPostTitle state
  const { toast } = useToast()
  const [newPostCaption, setNewPostCaption] = useState("") // Added newPostCaption state
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [imageUploadError, setImageUploadError] = useState<string | null>(null)
  const [isTableDialogOpen, setIsTableDialogOpen] = useState(false)
  const [tableRows, setTableRows] = useState(3)
  const [tableColumns, setTableColumns] = useState(3)
  const [includeHeaderRow, setIncludeHeaderRow] = useState(true)

  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [previewPost, setPreviewPost] = useState<ProductPost | null>(null)
  const [postToDelete, setPostToDelete] = useState<ProductPost | null>(null)

  const [downloadPermissions, setDownloadPermissions] = useState<Record<string, boolean>>({})

  const editor = useEditor({
    extensions: [
      StarterKit,
      TipTapUnderline,
      ResizableImage.configure({
        allowBase64: true,
        inline: false,
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
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: newPostCaption,
    onUpdate: ({ editor }) => {
      setNewPostCaption(editor.getHTML())
      setIsDraftSaved(false)
    },
    editorProps: {
      attributes: {
        class: "prose-sm max-w-none focus:outline-none min-h-[200px] dark:text-gray-50",
      },
    },
  })

  const [activeTab, setActiveTab] = useState<"upload" | "url">("upload")
  const [showImagePreview, setShowImagePreview] = useState(false)

  useEffect(() => {
    // Load draft from localStorage when component mounts
    const savedDraft = localStorage.getItem(`draft_post_${productId}`)
    if (savedDraft) {
      setDraftPost(JSON.parse(savedDraft))
    }
  }, [productId])

  useEffect(() => {
    // Autosave draft every 30 seconds
    const autosaveInterval = setInterval(() => {
      if ((isAddingPost || fullPageMode) && (newPostCaption || newPostFiles.length > 0 || newPostTitle)) {
        // Added newPostTitle to autosave condition
        saveDraft()
      }
    }, 30000)

    return () => clearInterval(autosaveInterval)
  }, [isAddingPost, fullPageMode, newPostFiles, newPostTitle, newPostCaption, editor]) // Added newPostCaption to dependency array

  const saveDraft = () => {
    const draft = {
      title: newPostTitle,
      caption: editor?.getHTML() || "",
      files: newPostFiles,
    }
    localStorage.setItem(`draft_post_${productId}`, JSON.stringify(draft))
    setDraftPost(draft)
    setIsDraftSaved(true)
    toast({
      title: "Draft saved",
      description: "Your post draft has been saved automatically.",
    })
  }

  const loadDraft = () => {
    if (draftPost) {
      setNewPostTitle(draftPost.title || "")
      editor?.commands.setContent(draftPost.caption)
      setNewPostFiles(draftPost.files)
      setIsDraftSaved(false)
      toast({
        title: "Draft loaded",
        description: "Your saved draft has been loaded.",
      })
    }
  }

  const clearDraft = () => {
    localStorage.removeItem(`draft_post_${productId}`)
    setDraftPost(null)
    setIsDraftSaved(false)
    setNewPostTitle("")
    editor?.commands.clearContent()
    toast({
      title: "Draft cleared",
      description: "Your post draft has been cleared.",
    })
  }

  const handleAddPost = () => {
    setIsAddingPost(true)
    setNewPostFiles([])
    setNewLink("")
    setNewPostTitle("") // Reset title when adding a new post
    editor?.commands.clearContent()
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newFiles: ProductFile[] = Array.from(files).map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        caption: "",
      }))
      setNewPostFiles((prevFiles) => [...prevFiles, ...newFiles])
    }
  }

  const handleRemoveFile = (fileId: string) => {
    setNewPostFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId))
  }

  const handleSavePost = () => {
    const newPost: ProductPost = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      files: newPostFiles,
      caption: editor?.getHTML() || "",
      title: newPostTitle,
    }
    setPosts((prevPosts) => [...prevPosts, newPost])
    onSave([...posts, newPost])
    clearDraft()
    setNewPostTitle("")
    setNewPostFiles([])
    editor?.commands.clearContent()

    if (fullPageMode && onCancel) {
      onCancel()
    } else {
      setIsAddingPost(false)
    }
  }

  const handleDeletePost = (postId: string) => {
    // Check if it's a real post
    if (!postId.startsWith("example-")) {
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId))
      onSave(posts.filter((post) => post.id !== postId))

      toast({
        title: "Post deleted",
        description: "The post has been successfully deleted.",
      })
    } else {
      // It's an example post
      toast({
        title: "Example post",
        description: "This is just an example post. You can create your own posts to replace these examples.",
      })
    }

    setIsDeleteDialogOpen(false)
  }

  const handleEditPost = (postId: string) => {
    // First check if it's a real post
    const postToEdit = posts.find((post) => post.id === postId)

    if (postToEdit) {
      setNewPostTitle(postToEdit.title)
      editor?.commands.setContent(postToEdit.caption)
      setNewPostFiles(postToEdit.files)
      setIsAddingPost(true)
      return
    }

    // If not found in real posts, check if it's an example post
    if (postId.startsWith("example-")) {
      // Get the example post data
      const examplePosts = [
        {
          id: "example-post-1",
          timestamp: new Date(Date.now() - 86400000 * 2),
          files: [
            {
              id: "example-file-1",
              fileName: "getting-started-guide.pdf",
              fileType: "application/pdf",
              fileSize: 1240000,
              caption: "Complete guide to get started with the product",
            },
            {
              id: "example-file-2",
              fileName: "welcome-video.mp4",
              fileType: "video/mp4",
              fileSize: 15400000,
              caption: "Introduction video",
            },
          ],
          caption:
            "<h2>Welcome to Your New Product!</h2><p>This is your <strong>getting started</strong> guide. We've included everything you need to begin using the product right away.</p><p>Check out the video for a quick overview.</p>",
          title: "Getting Started Guide",
        },
        {
          id: "example-post-2",
          timestamp: new Date(Date.now() - 86400000),
          files: [
            {
              id: "example-file-3",
              fileName: "resources.zip",
              fileType: "application/zip",
              fileSize: 8500000,
              caption: "All resource files in one package",
            },
          ],
          caption:
            "<p>Here are all the <a href='#' style='color: #3b82f6;'>resource files</a> you'll need for the advanced tutorials. Extract the ZIP file to access all materials.</p><p>Follow along with the included examples to master advanced techniques.</p>",
          title: "Resource Pack",
        },
        {
          id: "example-post-3",
          timestamp: new Date(Date.now() - 43200000),
          files: [
            {
              id: "example-file-4",
              fileName: "cheatsheet.pdf",
              fileType: "application/pdf",
              fileSize: 520000,
              caption: "Quick reference guide",
            },
            {
              id: "example-file-5",
              fileName: "templates.zip",
              fileType: "application/zip",
              fileSize: 3200000,
              caption: "Ready-to-use templates",
            },
          ],
          caption:
            "<h3>Quick Reference Materials</h3><p>Keep these handy for when you need a quick reminder of key functions and features.</p><ul><li>Keyboard shortcuts</li><li>Common workflows</li><li>Best practices</li></ul>",
          title: "Quick Reference Materials",
        },
        {
          id: "example-post-4",
          timestamp: new Date(),
          files: [
            {
              id: "example-file-6",
              fileName: "bonus-content.pdf",
              fileType: "application/pdf",
              fileSize: 1800000,
              caption: "Exclusive bonus content",
            },
            {
              id: "example-file-7",
              fileName: "https://example.com/webinar",
              fileType: "link",
              fileSize: 0,
              caption: "https://example.com/webinar",
            },
          ],
          caption:
            "<p>As a thank you for your purchase, we've included some <strong style='color: #3b82f6;'>exclusive bonus content</strong> that wasn't advertised!</p><p>Also, don't miss our upcoming <a href='#' style='color: #3b82f6;'>live webinar</a> where we'll cover advanced topics and answer your questions.</p><p><img src='/placeholder.svg?height=200&width=400' alt='Webinar preview' /></p>",
          title: "Bonus Content & Upcoming Webinar",
        },
      ]

      const examplePostToEdit = examplePosts.find((post) => post.id === postId)

      if (examplePostToEdit) {
        // Create a new ID for this post so it becomes a real post
        const newId = Math.random().toString(36).substr(2, 9)

        // Set up the editor with the example content
        setNewPostTitle(examplePostToEdit.title + " (Copy)")
        editor?.commands.setContent(examplePostToEdit.caption)

        // Copy the files but give them new IDs
        const newFiles = examplePostToEdit.files.map((file) => ({
          ...file,
          id: Math.random().toString(36).substr(2, 9),
        }))

        setNewPostFiles(newFiles)
        setIsAddingPost(true)

        toast({
          title: "Example post loaded",
          description: "You're now editing a copy of the example post. Save it to add it to your posts.",
        })
      }
    }
  }

  const handleAddLink = () => {
    if (newLink.trim()) {
      const newFile: ProductFile = {
        id: Math.random().toString(36).substr(2, 9),
        fileName: "External Link",
        fileType: "link",
        fileSize: 0,
        caption: newLink,
      }
      setNewPostFiles((prevFiles) => [...prevFiles, newFile])
      setNewLink("")
    }
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) return <ImageIcon className="h-6 w-6" />
    if (fileType.startsWith("video/")) return <Film className="h-6 w-6" />
    return <FileText className="h-6 w-6" />
  }

  const renderPostForm = () => {
    return (
      <div className="grid gap-4 py-4">
        <Input
          placeholder="Post title"
          value={newPostTitle}
          onChange={(e) => setNewPostTitle(e.target.value)}
          className="mb-2"
        />
        <div className="space-y-2">
          <Label htmlFor="post-content">Description / Caption</Label>
          <div className="rich-text-editor border rounded-md overflow-hidden bg-white dark:bg-gray-900 dark:border-gray-700 shadow-sm max-h-[400px] overflow-y-auto compact-line-spacing">
            {/* Toolbar */}
            <div className="menu-bar flex flex-wrap gap-1 p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="flex flex-wrap gap-1 mr-2 pr-2 border-r border-gray-200 dark:border-gray-700">
                <Button
                  type="button"
                  size="sm"
                  variant={editor?.isActive("bold") ? "secondary" : "ghost"}
                  onClick={() => (editor?.chain ? "secondary" : "ghost")}
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
                  onClick={() => setIsTableDialogOpen(true)}
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
                    // Check if a link is already active
                    if (editor?.isActive("link")) {
                      // If a link is already active, unset it
                      editor?.chain().focus().unsetLink().run()
                    } else {
                      // Check if text is selected
                      const selectedText = editor?.state.doc.textBetween(
                        editor.state.selection.from,
                        editor.state.selection.to,
                        " ",
                      )

                      // Check if an image is selected
                      const isImageSelected = editor?.isActive("image")

                      // Open dialog if text or image is selected, or if a link is already active
                      if (selectedText || isImageSelected || editor?.isActive("link")) {
                        setLinkUrl("")
                        setLinkOpenInNewTab(true)
                        setIsLinkInsertDialogOpen(true)
                      } else {
                        toast({
                          title: "Nothing selected",
                          description: "Please select text or an image to create a link.",
                          variant: "destructive",
                        })
                      }
                    }
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
                  onClick={() => setIsImageDialogOpen(true)}
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
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Button onClick={() => fileInputRef.current?.click()}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Files
            </Button>
            <Button onClick={() => setIsLinkDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Link
            </Button>
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} multiple />
            <Button onClick={saveDraft}>
              <Save className="mr-2 h-4 w-4" /> Save Draft
            </Button>
          </div>
          {draftPost && (
            <div className="flex space-x-2">
              <Button onClick={loadDraft} variant="outline">
                Load Draft
              </Button>
              <Button onClick={clearDraft} variant="outline">
                Clear Draft
              </Button>
            </div>
          )}
          <p className="text-sm text-gray-500">
            {isDraftSaved
              ? "Draft saved. You can continue editing or come back later."
              : "Unsaved changes. Draft will autosave every 30 seconds."}
          </p>
          <p className="text-sm text-gray-500">
            You can either upload files from your device, OR add links from Google Drive, OneDrive, Dropbox or any other
            file hosting platform.
          </p>
        </div>
        <DragDropContext
          onDragEnd={(result) => {
            if (!result.destination) return
            const items = Array.from(newPostFiles)
            const [reorderedItem] = items.splice(result.source.index, 1)
            items.splice(result.destination.index, 0, reorderedItem)
            setNewPostFiles(items)
          }}
        >
          <Droppable droppableId="files">
            {(provided) => (
              <ScrollArea
                className="h-[200px] w-full rounded-md border p-4"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {newPostFiles.map((file, index) => (
                  <Draggable key={file.id} draggableId={file.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="flex items-center justify-between mb-2"
                      >
                        <div className="flex items-center space-x-2">
                          {getFileIcon(file.fileType)}
                          {file.fileType === "link" ? (
                            <a
                              href={file.caption}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline"
                            >
                              {file.fileName}
                            </a>
                          ) : (
                            <span className="text-sm">{file.fileName}</span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="text"
                            placeholder="Add caption"
                            value={file.caption}
                            onChange={(e) => {
                              const updatedFiles = [...newPostFiles]
                              updatedFiles[index].caption = e.target.value
                              setNewPostFiles(updatedFiles)
                            }}
                            className="w-40"
                          />
                          <Button variant="ghost" size="sm" onClick={() => handleRemoveFile(file.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ScrollArea>
            )}
          </Droppable>
        </DragDropContext>
        <div className="flex justify-end space-x-2 mt-4">
          {fullPageMode && onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button
            onClick={handleSavePost}
            disabled={newPostFiles.length === 0 && !newPostCaption.trim() && !newPostTitle.trim()}
          >
            Save Post
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {!hideAddButton &&
        !fullPageMode &&
        (() => {
          const mockupPosts: ProductPost[] = [
            {
              id: "example-post-1",
              timestamp: new Date(Date.now() - 86400000 * 2), // 2 days ago
              files: [
                {
                  id: "example-file-1",
                  fileName: "getting-started-guide.pdf",
                  fileType: "application/pdf",
                  fileSize: 1240000,
                  caption: "Complete guide to get started with the product",
                },
                {
                  id: "example-file-2",
                  fileName: "welcome-video.mp4",
                  fileType: "video/mp4",
                  fileSize: 15400000,
                  caption: "Introduction video",
                },
              ],
              caption:
                "<h2>Welcome to Your New Product!</h2><p>This is your <strong>getting started</strong> guide. We've included everything you need to begin using the product right away.</p><p>Check out the video for a quick overview.</p>",
              title: "Getting Started Guide",
            },
            {
              id: "example-post-2",
              timestamp: new Date(Date.now() - 86400000), // 1 day ago
              files: [
                {
                  id: "example-file-3",
                  fileName: "resources.zip",
                  fileType: "application/zip",
                  fileSize: 8500000,
                  caption: "All resource files in one package",
                },
              ],
              caption:
                "<p>Here are all the <a href='#' style='color: #3b82f6;'>resource files</a> you'll need for the advanced tutorials. Extract the ZIP file to access all materials.</p><p>Follow along with the included examples to master advanced techniques.</p>",
              title: "Resource Pack",
            },
            {
              id: "example-post-3",
              timestamp: new Date(Date.now() - 43200000), // 12 hours ago
              files: [
                {
                  id: "example-file-4",
                  fileName: "cheatsheet.pdf",
                  fileType: "application/pdf",
                  fileSize: 520000,
                  caption: "Quick reference guide",
                },
                {
                  id: "example-file-5",
                  fileName: "templates.zip",
                  fileType: "application/zip",
                  fileSize: 3200000,
                  caption: "Ready-to-use templates",
                },
              ],
              caption:
                "<h3>Quick Reference Materials</h3><p>Keep these handy for when you need a quick reminder of key functions and features.</p><ul><li>Keyboard shortcuts</li><li>Common workflows</li><li>Best practices</li></ul>",
              title: "Quick Reference Materials",
            },
            {
              id: "example-post-4",
              timestamp: new Date(), // Now
              files: [
                {
                  id: "example-file-6",
                  fileName: "bonus-content.pdf",
                  fileType: "application/pdf",
                  fileSize: 1800000,
                  caption: "Exclusive bonus content",
                },
                {
                  id: "example-file-7",
                  fileName: "https://example.com/webinar",
                  fileType: "link",
                  fileSize: 0,
                  caption: "https://example.com/webinar",
                },
              ],
              caption:
                "<p>As a thank you for your purchase, we've included some <strong style='color: #3b82f6;'>exclusive bonus content</strong> that wasn't advertised!</p><p>Also, don't miss our upcoming <a href='#' style='color: #3b82f6;'>live webinar</a> where we'll cover advanced topics and answer your questions.</p><p><img src='/placeholder.svg?height=200&width=400' alt='Webinar preview' /></p>",
              title: "Bonus Content & Upcoming Webinar",
            },
          ]

          return (
            <Button onClick={handleAddPost}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New
            </Button>
          )
        })()}

      {fullPageMode ? (
        renderPostForm()
      ) : (
        <>
          {posts.length > 0 ? (
            posts.map((post) => (
              <Card key={post.id} className="mb-4">
                <CardHeader>
                  <CardTitle className="flex flex-col items-start">
                    <div className="flex justify-between w-full">
                      <span className="font-bold text-lg mb-1">{post.title}</span>
                      <div className="flex items-center space-x-2">
                        <Select
                          defaultValue={downloadPermissions[post.id] !== false ? "allow" : "viewOnly"}
                          onValueChange={(value) => {
                            setDownloadPermissions((prev) => ({
                              ...prev,
                              [post.id]: value === "allow",
                            }))
                          }}
                        >
                          <SelectTrigger className="h-8 w-[160px]">
                            <SelectValue placeholder="Download Permission" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="allow">
                              <span className="text-green-500">Allow Downloads</span>
                            </SelectItem>
                            <SelectItem value="viewOnly">
                              <span className="text-orange-500">View Only</span>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {post.timestamp.toLocaleDateString("en-US", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}{" "}
                      (
                      {post.timestamp.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}
                      )
                    </span>
                    <div className="mt-1">
                      {downloadPermissions[post.id] !== false ? (
                        <span className="text-xs text-green-500">Downloading enabled for image and video files</span>
                      ) : (
                        <span className="text-xs text-amber-500">Downloading disabled for image and video files</span>
                      )}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-start mb-2">
                    <div className="prose-sm max-w-none dark:prose-invert">
                      {(() => {
                        // Function to strip HTML tags and get plain text
                        const stripHtml = (html) => {
                          const doc = new DOMParser().parseFromString(html, "text/html")
                          return doc.body.textContent || ""
                        }

                        // Get plain text from HTML
                        const plainText = stripHtml(post.caption)

                        // Truncate to first 100 characters or first sentence
                        const truncated =
                          plainText.length > 100
                            ? plainText.substring(0, 100).split(".")[0] + "."
                            : plainText.split(".")[0] + "."

                        return (
                          <div>
                            {truncated}{" "}
                            <span
                              className="text-blue-500 hover:underline cursor-pointer"
                              onClick={() => {
                                setPreviewPost(post)
                                setIsPreviewDialogOpen(true)
                              }}
                            >
                              See More
                            </span>
                          </div>
                        )
                      })()}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditPost(post.id)}>
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setPreviewPost(post)
                          setIsPreviewDialogOpen(true)
                        }}
                      >
                        Preview
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setPostToDelete(post)
                          setIsDeleteDialogOpen(true)
                        }}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                      >
                        Delete
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onUpdateClientsForPost && onUpdateClientsForPost(post)}
                        className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                      >
                        Update Clients
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {post.files.map((file) => (
                      <div key={file.id} className="flex flex-col space-y-1 border p-2 rounded">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {getFileIcon(file.fileType)}
                            {file.fileType === "link" ? (
                              <a
                                href={file.caption}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                              >
                                {file.fileName}
                              </a>
                            ) : (
                              <span className="text-sm">{file.fileName}</span>
                            )}
                          </div>
                          {/* Show download button based on file type and permission */}
                          {(downloadPermissions[post.id] !== false ||
                            !(file.fileType.startsWith("image/") || file.fileType.startsWith("video/"))) && (
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        {file.caption && <p className="text-xs text-gray-500">{file.caption}</p>}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            // Show mockup example posts when no real posts exist
            <div className="space-y-4">
              <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-md p-3 mb-4">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <span className="font-medium">Example content:</span> These are example posts to show how your content
                  will appear. You can interact with them as if they were real posts.
                </p>
              </div>

              {(() => {
                const mockupPosts: ProductPost[] = [
                  {
                    id: "example-post-1",
                    timestamp: new Date(Date.now() - 86400000 * 2), // 2 days ago
                    files: [
                      {
                        id: "example-file-1",
                        fileName: "getting-started-guide.pdf",
                        fileType: "application/pdf",
                        fileSize: 1240000,
                        caption: "Complete guide to get started with the product",
                      },
                      {
                        id: "example-file-2",
                        fileName: "welcome-video.mp4",
                        fileType: "video/mp4",
                        fileSize: 15400000,
                        caption: "Introduction video",
                      },
                    ],
                    caption:
                      "<h2>Welcome to Your New Product!</h2><p>This is your <strong>getting started</strong> guide. We've included everything you need to begin using the product right away.</p><p>Check out the video for a quick overview.</p>",
                    title: "Getting Started Guide",
                  },
                  {
                    id: "example-post-2",
                    timestamp: new Date(Date.now() - 86400000), // 1 day ago
                    files: [
                      {
                        id: "example-file-3",
                        fileName: "resources.zip",
                        fileType: "application/zip",
                        fileSize: 8500000,
                        caption: "All resource files in one package",
                      },
                    ],
                    caption:
                      "<p>Here are all the <a href='#' style='color: #3b82f6;'>resource files</a> you'll need for the advanced tutorials. Extract the ZIP file to access all materials.</p><p>Follow along with the included examples to master advanced techniques.</p>",
                    title: "Resource Pack",
                  },
                  {
                    id: "example-post-3",
                    timestamp: new Date(Date.now() - 43200000), // 12 hours ago
                    files: [
                      {
                        id: "example-file-4",
                        fileName: "cheatsheet.pdf",
                        fileType: "application/pdf",
                        fileSize: 520000,
                        caption: "Quick reference guide",
                      },
                      {
                        id: "example-file-5",
                        fileName: "templates.zip",
                        fileType: "application/zip",
                        fileSize: 3200000,
                        caption: "Ready-to-use templates",
                      },
                    ],
                    caption:
                      "<h3>Quick Reference Materials</h3><p>Keep these handy for when you need a quick reminder of key functions and features.</p><ul><li>Keyboard shortcuts</li><li>Common workflows</li><li>Best practices</li></ul>",
                    title: "Quick Reference Materials",
                  },
                  {
                    id: "example-post-4",
                    timestamp: new Date(), // Now
                    files: [
                      {
                        id: "example-file-6",
                        fileName: "bonus-content.pdf",
                        fileType: "application/pdf",
                        fileSize: 1800000,
                        caption: "Exclusive bonus content",
                      },
                      {
                        id: "example-file-7",
                        fileName: "https://example.com/webinar",
                        fileType: "link",
                        fileSize: 0,
                        caption: "https://example.com/webinar",
                      },
                    ],
                    caption:
                      "<p>As a thank you for your purchase, we've included some <strong style='color: #3b82f6;'>exclusive bonus content</strong> that wasn't advertised!</p><p>Also, don't miss our upcoming <a href='#' style='color: #3b82f6;'>live webinar</a> where we'll cover advanced topics and answer your questions.</p><p><img src='/placeholder.svg?height=200&width=400' alt='Webinar preview' /></p>",
                    title: "Bonus Content & Upcoming Webinar",
                  },
                ]

                return mockupPosts.map((post) => (
                  <Card key={post.id} className="mb-4 border-dashed border-gray-300 dark:border-gray-700">
                    <CardHeader>
                      <CardTitle className="flex justify-between items-start w-full">
                        <div className="flex flex-col">
                          <span className="font-bold text-lg mb-1">{post.title}</span>
                          <span className="text-sm text-muted-foreground">
                            {post.timestamp.toLocaleDateString("en-US", {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}{" "}
                            (
                            {post.timestamp.toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}
                            )
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            title="Edit Post"
                            onClick={() => handleEditPost(post.id)}
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
                              className="lucide lucide-pencil"
                            >
                              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                              <path d="m15 5 4 4" />
                            </svg>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            title="Preview Post"
                            onClick={() => {
                              setPreviewPost(post)
                              setIsPreviewDialogOpen(true)
                            }}
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
                              className="lucide lucide-eye"
                            >
                              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            title="Update Clients"
                            onClick={() => {
                              if (onUpdateClientsForPost) {
                                onUpdateClientsForPost(post)
                              } else {
                                toast({
                                  title: "Example post",
                                  description:
                                    "This is just an example post. You can update clients with your own posts.",
                                })
                              }
                            }}
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
                              className="lucide lucide-bell text-blue-500"
                            >
                              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                            </svg>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            title="Delete Post"
                            onClick={() => {
                              setPostToDelete(post)
                              setIsDeleteDialogOpen(true)
                            }}
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
                              className="lucide lucide-trash-2 text-red-500"
                            >
                              <path d="M3 6h18" />
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                              <line x1="10" x2="10" y1="11" y2="17" />
                              <line x1="14" x2="14" y1="11" y2="17" />
                            </svg>
                          </Button>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-start mb-2">
                        <div
                          className="prose-sm max-w-none dark:prose-invert"
                          dangerouslySetInnerHTML={{ __html: post.caption }}
                        />
                        <div className="flex items-center">
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 rounded-full">
                            Example
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {post.files.map((file) => (
                          <div key={file.id} className="flex flex-col space-y-1 border p-2 rounded">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                {getFileIcon(file.fileType)}
                                {file.fileType === "link" ? (
                                  <a
                                    className="text-blue-500 hover:underline"
                                    href={file.caption}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {file.fileName}
                                  </a>
                                ) : (
                                  <span className="text-sm truncate">{file.fileName}</span>
                                )}
                              </div>
                              {(downloadPermissions[post.id] !== false ||
                                !(file.fileType.startsWith("image/") || file.fileType.startsWith("video/"))) && (
                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                  <Download className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                            {file.caption && <p className="text-xs text-gray-500">{file.caption}</p>}
                            {file.fileSize > 0 && (
                              <p className="text-xs text-gray-500">{(file.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))
              })()}
            </div>
          )}

          <Dialog open={isAddingPost} onOpenChange={setIsAddingPost}>
            <DialogContent className="sm:max-w-[700px] md:max-w-[800px] w-[90vw]">
              <DialogHeader>
                <DialogTitle>Add New Post</DialogTitle>
              </DialogHeader>
              {renderPostForm()}
            </DialogContent>
          </Dialog>
        </>
      )}

      <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add External Link</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Enter the external link URL"
              value={newLink}
              onChange={(e) => setNewLink(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                if (newLink.trim()) {
                  handleAddLink()
                  setIsLinkDialogOpen(false)
                }
              }}
            >
              Add Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isTableDialogOpen} onOpenChange={setIsTableDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Insert Table</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="table-rows">Rows</Label>
              <Input
                id="table-rows"
                type="number"
                min="1"
                max="20"
                value={tableRows}
                onChange={(e) => setTableRows(Number.parseInt(e.target.value) || 1)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="table-columns">Columns</Label>
              <Input
                id="table-columns"
                type="number"
                min="1"
                max="10"
                value={tableColumns}
                onChange={(e) => setTableColumns(Number.parseInt(e.target.value) || 1)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="include-header"
                checked={includeHeaderRow}
                onChange={(e) => setIncludeHeaderRow(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="include-header" className="text-sm font-normal">
                Include header row
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                if (tableRows > 0 && tableColumns > 0) {
                  editor
                    ?.chain()
                    .focus()
                    .insertTable({
                      rows: tableRows,
                      cols: tableColumns,
                      withHeaderRow: includeHeaderRow,
                    })
                    .run()
                  setIsTableDialogOpen(false)
                }
              }}
            >
              Insert Table
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent className="sm:max-w-[500px] w-[90vw]">
          <DialogHeader>
            <DialogTitle>Insert Image</DialogTitle>
          </DialogHeader>

          {/* Replace with proper tabs */}
          <div className="border-b border-gray-200">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab("upload")}
                className={`px-4 py-2 font-medium text-sm transition-all ${
                  activeTab === "upload"
                    ? "border-b-2 border-primary text-primary"
                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                type="button"
              >
                Upload from device
              </button>
              <button
                onClick={() => setActiveTab("url")}
                className={`px-4 py-2 font-medium text-sm transition-all ${
                  activeTab === "url"
                    ? "border-b-2 border-primary text-primary"
                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                type="button"
              >
                Image URL
              </button>
            </div>
          </div>

          <div className="py-4">
            {activeTab === "upload" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="image-upload-tab">Upload from your device</Label>
                  <Input
                    id="image-upload-tab"
                    type="file"
                    accept=".jpg,.jpeg,.png,.svg,.gif"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (!file) return

                      // Validate file type
                      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/svg+xml", "image/gif"]
                      if (!validTypes.includes(file.type)) {
                        setImageUploadError("Invalid file type. Please upload a JPG, JPEG, PNG, SVG, or GIF image.")
                        return
                      }

                      // Validate file size (2MB max)
                      if (file.size > 2 * 1024 * 1024) {
                        setImageUploadError("File size exceeds 2MB limit. Please upload a smaller image.")
                        return
                      }

                      setImageUploadError(null)

                      // Read the file
                      const reader = new FileReader()
                      reader.onload = function () {
                        setImageUrl(this.result as string)

                        // Show image preview
                        setShowImagePreview(true)
                      }
                      reader.onerror = () => {
                        setImageUploadError("Error reading file. Please try again.")
                      }
                      reader.readAsDataURL(file)
                    }}
                  />
                  {imageUploadError && <p className="text-sm text-red-500">{imageUploadError}</p>}
                  <p className="text-xs text-muted-foreground">
                    Maximum file size: 2MB. Supported formats: JPG, JPEG, PNG, SVG, GIF.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "url" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="image-url-tab">Image URL</Label>
                  <Input
                    id="image-url-tab"
                    placeholder="Enter the image URL"
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value)
                      setImageUploadError(null)

                      // If URL is valid, show preview
                      if (e.target.value.match(/^https?:\/\/.+\.(jpeg|jpg|png|gif|svg)(\?.*)?$/i)) {
                        setShowImagePreview(true)
                      } else {
                        setShowImagePreview(false)
                      }
                    }}
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter a direct URL to an image file (JPG, PNG, GIF, etc.)
                  </p>
                </div>
              </div>
            )}

            {/* Image preview */}
            {showImagePreview && imageUrl && (
              <div className="mt-4 border rounded-md p-2">
                <p className="text-sm font-medium mb-2">Preview:</p>
                <div className="relative bg-gray-100 rounded flex items-center justify-center h-40 overflow-hidden">
                  <img
                    src={imageUrl || "/placeholder.svg"}
                    alt="Preview"
                    className="max-h-full max-w-full object-contain"
                    onError={() => {
                      setImageUploadError("Invalid image URL or the image couldn't be loaded")
                      setShowImagePreview(false)
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              onClick={() => {
                if (imageUrl) {
                  try {
                    // Get a reference to the editor and its current selection
                    const editorElement = editor?.view?.dom
                    if (editorElement) {
                      editorElement.focus()
                    }

                    // Use window.Image to ensure we're using the browser's global Image constructor
                    const tempImg = new window.Image()
                    tempImg.crossOrigin = "anonymous"
                    tempImg.onload = () => {
                      // Calculate 40% of the editor width as default
                      const editorWidth = editor?.view?.dom?.clientWidth || 600
                      const defaultWidth = Math.round(editorWidth * 0.4)

                      // Calculate proportional height based on aspect ratio
                      const aspectRatio = tempImg.naturalWidth / tempImg.naturalHeight
                      const defaultHeight = Math.round(defaultWidth / aspectRatio)

                      // Insert image with calculated dimensions
                      editor
                        ?.chain()
                        .focus()
                        .setImage({
                          src: imageUrl,
                          alt: "User inserted image",
                          width: defaultWidth,
                          height: defaultHeight,
                          dataAspectRatio: aspectRatio,
                        })
                        .run()
                    }
                    tempImg.onerror = () => {
                      // Fallback if image loading fails
                      editor
                        ?.chain()
                        .focus()
                        .setImage({
                          src: imageUrl,
                          alt: "User inserted image",
                        })
                        .run()

                      toast({
                        title: "Warning",
                        description: "Could not determine image dimensions. The image may appear distorted.",
                        variant: "destructive",
                      })
                    }
                    tempImg.src = imageUrl

                    setImageUrl("")
                    setIsImageDialogOpen(false)
                    setShowImagePreview(false)
                  } catch (error) {
                    console.error("Error inserting image:", error)
                    toast({
                      title: "Error",
                      description: "Failed to insert image. Please try again.",
                      variant: "destructive",
                    })
                  }
                } else {
                  toast({
                    title: "No image selected",
                    description: "Please select an image file or enter a valid URL.",
                    variant: "destructive",
                  })
                }
              }}
              disabled={!imageUrl || !!imageUploadError}
            >
              Insert Image
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isLinkInsertDialogOpen} onOpenChange={setIsLinkInsertDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Insert Link</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="link-url">URL</Label>
              <Input
                id="link-url"
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="open-in-new-tab"
                checked={linkOpenInNewTab}
                onChange={(e) => setLinkOpenInNewTab(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="open-in-new-tab" className="text-sm font-normal">
                Open link in new tab
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                if (linkUrl.trim()) {
                  // Check if we're linking an image
                  const isImageSelected = editor?.isActive("image")

                  if (isImageSelected) {
                    // For images, we need to wrap the image in a link
                    // First get the current image attributes
                    const imageAttrs = editor?.getAttributes("image")

                    // Replace the image with a linked version
                    editor
                      ?.chain()
                      .focus()
                      .extendMarkRange("image")
                      .setLink({
                        href: linkUrl,
                        target: linkOpenInNewTab ? "_blank" : null,
                      })
                      .run()
                  } else {
                    // Regular text link
                    editor
                      ?.chain()
                      .focus()
                      .setLink({
                        href: linkUrl,
                        target: linkOpenInNewTab ? "_blank" : null,
                      })
                      .run()
                  }

                  setIsLinkInsertDialogOpen(false)
                }
              }}
              disabled={!linkUrl.trim()}
            >
              Insert Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Preview Dialog */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="sm:max-w-[700px] md:max-w-[800px] w-[90vw] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{previewPost?.title || "Post Preview"}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {previewPost && (
              <>
                <div className="text-sm text-muted-foreground mb-4">
                  {previewPost.timestamp.toLocaleDateString("en-US", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}{" "}
                  at{" "}
                  {previewPost.timestamp.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </div>

                <div
                  className="prose-sm max-w-none dark:prose-invert mb-6 border-b pb-6"
                  dangerouslySetInnerHTML={{ __html: previewPost.caption }}
                />

                <h4 className="text-sm font-medium mb-2">Attached Files:</h4>
                <div className="grid grid-cols-1 gap-3">
                  {previewPost.files.map((file) => (
                    <div key={file.id} className="flex flex-col space-y-1 border p-3 rounded">
                      <div className="flex items-center space-x-2">
                        {getFileIcon(file.fileType)}
                        {file.fileType === "link" ? (
                          <a
                            className="text-blue-500 hover:underline"
                            href={file.caption}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {file.fileName}
                          </a>
                        ) : (
                          <span className="text-sm font-medium">{file.fileName}</span>
                        )}
                      </div>
                      {file.caption && <p className="text-xs text-gray-500">{file.caption}</p>}
                      {file.fileSize > 0 && (
                        <p className="text-xs text-gray-500">{(file.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsPreviewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-500">
              Are you sure you want to delete this post? This action cannot be undone.
            </p>
            {postToDelete && (
              <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                <p className="font-medium text-sm">{postToDelete.title}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {postToDelete.files.length} file(s) attached • Posted on {postToDelete.timestamp.toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (postToDelete) {
                  handleDeletePost(postToDelete.id)
                }
              }}
            >
              {postToDelete && postToDelete.id.startsWith("example-") ? "Acknowledge" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Resizable image styles */}
      <style jsx global>{`
        /* Resizable image styles */
        .resizable-image-container {
          position: relative;
          display: inline-block;
          max-width: 100%;
          margin: 1rem 0;
        }

        .resizable-image-container img {
          display: block;
          max-width: 100%;
          height: auto;
        }

        .resizable-image-container.selected {
          outline: 2px solid #3b82f6;
        }

        .dark .resizable-image-container.selected {
          outline: 2px solid #60a5fa;
        }

        .resize-handle {
          position: absolute;
          width: 10px;
          height: 10px;
          background-color: #3b82f6;
          border-radius: 50%;
          border: 1px solid white;
          z-index: 10;
        }

        .dark .resize-handle {
          background-color: #60a5fa;
          border: 1px solid #1f2937;
        }

        .resize-handle-nw {
          top: -5px;
          left: -5px;
          cursor: nwse-resize;
        }

        .resize-handle-ne {
          top: -5px;
          right: -5px;
          cursor: nesw-resize;
        }

        .resize-handle-sw {
          bottom: -5px;
          left: -5px;
          cursor: nesw-resize;
        }

        .resize-handle-se {
          bottom: -5px;
          right: -5px;
          cursor: nwse-resize;
        }

        .resize-handle-n {
          top: -5px;
          left: 50%;
          transform: translateX(-50%);
          cursor: ns-resize;
        }

        .resize-handle-s {
          bottom: -5px;
          left: 50%;
          transform: translateX(-50%);
          cursor: ns-resize;
        }

        .resize-handle-e {
          right: -5px;
          top: 50%;
          transform: translateY(-50%);
          cursor: ew-resize;
        }

        .resize-handle-w {
          left: -5px;
          top: 50%;
          transform: translateY(-50%);
          cursor: ew-resize;
        }

        /* Touch-friendly adjustments */
        @media (max-width: 768px) {
          .resize-handle {
            width: 16px;
            height: 16px;
          }

          .resize-handle-nw {
            top: -8px;
            left: -8px;
          }

          .resize-handle-ne {
            top: -8px;
            right: -8px;
          }

          .resize-handle-sw {
            bottom: -8px;
            left: -8px;
          }

          .resize-handle-se {
            bottom: -8px;
            right: -8px;
          }

          .resize-handle-n {
            top: -8px;
          }

          .resize-handle-s {
            bottom: -8px;
          }

          .resize-handle-e {
            right: -8px;
          }

          .resize-handle-w {
            left: -8px;
          }
        }

      /* New resizing styles */
      .resizable-image-container.resizing {
        pointer-events: none;
        user-select: none;
      }
      
      .resizable-image-container.resizing img {
        opacity: 0.7;
      }
      
      .resize-indicator {
        position: absolute;
        bottom: 10px;
        right: 10px;
        background-color: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 12px;
        pointer-events: none;
        z-index: 20;
      }
      
      .dark .resize-indicator {
        background-color: rgba(255, 255, 255, 0.7);
        color: black;
      }
      
      /* Improve handle visibility */
      .resize-handle {
        opacity: 0;
        transition: opacity 0.2s ease;
      }
      
      .resizable-image-container:hover .resize-handle,
      .resizable-image-container.selected .resize-handle {
        opacity: 1;
      }
      
      /* Animation for smoother resize transitions */
      .resizable-image-container:not(.resizing) img {
        transition: width 0.1s ease, height 0.1s ease;
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
      `}</style>
    </div>
  )
}
