"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card"
import {
  PlusCircle,
  Trash2,
  Bold,
  Italic,
  Underline,
  Link2,
  ImageIcon,
  Heading2,
  Heading3,
  ListOrdered,
  List,
  AlignLeft,
  AlignCenter,
  AlignRight,
  LucideTable,
  Edit,
  FileText,
} from "lucide-react"
import { formatCurrency, usdToSol } from "@/utils/currency"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import Image from "next/image"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import TipTapUnderline from "@tiptap/extension-underline"
import Link from "@tiptap/extension-link"
import TipTapImage from "@tiptap/extension-image"
import TextAlign from "@tiptap/extension-text-align"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import Table from "@tiptap/extension-table"
import TableRow from "@tiptap/extension-table-row"
import TableHeader from "@tiptap/extension-table-header"
import TableCell from "@tiptap/extension-table-cell"

// Add custom animations for the glowing button
import { keyframes } from "@emotion/react"

// Define keyframes for the glow animation
const glowAnimation = keyframes`
  0%, 100% { opacity: 0.5; }
  50% { opacity: 0.8; }
`

const pulseSubtle = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.01); }
`

// Add the animations to the global styles
if (typeof document !== "undefined") {
  const style = document.createElement("style")
  style.innerHTML = `
    @keyframes glow {
      0%, 100% { opacity: 0.5; }
      50% { opacity: 0.8; }
    }
    
    @keyframes pulse-subtle {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.01); }
    }
    
    .animate-glow {
      animation: glow 2s ease-in-out infinite;
    }
    
    .animate-pulse-subtle {
      animation: pulse-subtle 3s ease-in-out infinite;
    }
  `
  document.head.appendChild(style)
}

const productCategories = ["eBooks", "Audio", "Videos", "Images", "Templates", "Software", "Blog / Article"]

interface PricingOption {
  amount: string
  duration: string
  packageName: string
}

interface CommissionLevel {
  level: number
  percentage: string
}

interface CreateProductFormProps {
  onSubmit?: (productData: any) => void
  onSaveContinue?: (productData: any) => void
  initialData?: any
  activeStep?: "product-details" | "pricing-options" | "affiliate-settings" | "downloads"
  isLastStep?: boolean
  onFieldChange?: (fields: any) => void
}

const cleanYouTubeLink = (link: string): string => {
  if (link.includes("youtu.be")) {
    return link.split("?")[0]
  } else if (link.includes("youtube.com/watch?v=")) {
    const videoId = link.split("v=")[1].split("&")[0]
    return `https://www.youtube.com/watch?v=${videoId}`
  }
  return link
}

// Custom extension for resizable images
const ResizableImage = TipTapImage.extend({
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
            imageElement.style.height = `${updatedNode.attrs.height}px`
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

// Add this at the beginning of the file, after the imports
const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const handleError = (error) => {
      console.error("Error caught by error boundary:", error)
      setHasError(true)
    }

    window.addEventListener("error", handleError)
    return () => window.removeEventListener("error", handleError)
  }, [])

  if (hasError) {
    return (
      <div className="border rounded-md p-4 bg-red-50 text-red-800">
        <h3 className="font-medium">Something went wrong with this component</h3>
        <p>Please try refreshing the page. If the problem persists, contact support.</p>
      </div>
    )
  }

  return children
}

