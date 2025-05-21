"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table as UITable, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Clock, Eye, Send } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import TipTapUnderline from "@tiptap/extension-underline"
import Image from "@tiptap/extension-image"
import Alignment from "@tiptap/extension-text-align"
import TableExtension from "@tiptap/extension-table"
import TableRowExtension from "@tiptap/extension-table-row"
import TableCellExtension from "@tiptap/extension-table-cell"
import TableHeaderExtension from "@tiptap/extension-table-header"
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
  TableIcon,
  ImageIcon,
} from "lucide-react"

// Sample email campaigns
const initialEmailCampaigns = [
  {
    id: 1,
    title: "March 2025 Newsletter",
    subject: "New Platform Features & Top Creator Spotlight",
    recipients: "All Subscribers",
    sentDate: "2025-03-15",
    status: "sent",
    openRate: "42%",
    clickRate: "18%",
  },
  {
    id: 2,
    title: "New Blog Post: Maximizing Your Affiliate Program",
    subject: "Just Published: Learn How to Grow Your Affiliate Network",
    recipients: "Blog Subscribers",
    sentDate: "2025-03-10",
    status: "sent",
    openRate: "38%",
    clickRate: "22%",
  },
  {
    id: 3,
    title: "April 2025 Newsletter",
    subject: "Spring Updates & New Success Stories",
    recipients: "All Subscribers",
    scheduledDate: "2025-04-01",
    status: "scheduled",
    openRate: "-",
    clickRate: "-",
  },
  {
    id: 4,
    title: "Product Creator Tips",
    subject: "5 Ways to Improve Your Digital Product Sales",
    recipients: "Product Creators",
    status: "draft",
    openRate: "-",
    clickRate: "-",
  },
]

// Sample subscriber groups
const subscriberGroups = [
  { id: "all", name: "All Subscribers", count: 2547 },
  { id: "blog", name: "Blog Subscribers", count: 1823 },
  { id: "creators", name: "Product Creators", count: 876 },
  { id: "customers", name: "Customers", count: 1245 },
  { id: "affiliates", name: "Active Affiliates", count: 432 },
  { id: "inactive", name: "Inactive Users (90+ days)", count: 678 },
]

