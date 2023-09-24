import * as z from "zod"

const signUpPayloadSchema = z.object({
    name: z.string(),
    email: z.string(),
    password: z.string(),
})

export type SignUpPayload = z.infer<typeof signUpPayloadSchema>

