"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, Clock, CheckCircle2, AlertCircle, MessageSquare } from "lucide-react"

// Mock data for support tickets
const mockTickets = [
  {
    id: "T-1001",
    subject: "Payment not received",
    user: "john.doe@example.com",
    status: "open",
    priority: "high",
    category: "Payment",
    created: "2023-11-15T10:30:00",
    lastUpdated: "2023-11-15T14:45:00",
    messages: [
      {
        id: "m1",
        from: "user",
        message: "I made a payment for Product X but it's not showing in my account. Transaction ID: SOL-123456",
        timestamp: "2023-11-15T10:30:00",
      },
    ],
  },
  {
    id: "T-1002",
    subject: "Cannot access purchased content",
    user: "sarah.smith@example.com",
    status: "in-progress",
    priority: "medium",
    category: "Access",
    created: "2023-11-14T09:15:00",
    lastUpdated: "2023-11-15T11:20:00",
    messages: [
      {
        id: "m1",
        from: "user",
        message:
          "I purchased the premium course yesterday but I can't access the content. It says I don't have permission.",
        timestamp: "2023-11-14T09:15:00",
      },
      {
        id: "m2",
        from: "admin",
        message: "I'm looking into this issue. Could you please confirm your order number?",
        timestamp: "2023-11-14T11:30:00",
      },
      {
        id: "m3",
        from: "user",
        message: "My order number is #ORD-78901",
        timestamp: "2023-11-15T10:15:00",
      },
    ],
  },
  {
    id: "T-1003",
    subject: "Request for refund",
    user: "mike.johnson@example.com",
    status: "open",
    priority: "high",
    category: "Refund",
    created: "2023-11-15T08:45:00",
    lastUpdated: "2023-11-15T08:45:00",
    messages: [
      {
        id: "m1",
        from: "user",
        message: "I would like to request a refund for my recent purchase as it doesn't meet my expectations.",
        timestamp: "2023-11-15T08:45:00",
      },
    ],
  },
  {
    id: "T-1004",
    subject: "Technical issue with download",
    user: "emily.wilson@example.com",
    status: "closed",
    priority: "low",
    category: "Technical",
    created: "2023-11-10T14:20:00",
    lastUpdated: "2023-11-12T16:30:00",
    messages: [
      {
        id: "m1",
        from: "user",
        message: "I'm having trouble downloading the files. The download keeps failing at 80%.",
        timestamp: "2023-11-10T14:20:00",
      },
      {
        id: "m2",
        from: "admin",
        message: "Could you please try clearing your browser cache and using a different browser?",
        timestamp: "2023-11-11T09:10:00",
      },
      {
        id: "m3",
        from: "user",
        message: "That worked! Thank you for your help.",
        timestamp: "2023-11-12T15:45:00",
      },
      {
        id: "m4",
        from: "admin",
        message: "Great! I'm glad that resolved the issue. Please let us know if you need anything else.",
        timestamp: "2023-11-12T16:30:00",
      },
    ],
  },
  {
    id: "T-1005",
    subject: "Question about product features",
    user: "alex.brown@example.com",
    status: "in-progress",
    priority: "medium",
    category: "Product",
    created: "2023-11-13T11:05:00",
    lastUpdated: "2023-11-14T13:40:00",
    messages: [
      {
        id: "m1",
        from: "user",
        message: "Does the premium package include access to the live webinars?",
        timestamp: "2023-11-13T11:05:00",
      },
      {
        id: "m2",
        from: "admin",
        message: "Yes, the premium package includes access to all live webinars for a period of 12 months.",
        timestamp: "2023-11-14T13:40:00",
      },
    ],
  },
]

