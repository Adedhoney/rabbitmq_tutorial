import nodeMailer from "nodemailer"

import dotenv from "dotenv"
dotenv.config()
const { AUTH_EMAIL, AUTH_EMAIL_PASSWORD } = process.env

const transporter = nodeMailer.createTransport({
    // host: "mail.privateemail.com",
    host: "smtp-mail.outlook.com",
    auth: {
        user: AUTH_EMAIL,
        pass: AUTH_EMAIL_PASSWORD,
    },
})
transporter.verify((error, success) => {
    if (error) {
        console.log(error)
    } else {
        console.log("Ready for messages")
        console.log(success)
    }
})

const sendEmail = async (mailOptions: {
    from: string
    to: string
    subject: string
    text: string
    html: string
}) => {
    try {
        await transporter.sendMail(mailOptions)
        return
    } catch (error) {
        console.log(error)
    }
}

export { sendEmail }
