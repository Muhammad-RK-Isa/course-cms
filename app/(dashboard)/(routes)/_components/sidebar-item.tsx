import { LucideIcon } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

interface SidebarItemProps {
    icon: LucideIcon
    label: string
    href: string
}

export const SidebarItem = ({
    icon: Icon,
    label,
    href
}: SidebarItemProps) => {

    const router = useRouter()
    const pathname = usePathname()
    const isActive =
        (pathname === "/" && href === "/") ||
        pathname === href ||
        pathname?.startsWith(`${href}/`)

    const onClick = () => {
        router.push(href)
    }

    return (
        <button
            onClick={onClick}
            type="button"
            className={cn(
                "flex items-center gap-x-2 text-muted-foreground text-sm font-[500] pl-6 transition-all hover:text-foreground hover:bg-foreground/5",
                isActive && "text-foreground"
            )}
        >
            <Icon />
            {label}
        </button>
    )
}
