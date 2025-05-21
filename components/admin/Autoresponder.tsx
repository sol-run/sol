"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Plus, Save, Trash, Edit, Clock, Bold, Italic, Underline, ImageIcon, AlertCircle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

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
  Link2,
  Heading2,
  Heading3,
  ListOrdered,
  List,
  AlignLeft,
  AlignCenter,
  AlignRight,
  TableIcon,
} from "lucide-react"

export function Autoresponder() {
  const [selectedRecipients, setSelectedRecipients] = useState("all")
  const editorRef = useRef<HTMLDivElement>(null)
  const [linkDialogOpen, setLinkDialogOpen] = useState(false)
  const [imageDialogOpen, setImageDialogOpen] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imagePreviewError, setImagePreviewError] = useState<string | null>(null)
  const [isLoadingPreview, setIsLoadingPreview] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [savedSelection, setSavedSelection] = useState<any | null>(null)
  const [selectionType, setSelectionType] = useState<"none" | "text" | "image">("none")

  const [sequences, setSequences] = useState([
    {
      id: 1,
      name: "Welcome Sequence",
      active: true,
      emails: [
        { days: 0, time: "09:00", subject: "Welcome to Sol.Run!", active: true },
        { days: 3, time: "10:00", subject: "Getting Started with Sol.Run", active: true },
        { days: 7, time: "11:00", subject: "Tips for Success on Sol.Run", active: true },
      ],
    },
    {
      id: 2,
      name: "Seller Onboarding",
      active: true,
      emails: [
        { days: 1, time: "09:00", subject: "How to Create Your First Product", active: true },
        { days: 5, time: "14:00", subject: "Marketing Your Products on Sol.Run", active: true },
        { days: 14, time: "10:00", subject: "Maximizing Your Sales on Sol.Run", active: true },
      ],
    },
    {
      id: 3,
      name: "Affiliate Onboarding",
      active: false,
      emails: [
        { days: 1, time: "09:00", subject: "Getting Started as an Affiliate", active: true },
        { days: 4, time: "15:00", subject: "Finding Products to Promote", active: true },
        { days: 10, time: "10:00", subject: "Affiliate Marketing Strategies", active: true },
      ],
    },
  ])

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [sequenceToDelete, setSequenceToDelete] = useState<number | null>(null)
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false)
  const [sequenceToPreview, setSequenceToPreview] = useState<any | null>(null)
  const [editEmailDialogOpen, setEditEmailDialogOpen] = useState(false)
  const [currentEmailData, setCurrentEmailData] = useState({
    sequenceId: 0,
    emailIndex: 0,
    days: 0,
    time: "09:00",
    subject: "",
    content: "",
  })

  const [isTableDialogOpen, setIsTableDialogOpen] = useState(false)
  const [tableRows, setTableRows] = useState(3)
  const [tableColumns, setTableColumns] = useState(3)
  const [includeHeaderRow, setIncludeHeaderRow] = useState(true)
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [imageUploadError, setImageUploadError] = useState(null)
  const [isLinkInsertDialogOpen, setIsLinkInsertDialogOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [linkOpenInNewTab, setLinkOpenInNewTab] = useState(true)

  const editor = useEditor({
    extensions: [
      StarterKit,
      TipTapUnderline,
      Image.configure({
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
      TipTapTableRow,
      TipTapTableHeader,
      TipTapTableCell,
    ],
    content: currentEmailData.content,
    onUpdate: ({ editor }) => {
      // Update the content when the editor changes
      setCurrentEmailData({
        ...currentEmailData,
        content: editor.getHTML(),
      })
    },
    editorProps: {
      attributes: {
        class: "prose-sm max-w-none focus:outline-none min-h-[200px] dark:text-gray-50",
      },
    },
  })

  // Reset image preview when dialog closes
  useEffect(() => {
    if (!imageDialogOpen) {
      setImagePreview(null)
      setImagePreviewError(null)
      setImageUrl("")
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }, [imageDialogOpen])

  // Set editor content when dialog opens
  useEffect(() => {
    if (editEmailDialogOpen && editorRef.current) {
      editorRef.current.innerHTML = currentEmailData.content
    }
  }, [editEmailDialogOpen, currentEmailData.content])

  // Preview image from URL when URL changes
  useEffect(() => {
    if (imageUrl) {
      setIsLoadingPreview(true)
      setImagePreviewError(null)

      const img = new Image()
      img.onload = () => {
        setImagePreview(imageUrl)
        setIsLoadingPreview(false)
      }
      img.onerror = () => {
        setImagePreviewError("Failed to load image from URL. Please check the URL and try again.")
        setImagePreview(null)
        setIsLoadingPreview(false)
      }
      img.src = imageUrl
    } else {
      setImagePreview(null)
      setImagePreviewError(null)
    }
  }, [imageUrl])

  // Format functions
  const formatText = (command: string, value = "") => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
  }

  // Simplified and more robust saveSelection function
  const saveSelection = () => {
    try {
      // Reset selection state
      setSavedSelection(null)
      setSelectionType("none")

      // Check if editor exists
      if (!editorRef.current) {
        return false
      }

      // First check if an image is selected
      const selectedImages = editorRef.current.querySelectorAll("img.selected")
      if (selectedImages.length > 0) {
        setSavedSelection({
          element: selectedImages[0],
        })
        setSelectionType("image")
        return true
      }

      // Otherwise try to get text selection
      const selection = window.getSelection()
      if (!selection || selection.rangeCount === 0) {
        return false
      }

      const range = selection.getRangeAt(0)

      // Check if the selection is within the editor
      let isSelectionInEditor = false
      let node = range.commonAncestorContainer

      while (node && node !== document.body) {
        if (node === editorRef.current) {
          isSelectionInEditor = true
          break
        }
        node = node.parentNode
      }

      if (!isSelectionInEditor) {
        return false
      }

      // Store the range details
      setSavedSelection({
        startContainer: range.startContainer,
        startOffset: range.startOffset,
        endContainer: range.endContainer,
        endOffset: range.endOffset,
      })
      setSelectionType("text")

      return true
    } catch (error) {
      console.error("Error saving selection:", error)
      return false
    }
  }

  // Enhanced handleInsertLink function
  const handleInsertLink = () => {
    if (!linkUrl) {
      toast({
        title: "URL required",
        description: "Please enter a URL for your link",
        variant: "destructive",
      })
      return
    }

    try {
      // Focus the editor
      if (editorRef.current) {
        editorRef.current.focus()

        // Check what type of selection we have
        if (selectionType === "image" && savedSelection) {
          // Handle image linking
          try {
            const imgElement = savedSelection.element as HTMLImageElement
            if (!imgElement) {
              throw new Error("Selected image not found")
            }

            // Create a wrapper anchor element
            const wrapper = document.createElement("a")
            wrapper.href = linkUrl
            wrapper.target = "_blank"
            wrapper.rel = "noopener noreferrer"

            // Replace the image with the wrapped version
            if (imgElement.parentNode) {
              // Clone the image to avoid reference issues
              const newImg = imgElement.cloneNode(true) as HTMLImageElement

              // Replace the image with anchor containing the image
              wrapper.appendChild(newImg)
              imgElement.parentNode.replaceChild(wrapper, imgElement)

              // Success message
              toast({
                title: "Link applied to image",
                description: "The image is now linked to the URL you provided.",
              })

              // Close dialog and reset
              setLinkUrl("")
              setLinkDialogOpen(false)
              return
            }
          } catch (e) {
            console.error("Error applying link to image:", e)
            // Will fall through to fallback
          }
        } else if (selectionType === "text" && savedSelection) {
          // Handle text selection linking
          try {
            const selection = window.getSelection()
            if (selection) {
              // Clear existing selections
              selection.removeAllRanges()

              // Create a new range
              const range = document.createRange()

              // Set the range based on saved selection
              try {
                range.setStart(savedSelection.startContainer, savedSelection.startOffset)
                range.setEnd(savedSelection.endContainer, savedSelection.endOffset)
                selection.addRange(range)

                // Apply the link
                document.execCommand("createLink", false, linkUrl)

                // Find the newly created links and add target="_blank"
                setTimeout(() => {
                  const links = editorRef.current?.querySelectorAll("a")
                  if (links) {
                    links.forEach((link) => {
                      if (link.href === linkUrl || link.href.includes(linkUrl)) {
                        link.setAttribute("target", "_blank")
                        link.setAttribute("rel", "noopener noreferrer")

                        // Add a visual highlight effect
                        link.style.transition = "background-color 0.3s"
                        link.style.backgroundColor = "rgba(59, 130, 246, 0.2)"
                        setTimeout(() => {
                          link.style.backgroundColor = "transparent"
                        }, 1000)
                      }
                    })
                  }
                }, 0)

                // Success message
                toast({
                  title: "Link inserted",
                  description: "The link has been applied to your selection.",
                })

                // Close dialog and reset
                setLinkUrl("")
                setLinkDialogOpen(false)
                return
              } catch (e) {
                console.error("Error setting range:", e)
                // Will fall through to fallback
              }
            }
          } catch (e) {
            console.error("Error restoring text selection:", e)
            // Will fall through to fallback
          }
        }

        // Fallback: prompt for text and insert link
        const linkText = window.prompt("Enter the text to display for this link:", "Link text")
        if (linkText) {
          // Insert HTML directly
          const linkHtml = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkText}</a> `
          document.execCommand("insertHTML", false, linkHtml)

          // Success message
          toast({
            title: "Link inserted",
            description: "A link has been added to your content.",
          })

          // Close dialog and reset
          setLinkUrl("")
          setLinkDialogOpen(false)
        }
      }
    } catch (error) {
      console.error("Error in link insertion:", error)
      toast({
        title: "Error inserting link",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleInsertImage = () => {
    if (imagePreview) {
      // Make sure the editor has focus before inserting
      if (editorRef.current) {
        try {
          // Focus the editor
          editorRef.current.focus()

          // Restore the saved selection if it exists
          if (savedSelection && selectionType === "text") {
            try {
              const selection = window.getSelection()
              if (selection) {
                // Clear any existing selections
                selection.removeAllRanges()

                // Create a new range from the saved one
                const range = document.createRange()
                range.setStart(savedSelection.startContainer, savedSelection.startOffset)
                range.setEnd(savedSelection.endContainer, savedSelection.endOffset)

                // Apply the new range
                selection.addRange(range)
              }
            } catch (e) {
              console.error("Error restoring selection for image:", e)
              // Continue with insertion at current position
            }
          }

          // Try using execCommand first
          try {
            document.execCommand("insertImage", false, imagePreview)
          } catch (e) {
            console.error("Error using execCommand for image:", e)

            // Fallback: create and insert image element directly
            const imgElement = document.createElement("img")
            imgElement.src = imagePreview
            imgElement.alt = "Inserted image"
            imgElement.style.maxWidth = "100%"

            const selection = window.getSelection()
            if (selection && selection.rangeCount > 0) {
              selection.getRangeAt(0).insertNode(imgElement)
            } else if (editorRef.current) {
              editorRef.current.appendChild(imgElement)
            }
          }

          // Add a line break after the image for better editing experience
          document.execCommand("insertHTML", false, "<br>")

          // Reset states
          setImageUrl("")
          setImagePreview(null)
          setImageDialogOpen(false)

          // Show success toast
          toast({
            title: "Image inserted",
            description: "The image has been added to your email content.",
          })
        } catch (error) {
          console.error("Error in image insertion:", error)
          toast({
            title: "Error inserting image",
            description: "An error occurred while trying to insert the image. Please try again.",
            variant: "destructive",
          })
        }
      } else {
        // If editor ref is not available, show an error
        toast({
          title: "Editor not found",
          description: "Could not locate the editor to insert the image. Please try again.",
          variant: "destructive",
        })
      }
    } else {
      toast({
        title: "No image selected",
        description: "Please select or upload an image first.",
        variant: "destructive",
      })
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Clear URL input when file is selected
      setImageUrl("")
      setImagePreviewError(null)

      // Check file type
      if (!file.type.startsWith("image/")) {
        setImagePreviewError("Selected file is not an image. Please select an image file.")
        setImagePreview(null)
        return
      }

      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setImagePreviewError("Image is too large. Maximum size is 5MB.")
        setImagePreview(null)
        return
      }

      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)
    }
  }

  // Generate time options for select dropdown
  const generateTimeOptions = () => {
    const options = []
    for (let hour = 0; hour < 24; hour++) {
      for (const minute of ["00", "30"]) {
        const formattedHour = hour.toString().padStart(2, "0")
        options.push(`${formattedHour}:${minute}`)
      }
    }
    return options
  }

  const timeOptions = generateTimeOptions()

  const handleDeleteSequence = (id: number) => {
    setSequenceToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteSequence = () => {
    if (sequenceToDelete) {
      setSequences(sequences.filter((seq) => seq.id !== sequenceToDelete))
      toast({
        title: "Sequence deleted",
        description: "The email sequence has been deleted successfully.",
      })
      setDeleteDialogOpen(false)
      setSequenceToDelete(null)
    }
  }

  const handlePreviewSequence = (id: number) => {
    const sequence = sequences.find((seq) => seq.id === id)
    if (sequence) {
      setSequenceToPreview(sequence)
      setPreviewDialogOpen(true)
    }
  }

  const handleEditEmail = (sequenceId: number, emailIndex: number) => {
    const sequence = sequences.find((seq) => seq.id === sequenceId)
    if (sequence && sequence.emails[emailIndex]) {
      const email = sequence.emails[emailIndex]
      setCurrentEmailData({
        sequenceId,
        emailIndex,
        days: email.days,
        time: email.time || "09:00",
        subject: email.subject,
        content: `<p>Dear {{username}},</p>
<p>We hope you're enjoying Sol.Run! Here's some important information about your account...</p>
<p>Best regards,<br>The Sol.Run Team</p>`,
      })
      setEditEmailDialogOpen(true)
    }
  }

  const handleToggleEmailStatus = (sequenceId: number, emailIndex: number) => {
    setSequences(
      sequences.map((seq) => {
        if (seq.id === sequenceId) {
          const updatedEmails = [...seq.emails]
          updatedEmails[emailIndex] = {
            ...updatedEmails[emailIndex],
            active: !updatedEmails[emailIndex].active,
          }
          return { ...seq, emails: updatedEmails }
        }
        return seq
      }),
    )

    toast({
      title: "Email status updated",
      description: "The email status has been updated successfully.",
    })
  }

  const handleSaveEmailChanges = () => {
    // Get content from editor
    const content = editor?.getHTML() || ""

    setSequences(
      sequences.map((seq) => {
        if (seq.id === currentEmailData.sequenceId) {
          const updatedEmails = [...seq.emails]
          updatedEmails[currentEmailData.emailIndex] = {
            ...updatedEmails[currentEmailData.emailIndex],
            days: currentEmailData.days,
            time: currentEmailData.time,
            subject: currentEmailData.subject,
          }
          return { ...seq, emails: updatedEmails }
        }
        return seq
      }),
    )

    toast({
      title: "Email updated",
      description: "The email has been updated successfully.",
    })
    setEditEmailDialogOpen(false)
  }

  const handleImageButtonClick = () => {
    saveSelection()
    setImageDialogOpen(true)
  }

  // Add this near your other useEffect hooks
  useEffect(() => {
    console.log("Link dialog state changed:", linkDialogOpen)
  }, [linkDialogOpen])

  // Add event listeners for image selection
  useEffect(() => {
    if (editEmailDialogOpen && editorRef.current) {
      // Set the initial content
      editorRef.current.innerHTML = currentEmailData.content

      // Add event listeners for image selection
      const handleImageClick = (e: Event) => {
        const target = e.target as HTMLElement
        if (target.tagName === "IMG") {
          // Remove selected class from all images
          editorRef.current?.querySelectorAll("img").forEach((img) => {
            img.classList.remove("selected")
          })

          // Add selected class to clicked image
          target.classList.add("selected")
        }
      }

      // Add the event listener to the editor
      editorRef.current.addEventListener("click", handleImageClick)

      // Cleanup function
      return () => {
        if (editorRef.current) {
          editorRef.current.removeEventListener("click", handleImageClick)
        }
      }
    }
  }, [editEmailDialogOpen, currentEmailData.content])

  // Simplified and safer link button click handler
  const handleLinkButtonClick = () => {
    try {
      // Try to save the current selection
      const hasSelection = saveSelection()

      // Open the dialog regardless of selection
      setLinkDialogOpen(true)

      // If nothing is selected, inform the user
      if (!hasSelection) {
        toast({
          title: "No selection detected",
          description: "You'll be prompted to enter text for your link.",
          variant: "info",
        })
      }
    } catch (error) {
      console.error("Error in link button click handler:", error)

      // Still open the dialog even if there was an error
      setLinkDialogOpen(true)

      toast({
        title: "Selection error",
        description: "There was an issue with your selection. You can still create a link.",
        variant: "warning",
      })
    }
  }

  // Add CSS for selected images in the global styles
  useEffect(() => {
    // Add style for selected images
    const style = document.createElement("style")
    style.innerHTML = `
      .min-h-[200px] img.selected {
        outline: 2px solid #3b82f6;
        outline-offset: 2px;
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Autoresponder</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create New Sequence
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Email Sequences</CardTitle>
          <CardDescription>Manage automated email sequences sent to users based on registration date</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sequence Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Emails</TableHead>
                <TableHead>Recipients</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sequences.map((sequence) => (
                <TableRow key={sequence.id}>
                  <TableCell className="font-medium">{sequence.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch checked={sequence.active} />
                      <span>{sequence.active ? "Active" : "Inactive"}</span>
                    </div>
                  </TableCell>
                  <TableCell>{sequence.emails.length} emails</TableCell>
                  <TableCell>All Users</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handlePreviewSequence(sequence.id)}
                        title="Preview sequence"
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteSequence(sequence.id)}
                        title="Delete sequence"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Create/Edit Sequence</CardTitle>
          <CardDescription>Configure an automated email sequence</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="sequence-name">Sequence Name</Label>
              <Input id="sequence-name" placeholder="Enter sequence name" />
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-4">Recipients</h3>
              <RadioGroup value={selectedRecipients} onValueChange={setSelectedRecipients} className="space-y-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all-auto" />
                  <Label htmlFor="all-auto">All Users</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="inactive-users" id="inactive-users-auto" />
                  <Label htmlFor="inactive-users-auto">
                    Inactive Users (only registered but didn't buy, earn commissions or sell anything yet)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="active-sellers" id="active-sellers-auto" />
                  <Label htmlFor="active-sellers-auto">Active Sellers (with at least 1 product listed)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="customers" id="customers-auto" />
                  <Label htmlFor="customers-auto">Customers (purchased at least 1 product)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="active-affiliates" id="active-affiliates-auto" />
                  <Label htmlFor="active-affiliates-auto">
                    Active Affiliates (earned commissions for at least 1 product)
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Emails in Sequence</h3>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Email
                </Button>
              </div>

              <div className="space-y-6">
                {/* Email 1 */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Email #1</CardTitle>
                      <Button variant="ghost" size="icon">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-0">
                    <div className="flex items-center space-x-4">
                      <Label className="w-24">Send after</Label>
                      <div className="flex items-center space-x-2">
                        <Input type="number" className="w-20" defaultValue="0" />
                        <span>days</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="email1-time" className="sr-only">
                          Time
                        </Label>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <Select defaultValue="09:00">
                            <SelectTrigger className="w-[110px]">
                              <SelectValue placeholder="Select time" />
                            </SelectTrigger>
                            <SelectContent>
                              {timeOptions.map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="email1-subject">Subject</Label>
                      <Input id="email1-subject" defaultValue="Welcome to Sol.Run!" />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="edit-email-content">Content</Label>
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
                              <TableIcon className="h-4 w-4" />
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
                    </div>
                  </CardContent>
                </Card>

                {/* Email 2 */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Email #2</CardTitle>
                      <Button variant="ghost" size="icon">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-0">
                    <div className="flex items-center space-x-4">
                      <Label className="w-24">Send after</Label>
                      <div className="flex items-center space-x-2">
                        <Input type="number" className="w-20" defaultValue="3" />
                        <span>days</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="email2-time" className="sr-only">
                          Time
                        </Label>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <Select defaultValue="10:00">
                            <SelectTrigger className="w-[110px]">
                              <SelectValue placeholder="Select time" />
                            </SelectTrigger>
                            <SelectContent>
                              {timeOptions.map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="email2-subject">Subject</Label>
                      <Input id="email2-subject" defaultValue="Getting Started with Sol.Run" />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="email2-content">Content</Label>
                      <Textarea
                        id="email2-content"
                        rows={6}
                        defaultValue={`Dear {{username}},

We hope you're enjoying Sol.Run so far! Here are some additional resources to help you make the most of our platform...`}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Save Sequence
          </Button>
        </CardFooter>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Email Sequence</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this email sequence? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteSequence}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Manage: {sequenceToPreview?.name}</DialogTitle>
            <DialogDescription>
              This sequence contains {sequenceToPreview?.emails.length} emails sent over time.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Day #</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sequenceToPreview?.emails.map((email: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">Day {email.days}</TableCell>
                    <TableCell>{email.time || "09:00"}</TableCell>
                    <TableCell className="max-w-[250px] truncate">{email.subject}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <Switch
                          checked={email.active}
                          onCheckedChange={() => handleToggleEmailStatus(sequenceToPreview.id, index)}
                        />
                        <span className="text-sm">{email.active ? "Active" : "Inactive"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => handleEditEmail(sequenceToPreview.id, index)}>
                        <Edit className="h-3.5 w-3.5 mr-1.5" />
                        Edit Email
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <DialogFooter className="mt-4">
            <Button onClick={() => setPreviewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Email Dialog */}
      <Dialog open={editEmailDialogOpen} onOpenChange={setEditEmailDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Email</DialogTitle>
            <DialogDescription>Edit the content of this email in the sequence.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <div className="w-full sm:w-auto">
                <Label htmlFor="edit-email-days" className="block mb-2">
                  Day
                </Label>
                <Input
                  id="edit-email-days"
                  type="number"
                  className="w-24"
                  value={currentEmailData.days}
                  onChange={(e) =>
                    setCurrentEmailData({
                      ...currentEmailData,
                      days: Number.parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="w-full sm:w-auto">
                <Label htmlFor="edit-email-time" className="block mb-2">
                  Time
                </Label>
                <Select
                  value={currentEmailData.time}
                  onValueChange={(value) => setCurrentEmailData({ ...currentEmailData, time: value })}
                >
                  <SelectTrigger id="edit-email-time" className="w-[110px]">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-email-subject">Subject</Label>
              <Input
                id="edit-email-subject"
                value={currentEmailData.subject}
                onChange={(e) => setCurrentEmailData({ ...currentEmailData, subject: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-email-content">Content</Label>
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
                      <TableIcon className="h-4 w-4" />
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
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditEmailDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEmailChanges}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Replace the Link Dialog with this enhanced version */}
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Insert Link</DialogTitle>
            <DialogDescription>
              {selectionType === "image"
                ? "Enter the URL where this image should link to."
                : "Enter the URL for your link."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="link-url">Link URL</Label>
              <Input
                id="link-url"
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                autoFocus
              />
              {selectionType === "none" && (
                <p className="text-sm text-muted-foreground mt-1">
                  No text or image selected. You'll be prompted to enter link text.
                </p>
              )}
              {selectionType === "image" && (
                <p className="text-sm text-muted-foreground mt-1">The selected image will become a clickable link.</p>
              )}
              {selectionType === "text" && (
                <p className="text-sm text-muted-foreground mt-1">The selected text will become a clickable link.</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLinkDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleInsertLink} disabled={!linkUrl}>
              Insert Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Dialog */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Insert Image</DialogTitle>
            <DialogDescription>Enter an image URL or upload an image from your device.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="image-url">Image URL</Label>
              <Input
                id="image-url"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image-upload">Or upload an image</Label>
              <Input id="image-upload" type="file" accept="image/*" ref={fileInputRef} onChange={handleFileUpload} />
            </div>

            {/* Image Preview Section */}
            <div className="mt-2">
              <Label>Preview</Label>
              <div className="mt-2 border rounded-md p-4 bg-muted/30 min-h-[200px] flex items-center justify-center">
                {isLoadingPreview && <div className="text-center text-muted-foreground">Loading preview...</div>}

                {imagePreviewError && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    <AlertDescription>{imagePreviewError}</AlertDescription>
                  </Alert>
                )}

                {imagePreview && !imagePreviewError && !isLoadingPreview && (
                  <div className="flex flex-col items-center">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="max-w-full max-h-[300px] object-contain rounded-md"
                    />
                    <p className="text-sm text-muted-foreground mt-2">Image preview</p>
                  </div>
                )}

                {!imagePreview && !imagePreviewError && !isLoadingPreview && (
                  <div className="text-center text-muted-foreground">
                    <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-30" />
                    <p>No image selected</p>
                    <p className="text-sm">Enter a URL or upload an image to see a preview</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setImageDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleInsertImage} disabled={!imagePreview || !!imagePreviewError}>
              Insert Image
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Image Dialog */}
      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Insert Image</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="image-url">Image URL</Label>
              <Input
                id="image-url"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImageDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (imageUrl) {
                  editor?.chain().focus().setImage({ src: imageUrl }).run()
                  setImageUrl("")
                  setIsImageDialogOpen(false)
                }
              }}
              disabled={!imageUrl}
            >
              Insert Image
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Link Dialog */}
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
                  editor
                    ?.chain()
                    .focus()
                    .setLink({
                      href: linkUrl,
                      target: linkOpenInNewTab ? "_blank" : null,
                    })
                    .run()
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

      {/* Table Dialog */}
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
    </div>
  )
}
