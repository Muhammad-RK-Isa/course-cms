"use client"

import { useSession } from "next-auth/react";

const useUser = () => {
    const { data } = useSession()
    return { user: data?.user }
}

export default useUser;