export async function generateStaticParams() {
  // Pre-render these product IDs
  return [{ id: "1" }, { id: "2" }, { id: "3" }]
}

interface Params {
  id: string
}

export default async function ProductPage({ params }: { params: Params }) {
  const { id } = params

  // Simulate fetching product data based on ID
  const product = await getProduct(id)

  if (!product) {
    return <div>Product not found</div>
  }

  return (
    <div>
      <h1>Product Details</h1>
      <h2>ID: {id}</h2>
      <h3>Name: {product.name}</h3>
      <p>Description: {product.description}</p>
    </div>
  )
}

async function getProduct(id: string): Promise<{ id: string; name: string; description: string } | null> {
  // Simulate fetching data from a database or API
  await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate network latency

  const products = [
    { id: "1", name: "Product 1", description: "This is product 1" },
    { id: "2", name: "Product 2", description: "This is product 2" },
    { id: "3", name: "Product 3", description: "This is product 3" },
  ]

  const product = products.find((p) => p.id === id)
  return product || null
}
