"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import axios, { AxiosResponse } from "axios"

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
import { useToast } from "@/components/ui/use-toast"
import { SignUpFormFields } from "@/lib/types/auth-types"

const formSchema = z
    .object({
        name: z
            .string()
            .refine((value) => value.length >= 1, {
                message: "Name is required"
            }),
        email: z.string().email(),
        password: z.string().regex(/^(?=.*[A-Za-z])(?=.*\d).{6,}$/, "Password must be at least 6 characters long and include at least one letter and one digit."),
        confirm: z.string()
    })
    .refine((values) => values.password === values.confirm, {
        message: "Passwords do not match",
        path: ["confirm"],
    })

const SignUpPage = () => {
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { toast } = useToast()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirm: "",
        }
    })

    const signUp = async (values: z.infer<typeof formSchema>) => {
        const payload: SignUpFormFields = {
            name: values.name,
            email: values.email,
            password: values.password,
        }

        try {
            setLoading(true)
            const result: AxiosResponse = await axios.post("/api/auth/sign-up", payload)
            setLoading(false)
            if (result.data?.inserted) {
                toast({
                    title: "Account created successfully!",
                    description: "Please sign in to continue.",
                })
                router.push('/sign-up/success?redirectIn=6')
            }
        } catch (error: any) {
            setLoading(false)
            if (axios.isAxiosError(error)) {
                if (error.response?.data === "EXISTING_USER" && error.response?.status === 409) {
                    form.setError("email", { message: "An account with this email is already registered! Please sign in to continue." })
                }
                console.log(error.response?.data)
            }
            console.error("[SIGNUP_ERROR]:", error)
        }
    }

    const signInWithGoogle = () => {
        signIn("google", { redirect: false })
    }

    return (
        <div className="w-[23rem] rounded-md border p-6">
            <Heading title="Create your account" subtitle="to continue to Course-CMS" className="mb-6" />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(signUp)} className="grid gap-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full name</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
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
                                    <Input {...field} type="text" />
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
                                    <Input {...field} type="text" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button disabled={loading} loading={loading} type="submit" className="text-sm">
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
            <Button disabled={loading} variant="outline" className="w-full" onClick={signInWithGoogle}>
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