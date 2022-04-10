const amqp = require('amqplib');
const ApiDataSender = require("./apiDataSender");

class RabbitMQApiDataSender extends ApiDataSender {
    constructor() {
        super();
    }

    async start() {
        super.start();
        this.channel = await amqp.connect(process.env.AMQP_URL || 'amqp://user:password@localhost:5673').then(function (connection) {
            return connection.createChannel().then(function (channel) {
                return channel;
            }).catch((error) => {
                console.error(error);
                process.exit(1);
            });
        }).catch((error) => {
            console.error(error);
            process.exit(1);
        });
    }

    send(channelId, message) {
        super.send(channelId, message);
        if (this.channel) {
            this.channel.assertQueue(channelId, {
                durable: false
            });
            this.channel.sendToQueue(channelId, Buffer.from(message));
        }
    }

    close() {
        super.close();
        if (this.channel && this.channel.connection) {
            this.channel.connection.close();
        }
    }
}

module.exports = RabbitMQApiDataSender;