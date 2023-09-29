import { NextResponse } from "next/server"
import bcrypt from "bcrypt"
import * as jwt from "jsonwebtoken"

import prismadb from "@/lib/db/prismadb"

export async function GET(
    req: Request,
    { params }: { params: { token: string } }
) {
    try {
        jwt.verify(params.token, process.env.NEXTAUTH_SECRET!, function (error) {
            if (error?.name === "TokenExpiredError") {
                console.log(error.name)
                return new NextResponse("TOKEN_EXPIRED", { status: 401 })
            }
        })

        const decoded = jwt.verify(params.token, process.env.NEXTAUTH_SECRET!) as jwt.JwtPayload

        const dbVerificationToken = await prismadb.verificationToken.findUnique({
            where: {
                identifier: decoded.identifier,
                token: decoded.token,
            }
        })

        if (!dbVerificationToken) return new NextResponse("INVALID_REQUEST", { status: 422 })
        if (dbVerificationToken.used) return new NextResponse("TOKEN_EXPIRED", { status: 401 })

        const currentTime = new Date()

        if (currentTime >= dbVerificationToken.expires) return new NextResponse("TOKEN_EXPIRED", { status: 401 })

        return NextResponse.json({ validated: true, identifier: decoded.identifier }, { status: 200 })
    } catch (error: any) {
        console.log(error)
        if (error?.name === "TokenExpiredError") {
            return new NextResponse("TOKEN_EXPIRED", { status: 401 })
        }
        if (error?.name !== "TokenExpiredError") {
            return new NextResponse("INVALID_REQUEST", { status: 422 })
        }
        return new NextResponse("Internal error", { status: 500 })
    }
}

export async function POST(
    req: Request,
    { params }: { params: { token: string} }
) {
    const { password } = await req.json()
    if (!password) return new NextResponse("PASSWORD_REQUIRED", { status: 400 })
    try {
        jwt.verify(params.token, process.env.NEXTAUTH_SECRET!, function (error, decoded) {
            if (error?.name === "TokenExpiredError") {
                console.log(error.name)
                return new NextResponse("TOKEN_EXPIRED", { status: 401 })
            }
        })
        const decoded = jwt.verify(params.token, process.env.NEXTAUTH_SECRET!) as jwt.JwtPayload

        const dbVerificationToken = await prismadb.verificationToken.findUnique({
            where: {
                identifier: decoded.identifier,
                token: decoded.token,
            }
        })

        if (!dbVerificationToken) return new NextResponse("INVALID_REQUEST", { status: 422 })
        if (dbVerificationToken.used) return new NextResponse("TOKEN_EXPIRED", { status: 401 })

        const currentTime = new Date()

        if (currentTime >= dbVerificationToken.expires) return new NextResponse("TOKEN_EXPIRED", { status: 401 })

        const hash = await bcrypt.hash(password, 10)

        await prismadb.user.update({
            where: {
                email: decoded.identifier,
            },
            data: {
                hash,
                emailVerified: true
            }
        })

        await prismadb.verificationToken.update({
            where: {
                token: decoded.token!
            },
            data: {
                used: true
            }
        })

        return NextResponse.json({ updated: true, identifier: decoded.identifier }, { status: 200 })
    } catch (error: any) {
        console.log(error)
        if (error?.name === "TokenExpiredError") {
            return new NextResponse("TOKEN_EXPIRED", { status: 401 })
        }
        if (error?.name !== "TokenExpiredError") {
            return new NextResponse("INVALID_REQUEST", { status: 422 })
        }
        return new NextResponse("Internal error", { status: 500 })
    }
}