// Replace the entire RichTextEditor component with this simplified version
// Rich text editor component from product-files-manager.tsx
const RichTextEditor = ({ content, onChange }) => {
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false)
  const [isLinkInsertDialogOpen, setIsLinkInsertDialogOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [linkOpenInNewTab, setLinkOpenInNewTab] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [imageUploadError, setImageUploadError] = useState<string | null>(null)
  const [isTableDialogOpen, setIsTableDialogOpen] = useState(false)
  const [tableRows, setTableRows] = useState(3)
  const [tableColumns, setTableColumns] = useState(3)
  const [includeHeaderRow, setIncludeHeaderRow] = useState(true)
  const [activeTab, setActiveTab] = useState<"upload" | "url">("upload")
  const [showImagePreview, setShowImagePreview] = useState(false)
  const { toast } = useToast()

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
      TextAlign.configure({
        types: ["heading", "paragraph"],
        defaultAlignment: "left",
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: "prose-sm max-w-none focus:outline-none min-h-[200px] dark:text-gray-50",
      },
    },
  })

  useEffect(() => {
    if (editor && content) {
      // Only update content if it's different from current content
      const currentContent = editor.getHTML()
      if (currentContent !== content) {
        editor.commands.setContent(content)
      }
    }
  }, [editor, content])

  useEffect(() => {
    // Add custom styles for the editor
    const style = document.createElement("style")
    style.innerHTML = `
    .ProseMirror p {
      margin-top: 0.25rem !important;
      margin-bottom: 0.25rem !important;
      line-height: 1.3 !important;
    }
    .ProseMirror h1, .ProseMirror h2, .ProseMirror h3 {
      margin-top: 0.75rem !important;
      margin-bottom: 0.25rem !important;
    }
    .ProseMirror ul, .ProseMirror ol {
      margin-top: 0.25rem !important;
      margin-bottom: 0.25rem !important;
    }
    .ProseMirror li {
      margin-top: 0.125rem !important;
      margin-bottom: 0.125rem !important;
    }
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
      transform: translateY(-50%);
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

  /* Link styles */
  .ProseMirror a {
    color: #3b82f6; /* bright blue for light mode */
    text-decoration: underline;
  }

  .dark .ProseMirror a {
    color: #60a5fa; /* lighter blue for dark mode */
  }

  .ProseMirror a:hover {
    color: #2563eb; /* slightly darker blue on hover in light mode */
  }

  .dark .ProseMirror a:hover {
    color: #93c5fd; /* slightly lighter blue on hover in dark mode */
  }
  `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  if (!editor) {
    return <div className="border rounded-md p-4 bg-gray-50 dark:bg-gray-800 text-center">Loading editor...</div>
  }

  return (
    <>
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

      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
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

      <div className="rich-text-editor border rounded-md overflow-hidden bg-white dark:bg-gray-900 dark:border-gray-700 shadow-sm max-h-[400px] overflow-y-auto compact-line-spacing">
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
              onClick={() => setIsTableDialogOpen(true)}
              className="h-8 w-8 p-0"
              title="Insert Table"
            >
              <LucideTable className="h-4 w-4" />
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
    </>
  )
}

export function CreateProductForm({
  onSubmit,
  onSaveContinue,
  initialData,
  activeStep = "product-details",
  isLastStep = false,
  onFieldChange,
}: CreateProductFormProps) {
  const [category, setCategory] = useState(initialData?.category || "")
  const [name, setName] = useState(initialData?.name || "")
  const [description, setDescription] = useState(initialData?.description || "")
  const [youtubeLink, setYoutubeLink] = useState(initialData?.youtubeLink || "")
  const [images, setImages] = useState<{ file: File; preview: string }[]>(initialData?.images || [])
  const [videoLinks, setVideoLinks] = useState<string[]>(initialData?.videoLinks || [])
  const [mediaItems, setMediaItems] = useState<Array<{ type: "image" | "video"; src: string; preview: string }>>(
    initialData?.mediaItems || [],
  )
  const [videoLink, setVideoLink] = useState("")
  const [pricingOptions, setPricingOptions] = useState<PricingOption[]>(
    initialData?.pricingOptions || [{ amount: "", duration: "", packageName: "" }],
  )
  const [commissionLevels, setCommissionLevels] = useState<CommissionLevel[]>(
    initialData?.commissionLevels || [{ level: 1, percentage: "" }],
  )
  const [totalCommission, setTotalCommission] = useState(0)
  const [productFiles, setProductFiles] = useState<
    Array<{ description: string; content?: string; timestamp: Date; files: File[] }>
  >(initialData?.productFiles || [])
  const [currentFileDescription, setCurrentFileDescription] = useState("")
  const [draftSaved, setDraftSaved] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false) // Added state for submission status
  const { toast } = useToast()
  const [editingPostIndex, setEditingPostIndex] = useState<number | null>(null)
  const [postContent, setPostContent] = useState("")
  const [isAddPostDialogOpen, setIsAddPostDialogOpen] = useState(false)
  const [newPostFiles, setNewPostFiles] = useState<File[]>([])

  const [affiliateResources, setAffiliateResources] = useState<
    Array<{
      id: string
      type: "file" | "link"
      title: string
      content: string | File
      description?: string
    }>
  >(initialData?.affiliateResources || [])
  const [resourceTitle, setResourceTitle] = useState("")
  const [resourceUrl, setResourceUrl] = useState("")
  const [resourceDescription, setResourceDescription] = useState("")

  const [isViewPostDialogOpen, setIsViewPostDialogOpen] = useState(false)
  const [isViewingPost, setIsViewingPost] = useState(false)
  const [postToDeleteIndex, setPostToDeleteIndex] = useState<number | null>(null)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)

  useEffect(() => {
    // Only create a new array of media items if mediaItems is empty or undefined
    if (!mediaItems || mediaItems.length === 0) {
      const newMediaItems = [
        ...images.map((img) => ({ type: "image" as const, src: img.file, preview: img.preview })),
        ...videoLinks.map((link) => ({ type: "video" as const, src: link, preview: getVideoThumbnail(link) })),
      ]

      // Update the mediaItems state
      setMediaItems(newMediaItems)

      // Call onFieldChange to update the parent component's state
      if (onFieldChange) {
        onFieldChange({
          images,
          videoLinks,
          mediaItems: newMediaItems,
        })
      }
    }
  }, [images, videoLinks])

  // Add this after the other useEffect hooks
  useEffect(() => {
    // If we have initialData with mediaItems, use that directly
    if (initialData?.mediaItems && initialData.mediaItems.length > 0) {
      setMediaItems(initialData.mediaItems)
    }
  }, [initialData])

  const handleVideoLinksChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e && e.target) {
      setVideoLinks(e.target.value)
    }
  }

  const reorderImages = (startIndex: number, endIndex: number) => {
    const result = Array.from(images)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    setImages(result)
  }

  const addPricingOption = () => {
    const newOptions = [...pricingOptions, { amount: "", duration: "", packageName: "" }]
    setPricingOptions(newOptions)

    // Call onFieldChange to update the parent component's state
    if (onFieldChange) {
      onFieldChange({ pricingOptions: newOptions })
    }
  }

  const updatePricingOption = (index: number, field: keyof PricingOption, value: string) => {
    const newOptions = [...pricingOptions]
    newOptions[index][field] = value
    setPricingOptions(newOptions)

    // Call onFieldChange to update the parent component's state
    if (onFieldChange) {
      onFieldChange({ pricingOptions: newOptions })
    }
  }

  const removePricingOption = (index: number) => {
    const newOptions = pricingOptions.filter((_, i) => i !== index)
    setPricingOptions(newOptions)

    // Call onFieldChange to update the parent component's state
    if (onFieldChange) {
      onFieldChange({ pricingOptions: newOptions })
    }
  }

  const addCommissionLevel = () => {
    if (commissionLevels.length < 15) {
      const newLevels = [...commissionLevels, { level: commissionLevels.length + 1, percentage: "" }]
      setCommissionLevels(newLevels)
      calculateTotalCommission()

      // Call onFieldChange to update the parent component's state
      if (onFieldChange) {
        onFieldChange({ commissionLevels: newLevels })
      }
    }
  }

  const calculateTotalCommission = () => {
    const total = commissionLevels.reduce((sum, level) => sum + Number(level.percentage), 0)
    setTotalCommission(total)

    // Call onFieldChange to update the parent component's state with the total
    if (onFieldChange) {
      onFieldChange({ totalCommission: total })
    }
  }

  const updateCommissionLevel = (index: number, percentage: string) => {
    const newLevels = [...commissionLevels]
    newLevels[index].percentage = percentage
    setCommissionLevels(newLevels)
    calculateTotalCommission()

    // Call onFieldChange to update the parent component's state
    if (onFieldChange) {
      onFieldChange({ commissionLevels: newLevels })
    }
  }

  const removeCommissionLevel = (index: number) => {
    const newLevels = commissionLevels.filter((_, i) => i !== index)
    setCommissionLevels(newLevels)
    calculateTotalCommission()

    // Call onFieldChange to update the parent component's state
    if (onFieldChange) {
      onFieldChange({ commissionLevels: newLevels })
    }
  }

  const handleAddVideo = () => {
    if (videoLink.trim()) {
      const updatedVideoLinks = [...videoLinks, videoLink.trim()]
      setVideoLinks(updatedVideoLinks)
      setVideoLink("")

      // Immediately update parent component state
      if (onFieldChange) {
        const updatedMediaItems = [
          ...images.map((img) => ({ type: "image" as const, src: img.file, preview: img.preview })),
          ...updatedVideoLinks.map((link) => ({ type: "video" as const, src: link, preview: getVideoThumbnail(link) })),
        ]
        onFieldChange({
          images,
          videoLinks: updatedVideoLinks,
          mediaItems: updatedMediaItems,
        })
      }
    }
  }

  const getVideoThumbnail = (url: string) => {
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const videoId = url.split("v=")[1] || url.split("/").pop()
      return `https://img.youtube.com/vi/${videoId}/0.jpg`
    }
    // Add more video platform checks here if needed
    return "/placeholder.svg?height=100&width=100" // Fallback thumbnail
  }

  const reorderMediaItems = (startIndex: number, endIndex: number) => {
    // First, reorder the mediaItems array
    const result = Array.from(mediaItems)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    setMediaItems(result)

    // Now we need to rebuild the source arrays (images and videoLinks) to match the new order
    const newImages: { file: File; preview: string }[] = []
    const newVideoLinks: string[] = []

    // Reconstruct the source arrays in the new order
    result.forEach((item) => {
      if (item.type === "image") {
        // Find the matching image in the original images array
        const matchingImage = images.find((img) => img.preview === item.preview)
        if (matchingImage) {
          newImages.push(matchingImage)
        }
      } else if (item.type === "video") {
        newVideoLinks.push(item.src)
      }
    })

    // Update the source arrays
    setImages(newImages)
    setVideoLinks(newVideoLinks)

    // Immediately update parent component state
    if (onFieldChange) {
      onFieldChange({
        images: newImages,
        videoLinks: newVideoLinks,
        mediaItems: result,
      })
    }
  }

  const handleDeleteMediaItem = (index: number) => {
    const itemToDelete = mediaItems[index]

    // Remove from mediaItems
    const updatedMediaItems = [...mediaItems]
    updatedMediaItems.splice(index, 1)
    setMediaItems(updatedMediaItems)

    const updatedImages = [...images]
    const updatedVideoLinks = [...videoLinks]

    // Also remove from the source array (images or videoLinks)
    if (itemToDelete.type === "image") {
      const imageIndex = images.findIndex((img) => img.preview === itemToDelete.preview)
      if (imageIndex !== -1) {
        updatedImages.splice(imageIndex, 1)
        setImages(updatedImages)
      }
    } else if (itemToDelete.type === "video") {
      const videoIndex = videoLinks.findIndex((link) => link === itemToDelete.src)
      if (videoIndex !== -1) {
        updatedVideoLinks.splice(videoIndex, 1)
        setVideoLinks(updatedVideoLinks)
      }
    }

    // Immediately update parent component state
    if (onFieldChange) {
      onFieldChange({
        images: updatedImages,
        videoLinks: updatedVideoLinks,
        mediaItems: updatedMediaItems,
      })
    }

    toast({
      title: "Media removed",
      description: `${itemToDelete.type === "image" ? "Image" : "Video"} has been removed from your product.`,
    })
  }

  const handleImageUpload = (event) => {
    try {
      // Ensure event exists and has the expected structure
      if (!event) {
        console.error("Event object is undefined in handleImageUpload")
        return
      }

      if (!event.target) {
        console.error("Event target is undefined in handleImageUpload")
        return
      }

      if (!event.target.files) {
        console.error("Event target files is undefined in handleImageUpload")
        return
      }

      if (event.target.files.length === 0) {
        console.error("No files selected in handleImageUpload")
        return
      }

      const files = Array.from(event.target.files)
      const newImages = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: "Error",
            description: "Image size should be less than 5MB",
            variant: "destructive",
          })
          continue
        }

        newImages.push({
          file: file,
          preview: URL.createObjectURL(file),
        })
      }

      const updatedImages = [...images, ...newImages]
      setImages(updatedImages)

      // Immediately update parent component state
      if (onFieldChange) {
        const updatedMediaItems = [
          ...updatedImages.map((img) => ({ type: "image" as const, src: img.file, preview: img.preview })),
          ...videoLinks.map((link) => ({ type: "video" as const, src: link, preview: getVideoThumbnail(link) })),
        ]
        onFieldChange({
          images: updatedImages,
          videoLinks,
          mediaItems: updatedMediaItems,
        })
      }
    } catch (error) {
      console.error("Error in handleImageUpload:", error)
      toast({
        title: "Error",
        description: "Failed to process the image upload",
        variant: "destructive",
      })
    }
  }

  // Update the handleSubmit function to include the formatted resources
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const totalCommissionPercentage = commissionLevels.reduce((sum, level) => sum + Number(level.percentage), 0)
    if (totalCommissionPercentage > 90) {
      alert("Total commission percentage cannot exceed 90%")
      return
    }
    setIsSubmitting(true)
    try {
      // Format affiliate resources for the product object
      const formattedFileResources = affiliateResources
        .filter((r) => r.type === "file")
        .map((r) => ({
          name: r.title,
          description: r.description || "Resource file for affiliates",
          url: r.content instanceof File ? URL.createObjectURL(r.content) : r.content,
        }))

      const formattedLinkResources = affiliateResources
        .filter((r) => r.type === "link")
        .map((r) => ({
          title: r.title,
          url: typeof r.content === "string" ? r.content : "#",
        }))

      // Prepare form data
      const formData = {
        id: initialData?.id,
        category,
        name,
        description,
        mediaItems,
        pricingOptions,
        commissionLevels,
        productFiles,
        affiliateResources,
        product: {
          ...initialData?.product,
          affiliateResourceFiles: formattedFileResources,
          affiliateResourceLinks: formattedLinkResources,
        },
      }

      // If this is a step within a wizard, call onSaveContinue
      if (onSaveContinue) {
        await onSaveContinue(formData)
        toast({
          title: "Success",
          description: isLastStep
            ? "Product created successfully!"
            : "Progress saved successfully. Moving to next step.",
        })
      }
      // Otherwise use traditional submit
      else if (onSubmit) {
        await onSubmit(formData)
        toast({
          title: "Success",
          description: `Product ${initialData ? "updated" : "created"} successfully.`,
        })
      }
    } catch (error) {
      console.error("Error saving product:", error)
      toast({
        title: "Error",
        description: "Failed to save product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
      // Scroll to the top of the page
      window.scrollTo({
        top: 0,
        behavior: "instant",
      })
    }
  }

  // Function to handle editing a post's content
  const handleEditPostContent = (index: number) => {
    setEditingPostIndex(index)
    setPostContent(productFiles[index].content || "")
  }

  // Function to save post content
  const handleSavePostContent = () => {
    if (editingPostIndex !== null) {
      const updatedFiles = [...productFiles]
      updatedFiles[editingPostIndex].content = postContent
      setProductFiles(updatedFiles)
      setEditingPostIndex(null)
      setPostContent("")

      // Update parent component with new product files
      if (onFieldChange) {
        onFieldChange({ productFiles: updatedFiles })
      }

      toast({
        title: "Post updated",
        description: "Your post content has been updated successfully.",
      })
    }
  }

  // Render different form sections based on the active step
  const renderFormContent = () => {
    switch (activeStep) {
      case "product-details":
        return (
          <>
            <div>
              <Label htmlFor="category">Product Category</Label>
              <Select
                value={category}
                onValueChange={(value) => {
                  setCategory(value)
                  // Dispatch custom event for live preview update
                  window.dispatchEvent(
                    new CustomEvent("product-field-change", {
                      detail: { category: value },
                    }),
                  )
                  // Also call onFieldChange if available
                  if (onFieldChange) {
                    onFieldChange({ category: value })
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {productCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => {
                  if (e && e.target) {
                    const newName = e.target.value
                    setName(newName)
                    // Dispatch custom event for live preview update
                    window.dispatchEvent(
                      new CustomEvent("product-field-change", {
                        detail: { name: newName },
                      }),
                    )
                    // Also call onFieldChange if available
                    if (onFieldChange) {
                      onFieldChange({ name: newName })
                    }
                  }
                }}
                required
              />
            </div>

            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="images">Product Images</Label>
                  <Input
                    id="images"
                    type="file"
                    multiple
                    onChange={handleImageUpload}
                    className="mb-2"
                    accept="image/*"
                  />
                </div>
                <div>
                  <Label htmlFor="videoLink">Video Link</Label>
                  <div className="relative">
                    <Input
                      id="videoLink"
                      placeholder="Enter YouTube Video Link"
                      value={videoLink}
                      onChange={(e) => {
                        if (e && e.target) {
                          setVideoLink(cleanYouTubeLink(e.target.value))
                        }
                      }}
                      className="pr-20 text-sm sm:text-base sm:pr-24"
                    />
                    <Button
                      type="button"
                      onClick={handleAddVideo}
                      className="absolute right-0 top-0 h-full rounded-l-none text-xs sm:text-sm"
                    >
                      Add Video
                    </Button>
                  </div>
                  <div className="mt-2">
                    {videoLinks.map((link, index) => (
                      <div key={index} className="flex items-center justify-between mb-1">
                        <span className="text-sm truncate">{link}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setVideoLinks(videoLinks.filter((_, i) => i !== index))}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {(images.length > 0 || videoLinks.length > 0) && (
                <h3 className="text-sm text-gray-500 mb-2 mt-4">Uploaded Media Preview</h3>
              )}
              <DragDropContext
                onDragEnd={(result) => {
                  if (!result.destination) return
                  reorderMediaItems(result.source.index, result.destination.index)
                }}
              >
                <Droppable droppableId="media-list" direction="horizontal">
                  {(provided) => (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Hint: Drag and drop media to re-arrange order
                      </p>
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="flex flex-wrap gap-2 justify-center sm:justify-start"
                      >
                        {mediaItems.map((item, index) => (
                          <Draggable key={item.preview} draggableId={item.preview} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="relative w-28 h-28 sm:w-24 sm:h-24 group"
                              >
                                <Image
                                  src={item.preview || "/placeholder.svg"}
                                  alt={`Preview ${index}`}
                                  fill
                                  style={{ objectFit: "cover" }}
                                  className="rounded-md"
                                />
                                {item.type === "video" && (
                                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-md">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-8 w-8 text-white"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                      strokeWidth={2}
                                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                    />
                                  </div>
                                )}

                                {/* Delete button */}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDeleteMediaItem(index)
                                  }}
                                  className="absolute top-0 right-0 p-1 bg-black bg-opacity-60 rounded-bl-md rounded-tr-md text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-opacity-80 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 z-10"
                                  aria-label={`Delete ${item.type}`}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>

            <div>
              <Label htmlFor="description">Product Description</Label>
              <ErrorBoundary>
                <RichTextEditor
                  content={description || ""}
                  onChange={(newContent) => {
                    setDescription(newContent)

                    // Dispatch custom event for live preview update
                    window.dispatchEvent(
                      new CustomEvent("product-field-change", {
                        detail: { description: newContent },
                      }),
                    )

                    // Also call onFieldChange if available
                    if (onFieldChange) {
                      onFieldChange({ description: newContent })
                    }
                  }}
                />
              </ErrorBoundary>
            </div>
          </>
        )

      case "pricing-options":
        return (
          <div>
            <Label>Pricing Options</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Add different pricing tiers for your product. Drag to reorder.
            </p>

            <DragDropContext
              onDragEnd={(result) => {
                if (!result.destination) return
                const items = Array.from(pricingOptions)
                const [reorderedItem] = items.splice(result.source.index, 1)
                items.splice(result.destination.index, 0, reorderedItem)
                setPricingOptions(items)

                // Call onFieldChange to update the parent component's state
                if (onFieldChange) {
                  onFieldChange({ pricingOptions: items })
                }
              }}
            >
              <Droppable droppableId="pricing-options">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3 my-4">
                    {pricingOptions.map((option, index) => (
                      <Draggable key={`price-option-${index}`} draggableId={`price-option-${index}`} index={index}>
                        {(provided, snapshot) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`${snapshot.isDragging ? "shadow-lg ring-2 ring-primary/20" : ""} transition-all duration-200`}
                          >
                            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                              <div className="flex items-center gap-2">
                                <div
                                  {...provided.dragHandleProps}
                                  className="cursor-move p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                                  title="Drag to reorder"
                                >
                                  <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="text-gray-500"
                                  >
                                    <path
                                      d="M8 6H16M8 12H16M8 18H16"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                    />
                                  </svg>
                                </div>
                                <CardTitle className="text-base font-medium">
                                  {option.packageName || `Price Option ${index + 1}`}
                                </CardTitle>
                              </div>

                              <div className="flex gap-1">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removePricingOption(index)}
                                  className="h-8 w-8 p-0"
                                  title="Remove price option"
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            </div>

                            <CardContent className="pt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                              <div>
                                <Label
                                  htmlFor={`packageName-${index}`}
                                  className="text-xs uppercase font-medium text-gray-500 dark:text-gray-400"
                                >
                                  Package Name
                                </Label>
                                <Input
                                  id={`packageName-${index}`}
                                  value={option.packageName}
                                  onChange={(e) => {
                                    if (e && e.target) {
                                      updatePricingOption(index, "packageName", e.target.value)
                                    }
                                  }}
                                  placeholder="e.g. 1 Month Access / 3 Month Access / Lifetime"
                                  className="mt-1"
                                  required
                                />
                              </div>

                              <div>
                                <Label
                                  htmlFor={`amount-${index}`}
                                  className="text-xs uppercase font-medium text-gray-500 dark:text-gray-400"
                                >
                                  Amount (USD)
                                </Label>
                                <Input
                                  id={`amount-${index}`}
                                  value={option.amount}
                                  onChange={(e) => {
                                    if (e && e.target) {
                                      updatePricingOption(index, "amount", e.target.value)
                                    }
                                  }}
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  placeholder="0.00"
                                  className="mt-1"
                                  required
                                />
                                {option.amount && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    SOL: {formatCurrency(usdToSol(Number.parseFloat(option.amount)))}
                                  </div>
                                )}
                              </div>

                              <div>
                                <Label
                                  htmlFor={`duration-${index}`}
                                  className="text-xs uppercase font-medium text-gray-500 dark:text-gray-400"
                                >
                                  Duration (days)
                                </Label>
                                <Input
                                  id={`duration-${index}`}
                                  value={option.duration}
                                  onChange={(e) => {
                                    if (e && e.target) {
                                      updatePricingOption(index, "duration", e.target.value)
                                    }
                                  }}
                                  type="number"
                                  min="0"
                                  placeholder="Enter 0 for unlimited access"
                                  className="mt-1"
                                  required
                                />
                                {option.duration && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    {option.duration === "0" ? "Unlimited access" : `${option.duration} days access`}
                                  </div>
                                )}
                              </div>
                            </CardContent>

                            {option.amount && option.duration && option.packageName && (
                              <CardFooter className="bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800 text-sm text-gray-600 dark:text-gray-300 px-4 py-3">
                                <div>
                                  Clients who purchase the <span className="font-medium">{option.packageName}</span>{" "}
                                  package for{" "}
                                  <span className="font-medium">
                                    {formatCurrency(usdToSol(Number.parseFloat(option.amount)))}
                                  </span>{" "}
                                  will receive
                                  {option.duration === "0"
                                    ? " unlimited access"
                                    : ` access for ${option.duration} days`}{" "}
                                  to this product's content and affiliate benefits.
                                </div>
                              </CardFooter>
                            )}
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}

                    {pricingOptions.length === 0 && (
                      <div className="border border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center">
                        <p className="text-gray-500 dark:text-gray-400 mb-2">No pricing options added yet</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500">Add your first pricing option below</p>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            <Button type="button" onClick={addPricingOption} className="mt-2" variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Pricing Option
            </Button>
          </div>
        )

      case "affiliate-settings":
        return (
          <div>
            <Label>Commission Levels</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Set commission percentages for affiliate levels (Max Total Commissions: 90% | Max Levels: 15)
            </p>
            {commissionLevels.map((level, index) => (
              <div key={index} className="flex items-center space-x-2 mt-2">
                <Label htmlFor={`commission-${index}`} className="w-24">
                  Level {level.level}
                </Label>
                <Input
                  id={`commission-${index}`}
                  value={level.percentage}
                  onChange={(e) => {
                    if (e && e.target) {
                      updateCommissionLevel(index, e.target.value)
                      calculateTotalCommission()
                    }
                  }}
                  type="number"
                  min="0"
                  max="90"
                  required
                  className="w-24"
                />
                <span>%</span>
                {index > 0 && (
                  <Button type="button" variant="ghost" onClick={() => removeCommissionLevel(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <div className="mt-2 text-sm">
              Total commission allocated: {totalCommission}%
              {totalCommission > 90 && <span className="text-red-500 ml-2">Warning: Total commission exceeds 90%</span>}
              {/* Replace the paragraph about commission distribution with a bullet point list: */}
              <ul className="mt-2 text-gray-500 space-y-1 list-disc pl-5">
                <li>
                  You are distributing total gross commissions of {totalCommission}% for your {commissionLevels.length}{" "}
                  Level Affiliate Program for this product.
                </li>
                <li>
                  Your Net Profit will be about {Math.max(0, 90 - totalCommission)}% per sale, once affiliates have been
                  paid.
                </li>
                <li>A 10% platform transaction fee is charged on every sale.</li>
              </ul>
            </div>
            {commissionLevels.length < 15 && (
              <Button type="button" onClick={addCommissionLevel} className="mt-2">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Commission Level
              </Button>
            )}

            {/* Affiliate Resources Section */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Affiliate Resources</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Provide resources to help your affiliates promote your product. These will appear in the Affiliate
                Program section of your sales page.
              </p>

              <div className="space-y-6">
                {/* File Upload Section */}
                <Card>
                  <CardContent className="pt-6">
                    <h4 className="font-medium mb-3">Upload Resource Files</h4>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="affiliate-resource-upload">Upload File</Label>
                        <Input
                          id="affiliate-resource-upload"
                          type="file"
                          className="mt-1"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              setResourceDescription(file.name)
                            }
                          }}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Max file size: 10MB. Supported formats: PDF, DOCX, JPG, PNG, ZIP, etc.
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="resource-description">Resource Description</Label>
                        <Input
                          id="resource-description"
                          placeholder="E.g., 'Email swipe copy' or 'Social media banners'"
                          className="mt-1"
                          value={resourceDescription}
                          onChange={(e) => setResourceDescription(e.target.value)}
                        />
                      </div>

                      <Button
                        type="button"
                        onClick={() => {
                          const fileInput = document.getElementById("affiliate-resource-upload") as HTMLInputElement
                          const file = fileInput?.files?.[0]

                          if (file && resourceDescription) {
                            // Create the new resource
                            const newResource = {
                              id: `file-${Date.now()}`,
                              type: "file" as const,
                              title: resourceDescription,
                              content: file,
                            }

                            // Update local state
                            const updatedResources = [...affiliateResources, newResource]
                            setAffiliateResources(updatedResources)

                            // Reset form
                            setResourceDescription("")
                            if (fileInput) {
                              fileInput.value = "" // Reset the file input
                            }

                            // Create the formatted resources for the preview
                            const formattedFileResources = updatedResources
                              .filter((r) => r.type === "file")
                              .map((r) => ({
                                name: r.title,
                                description: r.description || "Resource file for affiliates",
                                url: r.content instanceof File ? URL.createObjectURL(r.content) : r.content,
                              }))

                            const formattedLinkResources = updatedResources
                              .filter((r) => r.type === "link")
                              .map((r) => ({
                                title: r.title,
                                url: typeof r.content === "string" ? r.content : "#",
                              }))

                            // Update parent component state with both the raw resources and the formatted ones
                            if (onFieldChange) {
                              onFieldChange({
                                affiliateResources: updatedResources,
                                product: {
                                  affiliateResourceFiles: formattedFileResources,
                                  affiliateResourceLinks: formattedLinkResources,
                                },
                              })
                            }

                            toast({
                              title: "Resource file added",
                              description: `${resourceDescription} has been added to affiliate resources.`,
                            })
                          } else {
                            toast({
                              title: "Missing information",
                              description: "Please upload a file and provide a description.",
                              variant: "destructive",
                            })
                          }
                        }}
                      >
                        Add Resource File
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Link Input Section */}
                <Card>
                  <CardContent className="pt-6">
                    <h4 className="font-medium mb-3">Add Resource Links</h4>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="resource-title">Resource Title</Label>
                        <Input
                          id="resource-title"
                          placeholder="E.g., 'Affiliate Program Guidelines'"
                          className="mt-1"
                          value={resourceTitle}
                          onChange={(e) => setResourceTitle(e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="resource-url">Resource URL</Label>
                        <Input
                          id="resource-url"
                          placeholder="E.g., 'https://example.com/affiliate-guidelines'"
                          className="mt-1"
                          value={resourceUrl}
                          onChange={(e) => setResourceUrl(e.target.value)}
                        />
                      </div>

                      {/* Update the button click handler for adding a link resource */}
                      <Button
                        type="button"
                        onClick={() => {
                          if (resourceTitle && resourceUrl) {
                            // Validate URL
                            try {
                              new URL(resourceUrl)

                              // Create the new resource
                              const newResource = {
                                id: `link-${Date.now()}`,
                                type: "link" as const,
                                title: resourceTitle,
                                content: resourceUrl,
                              }

                              // Update local state
                              const updatedResources = [...affiliateResources, newResource]
                              setAffiliateResources(updatedResources)

                              // Reset form
                              setResourceTitle("")
                              setResourceUrl("")

                              // Create the formatted resources for the preview
                              const formattedFileResources = updatedResources
                                .filter((r) => r.type === "file")
                                .map((r) => ({
                                  name: r.title,
                                  description: r.description || "Resource file for affiliates",
                                  url: r.content instanceof File ? URL.createObjectURL(r.content) : r.content,
                                }))

                              const formattedLinkResources = updatedResources
                                .filter((r) => r.type === "link")
                                .map((r) => ({
                                  title: r.title,
                                  url: typeof r.content === "string" ? r.content : "#",
                                }))

                              // Update parent component state with both the raw resources and the formatted ones
                              if (onFieldChange) {
                                onFieldChange({
                                  affiliateResources: updatedResources,
                                  product: {
                                    affiliateResourceFiles: formattedFileResources,
                                    affiliateResourceLinks: formattedLinkResources,
                                  },
                                })
                              }

                              toast({
                                title: "Resource link added",
                                description: `${resourceTitle} has been added to affiliate resources.`,
                              })
                            } catch (e) {
                              toast({
                                title: "Invalid URL",
                                description: "Please enter a valid URL including http:// or https://",
                                variant: "destructive",
                              })
                            }
                          } else {
                            toast({
                              title: "Missing information",
                              description: "Please provide both a title and URL for the resource.",
                              variant: "destructive",
                            })
                          }
                        }}
                      >
                        Add Resource Link
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Display Added Resources */}
                {affiliateResources.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-medium mb-3">Added Resources</h4>
                    <ul className="space-y-2">
                      {affiliateResources.map((resource) => (
                        <li
                          key={resource.id}
                          className="flex items-center justify-between px-4 py-2 border rounded-md bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
                        >
                          <div className="flex items-center">
                            {resource.type === "file" ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-file"
                              >
                                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                                <polyline points="14 2 14 8 20 8" />
                              </svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-link"
                              >
                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                              </svg>
                            )}
                            <span className="ml-2">{resource.title}</span>
                          </div>
                          {/* Update the button click handler for removing a resource */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              // Update local state by filtering out the resource
                              const updatedResources = affiliateResources.filter((r) => r.id !== resource.id)
                              setAffiliateResources(updatedResources)

                              // Create the formatted resources for the preview
                              const formattedFileResources = updatedResources
                                .filter((r) => r.type === "file")
                                .map((r) => ({
                                  name: r.title,
                                  description: r.description || "Resource file for affiliates",
                                  url: r.content instanceof File ? URL.createObjectURL(r.content) : r.content,
                                }))

                              const formattedLinkResources = updatedResources
                                .filter((r) => r.type === "link")
                                .map((r) => ({
                                  title: r.title,
                                  url: typeof r.content === "string" ? r.content : "#",
                                }))

                              // Update parent component state with both the raw resources and the formatted ones
                              if (onFieldChange) {
                                onFieldChange({
                                  affiliateResources: updatedResources,
                                  product: {
                                    affiliateResourceFiles: formattedFileResources,
                                    affiliateResourceLinks: formattedLinkResources,
                                  },
                                })
                              }

                              toast({
                                title: "Resource removed",
                                description: `${resource.title} has been removed from affiliate resources.`,
                              })
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )

      case "downloads":
        const totalFilesCount = productFiles.reduce((total, post) => total + (post.files?.length || 0), 0)

        // Add state for sorting if it doesn't exist
        const [sortOption, setSortOption] = useState<"recent" | "fileCount" | "oldest">("recent")

        // Sort posts based on selected option
        const sortedProductFiles = [...productFiles]
          .map((post, originalIndex) => ({
            ...post,
            originalIndex, // Store the original index to maintain stable references
          }))
          .sort((a, b) => {
            switch (sortOption) {
              case "recent":
                return b.timestamp.getTime() - a.timestamp.getTime() // Most recent first
              case "oldest":
                return a.timestamp.getTime() - b.timestamp.getTime() // Oldest first
              case "fileCount":
                return (b.files?.length || 0) - (a.files?.length || 0) // Most files first
              default:
                return 0
            }
          })

        return (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div>
                <Label>Product Content</Label>
                <p className="text-sm text-muted-foreground">
                  Organize your product content into posts. Each post can contain multiple files, descriptions, and
                  other resources.
                </p>
              </div>
              <div className="text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-md self-start">
                <span className="font-medium">{productFiles.length}</span> Posts |{" "}
                <span className="font-medium">{totalFilesCount}</span> Files
              </div>
            </div>

            {productFiles.length > 0 && (
              <div className="flex justify-end mb-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Label htmlFor="sort-posts" className="text-sm">
                    Sort by:
                  </Label>
                  <Select
                    value={sortOption}
                    onValueChange={(value: "recent" | "fileCount" | "oldest") => setSortOption(value)}
                  >
                    <SelectTrigger className="w-[140px] sm:w-[180px] h-8">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="oldest">Oldest</SelectItem>
                      <SelectItem value="fileCount">File Count</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Posts List */}
            {productFiles.length > 0 ? (
              <div className="space-y-3 mt-4">
                <h3 className="text-lg font-medium">Posts</h3>
                {sortedProductFiles.map((post, index) => (
                  <Card key={post.originalIndex} className="overflow-hidden">
                    <div className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
                        <div className="space-y-1">
                          <h4 className="font-medium text-base">{post.description}</h4>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                            <span>{post.timestamp.toLocaleString()}</span>
                            <span>
                              {post.files?.length || 0} file{post.files?.length !== 1 ? "s" : ""}
                            </span>
                          </div>
                          {post.content && (
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                              {post.content.replace(/<[^>]*>/g, "").substring(0, 100)}
                              {post.content.replace(/<[^>]*>/g, "").length > 100 ? "..." : ""}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3 sm:mt-0">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // Open a dialog to view the full post content (not in edit mode)
                              const postToView = productFiles[post.originalIndex]
                              setPostContent(postToView.content || "")
                              setCurrentFileDescription(postToView.description)
                              setNewPostFiles(postToView.files || [])
                              // Set a new state to indicate we're in view mode, not in edit mode
                              setIsViewingPost(true)
                              setEditingPostIndex(null) // Ensure we're not in edit mode
                              setIsAddPostDialogOpen(false) // Close the add/edit dialog if open
                              setIsViewPostDialogOpen(true) // Open the view dialog
                            }}
                            className="flex items-center h-9 px-3"
                            title="View Post"
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
                              className="mr-1"
                            >
                              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                            View
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // Open dialog in edit mode with the current post data
                              const postToEdit = productFiles[post.originalIndex]
                              // Set the editingPostIndex to track which post we're editing
                              setEditingPostIndex(post.originalIndex)
                              setCurrentFileDescription(postToEdit.description)
                              setPostContent(postToEdit.content || "")
                              setNewPostFiles(postToEdit.files || [])
                              setIsAddPostDialogOpen(true)
                            }}
                            className="flex items-center h-9 px-3"
                            title="Edit Post"
                          >
                            <Edit className="h-4 w-4 mr-1" /> Edit
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // Show confirmation dialog before deleting
                              setPostToDeleteIndex(post.originalIndex)
                              setIsDeleteConfirmOpen(true)
                            }}
                            className="flex items-center h-9 px-3 text-red-500 hover:text-red-700 hover:bg-red-50"
                            title="Delete Post"
                          >
                            <Trash2 className="h-4 w-4 mr-1" /> Delete
                          </Button>
                        </div>
                      </div>

                      {/* File thumbnails section */}
                      {post.files && post.files.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                          <div className="flex items-center gap-2 overflow-x-auto pb-2 max-w-full">
                            {post.files.slice(0, 5).map((file, fileIndex) => {
                              const isImage =
                                file.type?.startsWith("image/") || /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name)

                              return (
                                <div
                                  key={fileIndex}
                                  className="relative flex-shrink-0 w-16 h-16 rounded border border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-50 dark:bg-gray-800"
                                  title={file.name}
                                >
                                  {isImage ? (
                                    <div className="w-full h-full">
                                      <img
                                        src={URL.createObjectURL(file) || "/placeholder.svg"}
                                        alt={file.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          e.currentTarget.src = "/placeholder.svg?height=64&width=64"
                                        }}
                                      />
                                    </div>
                                  ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center p-1">
                                      <FileText className="h-6 w-6 text-gray-400" />
                                      <span className="text-[8px] text-gray-500 truncate w-full text-center mt-1">
                                        {file.name.split(".").pop()?.toUpperCase()}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                            {post.files.length > 5 && (
                              <div className="flex-shrink-0 w-16 h-16 rounded border border-gray-200 dark:border-gray-700 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                                <span className="text-sm text-gray-500">+{post.files.length - 5} more</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="border border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center mt-4">
                <p className="text-gray-500 dark:text-gray-400">
                  No content added yet. Start by creating your first post!
                </p>
              </div>
            )}

            {/* Add Post Button */}
            <Button type="button" onClick={() => setIsAddPostDialogOpen(true)} className="mt-4">
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Post
            </Button>

            {/* Add/Edit Post Dialog */}
            <Dialog
              open={isAddPostDialogOpen}
              onOpenChange={(open) => {
                setIsAddPostDialogOpen(open)
                if (!open) {
                  // Reset editing state when dialog is closed
                  setEditingPostIndex(null)
                }
              }}
            >
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>{editingPostIndex !== null ? "Edit Post" : "Add New Post"}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="post-description">Post Title</Label>
                    <Input
                      id="post-description"
                      placeholder="e.g. Introduction to the Course"
                      value={currentFileDescription}
                      onChange={(e) => setCurrentFileDescription(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="post-content">Post Content</Label>
                    <RichTextEditor content={postContent} onChange={(newContent) => setPostContent(newContent)} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="post-files">Files</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const fileInput = document.getElementById("post-files")
                          if (fileInput) {
                            fileInput.click()
                          }
                        }}
                      >
                        <PlusCircle className="h-4 w-4 mr-1" /> Add Files
                      </Button>
                    </div>
                    <Input
                      id="post-files"
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files) {
                          const newFiles = Array.from(e.target.files)
                          setNewPostFiles([...newPostFiles, ...newFiles])
                        }
                      }}
                    />
                    <p className="text-sm text-muted-foreground">
                      Upload files related to this post. Drag and drop to reorder.
                    </p>
                    {newPostFiles.length > 0 && (
                      <div className="mt-2">
                        <h4 className="text-sm font-medium mb-2">Attached Files:</h4>
                        <DragDropContext
                          onDragEnd={(result) => {
                            if (!result.destination) return

                            // Reorder the files array
                            const items = Array.from(newPostFiles)
                            const [reorderedItem] = items.splice(result.source.index, 1)
                            items.splice(result.destination.index, 0, reorderedItem)

                            setNewPostFiles(items)
                          }}
                        >
                          <Droppable droppableId="file-list">
                            {(provided) => (
                              <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="space-y-2 max-h-[200px] overflow-y-auto border rounded-md p-2"
                              >
                                {newPostFiles.map((file, fileIndex) => (
                                  <Draggable
                                    key={file.name + fileIndex}
                                    draggableId={file.name + fileIndex}
                                    index={fileIndex}
                                  >
                                    {(provided, snapshot) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        className={`flex items-center justify-between text-sm border-b pb-2 last:border-0 last:pb-0 ${
                                          snapshot.isDragging ? "bg-gray-100 dark:bg-gray-800 rounded" : ""
                                        }`}
                                      >
                                        <div className="flex items-center gap-2 truncate">
                                          <div
                                            {...provided.dragHandleProps}
                                            className="cursor-move p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                                            title="Drag to reorder"
                                          >
                                            <svg
                                              width="14"
                                              height="14"
                                              viewBox="0 0 24 24"
                                              fill="none"
                                              xmlns="http://www.w3.org/2000/svg"
                                              className="text-gray-500"
                                            >
                                              <path
                                                d="M8 6H16M8 12H16M8 18H16"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                              />
                                            </svg>
                                          </div>
                                          <FileText className="h-4 w-4 flex-shrink-0" />
                                          <span className="truncate">{file.name}</span>
                                          <span className="text-xs text-muted-foreground">
                                            ({(file.size / 1024).toFixed(1)} KB)
                                          </span>
                                        </div>
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          className="h-7 w-7 p-0 text-red-500"
                                          onClick={() => {
                                            const updatedFiles = [...newPostFiles]
                                            updatedFiles.splice(fileIndex, 1)
                                            setNewPostFiles(updatedFiles)
                                          }}
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </DragDropContext>
                      </div>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={() => {
                      if (currentFileDescription.trim()) {
                        const newPost = {
                          description: currentFileDescription,
                          content: postContent,
                          timestamp: new Date(),
                          files: newPostFiles,
                        }

                        let updatedProductFiles = [...productFiles]
                        if (editingPostIndex !== null) {
                          updatedProductFiles[editingPostIndex] = newPost
                        } else {
                          updatedProductFiles = [...productFiles, newPost]
                        }

                        setProductFiles(updatedProductFiles)
                        setCurrentFileDescription("")
                        setPostContent("")
                        setNewPostFiles([])
                        setIsAddPostDialogOpen(false)
                        setEditingPostIndex(null)

                        // Update parent component with new product files
                        if (onFieldChange) {
                          onFieldChange({ productFiles: updatedProductFiles })
                        }

                        toast({
                          title: "Post saved",
                          description: "Your post has been saved successfully.",
                        })
                      } else {
                        toast({
                          title: "Missing description",
                          description: "Please add a description for your post.",
                          variant: "destructive",
                        })
                      }
                    }}
                  >
                    {editingPostIndex !== null ? "Update Post" : "Add Post"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Post Content Dialog */}
            <Dialog
              open={editingPostIndex !== null && !isAddPostDialogOpen}
              onOpenChange={() => setEditingPostIndex(null)}
            >
              <DialogContent className="sm:max-w-[750px]">
                <DialogHeader>
                  <DialogTitle>Post Content</DialogTitle>
                </DialogHeader>
                {editingPostIndex !== null && (
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="post-content">Content</Label>
                      <RichTextEditor content={postContent} onChange={(newContent) => setPostContent(newContent)} />
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <Button onClick={handleSavePostContent}>Save Content</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* View Post Dialog */}
            <Dialog open={isViewPostDialogOpen} onOpenChange={setIsViewPostDialogOpen}>
              <DialogContent className="sm:max-w-[750px]">
                <DialogHeader>
                  <DialogTitle>{currentFileDescription}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: postContent }} />
                  </div>
                  {newPostFiles && newPostFiles.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Attachments:</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {newPostFiles.map((file, fileIndex) => (
                          <div key={fileIndex} className="border rounded p-2 text-xs">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              <span className="truncate">{file.name}</span>
                            </div>
                            <div className="text-muted-foreground mt-1">{(file.size / 1024).toFixed(1)} KB</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button onClick={() => setIsViewPostDialogOpen(false)}>Close</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Confirm Deletion</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <p>Are you sure you want to delete this post? This action cannot be undone.</p>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      if (postToDeleteIndex !== null) {
                        const updatedProductFiles = productFiles.filter((_, i) => i !== postToDeleteIndex)
                        setProductFiles(updatedProductFiles)
                        setPostToDeleteIndex(null)
                        setIsDeleteConfirmOpen(false)

                        // Update parent component with new product files
                        if (onFieldChange) {
                          onFieldChange({ productFiles: updatedProductFiles })
                        }

                        toast({
                          title: "Post deleted",
                          description: "The post has been removed from your content list.",
                        })
                      }
                    }}
                  >
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )

      default:
        return <div>Unknown step</div>
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {renderFormContent()}

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting} className="animate-pulse-subtle">
          {isSubmitting ? "Saving..." : isLastStep ? "Create Product" : "Save & Continue"}
        </Button>
      </div>
    </form>
  )
}