export function EmailUpdates() {
  const [emailCampaigns, setEmailCampaigns] = useState(initialEmailCampaigns)
  const [activeTab, setActiveTab] = useState("compose")
  const [selectedRecipients, setSelectedRecipients] = useState("all")
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined)
  const [sendingOption, setSendingOption] = useState("immediate")
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false)
  const [currentCampaign, setCurrentCampaign] = useState<any>(null)
  const [isSendConfirmDialogOpen, setIsSendConfirmDialogOpen] = useState(false)

  const [isHtmlEditorOpen, setIsHtmlEditorOpen] = useState(false)
  const [htmlContent, setHtmlContent] = useState("")

  const [newCampaign, setNewCampaign] = useState({
    title: "",
    subject: "",
    content: "",
    recipients: "all",
    sendingOption: "immediate",
    scheduledDate: "",
    includeBlogPost: false,
    selectedBlogPost: "",
  })

  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [imageUploadError, setImageUploadError] = useState<string | null>(null)
  const [imageUploadTab, setImageUploadTab] = useState<"upload" | "url">("upload")
  const [showImagePreview, setShowImagePreview] = useState(false)
  const [isTableDialogOpen, setIsTableDialogOpen] = useState(false)
  const [tableRows, setTableRows] = useState(3)
  const [tableColumns, setTableColumns] = useState(3)
  const [includeHeaderRow, setIncludeHeaderRow] = useState(true)
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
      TableRowExtension,
      TableHeaderExtension,
      TableCellExtension,
    ],
    content: newCampaign.content,
    onUpdate: ({ editor }) => {
      setNewCampaign({ ...newCampaign, content: editor.getHTML() })
    },
    editorProps: {
      attributes: {
        class: "prose-sm max-w-none focus:outline-none min-h-[200px] dark:text-gray-50",
      },
    },
  })

  const handleSendEmail = () => {
    // In a real application, this would send the email through an API
    const newId = Math.max(...emailCampaigns.map((campaign) => campaign.id)) + 1

    const newEmailCampaign = {
      id: newId,
      title: newCampaign.title,
      subject: newCampaign.subject,
      recipients: subscriberGroups.find((group) => group.id === newCampaign.recipients)?.name || "All Subscribers",
      status: newCampaign.sendingOption === "immediate" ? "sent" : "scheduled",
      sentDate: newCampaign.sendingOption === "immediate" ? new Date().toISOString().split("T")[0] : undefined,
      scheduledDate: newCampaign.sendingOption === "scheduled" ? newCampaign.scheduledDate : undefined,
      openRate: "-",
      clickRate: "-",
    }

    setEmailCampaigns([...emailCampaigns, newEmailCampaign])
    setIsSendConfirmDialogOpen(false)

    // Reset form
    setNewCampaign({
      title: "",
      subject: "",
      content: "",
      recipients: "all",
      sendingOption: "immediate",
      scheduledDate: "",
      includeBlogPost: false,
      selectedBlogPost: "",
    })

    // Show success message (in a real app)
    alert(newCampaign.sendingOption === "immediate" ? "Email sent successfully!" : "Email scheduled successfully!")
  }

  const openPreviewDialog = (campaign) => {
    setCurrentCampaign(campaign)
    setIsPreviewDialogOpen(true)
  }

  const confirmSendEmail = () => {
    setIsSendConfirmDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Email Updates</h2>
      </div>

      <Tabs defaultValue="compose" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="compose">Compose Email</TabsTrigger>
          <TabsTrigger value="history">Email History</TabsTrigger>
        </TabsList>

        <TabsContent value="compose" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Create Email Update</CardTitle>
              <CardDescription>Compose and send email updates about blog posts to subscribers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="campaign-title">Campaign Title</Label>
                  <Input
                    id="campaign-title"
                    placeholder="Internal title for this email campaign"
                    value={newCampaign.title}
                    onChange={(e) => setNewCampaign({ ...newCampaign, title: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">For your reference only, not shown to recipients</p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email-subject">Email Subject</Label>
                  <Input
                    id="email-subject"
                    placeholder="Enter email subject line"
                    value={newCampaign.subject}
                    onChange={(e) => setNewCampaign({ ...newCampaign, subject: e.target.value })}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email-content">Email Content</Label>
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
                                alert("Please select text or an image to create a link.")
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

                      <div className="flex flex-wrap gap-1 ml-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setHtmlContent(editor?.getHTML() || "")
                            setIsHtmlEditorOpen(true)
                          }}
                          className="h-8 px-2 text-xs"
                          title="Edit HTML"
                        >
                          HTML
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

              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-4">Include Blog Post</h3>
                <div className="flex items-center space-x-2 mb-4">
                  <Switch
                    id="include-blog-post"
                    checked={newCampaign.includeBlogPost}
                    onCheckedChange={(checked) => setNewCampaign({ ...newCampaign, includeBlogPost: checked })}
                  />
                  <Label htmlFor="include-blog-post">Include a blog post in this email</Label>
                </div>

                {newCampaign.includeBlogPost && (
                  <div className="ml-6">
                    <Label htmlFor="blog-post" className="mb-2 block">
                      Select Blog Post
                    </Label>
                    <Select
                      value={newCampaign.selectedBlogPost}
                      onValueChange={(value) => setNewCampaign({ ...newCampaign, selectedBlogPost: value })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a blog post" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="post1">Getting Started with Digital Product Sales</SelectItem>
                        <SelectItem value="post2">Maximizing Your Affiliate Program Potential</SelectItem>
                        <SelectItem value="post3">The Future of Digital Commerce on Solana</SelectItem>
                        <SelectItem value="post4">Creating Compelling Digital Products That Sell</SelectItem>
                        <SelectItem value="post5">Understanding Sol.Run's Payment Structure</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-4">Recipients</h3>
                <RadioGroup
                  value={newCampaign.recipients}
                  onValueChange={(value) => setNewCampaign({ ...newCampaign, recipients: value })}
                  className="space-y-3"
                >
                  {subscriberGroups.map((group) => (
                    <div key={group.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={group.id} id={`group-${group.id}`} />
                      <Label htmlFor={`group-${group.id}`} className="flex items-center justify-between w-full">
                        <span>{group.name}</span>
                        <Badge variant="outline" className="ml-2">
                          {group.count}
                        </Badge>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-4">Sending Options</h3>
                <RadioGroup
                  value={newCampaign.sendingOption}
                  onValueChange={(value) => setNewCampaign({ ...newCampaign, sendingOption: value })}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="immediate" id="immediate" />
                    <Label htmlFor="immediate">Send Immediately</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="scheduled" id="scheduled" />
                    <Label htmlFor="scheduled">Schedule for Later</Label>
                  </div>
                </RadioGroup>

                {newCampaign.sendingOption === "scheduled" && (
                  <div className="mt-4 ml-6 flex flex-col space-y-4">
                    <div className="flex flex-col space-y-2">
                      <Label>Select Date and Time</Label>
                      <div className="flex space-x-2 items-center">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {newCampaign.scheduledDate
                                ? format(new Date(newCampaign.scheduledDate), "PPP")
                                : "Select date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={newCampaign.scheduledDate ? new Date(newCampaign.scheduledDate) : undefined}
                              onSelect={(date) =>
                                setNewCampaign({
                                  ...newCampaign,
                                  scheduledDate: date ? date.toISOString().split("T")[0] : "",
                                })
                              }
                              initialFocus
                              disabled={(date) => date < new Date()}
                            />
                          </PopoverContent>
                        </Popover>

                        <Select defaultValue="12">
                          <SelectTrigger className="w-[100px]">
                            <SelectValue placeholder="Hour" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 24 }).map((_, i) => (
                              <SelectItem key={i} value={i.toString()}>
                                {i.toString().padStart(2, "0")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <span>:</span>
                        <Select defaultValue="00">
                          <SelectTrigger className="w-[100px]">
                            <SelectValue placeholder="Minute" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 60 }).map((_, i) => (
                              <SelectItem key={i} value={i.toString()}>
                                {i.toString().padStart(2, "0")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Clock className="h-4 w-4 ml-2" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("history")}>
                View Email History
              </Button>
              <Button onClick={confirmSendEmail}>
                <Send className="mr-2 h-4 w-4" />
                {newCampaign.sendingOption === "immediate" ? "Send Email" : "Schedule Email"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Campaign History</CardTitle>
              <CardDescription>View past and scheduled email campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <UITable>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Open Rate</TableHead>
                    <TableHead>Click Rate</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {emailCampaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell className="font-medium">{campaign.title}</TableCell>
                      <TableCell>{campaign.subject}</TableCell>
                      <TableCell>{campaign.recipients}</TableCell>
                      <TableCell>
                        {campaign.sentDate
                          ? format(new Date(campaign.sentDate), "MMM d, yyyy")
                          : campaign.scheduledDate
                            ? format(new Date(campaign.scheduledDate), "MMM d, yyyy")
                            : "-"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            campaign.status === "sent"
                              ? "default"
                              : campaign.status === "scheduled"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {campaign.status === "sent"
                            ? "Sent"
                            : campaign.status === "scheduled"
                              ? "Scheduled"
                              : "Draft"}
                        </Badge>
                      </TableCell>
                      <TableCell>{campaign.openRate}</TableCell>
                      <TableCell>{campaign.clickRate}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => openPreviewDialog(campaign)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </UITable>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={() => setActiveTab("compose")}>
                Compose New Email
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Preview Dialog */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Email Preview</DialogTitle>
          </DialogHeader>

          {currentCampaign && (
            <div className="py-4">
              <div className="mb-4 border-b pb-4">
                <p className="text-sm text-muted-foreground">From: Sol.Run Team &lt;updates@sol.run&gt;</p>
                <p className="text-sm text-muted-foreground">To: {currentCampaign.recipients}</p>
                <p className="text-sm text-muted-foreground">Subject: {currentCampaign.subject}</p>
                <p className="text-sm text-muted-foreground">
                  Date:{" "}
                  {currentCampaign.sentDate
                    ? format(new Date(currentCampaign.sentDate), "MMM d, yyyy")
                    : currentCampaign.scheduledDate
                      ? format(new Date(currentCampaign.scheduledDate), "MMM d, yyyy")
                      : "Draft"}
                </p>
              </div>

              <div className="prose prose-sm max-w-none">
                <p>Hello Sol.Run Community,</p>
                <p>We hope this email finds you well. Here's the latest update from Sol.Run:</p>

                <h2>{currentCampaign.title}</h2>
                <p>
                  This is a preview of the email content that would be sent to {currentCampaign.recipients}. In a real
                  implementation, this would contain the actual email content.
                </p>

                <div className="bg-gray-50 p-4 rounded-md my-4">
                  <h3>Campaign Statistics</h3>
                  <p>Status: {currentCampaign.status}</p>
                  <p>Open Rate: {currentCampaign.openRate}</p>
                  <p>Click Rate: {currentCampaign.clickRate}</p>
                </div>

                <p>
                  Best regards,
                  <br />
                  The Sol.Run Team
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setIsPreviewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Confirmation Dialog */}
      <Dialog open={isSendConfirmDialogOpen} onOpenChange={setIsSendConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Email {newCampaign.sendingOption === "immediate" ? "Send" : "Schedule"}</DialogTitle>
            <DialogDescription>
              {newCampaign.sendingOption === "immediate"
                ? "This email will be sent immediately to the selected recipients."
                : "This email will be scheduled for the selected date and time."}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Campaign:</span>
                <span>{newCampaign.title || "Untitled Campaign"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Subject:</span>
                <span>{newCampaign.subject}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Recipients:</span>
                <span>
                  {subscriberGroups.find((group) => group.id === newCampaign.recipients)?.name || "All Subscribers"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Recipient Count:</span>
                <span>{subscriberGroups.find((group) => group.id === newCampaign.recipients)?.count || 0}</span>
              </div>
              {newCampaign.sendingOption === "scheduled" && (
                <div className="flex justify-between">
                  <span className="font-medium">Scheduled Date:</span>
                  <span>
                    {newCampaign.scheduledDate ? format(new Date(newCampaign.scheduledDate), "PPP") : "Not set"}
                  </span>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSendConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendEmail}>
              {newCampaign.sendingOption === "immediate" ? "Send Now" : "Schedule Email"}
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

          {/* Replace with proper tabs */}
          <div className="border-b border-gray-200">
            <div className="flex space-x-2">
              <button
                onClick={() => setImageUploadTab("upload")}
                className={`px-4 py-2 font-medium text-sm transition-all ${
                  imageUploadTab === "upload"
                    ? "border-b-2 border-primary text-primary"
                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                type="button"
              >
                Upload from device
              </button>
              <button
                onClick={() => setImageUploadTab("url")}
                className={`px-4 py-2 font-medium text-sm transition-all ${
                  imageUploadTab === "url"
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
            {imageUploadTab === "upload" && (
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

            {imageUploadTab === "url" && (
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

                      alert("Could not determine image dimensions. The image may appear distorted.")
                    }
                    tempImg.src = imageUrl

                    setImageUrl("")
                    setIsImageDialogOpen(false)
                    setShowImagePreview(false)
                  } catch (error) {
                    console.error("Error inserting image:", error)
                    alert("Failed to insert image. Please try again.")
                  }
                } else {
                  alert("Please select an image file or enter a valid URL.")
                }
              }}
              disabled={!imageUrl || !!imageUploadError}
            >
              Insert Image
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

      {/* HTML Editor Dialog */}
      <Dialog open={isHtmlEditorOpen} onOpenChange={setIsHtmlEditorOpen}>
        <DialogContent className="sm:max-w-[800px] sm:max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Edit HTML</DialogTitle>
            <DialogDescription>
              Edit the raw HTML of your email content. Be careful as invalid HTML may break the formatting.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              value={htmlContent}
              onChange={(e) => setHtmlContent(e.target.value)}
              className="font-mono text-sm h-[400px] resize-none"
              spellCheck={false}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsHtmlEditorOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (editor) {
                  editor.commands.setContent(htmlContent)
                  setIsHtmlEditorOpen(false)
                }
              }}
            >
              Apply Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add CSS for tables */}
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
      `}</style>
    </div>
  )
}
