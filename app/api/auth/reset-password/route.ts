import { NextResponse } from "next/server"
import nodemailer, { Transporter } from "nodemailer"
import prismadb from "@/lib/db/prismadb"
import * as jwt from "jsonwebtoken"

export async function POST(
    req: Request
) {
    const { recipient } = await req.json()

    try {
        const user = await prismadb.user.findFirst({
            where: {
                email: recipient,
            }
        })

        // TODO: Uncomment the lines below to set limit for max 3 reset code requests

        const nonExpiredTokens = await prismadb.verificationToken.findMany({
            where: {
                identifier: recipient,
                expires: {
                    gte: new Date()
                }
            }
        })

        if (nonExpiredTokens.length >= 3) return new NextResponse("MAX_CODE_REQUEST_REACHED", { status: 429 })

        if (!user) return new NextResponse("NON_EXISTING_USER", { status: 404 })

        const calculateExpiryDate = (): Date => {
            const currentTime = new Date()
            const expiryTime = new Date(currentTime.getTime() + 10 * 60 * 1000)
            return expiryTime
        }

        const expiryDate = calculateExpiryDate()

        const token = await prismadb.verificationToken.create({
            data: {
                identifier: user.email!,
                expires: expiryDate
            }
        })

        const jwtPayload = {
            identifier: user.email,
            token: token.token,
        }

        const jwtToken = jwt.sign(jwtPayload, process.env.NEXTAUTH_SECRET!, { expiresIn: "10m" })

        if (!jwtToken) return new NextResponse("INTERNAL_ERROR", { status: 500 })

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
                                    We have received a request to reset your password for your Course CMS account. To reset your password, please click on <strong>Reset password</strong> button or follow this 
                                    <a target="_blank" style="color:rgb(37,99,235);text-decoration:none;text-decoration-line:none"
                                    href="${process.env.NEXTAUTH_URL}/reset-password/${jwtToken}/${user.email}">
                                    link
                                    </a>
                                </p>
                                <p style="text-align: center;">or</p>
                                <table align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" width="100%"
                                    style="margin-bottom:32px;margin-top:32px;text-align:center">
                                    <tbody>
                                        <tr>
                                            <td>
                                                <a href="${process.env.NEXTAUTH_URL}/reset-password/${jwtToken}/${user.email}" target="_blank"
                                                    style="p-x:20px;p-y:12px;line-height:100%;text-decoration:none;display:inline-block;max-width:100%;padding:12px 20px;border-radius:0.25rem;background-color:rgb(0,0,0);text-align:center;font-size:12px;font-weight:600;color:rgb(255,255,255);text-decoration-line:none"><span></span><span
                                                        style="p-x:20px;p-y:12px;max-width:100%;display:inline-block;line-height:120%;text-decoration:none;text-transform:none;mso-padding-alt:0px;mso-text-raise:9px">
                                                        Reset Password</span>
                                                </a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <p style="font-size:14px;line-height:24px;margin:16px 0;color:rgb(0,0,0)">
                                    This link will expire in <strong>10 minutes</strong>,
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
            from: `CCMS <${process.env.MAIL_ACCOUNT}>`,
            to: recipient,
            subject: 'CCMS Verification Email',
            html: emailHtml,
        }

        await transporter.sendMail(options)
        return NextResponse.json("EMAIL_SENT", {status: 200})
    } catch (error) {
        console.log(error)
        return new NextResponse("INTERNAL_ERROR", { status: 500 })
    }
}