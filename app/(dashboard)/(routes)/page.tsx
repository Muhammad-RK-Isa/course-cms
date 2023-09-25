import { ThemeToggle } from "@/components/ui/theme-toggle";
import useAuth from "@/hook/use-auth";

export default async function Home() {
  const { user } = await useAuth()

  return (
    <main>
      This is a protected page.
      <ThemeToggle/>
    </main>
  )
}