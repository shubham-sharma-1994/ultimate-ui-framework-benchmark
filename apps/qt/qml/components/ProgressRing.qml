import QtQuick

Item {
    id: root
    width: 120
    height: 120

    property int score: 0
    property real currentScore: 0
    property color colorStart: "white"
    property color colorEnd: "white"

    Behavior on currentScore {
        NumberAnimation { duration: Theme.slowDuration; easing.type: Theme.slowEasingType }
    }

    Component.onCompleted: {
        // Start animation after a short delay or immediately
        currentScore = score
    }

    // A tap replays the animation
    MouseArea {
        anchors.fill: parent
        onClicked: {
            currentScore = 0
            replayTimer.start()
        }
    }

    Timer {
        id: replayTimer
        interval: 50
        onTriggered: currentScore = score
    }

    Canvas {
        id: canvas
        anchors.fill: parent

        Connections {
            target: root
            function onCurrentScoreChanged() {
                canvas.requestPaint();
            }
        }

        onPaint: {
            var ctx = getContext("2d");
            ctx.clearRect(0, 0, width, height);

            var centerX = width / 2;
            var centerY = height / 2;
            var radius = (width / 2) - 6; // stroke 12, so center of stroke is at r-6

            ctx.lineCap = "round";
            ctx.lineWidth = 12;

            // Background ring (optional, light version)
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            ctx.strokeStyle = Theme.outline; // using outline for track
            ctx.stroke();

            // Progress ring
            var startAngle = -0.5 * Math.PI;
            var progress = root.currentScore / 100.0;
            var endAngle = startAngle + (progress * 2 * Math.PI);

            if (progress > 0) {
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, startAngle, endAngle);

                // Canvas gradient for the ring
                var gradient = ctx.createLinearGradient(0, 0, width, height);
                gradient.addColorStop(0, root.colorStart);
                gradient.addColorStop(1, root.colorEnd);

                ctx.strokeStyle = gradient;
                ctx.stroke();
            }
        }
    }

    Text {
        anchors.centerIn: parent
        text: Math.round(root.currentScore) + "%"
        font: Theme.displayFont
        color: Theme.text
    }
}
