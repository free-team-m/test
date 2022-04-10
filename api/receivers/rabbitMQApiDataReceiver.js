const amqp = require('amqplib');
const ApiDataReceiver = require("./apiDataReceiver");

class RabbitMQApiDataReceiver extends ApiDataReceiver {
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

    receive(channelId, callback) {
        super.receive(channelId, callback);

        function WaitConnect(_this) {
            if (_this.channel) {
                _this.channel.assertQueue(channelId, {
                    durable: false
                });
                _this.channel.consume(channelId, (message) => {
                    callback(message.content.toString());
                }, {noAck: true});
            } else {
                setTimeout(WaitConnect, 1000, _this);
            }
        }
        WaitConnect(this);
    }

    close() {
        super.close();
        if (this.channel && this.channel.connection) {
            this.channel.connection.close();
        }
    }
}

module.exports = RabbitMQApiDataReceiver;