export function SupportManagement() {
  const [tickets, setTickets] = useState(mockTickets)
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [isViewTicketOpen, setIsViewTicketOpen] = useState(false)
  const [replyText, setReplyText] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterPriority, setFilterPriority] = useState("all")

  // Filter tickets based on active tab, search query, and filters
  const filteredTickets = tickets.filter((ticket) => {
    // Filter by tab
    if (activeTab !== "all" && ticket.status !== activeTab) return false

    // Filter by search query
    if (
      searchQuery &&
      !ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !ticket.user.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !ticket.id.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    // Filter by category
    if (filterCategory !== "all" && ticket.category.toLowerCase() !== filterCategory.toLowerCase()) {
      return false
    }

    // Filter by priority
    if (filterPriority !== "all" && ticket.priority !== filterPriority) {
      return false
    }

    return true
  })

  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket)
    setIsViewTicketOpen(true)
  }

  const handleSendReply = () => {
    if (!replyText.trim()) return

    const updatedTickets = tickets.map((ticket) => {
      if (ticket.id === selectedTicket.id) {
        const updatedTicket = {
          ...ticket,
          lastUpdated: new Date().toISOString(),
          messages: [
            ...ticket.messages,
            {
              id: `m${ticket.messages.length + 1}`,
              from: "admin",
              message: replyText,
              timestamp: new Date().toISOString(),
            },
          ],
        }
        setSelectedTicket(updatedTicket)
        return updatedTicket
      }
      return ticket
    })

    setTickets(updatedTickets)
    setReplyText("")
  }

  const handleUpdateStatus = (ticketId, newStatus) => {
    const updatedTickets = tickets.map((ticket) => {
      if (ticket.id === ticketId) {
        return {
          ...ticket,
          status: newStatus,
          lastUpdated: new Date().toISOString(),
        }
      }
      return ticket
    })

    setTickets(updatedTickets)

    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket({
        ...selectedTicket,
        status: newStatus,
        lastUpdated: new Date().toISOString(),
      })
    }
  }

  const handleUpdatePriority = (ticketId, newPriority) => {
    const updatedTickets = tickets.map((ticket) => {
      if (ticket.id === ticketId) {
        return {
          ...ticket,
          priority: newPriority,
          lastUpdated: new Date().toISOString(),
        }
      }
      return ticket
    })

    setTickets(updatedTickets)

    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket({
        ...selectedTicket,
        priority: newPriority,
        lastUpdated: new Date().toISOString(),
      })
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "open":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "closed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "open":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
            Open
          </Badge>
        )
      case "in-progress":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
            In Progress
          </Badge>
        )
      case "closed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
            Closed
          </Badge>
        )
      default:
        return null
    }
  }

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "high":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
            High
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">
            Medium
          </Badge>
        )
      case "low":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
            Low
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Support Management</CardTitle>
        <CardDescription>Manage customer support tickets and inquiries</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tickets..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Payment">Payment</SelectItem>
                  <SelectItem value="Access">Access</SelectItem>
                  <SelectItem value="Refund">Refund</SelectItem>
                  <SelectItem value="Technical">Technical</SelectItem>
                  <SelectItem value="Product">Product</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 w-full sm:w-[400px]">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="open">Open</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress</TabsTrigger>
              <TabsTrigger value="closed">Closed</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Ticket ID</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead className="hidden md:table-cell">Category</TableHead>
                      <TableHead className="hidden md:table-cell">Priority</TableHead>
                      <TableHead className="hidden md:table-cell">Status</TableHead>
                      <TableHead className="hidden md:table-cell">Last Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTickets.length > 0 ? (
                      filteredTickets.map((ticket) => (
                        <TableRow key={ticket.id}>
                          <TableCell className="font-medium">{ticket.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(ticket.status)}
                              <span className="truncate max-w-[150px] sm:max-w-[250px]">{ticket.subject}</span>
                            </div>
                          </TableCell>
                          <TableCell className="truncate max-w-[150px]">{ticket.user}</TableCell>
                          <TableCell className="hidden md:table-cell">{ticket.category}</TableCell>
                          <TableCell className="hidden md:table-cell">{getPriorityBadge(ticket.priority)}</TableCell>
                          <TableCell className="hidden md:table-cell">{getStatusBadge(ticket.status)}</TableCell>
                          <TableCell className="hidden md:table-cell">{formatDate(ticket.lastUpdated)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleViewTicket(ticket)}>
                                <MessageSquare className="h-4 w-4 mr-1" />
                                <span className="hidden sm:inline">View</span>
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => handleUpdateStatus(ticket.id, "open")}
                                    disabled={ticket.status === "open"}
                                  >
                                    Mark as Open
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleUpdateStatus(ticket.id, "in-progress")}
                                    disabled={ticket.status === "in-progress"}
                                  >
                                    Mark as In Progress
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleUpdateStatus(ticket.id, "closed")}
                                    disabled={ticket.status === "closed"}
                                  >
                                    Mark as Closed
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleUpdatePriority(ticket.id, "high")}
                                    disabled={ticket.priority === "high"}
                                  >
                                    Set High Priority
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleUpdatePriority(ticket.id, "medium")}
                                    disabled={ticket.priority === "medium"}
                                  >
                                    Set Medium Priority
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleUpdatePriority(ticket.id, "low")}
                                    disabled={ticket.priority === "low"}
                                  >
                                    Set Low Priority
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          No tickets found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Ticket View Dialog */}
        {selectedTicket && (
          <Dialog open={isViewTicketOpen} onOpenChange={setIsViewTicketOpen}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {getStatusIcon(selectedTicket.status)}
                  <span>
                    Ticket {selectedTicket.id}: {selectedTicket.subject}
                  </span>
                </DialogTitle>
                <DialogDescription>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium">Status:</span>
                      {getStatusBadge(selectedTicket.status)}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium">Priority:</span>
                      {getPriorityBadge(selectedTicket.priority)}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium">Category:</span>
                      <Badge variant="outline">{selectedTicket.category}</Badge>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="text-sm font-medium">From:</span> {selectedTicket.user}
                  </div>
                  <div className="mt-1">
                    <span className="text-sm font-medium">Created:</span> {formatDate(selectedTicket.created)}
                  </div>
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 my-4">
                <div className="text-sm font-medium">Conversation:</div>
                <div className="space-y-4 max-h-[300px] overflow-y-auto p-2 border rounded-md">
                  {selectedTicket.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-3 rounded-lg ${message.from === "admin" ? "bg-blue-50 ml-4" : "bg-gray-50 mr-4"}`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">{message.from === "admin" ? "Support Agent" : "Customer"}</span>
                        <span className="text-xs text-gray-500">{formatDate(message.timestamp)}</span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Reply:</div>
                <Textarea
                  placeholder="Type your response here..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={4}
                />
              </div>

              <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between">
                <div className="flex gap-2">
                  <Select
                    value={selectedTicket.status}
                    onValueChange={(value) => handleUpdateStatus(selectedTicket.id, value)}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={selectedTicket.priority}
                    onValueChange={(value) => handleUpdatePriority(selectedTicket.id, value)}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsViewTicketOpen(false)}>
                    Close
                  </Button>
                  <Button onClick={handleSendReply} disabled={!replyText.trim()}>
                    Send Reply
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  )
}
