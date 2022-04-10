document.addEventListener('DOMContentLoaded', (event) => {
    const outputs = document.getElementsByClassName('output');
    const cursor = document.getElementById('cursorImage');
    let ctx = null;
    let canvas = null;
    if (outputs.length > 0) {
        canvas = document.getElementsByClassName('output').item(0);
        updateCanvasSize();
        ctx = canvas.getContext('2d');
    }

    function updateCanvasSize() {
        canvas.width = document.body.clientWidth;
        canvas.height = document.body.clientHeight;
    }

    if (canvas !== null && ctx !== null && cursor !== null) {
        let backCursorPos = {x: 0, y: 0}

        connect(undefined, (message) => {
            switch (message.type) {
                case 'mousePos': {
                    const pos = message.value;
                    ctx.clearRect(backCursorPos.x, backCursorPos.y, cursor.width, cursor.height);
                    ctx.drawImage(cursor, pos.x, pos.y);
                    backCursorPos = pos;
                    break;
                }
            }
        });

        window.addEventListener('resize', () => {
            updateCanvasSize();
        });
    }
});