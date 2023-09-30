import useAuth from "@/hook/use-auth"

export default async function Home() {
  const user = await useAuth()
  return (
    <main className="mt-20">
      This is a protected page.
      <p>{JSON.stringify(user)}</p>
    </main>
  )
}