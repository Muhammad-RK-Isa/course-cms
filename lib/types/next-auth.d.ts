import type { Session, User, Profile } from 'next-auth'
import type { JWT } from 'next-auth/jwt'

type UserId = string

declare module 'next-auth/jwt' {
    interface JWT {
        id: UserId
    }
}

declare module 'next-auth' {
    interface Session {
        user: User & {
            id: UserId
        }
    }
}

declare module 'next-auth' {
    interface Profile {
        picture?: string
        email_verified: boolean
    }
}