"use client"

import { useState } from "react"
import Image from "next/image"
import { redirect } from "next/navigation"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { EyeIcon, EyeOffIcon } from "lucide-react"

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

const formSchema = z.object({
    email: z.string().email(),
    password: z
        .string()
        .refine((value) => value.length >= 6, {
            message: "Password must at least 6 characters long"
        })
})

type formFields = z.infer<typeof formSchema>

const SignInPage = () => {
    const { data: session } = useSession()
    if (session) redirect('/')

    const [loading, setLoading] = useState(false)
    const [isTypePassword, setIsTypePassword] = useState(true)

    const form = useForm<formFields>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    })

    const credentialLogin = (values: formFields) => {
        console.log(values)
    }

    return (
        <div className="max-w-sm min-w-[22rem] rounded-md border p-6 overflow-hidden">
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
                                        <Input {...field} type={isTypePassword ? "password" : "text"} />
                                        {field.value &&
                                            <>
                                                {isTypePassword ?
                                                    <EyeIcon
                                                        onClick={() => setIsTypePassword(false)}
                                                        className="h-4 w-4 absolute right-2 top-1/2 -translate-y-1/2"
                                                    />
                                                    :
                                                    <EyeOffIcon
                                                        onClick={() => setIsTypePassword(true)}
                                                        className="h-4 w-4 absolute right-2 top-1/2 -translate-y-1/2"
                                                    />
                                                }
                                            </>
                                        }
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button loading={loading}>
                        CONTINUE
                    </Button>
                </form>
            </Form>
            <div className="my-6 flex items-center">
                <Separator className="flex-1" />
                <div className="px-2 text-gray-600">or</div>
                <Separator className="flex-1" />
            </div>
            <Button variant="outline" className="w-full">
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