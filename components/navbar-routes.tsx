"use client"

import Link from "next/link"

import { ThemeToggle } from "@/components/ui/theme-toggle"
import { UserButton } from "@/components/user-button"
import { useSession } from "next-auth/react"

export const NavbarRoutes = () => {

    const { data: user } = useSession()

    return (
        <div>
            <div className="ml-auto flex items-center">
                <ThemeToggle />
                {user ?
                    <UserButton />
                    :
                    <Link href="/sign-in">Sign in</Link>
                }
            </div>
        </div>
    )
}