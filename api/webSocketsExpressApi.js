const Api = require('./api');
const cookie = require('cookie')
const crypto = require('crypto')
const ws = require('ws')

class WebSocketsExpressApi extends Api {
    /**
     * @param server
     * @param {ApiDataSender} sender
     * @param {ApiDataReceiver} receiver
     */
    constructor(server, sender, receiver) {
        super(sender, receiver);
        this.ws = new ws.Server({server});
        this.channelSockets = {};
    }

    start() {
        this.ws.on('connection', (ws, request) => {
            if (!request.headers.cookie) request.headers.cookie = '';
            const cookies = cookie.parse(request.headers.cookie);
            if (!cookies.channelId) {
                cookies.channelId = crypto.createHash('md5').update(Date.now().toString() + Math.random().toString()).digest('hex');
                ws.send(JSON.stringify({type: 'setChannelId', 'value': cookies.channelId}));
            }

            this.addWsToChannel(ws, cookies.channelId);

            this.receiver.receive(cookies.channelId, (message) => {
                this.sendToChannel(ws, cookies.channelId, message);
            })

            ws.on('message', (data) => {
                const message = JSON.parse(data);
                switch (message.type) {
                    case 'mousePos':
                        this.sender.send(cookies.channelId, data);
                        break;
                }
            });

            ws.on('close', () => {
                this.removeWsFromChannel(ws, cookies.channelId);
            });
            ws.on('error', () => {
                ws.close();
                this.removeWsFromChannel(ws, cookies.channelId);
            });
        });

        super.start();
    }

    sendToChannel(ws, channelId, data) {
        if (this.channelSockets[channelId] !== undefined) {
            this.channelSockets[channelId].forEach((value) => {
                if (value !== ws) {
                    value.send(data.toString());
                }
            });
        }
    }

    removeWsFromChannel(ws, channelId) {
        if (this.channelSockets[channelId] !== undefined) {
            const pos = this.channelSockets[channelId].indexOf(ws);
            if (pos > 0) {
                this.channelSockets[channelId].splice(pos, 1);
            }
        }
    }

    addWsToChannel(ws, channelId) {
        if (this.channelSockets[channelId] === undefined) {
            this.channelSockets[channelId] = [ws];
        } else {
            this.channelSockets[channelId].push(ws);
        }
    }
}

module.exports = WebSocketsExpressApi;