"use client"

import { ChevronLeft } from "lucide-react"

const BackButton = () => {
    return (
        <div
            className="-ml-1 mb-4 inline-flex group text-muted-foreground hover:text-foreground cursor-pointer"
            onClick={() => window.history.back()}
        >
            <ChevronLeft className="h-6 w-6" />
            <span>Back</span>
        </div>
    )
}

export default BackButton