"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import { usePathname, useRouter } from "next/navigation"

import { ThemeToggle } from "@/components/ui/theme-toggle"
import { UserButton } from "@/components/user-button"
import { Button } from "./ui/button"
import { LogOut } from "lucide-react"

export const NavbarRoutes = () => {
    const { data: user } = useSession()
    const pathname = usePathname()
    const router = useRouter()

    const isTeacher = pathname?.startsWith("/teacher")
    const isPlayerPage = pathname?.includes("/chapter")

    return (
        <div className="ml-auto flex items-center gap-x-2">
            {(isTeacher || isPlayerPage ?
                (
                    <Link href="/">
                        <Button variant="ghost" size="sm">
                            <LogOut className="h-4 w-4 mr-2" />
                            Exit
                        </Button>
                    </Link>
                )
                :
                (
                    <Link href="/teacher/courses">
                        <Button variant="ghost" size="sm">
                            Teacher mode
                        </Button>
                    </Link>
                )
            )}
            <ThemeToggle />
            {user ?
                <UserButton />
                :
                <Link href="/sign-in">Sign in</Link>
            }
        </div>
    )
}