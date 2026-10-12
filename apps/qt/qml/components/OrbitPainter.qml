import QtQuick

Item {
    id: root
    width: 80
    height: 80

    // Animate a rotation property from 0 to 360 over 3000ms infinitely
    property real angle: 0
    NumberAnimation on angle {
        from: 0
        to: 360
        duration: 3000
        loops: Animation.Infinite
        running: true
    }

    // Qt Quick doesn't have a direct Canvas context accessible outside onPaint,
    // but we can use Canvas to paint
    Canvas {
        id: canvas
        anchors.fill: parent

        Connections {
            target: root
            function onAngleChanged() {
                canvas.requestPaint();
            }
        }

        onPaint: {
            var ctx = getContext("2d");
            ctx.clearRect(0, 0, width, height);

            var centerX = width / 2;
            var centerY = height / 2;
            var ringR = 40 - 6; // 40 max radius minus dot radius

            ctx.save();
            ctx.translate(centerX, centerY);

            // Draw ring (optional, spec says "orbit custom-painted: 3 dots circling a ring (ring r=40, dot r=6)")
            ctx.beginPath();
            ctx.arc(0, 0, ringR, 0, 2 * Math.PI);
            ctx.strokeStyle = "rgba(255,255,255,0.3)";
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.rotate(root.angle * Math.PI / 180);

            // Draw 3 dots
            ctx.fillStyle = "white";
            for (var i = 0; i < 3; i++) {
                ctx.beginPath();
                var dotAngle = (i * 120) * Math.PI / 180;
                var dx = ringR * Math.cos(dotAngle);
                var dy = ringR * Math.sin(dotAngle);
                ctx.arc(dx, dy, 6, 0, 2 * Math.PI);
                ctx.fill();
            }

            ctx.restore();
        }
    }
}
