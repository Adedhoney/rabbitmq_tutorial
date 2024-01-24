import ampq from "amqplib/callback_api.js"
import { sendEmail } from "./send_mail.js"
import dotenv from "dotenv"
dotenv.config()
const ampqURL = process.env.AMPQ_URL

type emailType = "welcomeEmail" | "subcriptionEmail" | "deletionEmail"
// Test using email

const publisher = (email: string, emailType: emailType) => {
    if (!ampqURL) return
    ampq.connect(ampqURL, (err, connection) => {
        if (err) throw err
        connection.createChannel((err, channel) => {
            channel.assertExchange("emails", "direct", { durable: true })
            channel.publish(
                "emails",
                emailType, // This will chna
                Buffer.from(email)
            )
            console.log("this is it")
        })

        setTimeout(() => {
            connection.close()
            process.exit(0)
        }, 500)
    })
}

const reciever = async () => {
    const { AUTH_EMAIL } = process.env
    if (!ampqURL) return
    ampq.connect(ampqURL, (err, connection) => {
        if (err) {
            throw err
        }
        connection.createChannel((err1, channel) => {
            if (err1) throw err1
            const exchange = "emails"
            channel.assertExchange(exchange, "direct", { durable: true })
            channel.assertQueue("testEmail", { durable: true })
            channel.bindQueue("testEmail", exchange, "welcomeEmail")
            channel.consume(
                "testEmail",
                (message) => {
                    if (message) {
                        sendEmail({
                            from: AUTH_EMAIL as string,
                            to: message.content.toString(),
                            subject: "Welcome",
                            text: "I am trying to test this rabbitmq",
                            html: "<p>I am trying to test this rabbitmq<p/>",
                        })
                        console.log("I just sent the email ")
                        channel.ack(message)
                    }
                },
                { noAck: false }
            )
        })
    })
}

export { publisher, reciever }
