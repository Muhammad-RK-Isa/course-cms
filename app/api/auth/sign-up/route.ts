import { NextResponse } from "next/server"
import bcrypt from "bcrypt"

import prismadb from "@/lib/db/prismadb"
import { SignUpPayload } from "@/lib/types/auth-types"

export async function POST(
    req: Request
) {
    try {
        const { name, email, password }: SignUpPayload = await req.json()

        if (!name) return new NextResponse('USERNAME_REQUIRED', { status: 400 })
        if (!email) return new NextResponse('EMAIL_REQUIRED', { status: 400 })

        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
        
        const isValidEmail = emailRegex.test(email)

        if (!isValidEmail) return new NextResponse('INVALID_EMAIL', { status: 400 })

        if (!password) return new NextResponse('PASSWORD_REQUIRED', { status: 400 })

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/

        const isValidPassword = passwordRegex.test(password)

        if (!isValidPassword) return new NextResponse('INVALID_PASSWORD', { status: 400 })

        const existingUser = await prismadb.user.findFirst({
            where: {
                email,
            }
        })

        if (existingUser) return new NextResponse('EXISTING_USER', { status: 409 })

        const hash = await bcrypt.hash(password, 10)

        const newUser = await prismadb.user.create({
            data: {
                name,
                email,
                hash,
            }
        })

        return NextResponse.json({ inserted: true, createdAt: newUser.createdAt })

    } catch (error) {
        console.error("[REGISTRATION_POST", error)
        return new NextResponse("Internal error", { status: 500 })
    }
}