import { ThemeToggle } from "@/components/ui/theme-toggle";
import { UserButton } from "@/components/user-button";
import useAuth from "@/hook/use-auth";
import Link from "next/link";

export default async function Home() {
  const { user } = await useAuth()

  return (
    <main>
      This is a protected page.
      <ThemeToggle />
      <div className="my-8 mr-20">
        {user ?
          <UserButton />
          :
          <Link href="/sign-in">Sign in</Link>
        }
      </div>
    </main>
  )
}