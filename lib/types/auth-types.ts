import * as z from "zod"

export const signInFormSchema = z.object({
    email: z.string().email(),
    password: z.string().regex(/^(?=.*[A-Za-z])(?=.*\d).{6,}$/, "Password must be at least 6 characters long and include at least one letter and one digit"),
})

export type SignInFormFields = z.infer<typeof signInFormSchema>

export interface SignUpFormFields {
    name: string
    email: string
    password: string
}