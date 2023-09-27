import { FC } from "react"

import { cn } from "@/lib/utils"

interface HeadingProps {
    title: string
    subtitle?: string
    className?: string
}

const Heading: FC<HeadingProps> = ({
    title,
    subtitle,
    className
}) => {
    return (
        <div className={cn(className)}>
            <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                {title}
            </h2>
            <p className="text-muted-foreground">
                {subtitle}
            </p>
        </div>
    )
}

export default Heading;