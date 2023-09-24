import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth"

const useServerUser = async () => {
    const session = await getServerSession(authOptions)

    return { user: session?.user }
}

export default useServerUser