"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Send } from "lucide-react"
import axios from "axios"
import * as z from "zod"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Heading from "@/components/ui/heading"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import BackButton from "@/components/ui/back-button"

const formSchema = z.object({
    email: z.string().email(),
})

const ResetPassword = () => {

    const [loading, setLoading] = useState(false)
    const searchParams = useSearchParams()
    const email = searchParams.get("email")

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: email || "",
        }
    })

    const sendRecoveryEmail = async (values: z.infer<typeof formSchema>) => {

        const payload = {
            recipient: values.email
        }

        try {
            setLoading(true)
            const result = await axios.post("/api/auth/reset-password", payload)
            console.log(result)
        } catch (error: any) {
            setLoading(false)
            if (axios.isAxiosError(error)) {
                if (error.response?.data === "NON_EXISTING_USER" && error.response?.status === 404) {
                    form.setError("email", { message: "Could not find an account associated with this email. Please sign up to continue." })
                }
            }
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="border rounded-md p-4 md:p-6 w-[23rem]">
            <BackButton />
            <Heading
                title="Reset password"
                subtitle="Verify your email to reset your password"
                className="mb-6"
            />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(sendRecoveryEmail)}>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="What's your email?" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button className="w-full mt-4">
                        Send Verification Email
                        <Send className="h-4 w-4 ml-2" />
                    </Button>
                </form>
            </Form>
        </div>
    )
}

export default ResetPassword