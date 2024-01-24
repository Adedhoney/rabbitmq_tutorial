import ampq from "amqplib/callback_api.js"

const testSend = () => {
    ampq.connect(
        "amqps://tmntwmyh:Us8-2AL1iruhag_L5oNVo_d71Tqw9oeR@chimpanzee.rmq.cloudamqp.com/tmntwmyh",
        (err, connection) => {
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
        }
    )
}
const testRecieve = () => {
    ampq.connect(
        "amqps://tmntwmyh:Us8-2AL1iruhag_L5oNVo_d71Tqw9oeR@chimpanzee.rmq.cloudamqp.com/tmntwmyh",
        (err, connection) => {
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
                            console.log(
                                "Recieved : ",
                                message.content.toString()
                            )
                            channel.ack(message)
                        }
                    },
                    { noAck: false }
                )
            })
        }
    )
}

export { testSend, testRecieve }
