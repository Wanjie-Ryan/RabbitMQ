const amqp = require('amqplib')
const config = require('./config')

class Producer{

    channel;

    async createChannel (){

        // this here acts as our connection
        const connection = await amqp.connect(config.rabbitMQ.url)

        // creating the channel over the connection we just created.
        this.channel = await connection.createChannel()

    }

    async publishMessage(routingKey, message){

        if(!this.channel){
            await this.createChannel()
        }

        // create the exchange
        const exchangeName = config.rabbitMQ.exchange
        await this.channel.assertExchange(exchangeName, 'direct')

        // publishing the message which takes in the exchange name and routing key as arguments, and the actual message as the Buffer....

        const logDetails = {
            logType:routingKey,
            message:message,
            dateTime: new Date()
        }

        await this.channel.publish(exchangeName, routingKey,
            Buffer.from(JSON.stringify(logDetails))
        )

        console.log(`The message ${message} is sent to exchange ${exchangeName}`)

    }

}

module.exports = Producer;