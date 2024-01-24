import ampq from "amqplib/callback_api.js"

const publishWork = () => {
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
                const message = "This is the newer new message"

                channel.assertExchange("logs", "direct", { durable: true })

                channel.publish("logs", "testRoute", Buffer.from(message))
                console.log(" Sent : ", message)
            })
            setTimeout(() => {
                connection.close()
                process.exit(0)
            }, 500)
        }
    )
}
const recieveBroadcast = () => {
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
                const exchange = "logs"
                channel.assertExchange(exchange, "direct", { durable: true })

                channel.assertQueue("", { exclusive: true }, (err, reply) => {
                    if (err) throw err
                    console.log(reply.queue)

                    // You can bind the same reciever to various exchnges and even the same exchange with different routes
                    channel.bindQueue(reply.queue, "logs", "testRoute")
                    channel.bindQueue(reply.queue, "logs", "testRoute2")
                    channel.consume(
                        reply.queue,
                        (message) => {
                            if (message) {
                                console.log(
                                    " Recieved",
                                    message.content.toString()
                                ),
                                    channel.ack(message)
                            }
                        },
                        { noAck: false }
                    )
                })
            })
        }
    )
}

export { publishWork, recieveBroadcast }
