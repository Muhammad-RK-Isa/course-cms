import useServerUser from "@/hook/useServerUser";

export default async function Home() {
  const { user } = await useServerUser()

  return (
    <main>
      This is a protected page.
    </main>
  )
}