import { PrismaAdapter } from "@auth/prisma-adapter"
import bcrypt from "bcrypt"
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"

import prismadb from "@/lib/db/prismadb"

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prismadb),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                    placeholder: "example@email.com"
                },
                password: {
                    label: "Password",
                    type: "password",
                }
            },
            async authorize(credentials) {
                if (!credentials?.email) throw new Error("Please enter an email address!")
                if (!credentials?.password) throw new Error("Please enter the password!")

                const user = await prismadb.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                })

                if (!user) throw new Error("USER_NOT_FOUND")
                if (!user.hash) {
                    const account = await prismadb.account.findFirst({
                        where: {
                            userId: user.id
                        }
                    })
                    throw new Error(`LOGIN_USING_PROVIDER:${account?.provider}`)
                }

                const passwordMatch = await bcrypt.compare(credentials?.password, user.hash)

                if (!passwordMatch) throw new Error("INCORRECT_PASSWORD")

                return user
            },
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        jwt({ token, user }) {
            if (user) {
                const u = user as unknown as any
                return {
                    ...token,
                    id: u.id,
                }
            }
            return token
        },
        session({ session, token }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                }
            }
        },
    },
    // pages: {
    //     signIn: "/sign-in",
    // },
    // debug: process.env.NODE_ENV === "development"
}