"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { EyeIcon, EyeOffIcon } from "lucide-react"

import { SignInFormFields, signInFormSchema } from "@/lib/types/auth-types"
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

const SignInPage = () => {
    const [loading, setLoading] = useState(false)
    const [isTypePassword, setIsTypePassword] = useState(true)

    const form = useForm<SignInFormFields>({
        resolver: zodResolver(signInFormSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    })

    const credentialLogin = async (values: SignInFormFields) => {
        setLoading(true)
        try {
            const result = await signIn("credentials", { ...values, redirect: false })

            if (result?.error === "USER_NOT_FOUND") {
                form.setError("email", { message: "No account is associated with this email! Please try a different email or Sign up." })
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

    return (
        <div className="w-[23rem] rounded-md border p-6">
            <Heading title="Sign in" subtitle="to continue to Course-CMS" className="mb-6" />
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
                                    <div className="relative">
                                        <Input {...field} type={isTypePassword ? "password" : "text"} className="pr-8" />
                                        {field.value &&
                                            <>
                                                {isTypePassword ?
                                                    <Button disabled={loading}
                                                        variant="link"
                                                        size="icon"
                                                        className="absolute right-0 top-1/2 -translate-y-1/2"
                                                        onClick={(e) => {
                                                            e.preventDefault()
                                                            setIsTypePassword(false)
                                                        }}
                                                    >
                                                        <EyeIcon
                                                            className="h-5 w-5 text-muted-foreground hover:text-foreground duration-300"
                                                        />
                                                    </Button>
                                                    :
                                                    <Button disabled={loading}
                                                        variant="link"
                                                        size="icon"
                                                        className="absolute right-0 top-1/2 -translate-y-1/2"
                                                        onClick={(e) => {
                                                            e.preventDefault()
                                                            setIsTypePassword(true)
                                                        }}
                                                    >
                                                        <EyeOffIcon
                                                            className="h-5 w-5 text-muted-foreground hover:text-foreground duration-300"
                                                        />
                                                    </Button>
                                                }
                                            </>
                                        }
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button disabled={loading} type="submit" loading={loading} className="text-sm">
                        CONTINUE
                    </Button>
                </form>
            </Form>
            <div className="mt-5 inline-flex text-sm items-center gap-1">
                <span className="text-muted-foreground">No account?</span>
                <Link href="/sign-up" className="font-semibold hover:underline underline-offset-2">Sign up</Link>
            </div>
            <div className="my-6 flex items-center">
                <Separator className="flex-1" />
                <div className="px-2 text-gray-600">or</div>
                <Separator className="flex-1" />
            </div>
            <Button disabled={loading} variant="outline" className="w-full" onClick={() => signIn("google")}>
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

export default SignInPage