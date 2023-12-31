"use client"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { signOut, useSession } from "next-auth/react"
import Image from "next/image"
import { LogOutIcon, UserCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

export const UserButton = ({
    className,
    ...props
}: React.HtmlHTMLAttributes<HTMLElement>) => {
    const { data: session } = useSession()

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className={cn(
                    "rounded-full w-6 h-6 p-0 overflow-hidden",
                    className
                )}>
                    {session?.user.image ?
                        <Image
                            src={session?.user.image}
                            alt="user icon"
                            height={30}
                            width={30}
                        />
                        :
                        <UserCircle2 />
                    }
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-max">
                <div className="flex flex-col">
                    <div className="border-b p-2">
                        <h4 className="font-semibold text-sm">{session?.user.name}</h4>
                        <p className="text-xs text-muted-foreground">{session?.user.email}</p>
                    </div>
                    <Button
                        onClick={() => signOut()}
                        variant="ghost"
                        size="sm"
                        className="m-1 gap-2 justify-start text-sm hover:text-destructive hover:bg-destructive/10"
                    >
                        <LogOutIcon className="h-4 w-4 -ml-2" />
                        <span className="text-left font-normal">Sign out</span>
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}