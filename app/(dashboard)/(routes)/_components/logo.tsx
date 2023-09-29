"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import Image from "next/image"

export const Logo = () => {
    const [mode, setMode] = useState<string>()
    const { theme, systemTheme } = useTheme()

    useEffect(() => {
        if (theme !== "system") {
            setMode(theme)
        } else {
            setMode(systemTheme)
        }
    }, [theme, systemTheme])
    return (
        <>
            {mode === "dark" ?
                <Image
                    src="./ccms-white-no-bg.svg"
                    alt="icon"
                    height={130}
                    width={130}
                    priority
                />
                :
                <Image
                    src="./ccms-black-no-bg.svg"
                    alt="icon"
                    height={130}
                    width={130}
                    priority
                />
            }
        </>
    )
}