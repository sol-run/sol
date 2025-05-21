export async function generateStaticParams() {
  // Pre-render these product IDs
  return [{ id: "1" }, { id: "2" }, { id: "3" }]
}

interface Params {
  id: string
}

interface Props {
  params: Params
}

export default async function ProductAccessPage({ params }: Props) {
  const { id } = params

  return (
    <div>
      <h1>Product Access Page</h1>
      <p>Product ID: {id}</p>
    </div>
  )
}
