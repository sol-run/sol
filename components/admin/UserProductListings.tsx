import { TableHeader } from "@/components/ui/table"
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table"
import Link from "next/link"

interface Product {
  id: number
  name: string
  price: number
  status: string
}

interface UserProductListingsProps {
  username: string
  products: Product[]
}

export function UserProductListings({ username, products }: UserProductListingsProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Product Listings for {username}</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Total Revenue</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.id}</TableCell>
              <TableCell>
                <Link href={`/product/${product.id}`} target="_blank" rel="noopener noreferrer">
                  {product.name}
                </Link>
              </TableCell>
              <TableCell>
                {product.price.toFixed(4)} SOL ({(product.price * 25.75).toFixed(2)} USD)
              </TableCell>
              <TableCell>{product.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
