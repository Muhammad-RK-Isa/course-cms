import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth/auth"

const useAuth = async (
    redirectURL?: string,
    callbackURL?: string
) => {
    const session = await getServerSession(authOptions)

    if (!session && redirectURL) {
        if (callbackURL) redirect(`${redirectURL}?$callbackUrl=${callbackURL}`)
        redirect(redirectURL)
    }

    return { user: session?.user }
}

export default useAuth