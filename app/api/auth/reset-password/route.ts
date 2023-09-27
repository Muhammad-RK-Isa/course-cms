import { NextResponse } from "next/server"
import nodemailer, { Transporter } from "nodemailer"
import bcrypt from "bcrypt"

import prismadb from "@/lib/db/prismadb"

export async function POST(
    req: Request
) {
    const { recipient } = await req.json()

    try {

        const user = await prismadb.user.findUnique({
            where: {
                email: recipient,
            }
        })

        if (!user) return new NextResponse("NON_EXISTING_USER", { status: 404 })

        const code = Math.floor(Math.random() * 1000000).toString().padStart(6, '0')

        const hash = await bcrypt.hash(code, 10)

        const calculateExpiryDate = (): Date => {
            const currentTime = new Date()
            const expiryTime = new Date(currentTime.getTime() + 10 * 60 * 1000)
            return expiryTime
        }

        const expiryDate = calculateExpiryDate()

        await prismadb.verificationToken.create({
            data: {
                identifier: user.email!,
                token: hash,
                expires: expiryDate
            }
        })

        const transporter: Transporter = nodemailer.createTransport({
            port: 587,
            service: "gmail",
            auth: {
                user: process.env.MAIL_ACCOUNT,
                pass: process.env.MAIL_PASSWORD
            },
        })

        const emailHtml = `
        <!DOCTYPE html
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
<html lang="en">

    <head></head>
    <div id="__react-email-preview"
        style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">Reset password
    </div>

    <body
        style="margin-left:auto;margin-right:auto;margin-top:auto;margin-bottom:auto;background-color:rgb(255,255,255);font-family:ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, &quot;Noto Sans&quot;, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;">
        <table align="center" role="presentation" cellSpacing="0" cellPadding="0" border="0" width="100%"
            style="max-width:37.5em;margin-left:auto;margin-right:auto;margin-top:40px;margin-bottom:40px;width:465px;border-radius:0.25rem;border-width:1px;border-style:solid;border-color:rgb(234,234,234);padding:20px">
            <tr style="width:100%">
                <td>
                    <h1
                        style="margin-left:0px;margin-right:0px;margin-top:30px;margin-bottom:0px;padding:0px;text-align:center;font-size:24px;color:rgb(0,0,0);line-height: 0;">
                        <strong>Verify Your Identity</strong>
                    </h1>
                    <p style="font-size:16px;line-height:24px;margin-bottom:20px;color:rgb(0,0,0);text-align: center;">
                        To reset your password</p>
                    <p style="font-size:14px;line-height:24px;margin:16px 0;color:rgb(0,0,0)">Hello ${user.name},</p>
                    <p style="font-size:14px;line-height:24px;margin:16px 0;color:rgb(0,0,0)">
                        We have received a request to reset your password for your Course CMS account. To ensure the
                        security of your
                        account, we require you to verify your identity by providing the following verification code.
                    </p>
                    <div style="font-size:30px;margin: 30px 0;text-align:center;">
                        <code
                            style="background-color:#eaeaea;display:inline-block;padding:5px 10px;border-radius: 4px;">${code}</code>
                    </div>
                    <p style="text-align: center;">or</p>
                    <table align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" width="100%"
                        style="margin-bottom:32px;margin-top:32px;text-align:center">
                        <tbody>
                            <tr>
                                <td>
                                    <a href=${process.env.NEXTAUTH_URL} target="_blank"
                                        style="p-x:20px;p-y:12px;line-height:100%;text-decoration:none;display:inline-block;max-width:100%;padding:12px 20px;border-radius:0.25rem;background-color:rgb(0,0,0);text-align:center;font-size:12px;font-weight:600;color:rgb(255,255,255);text-decoration-line:none"><span></span><span
                                            style="p-x:20px;p-y:12px;max-width:100%;display:inline-block;line-height:120%;text-decoration:none;text-transform:none;mso-padding-alt:0px;mso-text-raise:9px">
                                            Reset Password</span><span></span></a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <p style="font-size:14px;line-height:24px;margin:16px 0;color:rgb(0,0,0)">
                        Please use the code above or click the reset button to reset your password. This code will expire in 10 minutes,
                        so please act promptly.
                    </p>
                    <p style="font-size:14px;line-height:24px;margin:16px 0;color:rgb(0,0,0)">
                        If you did not request a password reset or believe this email was sent in error, please ignore
                        it. Your account's
                        security remains intact.
                    </p>
                    <p style="font-size:14px;line-height:24px;margin:16px 0;color:rgb(0,0,0)">
                        If you encounter any issues or require further assistance, please do not hesitate to contact our
                        support team at ${process.env.MAIL_ACCOUNT}
                    </p>
                    <p style="font-size:14px;line-height:10px;margin-top:16px;color:rgb(0,0,0)">
                        Thank you for choosing Course CMS.
                    </p>
                    <p style="font-size:14px;line-height:10px;color:rgb(0,0,0)">
                        Best regards,
                    </p>
                    <p style="font-size:14px;line-height:10px;color:rgb(0,0,0)">
                        <a target="_blank" style="color:rgb(37,99,235);text-decoration:none;text-decoration-line:none"
                            href=${process.env.NEXTAUTH_URL}>Course CMS
                        </a>
                    </p>

                </td>
            </tr>
        </table>
    </body>

</html>
        `

        const options = {
            user: "CCMS",
            from: process.env.MAIL_ACCOUNT,
            to: recipient,
            subject: 'CCMS Verification Email',
            html: emailHtml,
        }

        const result = await transporter.sendMail(options)
        return NextResponse.json(result)

    } catch (error) {
        console.log(error)
        return new NextResponse("Couldn't send an email", { status: 500 })
    }
}