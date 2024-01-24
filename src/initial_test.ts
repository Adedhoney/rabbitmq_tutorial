import ampq from "amqplib/callback_api.js"

import dotenv from "dotenv"
dotenv.config()

const ampqURL = process.env.AMPQ_URL

const testSend = () => {
    if (!ampqURL) return
    ampq.connect(ampqURL, (err, connection) => {
        if (err) {
            throw err
        }
        connection.createChannel((err1, channel) => {
            if (err1) {
                throw err1
            }
            const queue = "test2 queue"
            const message =
                "This is the correspoinding test message to the test queue"
            channel.assertQueue(queue, { durable: true })
            channel.sendToQueue(queue, Buffer.from("message 1"), {
                persistent: true,
            })
            channel.sendToQueue(queue, Buffer.from("message 2"))
            channel.sendToQueue(queue, Buffer.from("message 3"))
            channel.sendToQueue(queue, Buffer.from("message 4"))
            channel.sendToQueue(queue, Buffer.from("message 5"))
            console.log(" [x] Sent %s", message)
        })
        setTimeout(() => {
            connection.close()
            process.exit(0)
        }, 500)
    })
}
const testRecieve = () => {
    if (!ampqURL) return
    ampq.connect(ampqURL, (err, connection) => {
        if (err) {
            throw err
        }
        connection.createChannel((err1, channel) => {
            if (err1) {
                throw err1
            }
            const queue = "test2 queue"
            channel.assertQueue(queue, { durable: true })

            channel.prefetch(1)
            channel.consume(
                queue,
                (message) => {
                    if (message) {
                        console.log("Recieved : ", message.content.toString())
                        channel.ack(message)
                    }
                },
                { noAck: false }
            )
        })
    })
}

export { testSend, testRecieve }
