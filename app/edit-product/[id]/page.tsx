export async function generateStaticParams() {
  // Pre-render these product IDs
  return [{ id: "1" }, { id: "2" }, { id: "3" }]
}

interface Props {
  params: { id: string }
}

const EditProductPage = ({ params }: Props) => {
  const { id } = params

  return (
    <div>
      <h1>Edit Product</h1>
      <p>Editing product with ID: {id}</p>
      {/* Add your form and logic for editing the product here */}
    </div>
  )
}

export default EditProductPage
