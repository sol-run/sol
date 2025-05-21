"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Clock, Send } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"

export function Newsletters() {
  const [selectedRecipients, setSelectedRecipients] = useState("all")
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined)
  const [sendingOption, setSendingOption] = useState("immediate")
  const [content, setContent] = useState("")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Newsletters</h2>
        <div className="flex space-x-2">
          <Button variant="outline">Drafts</Button>
          <Button variant="outline">Sent Emails</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create Newsletter</CardTitle>
          <CardDescription>Create and send newsletters to your users</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="newsletter-subject">Email Subject</Label>
              <Input id="newsletter-subject" placeholder="Enter newsletter subject" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="newsletter-content">Email Content</Label>
              <div className="border rounded-md overflow-hidden">
                <div className="bg-muted p-2 flex items-center gap-1 border-b">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => document.execCommand("bold")}
                    className="h-8 w-8 p-0"
                    title="Bold"
                  >
                    <span className="font-bold">B</span>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => document.execCommand("italic")}
                    className="h-8 w-8 p-0"
                    title="Italic"
                  >
                    <span className="italic">I</span>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => document.execCommand("underline")}
                    className="h-8 w-8 p-0"
                    title="Underline"
                  >
                    <span className="underline">U</span>
                  </Button>
                  <div className="h-4 w-px bg-border mx-1" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const url = prompt("Enter image URL:")
                      if (url) document.execCommand("insertImage", false, url)
                    }}
                    className="h-8 w-8 p-0"
                    title="Insert Image"
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
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const url = prompt("Enter link URL:")
                      if (url) document.execCommand("createLink", false, url)
                    }}
                    className="h-8 w-8 p-0"
                    title="Insert Link"
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
                    >
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                  </Button>
                  <input
                    type="file"
                    id="image-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.onload = (event) => {
                          document.execCommand("insertImage", false, event.target?.result as string)
                        }
                        reader.readAsDataURL(file)
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => document.getElementById("image-upload")?.click()}
                    className="h-8 w-8 p-0"
                    title="Upload Image"
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
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </Button>
                </div>
                <div
                  contentEditable
                  className="min-h-[300px] p-3 focus:outline-none"
                  placeholder="Write your newsletter content here..."
                  onInput={(e) => {
                    // You can store the HTML content in state if needed
                    // setContent(e.currentTarget.innerHTML);
                  }}
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-lg font-medium mb-4">Recipients</h3>
            <RadioGroup value={selectedRecipients} onValueChange={setSelectedRecipients} className="space-y-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all">All Users</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="active-sellers" id="active-sellers" />
                <Label htmlFor="active-sellers">Active Sellers (with at least 1 product listed)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="customers" id="customers" />
                <Label htmlFor="customers">Customers (purchased at least 1 product)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="active-affiliates" id="active-affiliates" />
                <Label htmlFor="active-affiliates">Active Affiliates (earned commissions for at least 1 product)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="custom" />
                <Label htmlFor="custom">Custom Selection</Label>
              </div>
            </RadioGroup>

            {selectedRecipients === "custom" && (
              <div className="mt-4 ml-6">
                <Label htmlFor="custom-users" className="mb-2 block">
                  Select Users
                </Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select users" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user1">john_doe</SelectItem>
                    <SelectItem value="user2">jane_smith</SelectItem>
                    <SelectItem value="user3">robert_johnson</SelectItem>
                    {/* More users would be listed here */}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="border-t pt-4">
            <h3 className="text-lg font-medium mb-4">Sending Options</h3>
            <RadioGroup value={sendingOption} onValueChange={setSendingOption} className="space-y-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="immediate" id="immediate" />
                <Label htmlFor="immediate">Send Immediately</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="scheduled" id="scheduled" />
                <Label htmlFor="scheduled">Schedule for Later</Label>
              </div>
            </RadioGroup>

            {sendingOption === "scheduled" && (
              <div className="mt-4 ml-6 flex flex-col space-y-4">
                <div className="flex flex-col space-y-2">
                  <Label>Select Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {scheduledDate ? format(scheduledDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={scheduledDate} onSelect={setScheduledDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex flex-col space-y-2">
                  <Label>Select Time</Label>
                  <div className="flex space-x-2 items-center">
                    <Select>
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
                    <Select>
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
          <Button variant="outline">Save as Draft</Button>
          <Button>
            <Send className="mr-2 h-4 w-4" />
            {sendingOption === "immediate" ? "Send Newsletter" : "Schedule Newsletter"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
