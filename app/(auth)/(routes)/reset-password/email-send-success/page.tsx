import { Mail } from "lucide-react"

const EmailSendSuccess = () => {

    return (
        <div className="border rounded-md p-8 md:p-16 max-w-[23rem] md:max-w-xl text-center">
            <Mail className="h-16 w-16 mb-6 mx-auto" />
            <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight transition-colors mb-4">
                Email Sent
            </h2>
            <p className="md:px-20 leading-7 text-muted-foreground">
                Please check your inbox and spam folders for the <strong>Password Reset</strong> Link.
            </p>
        </div>
    )
}

export default EmailSendSuccess