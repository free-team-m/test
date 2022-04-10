document.addEventListener('DOMContentLoaded', (event) => {
    connect((socket) => {
        function sendMousePosToServer(pos) {
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({type: 'mousePos', value: pos}).toString());
            }
        }

        document.addEventListener('mousemove', (e) => {
            sendMousePosToServer({x: e.clientX, y: e.clientY})
        });
    });
});