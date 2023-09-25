import useAuth from "@/hook/use-auth"
import { redirect } from "next/navigation"

const AuthLayout = async ({
    children
}: {
    children: React.ReactNode
}) => {
    const { user } = await useAuth()
    if (user) redirect('/')

    return (
        <div className="grid h-screen place-content-center">
            {children}
        </div>
    )
}

export default AuthLayout