"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import * as z from "zod"

import Heading from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Frown, Loader2, ShieldX } from "lucide-react"

const formSchema = z
    .object({
        password: z.string().regex(/^(?=.*[A-Za-z])(?=.*\d).{6,}$/, "Password must be at least 6 characters long and include at least one letter and one digit."),
        confirm: z.string()
    })
    .refine((values) => values.password === values.confirm, {
        message: "Passwords do not match",
        path: ["confirm"],
    })

const CreateNewPasswordPage = () => {

    const params = useParams()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [processing, setProcessing] = useState(true)
    const [error, setError] = useState<string>("")

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
            confirm: "",
        }
    })

    const resetPassword = async (values: z.infer<typeof formSchema>) => {
        const payload: {password: string} = {
            password: values.password
        }

        try {
            setLoading(true)
            await axios.post(`/api/auth/reset-password/${params.token}/${params.identifier}`, payload)
            router.push("/reset-password/password-reset-success?redirectIn=10")
        } catch (error: any) {
            setLoading(false)
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                setError("TOKEN_EXPIRED")
            }
            if (axios.isAxiosError(error) && error.response?.status === 422) {
                setError("INVALID_REQUEST")
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        (async function () {
            try {
                await axios.get(`/api/auth/reset-password/${params.token}/${params.identifier}`)
            } catch (error: any) {
                if (axios.isAxiosError(error) && error.response?.status === 401) {
                    setError("TOKEN_EXPIRED")
                }
                if (axios.isAxiosError(error) && error.response?.status === 422) {
                    setError("INVALID_REQUEST")
                }
                console.log(error)
                setProcessing(false)
            } finally {
                setProcessing(false)
            }
        }
        )()
    }, [])

    if (processing) {
        return (
            <div className="inline-flex items-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin" />
                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                    Validating your request
                </h3>
            </div>
        )
    }

    if (error === "TOKEN_EXPIRED") {
        return (
            <div className="inline-flex items-center gap-2">
                <Frown className="h-6 w-6" />
                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                    Link expired!
                </h3>
            </div>
        )
    }
    if (error === "INVALID_REQUEST") {
        return (
            <div className="inline-flex items-center gap-2">
                <ShieldX className="h-6 w-6" />
                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                    Invalid Request!
                </h3>
            </div>
        )
    }

        return (
            <div className="w-[24rem] rounded-md border p-6">
                <Heading title="Create a new password" className="mb-6" />
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(resetPassword)} className="grid gap-4">
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
                            Save changes
                        </Button>
                    </form>
                </Form>
            </div>
        )
}

export default CreateNewPasswordPage