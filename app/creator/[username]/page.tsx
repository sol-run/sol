export async function generateStaticParams() {
  // Pre-render these usernames
  return [{ username: "johndoe" }, { username: "janedoe" }, { username: "creator1" }]
}

interface Params {
  username: string
}

interface Props {
  params: Params
}

export default async function CreatorPage({ params }: Props) {
  const { username } = params

  return (
    <div>
      <h1>Creator Page</h1>
      <p>Username: {username}</p>
    </div>
  )
}
