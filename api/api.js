class Api {
    /**
     * @param {ApiDataSender} sender
     * @param {ApiDataReceiver} receiver
     */
    constructor(sender, receiver) {
        this.sender = sender;
        this.receiver = receiver;
    }
    start() {
        this.sender.start();
        this.receiver.start();
    }
}

module.exports = Api;