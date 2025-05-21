"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface Affiliate {
  id: number
  name: string
  email: string
  totalSales: number
  commissionRate: number
}

const mockAffiliates: Affiliate[] = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", totalSales: 5000, commissionRate: 10 },
  { id: 2, name: "Bob Smith", email: "bob@example.com", totalSales: 7500, commissionRate: 12 },
  { id: 3, name: "Charlie Brown", email: "charlie@example.com", totalSales: 3000, commissionRate: 8 },
]

export function AffiliateManagement() {
  const [affiliates, setAffiliates] = useState<Affiliate[]>(mockAffiliates)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddAffiliateOpen, setIsAddAffiliateOpen] = useState(false)
  const [newAffiliate, setNewAffiliate] = useState({ name: "", email: "", totalSales: 0, commissionRate: 0 })

  const filteredAffiliates = affiliates.filter(
    (affiliate) =>
      affiliate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      affiliate.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddAffiliate = () => {
    setAffiliates([...affiliates, { ...newAffiliate, id: affiliates.length + 1 }])
    setNewAffiliate({ name: "", email: "", totalSales: 0, commissionRate: 0 })
    setIsAddAffiliateOpen(false)
  }

  const handleDeleteAffiliate = (id: number) => {
    setAffiliates(affiliates.filter((affiliate) => affiliate.id !== id))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Affiliate Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-4">
          <Input
            placeholder="Search affiliates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Button onClick={() => setIsAddAffiliateOpen(true)}>Add Affiliate</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Total Sales</TableHead>
              <TableHead>Commission Rate</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAffiliates.map((affiliate) => (
              <TableRow key={affiliate.id}>
                <TableCell>{affiliate.name}</TableCell>
                <TableCell>{affiliate.email}</TableCell>
                <TableCell>${affiliate.totalSales.toFixed(2)}</TableCell>
                <TableCell>{affiliate.commissionRate}%</TableCell>
                <TableCell>
                  <Button variant="destructive" onClick={() => handleDeleteAffiliate(affiliate.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <Dialog open={isAddAffiliateOpen} onOpenChange={setIsAddAffiliateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Affiliate</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newAffiliate.name}
                onChange={(e) => setNewAffiliate({ ...newAffiliate, name: e.target.value })}
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
                value={newAffiliate.email}
                onChange={(e) => setNewAffiliate({ ...newAffiliate, email: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="totalSales" className="text-right">
                Total Sales
              </Label>
              <Input
                id="totalSales"
                type="number"
                value={newAffiliate.totalSales}
                onChange={(e) => setNewAffiliate({ ...newAffiliate, totalSales: Number.parseFloat(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="commissionRate" className="text-right">
                Commission Rate (%)
              </Label>
              <Input
                id="commissionRate"
                type="number"
                value={newAffiliate.commissionRate}
                onChange={(e) =>
                  setNewAffiliate({ ...newAffiliate, commissionRate: Number.parseFloat(e.target.value) })
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleAddAffiliate}>
              Add Affiliate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
