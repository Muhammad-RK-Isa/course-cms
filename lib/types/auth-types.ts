import * as z from "zod"

export const signUpFormSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().regex(/^(?=.*[A-Za-z])(?=.*\d).{6,}$/, "Password must be at least 6 characters long and include at least one letter and one digit"),
})

export const signInFormSchema = z.object({
    email: z.string().email(),
    password: z.string().regex(/^(?=.*[A-Za-z])(?=.*\d).{6,}$/, "Password must be at least 6 characters long and include at least one letter and one digit"),
})


export type SignUpFormFields = z.infer<typeof signUpFormSchema>
export type SignInFormFields = z.infer<typeof signInFormSchema>

