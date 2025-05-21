"use client"

import { TableHeader } from "@/components/ui/table"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { UserProductListings } from "./UserProductListings"
import { UserEarnings } from "./UserEarnings"
import { UserWallet } from "./UserWallet"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface User {
  id: number
  username: string
  email: string
  joinDate: string
  productsListed: number
  revenueGenerated: number
}

const mockUsers: User[] = [
  {
    id: 1,
    username: "JohnDoe",
    email: "john@example.com",
    joinDate: "2023-05-15",
    productsListed: 8,
    revenueGenerated: 4250.75,
  },
  {
    id: 2,
    username: "JaneSmith",
    email: "jane@example.com",
    joinDate: "2023-07-22",
    productsListed: 5,
    revenueGenerated: 2890.3,
  },
  {
    id: 3,
    username: "BobJohnson",
    email: "bob@example.com",
    joinDate: "2023-09-10",
    productsListed: 3,
    revenueGenerated: 1475.2,
  },
]

// Mock data for product listings
const mockProducts = [
  { id: 1, name: "Product A", price: 19.99, status: "Active" },
  { id: 2, name: "Product B", price: 29.99, status: "Inactive" },
  { id: 3, name: "Product C", price: 39.99, status: "Active" },
]

// Mock data for wallet
const mockWallet = {
  address: "8xjn6rmEX8T9SYnLWyvjVS8GDCo4vJCUXecPzw7RWMXd",
  balance: 25.5,
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    joinDate: new Date().toISOString().split("T")[0],
    productsListed: 0,
    revenueGenerated: 0,
  })
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isManageDialogOpen, setIsManageDialogOpen] = useState(false)
  const [managementView, setManagementView] = useState<string | null>(null)
  const [emailContent, setEmailContent] = useState("")
  const [emailSubject, setEmailSubject] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [earningsData, setEarningsData] = useState({
    totalSales: { thisMonth: 0, lastMonth: 0, allTime: 0 },
    salesProfits: { thisMonth: 0, lastMonth: 0, allTime: 0 },
    affiliateEarnings: { thisMonth: 0, lastMonth: 0, allTime: 0 },
  })
  const [emailAttachments, setEmailAttachments] = useState<File[]>([])
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [sortField, setSortField] = useState<"joinDate" | "productsListed" | "revenueGenerated">("joinDate")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddUser = () => {
    setUsers([...users, { ...newUser, id: users.length + 1 }])
    setNewUser({
      username: "",
      email: "",
      joinDate: new Date().toISOString().split("T")[0],
      productsListed: 0,
      revenueGenerated: 0,
    })
    setIsAddUserOpen(false)
  }

  const handleDeleteUser = (id: number) => {
    setUsers(users.filter((user) => user.id !== id))
    setIsManageDialogOpen(false)
  }

  const handleManageUser = (user: User) => {
    setSelectedUser(user)
    setIsManageDialogOpen(true)
    setManagementView(null)
  }

  const fetchEarningsData = async (startDate: Date, endDate: Date) => {
    setIsLoading(true)
    setError(null)
    try {
      // Simulating API call with setTimeout
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Generate random data for demonstration
      const generateRandomData = () => ({
        thisMonth: Math.random() * 10000,
        lastMonth: Math.random() * 9000,
        allTime: Math.random() * 50000,
      })

      setEarningsData({
        totalSales: generateRandomData(),
        salesProfits: generateRandomData(),
        affiliateEarnings: generateRandomData(),
      })
    } catch (err) {
      setError("Failed to fetch earnings data. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (managementView === "earnings") {
      fetchEarningsData(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date())
    }
  }, [managementView, fetchEarningsData]) // Added fetchEarningsData to dependencies

  const renderManagementView = () => {
    if (!selectedUser) return null

    switch (managementView) {
      case "products":
        return <UserProductListings username={selectedUser.username} products={mockProducts} />
      case "earnings":
        return (
          <UserEarnings
            username={selectedUser.username}
            earningsData={earningsData}
            isLoading={isLoading}
            error={error}
            onDateRangeChange={fetchEarningsData}
          />
        )
      case "wallet":
        return <UserWallet username={selectedUser.username} walletData={mockWallet} />
      case "email":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Email {selectedUser.username}</h2>
            <Input
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              placeholder="Email subject"
              className="mb-2"
            />
            <Textarea
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              placeholder="Type your email here..."
              className="min-h-[200px] mb-4"
            />
            <div className="mb-4">
              <Input
                type="file"
                onChange={(e) => {
                  const files = Array.from(e.target.files || [])
                  setEmailAttachments((prev) => [...prev, ...files])
                }}
                multiple
                className="mb-2"
              />
              {emailAttachments.length > 0 && (
                <div>
                  <p>Attachments:</p>
                  <ul>
                    {emailAttachments.map((file, index) => (
                      <li key={index}>{file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <Button
              onClick={() => {
                console.log(
                  `Sending email to ${selectedUser.email}: Subject: ${emailSubject}, Content: ${emailContent}, Attachments: ${emailAttachments.map((f) => f.name).join(", ")}`,
                )
                setEmailSubject("")
                setEmailContent("")
                setEmailAttachments([])
                setManagementView(null)
              }}
            >
              Send Email
            </Button>
          </div>
        )
      case "suspend":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Suspend Account: {selectedUser.username}</h2>
            <p className="mb-4">Are you sure you want to suspend this account?</p>
            <Button
              variant="destructive"
              onClick={() => {
                console.log(`Suspending account: ${selectedUser.username}`)
                setManagementView(null)
              }}
            >
              Confirm Suspension
            </Button>
          </div>
        )
      default:
        return (
          <div className="space-y-4">
            <Button className="w-full" onClick={() => setManagementView("products")}>
              View Product Listings
            </Button>
            <Button className="w-full" onClick={() => setManagementView("earnings")}>
              View Earnings
            </Button>
            <Button className="w-full" onClick={() => setManagementView("wallet")}>
              View Solana Wallet
            </Button>
            <Button className="w-full" onClick={() => setManagementView("email")}>
              Email User
            </Button>
            <Button className="w-full" onClick={() => setManagementView("suspend")}>
              Suspend Account
            </Button>
            <Button className="w-full" variant="destructive" onClick={() => setIsDeleteConfirmOpen(true)}>
              Delete Account
            </Button>
          </div>
        )
    }
  }

  const handleConfirmedDelete = () => {
    if (selectedUser) {
      handleDeleteUser(selectedUser.id)
      setIsDeleteConfirmOpen(false)
      setIsManageDialogOpen(false)
    }
  }

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let comparison = 0

    if (sortField === "joinDate") {
      comparison = new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime()
    } else if (sortField === "productsListed") {
      comparison = a.productsListed - b.productsListed
    } else if (sortField === "revenueGenerated") {
      comparison = a.revenueGenerated - b.revenueGenerated
    }

    return sortDirection === "asc" ? comparison : -comparison
  })

  const handleSort = (field: "joinDate" | "productsListed" | "revenueGenerated") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc") // Default to descending when changing fields
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <p className="text-sm text-muted-foreground">Total Users: {users.length}</p>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-4">
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Button onClick={() => setIsAddUserOpen(true)}>Add User</Button>
        </div>
        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-2">Sort by:</p>
          <div className="flex space-x-4">
            <Button
              variant={sortField === "joinDate" ? "default" : "outline"}
              size="sm"
              onClick={() => handleSort("joinDate")}
              className="flex items-center"
            >
              Join Date
              {sortField === "joinDate" && <span className="ml-2">{sortDirection === "asc" ? "↑" : "↓"}</span>}
            </Button>
            <Button
              variant={sortField === "productsListed" ? "default" : "outline"}
              size="sm"
              onClick={() => handleSort("productsListed")}
              className="flex items-center"
            >
              Products Listed
              {sortField === "productsListed" && <span className="ml-2">{sortDirection === "asc" ? "↑" : "↓"}</span>}
            </Button>
            <Button
              variant={sortField === "revenueGenerated" ? "default" : "outline"}
              size="sm"
              onClick={() => handleSort("revenueGenerated")}
              className="flex items-center"
            >
              Revenue Generated
              {sortField === "revenueGenerated" && <span className="ml-2">{sortDirection === "asc" ? "↑" : "↓"}</span>}
            </Button>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("joinDate")}>
                Join Date {sortField === "joinDate" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("productsListed")}>
                Products Listed {sortField === "productsListed" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("revenueGenerated")}>
                Revenue Generated {sortField === "revenueGenerated" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{new Date(user.joinDate).toLocaleDateString()}</TableCell>
                <TableCell>{user.productsListed}</TableCell>
                <TableCell>
                  {(user.revenueGenerated / 20).toFixed(4)} SOL ({user.revenueGenerated.toFixed(2)} USD)
                </TableCell>
                <TableCell>
                  <Button variant="outline" onClick={() => handleManageUser(user)}>
                    Manage
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input
                id="username"
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="joinDate" className="text-right">
                Join Date
              </Label>
              <Input
                id="joinDate"
                type="date"
                value={newUser.joinDate}
                onChange={(e) => setNewUser({ ...newUser, joinDate: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="productsListed" className="text-right">
                Products Listed
              </Label>
              <Input
                id="productsListed"
                type="number"
                value={newUser.productsListed}
                onChange={(e) => setNewUser({ ...newUser, productsListed: Number.parseInt(e.target.value, 10) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="revenueGenerated" className="text-right">
                Revenue Generated
              </Label>
              <Input
                id="revenueGenerated"
                type="number"
                value={newUser.revenueGenerated}
                onChange={(e) => setNewUser({ ...newUser, revenueGenerated: Number.parseFloat(e.target.value) })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleAddUser}>
              Add User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isManageDialogOpen} onOpenChange={setIsManageDialogOpen}>
        <DialogContent className="max-w-3xl flex flex-col max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Manage User: {selectedUser?.username}</DialogTitle>
          </DialogHeader>
          <div className="flex-grow overflow-y-auto py-4">{renderManagementView()}</div>
          {managementView && (
            <DialogFooter className="mt-4 border-t pt-4">
              <Button onClick={() => setManagementView(null)}>Back</Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
      <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user account and remove all associated data
              from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmedDelete}>Yes, delete account</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
