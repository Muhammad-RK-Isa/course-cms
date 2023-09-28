"use client"

import { useEffect, useState } from "react"
import { redirect, useRouter, useSearchParams } from "next/navigation"
import { CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"

const SuccessScreen = () => {

    const router = useRouter()
    const searchParams = useSearchParams()
    const redirectDelay = searchParams.get("redirectIn")

    if (!redirectDelay) redirect('/sign-in')

    const delay = parseInt(redirectDelay!)

    const [count, setCount] = useState(delay)

    useEffect(() => {
        const interval = setInterval(() => {
            if (count > 0) {
                setCount(count - 1)

            } else {
                clearInterval(interval)
                router.push('/sign-in')
            }

        }, 1000)

        return () => clearInterval(interval)
    }, [count])

    return (
        <div className="border rounded-md p-4 md:p-6 max-w-[23rem] md:max-w-xl">
            <div className="flex items-start gap-2 mb-4">
                <CheckCircle className="h-8 w-8 mt-1 box-border block" />
                <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                    Your password has been reset
                </h2>
            </div>
            <p className="leading-7">
                You will be automatically redirected to the <span className="font-semibold">Sign In</span> page in {count} seconds. Please sign in to continue.
            </p>
            <div className="flex items-center justify-end mt-8">
                <Button onClick={() => router.push('/sign-in')} className="w-max">Continue to sign in</Button>
            </div>
        </div>
    )
}

export default SuccessScreen