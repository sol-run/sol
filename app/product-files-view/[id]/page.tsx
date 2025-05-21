export async function generateStaticParams() {
  // Pre-render these product IDs
  return [{ id: "1" }, { id: "2" }, { id: "3" }]
}

const ProductFilesView = async ({ params }: { params: { id: string } }) => {
  const productId = params.id

  return (
    <div>
      <h1>Product Files for Product ID: {productId}</h1>
      {/* Add your component logic here to display files for the product */}
    </div>
  )
}

export default ProductFilesView
