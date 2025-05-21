"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpDown } from "lucide-react"

const steps = [
  {
    title: "User Registration",
    description: "Sign up and get a unique Solana wallet address.",
  },
  {
    title: "Product Listing",
    description: "Sellers add products and set up affiliate programs.",
  },
  {
    title: "Affiliate Marketing",
    description: "Affiliates promote products using unique referral links.",
  },
  {
    title: "Purchase & Delivery",
    description: "Customers buy products using Solana, instant delivery.",
  },
  {
    title: "Earnings & Commissions",
    description: "Automatic distribution of earnings and commissions.",
  },
]

interface UserEvent {
  id: number
  timestamp: Date
  username: string
  eventDescription: string
  eventValue: string
  commissionLevel?: number
}

const generateMockEvents = (count: number): UserEvent[] => {
  const events = []
  const now = new Date()
  for (let i = 0; i < count; i++) {
    const eventType = Math.random()
    let eventDescription, eventValue, commissionLevel
    if (eventType < 0.33) {
      eventDescription = "Registration Completed"
      eventValue = "0.0000 SOL (0.00 USD)"
    } else if (eventType < 0.66) {
      const amount = (Math.random() * 100).toFixed(2)
      const sol = (Number.parseFloat(amount) / 20).toFixed(4)
      eventDescription = "Purchase Completed"
      eventValue = `${sol} SOL (${amount} USD)`
    } else {
      const amount = (Math.random() * 50).toFixed(2)
      const sol = (Number.parseFloat(amount) / 20).toFixed(4)
      const commissionPercentage = Math.floor(Math.random() * 20) + 5 // 5% to 25%
      commissionLevel = Math.floor(Math.random() * 3) + 1 // 1 to 3
      eventDescription = `${commissionPercentage}% Commission Earned`
    }
    events.push({
      id: Date.now() + i,
      timestamp: new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      username: `user${Math.floor(Math.random() * 10000)
        .toString()
        .padStart(5, "0")}`,
      eventDescription,
      eventValue,
      commissionLevel,
    })
  }
  return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

export default function Workflow() {
  const [events, setEvents] = useState<UserEvent[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  useEffect(() => {
    setEvents(generateMockEvents(100))
    const interval = setInterval(() => {
      setEvents((prev) => {
        const newEvent = {
          ...generateMockEvents(1)[0],
          id: Date.now(),
        }
        return [newEvent, ...prev.slice(0, -1)]
      })
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const formatTimeDifference = (date: Date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    const days = Math.floor(diffInSeconds / 86400)
    const hours = Math.floor((diffInSeconds % 86400) / 3600)
    const minutes = Math.floor((diffInSeconds % 3600) / 60)
    const seconds = diffInSeconds % 60

    // Create time parts array
    const timeParts = [
      { value: days, unit: "d" },
      { value: hours, unit: "h" },
      { value: minutes, unit: "m" },
      { value: seconds, unit: "s" },
    ]

    // Filter out zero values except for the last non-zero or the very last element
    const filteredParts = []
    let lastNonZeroIndex = timeParts.length - 1

    // Find the last non-zero value
    for (let i = timeParts.length - 1; i >= 0; i--) {
      if (timeParts[i].value > 0) {
        lastNonZeroIndex = i
        break
      }
    }

    // Add parts based on rules
    for (let i = 0; i < timeParts.length; i++) {
      const part = timeParts[i]
      const isZero = part.value === 0

      // Always include days if non-zero
      if (i === 0 && !isZero) {
        filteredParts.push(`${part.value.toString().padStart(2, "0")}${part.unit}`)
      }
      // Include hours if non-zero
      else if (i === 1 && !isZero) {
        filteredParts.push(`${part.value.toString().padStart(2, "0")}${part.unit}`)
      }
      // Always include minutes
      else if (i === 2) {
        filteredParts.push(`${part.value.toString().padStart(2, "0")}${part.unit}`)
      }
      // Include seconds (always show the last element)
      else if (i === 3) {
        filteredParts.push(`${part.value.toString().padStart(2, "0")}${part.unit}`)
      }
    }

    return filteredParts.join(", ") + " Ago"
  }

  const totalPages = Math.ceil(events.length / itemsPerPage)
  const paginatedEvents = events
    .sort((a, b) =>
      sortOrder === "desc"
        ? b.timestamp.getTime() - a.timestamp.getTime()
        : a.timestamp.getTime() - b.timestamp.getTime(),
    )
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <>
      <section id="how-it-works" className="py-20 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {steps
              .sort((a, b) => steps.indexOf(a) - steps.indexOf(b))
              .map((step, index) => (
                <div key={index} className={`flex items-start mb-8 w-full ${index % 2 === 0 ? "md:pr-4" : "md:pl-4"}`}>
                  <div className="bg-purple-600 rounded-full h-12 w-12 flex-shrink-0 flex items-center justify-center text-white font-bold text-xl mr-4">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1 dark:text-white">{step.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      <section id="recent-events" className="py-8 md:py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 dark:text-white mt-8 md:mt-16 mb-6 md:mb-8">
            Recent User Events
          </h2>

          {/* Desktop view - only show on md screens and up */}
          <div className="hidden md:block overflow-x-auto">
            <Table className="dark:text-gray-300">
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer font-bold"
                    onClick={() => setSortOrder((order) => (order === "desc" ? "asc" : "desc"))}
                  >
                    TIME <ArrowUpDown className="inline ml-2" size={16} />
                  </TableHead>
                  <TableHead className="font-bold">USERNAME</TableHead>
                  <TableHead className="font-bold">EVENT DESCRIPTION</TableHead>
                  <TableHead className="font-bold">EVENT VALUE</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>{formatTimeDifference(event.timestamp)}</TableCell>
                    <TableCell>{event.username}</TableCell>
                    <TableCell>
                      {event.eventDescription}
                      {event.commissionLevel ? ` (Level ${event.commissionLevel})` : ""}
                    </TableCell>
                    <TableCell>
                      {event.eventValue ||
                        (() => {
                          const mockValue = (Math.random() * 10).toFixed(4)
                          return `${mockValue} SOL (${(Number.parseFloat(mockValue) * 20).toFixed(2)} USD)`
                        })()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile view - only show on small screens */}
          <div className="md:hidden">
            {paginatedEvents.map((event) => (
              <div key={event.id} className="mb-4 p-4 border rounded-lg dark:border-gray-700 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-sm">{event.username}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatTimeDifference(event.timestamp)}
                  </span>
                </div>
                <div className="text-sm mb-1">
                  {event.eventDescription}
                  {event.commissionLevel ? ` (Level ${event.commissionLevel})` : ""}
                </div>
                <div className="text-sm font-medium text-purple-600 dark:text-purple-400">
                  {event.eventValue ||
                    (() => {
                      const mockValue = (Math.random() * 10).toFixed(4)
                      return `${mockValue} SOL (${(Number.parseFloat(mockValue) * 20).toFixed(2)} USD)`
                    })()}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center mt-4 space-y-4 md:space-y-0">
            <div className="flex items-center text-sm">
              <span className="mr-2">Show</span>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => setItemsPerPage(Number.parseInt(value))}
              >
                <SelectTrigger className="w-[80px] md:w-[100px]">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  {[10, 20, 30, 40, 50].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="ml-2">per page</span>
            </div>
            <div className="flex items-center text-sm">
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
                |&lt;
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="ml-2"
              >
                &lt;
              </Button>
              <span className="mx-4 text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                &gt;
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="ml-2"
              >
                &gt;|
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
