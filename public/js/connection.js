function connect(openCallback, messageCallback) {
    const socket = new WebSocket('ws://localhost:8080');
    let reconnectTimer;

    socket.addEventListener('message', (e) => {
        const message = JSON.parse(e.data);
        if (message.type === 'setChannelId') {
            Cookies.set('channelId', message.value);
        }
        if (messageCallback !== undefined) {
            messageCallback(message);
        }
    });

    function reconnect() {
        if (socket.readyState === WebSocket.CLOSED) {
            connect(openCallback, messageCallback);
        }
    }

    socket.addEventListener('close', () => {
        reconnectTimer = setTimeout(reconnect, 2000);
    });

    socket.addEventListener('error', () => {
        socket.close();
    });

    socket.addEventListener('open', () => {
        clearTimeout(reconnectTimer);
        if (openCallback !== undefined) {
            openCallback(socket);
        }
    });
}