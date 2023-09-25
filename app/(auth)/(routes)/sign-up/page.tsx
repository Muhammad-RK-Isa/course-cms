"use client"

import { useState } from "react"
import Image from "next/image"
import { redirect } from "next/navigation"
import Link from "next/link"
import { signIn, useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import Heading from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"

const formSchema = z
    .object({
        name: z.string().min(1),
        email: z.string().email(),
        password: z.string().regex(/^(?=.*[A-Za-z])(?=.*\d).{6,}$/, "Password must be at least 6 characters long and include at least one letter and one digit"),
        confirm: z.string()
    })
    .refine((values) => values.password === values.confirm, {
        message: "Passwords does not match",
        path: ["confirm"]
    })

const SignUpPage = () => {
    const { data: session } = useSession()
    if (session) redirect('/')

    const [loading, setLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            confirm: ""
        }
    })

    const credentialLogin = async (values: z.infer<typeof formSchema>) => {
        setLoading(true)
        try {
            const result = await signIn("credentials", { ...values, redirect: false })

            if (result?.error === "USER_NOT_FOUND") {
                form.setError("email", { message: "User does not exist!" })
                setLoading(false)
                return
            }
            if (result?.error === "LOGIN_USING_PROVIDER:google") {
                form.setError("email", { message: "This email is associated with a google account. Please sign in using your google account." })
                setLoading(false)
                return
            }
            if (result?.error === "INCORRECT_PASSWORD") {
                form.setError("password", { message: "Incorrect password!" })
                setLoading(false)
                return
            }
        } catch (error) {
            setLoading(false)
            console.error("[SIGNIN_ERROR]:", error)
        } finally {
            setLoading(false)
        }
    }

    const signInWithGoogle = () => {
        signIn("google", { redirect: false })
    }

    return (
        <div className="w-[23rem] rounded-md border p-6 overflow-hidden">
            <Heading title="Create your account" subtitle="to continue to Course-CMS" className="mb-6" />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(credentialLogin)} className="grid gap-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email address</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input {...field} type="text"/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confirm"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm password</FormLabel>
                                <FormControl>
                                    <Input {...field} type="text"/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" loading={loading} className="text-sm">
                        CONTINUE
                    </Button>
                </form>
            </Form>
            <div className="mt-5 inline-flex text-sm items-center gap-1">
                <span className="text-muted-foreground">Have an account?</span>
                <Link href="/sign-in" className="font-semibold hover:underline underline-offset-2">Sign in</Link>
            </div>
            <div className="my-6 flex items-center">
                <Separator className="flex-1" />
                <div className="px-2 text-gray-600">or</div>
                <Separator className="flex-1" />
            </div>
            <Button variant="outline" className="w-full" onClick={signInWithGoogle}>
                <Image
                    width={16}
                    height={16}
                    src="./google.svg"
                    alt="google icon"
                    className="mr-2"
                />
                Continue with Google
            </Button>
        </div>
    )
}

export default SignUpPage