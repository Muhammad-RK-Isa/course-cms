import useAuth from "@/hook/use-auth";
import useServerUser from "@/hook/use-auth";

export default async function Home() {
  const { user } = await useAuth()

  return (
    <main>
      This is a protected page.
    </main>
  )
}