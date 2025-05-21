"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Mail } from "lucide-react"
interface DashboardHeaderProps {
  heading: string
  text?: string
  children?: React.ReactNode
}

export function DashboardHeader({ heading, text, children }: DashboardHeaderProps) {
  const [activeTab, setActiveTab] = useState("new")
  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: "TICKET-1001",
      subject: "Payment issue",
      message: "I'm having trouble with my payment processing. The transaction failed but I was still charged.",
      status: "open",
      priority: "high",
      createdAt: "2023-11-15T10:30:00Z",
      category: "payment",
      responses: [
        {
          id: "RESP-1",
          message: "We're looking into this issue. Could you please provide your transaction ID?",
          createdAt: "2023-11-15T11:45:00Z",
          isAdmin: true,
        },
      ],
    },
    {
      id: "TICKET-1002",
      subject: "Product download error",
      message: "I purchased a product but I'm unable to download the files. I keep getting an error.",
      status: "in-progress",
      priority: "medium",
      createdAt: "2023-11-14T15:20:00Z",
      category: "product",
      responses: [],
    },
  ])

  const [newTicket, setNewTicket] = useState({
    subject: "",
    message: "",
    category: "general",
  })

  const [newResponse, setNewResponse] = useState("")
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [unreadMessages, setUnreadMessages] = useState(3)

  const handleCreateTicket = () => {
    if (!newTicket.subject || !newTicket.message) return

    const ticket: SupportTicket = {
      id: `TICKET-${Math.floor(1000 + Math.random() * 9000)}`,
      subject: newTicket.subject,
      message: newTicket.message,
      status: "open",
      priority: "medium",
      createdAt: new Date().toISOString(),
      category: newTicket.category,
      responses: [],
    }

    setTickets([ticket, ...tickets])
    setNewTicket({
      subject: "",
      message: "",
      category: "general",
    })

    // In a real implementation, you would send this to your API
    // and show a success message
    alert("Support ticket created successfully!")

    // Close the dialog after successful submission
    setIsDialogOpen(false)
  }

  const handleAddResponse = (ticketId: string) => {
    if (!newResponse) return

    const updatedTickets = tickets.map((ticket) => {
      if (ticket.id === ticketId) {
        return {
          ...ticket,
          responses: [
            ...ticket.responses,
            {
              id: `RESP-${Math.floor(1000 + Math.random() * 9000)}`,
              message: newResponse,
              createdAt: new Date().toISOString(),
              isAdmin: false,
            },
          ],
        }
      }
      return ticket
    })

    setTickets(updatedTickets)
    setNewResponse("")

    // In a real implementation, you would send this to your API
  }

  const getStatusBadge = (status: string) => {
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
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
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
        return <Badge variant="outline">Normal</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="flex items-center justify-between px-2">
      <div className="grid gap-1">
        <h1 className="font-heading text-3xl md:text-4xl">{heading}</h1>
        {text && <p className="text-lg text-muted-foreground">{text}</p>}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full relative"
          title="Messages"
          onClick={() => setIsDialogOpen(true)}
        >
          <Mail className="h-5 w-5" />
          {unreadMessages > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadMessages > 9 ? "9+" : unreadMessages}
            </span>
          )}
        </Button>

        {isDialogOpen && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Support Center</DialogTitle>
                <DialogDescription>Create a new support ticket or view your existing tickets.</DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="new" value={activeTab} onValueChange={setActiveTab} className="mt-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="new">New Ticket</TabsTrigger>
                  <TabsTrigger value="existing">My Tickets</TabsTrigger>
                </TabsList>

                <TabsContent value="new" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newTicket.category}
                      onValueChange={(value) => setNewTicket({ ...newTicket, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="payment">Payment Issue</SelectItem>
                        <SelectItem value="product">Product Issue</SelectItem>
                        <SelectItem value="account">Account Issue</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={newTicket.subject}
                      onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                      placeholder="Brief description of your issue"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={newTicket.message}
                      onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })}
                      placeholder="Please provide details about your issue"
                      rows={5}
                    />
                  </div>

                  <DialogFooter>
                    <Button onClick={handleCreateTicket} disabled={!newTicket.subject || !newTicket.message}>
                      Submit Ticket
                    </Button>
                  </DialogFooter>
                </TabsContent>

                <TabsContent value="existing" className="pt-4">
                  {selectedTicket ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium">{selectedTicket.subject}</h3>
                          <div className="flex gap-2 mt-1">
                            <span className="text-sm text-muted-foreground">
                              {selectedTicket.id} • {formatDate(selectedTicket.createdAt)}
                            </span>
                          </div>
                          <div className="flex gap-2 mt-2">
                            {getStatusBadge(selectedTicket.status)}
                            {getPriorityBadge(selectedTicket.priority)}
                          </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setSelectedTicket(null)}>
                          Back to List
                        </Button>
                      </div>

                      <ScrollArea className="h-[250px] rounded-md border p-4">
                        <div className="space-y-4">
                          <div className="p-3 bg-muted rounded-lg">
                            <p className="text-sm">{selectedTicket.message}</p>
                            <p className="text-xs text-muted-foreground mt-2">
                              You • {formatDate(selectedTicket.createdAt)}
                            </p>
                          </div>

                          {selectedTicket.responses.map((response) => (
                            <div
                              key={response.id}
                              className={`p-3 rounded-lg ${
                                response.isAdmin ? "bg-blue-50 border border-blue-100" : "bg-muted"
                              }`}
                            >
                              <p className="text-sm">{response.message}</p>
                              <p className="text-xs text-muted-foreground mt-2">
                                {response.isAdmin ? "Support Team" : "You"} • {formatDate(response.createdAt)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>

                      <div className="space-y-2">
                        <Label htmlFor="reply">Add Reply</Label>
                        <Textarea
                          id="reply"
                          value={newResponse}
                          onChange={(e) => setNewResponse(e.target.value)}
                          placeholder="Type your reply here..."
                          rows={3}
                        />
                      </div>

                      <DialogFooter>
                        <Button onClick={() => handleAddResponse(selectedTicket.id)} disabled={!newResponse}>
                          Send Reply
                        </Button>
                      </DialogFooter>
                    </div>
                  ) : (
                    <>
                      {tickets.length > 0 ? (
                        <div className="space-y-4">
                          {tickets.map((ticket) => (
                            <div
                              key={ticket.id}
                              className="p-4 border rounded-lg hover:bg-accent cursor-pointer"
                              onClick={() => setSelectedTicket(ticket)}
                            >
                              <div className="flex justify-between">
                                <h3 className="font-medium">{ticket.subject}</h3>
                                <div className="flex gap-2">{getStatusBadge(ticket.status)}</div>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{ticket.message}</p>
                              <div className="flex justify-between items-center mt-2">
                                <span className="text-xs text-muted-foreground">
                                  {ticket.id} • {formatDate(ticket.createdAt)}
                                </span>
                                <span className="text-xs">
                                  {ticket.responses.length} {ticket.responses.length === 1 ? "response" : "responses"}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">You don't have any support tickets yet.</p>
                          <Button variant="outline" className="mt-4" onClick={() => setActiveTab("new")}>
                            Create Your First Ticket
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        )}
        {children}
      </div>
    </div>
  )
}

// Types
interface SupportTicket {
  id: string
  subject: string
  message: string
  status: string
  priority: string
  createdAt: string
  category: string
  responses: TicketResponse[]
}

interface TicketResponse {
  id: string
  message: string
  createdAt: string
  isAdmin: boolean
}
