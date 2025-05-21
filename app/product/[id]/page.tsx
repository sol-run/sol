export async function generateStaticParams() {
  // Pre-render these product IDs
  return [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }, { id: "5" }]
}

interface Props {
  params: {
    id: string
  }
}

export default async function ProductPage({ params }: Props) {
  const { id } = params

  return (
    <div>
      <h1>Product Details</h1>
      <p>Product ID: {id}</p>
      {/* You can fetch product details from a database or API here */}
    </div>
  )
}
