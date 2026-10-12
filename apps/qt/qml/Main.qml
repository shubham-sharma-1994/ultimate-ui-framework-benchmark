import PulseAppExe
import QtQuick
import QtQuick.Controls
import QtQuick.Window

Window {
    id: mainWindow
    width: 390
    height: 844
    visible: true
    title: qsTr("Pulse")
    color: Theme.background

    Behavior on color { ColorAnimation { duration: Theme.slowDuration; easing.type: Theme.slowEasingType } }

    property bool isPoppingFromBrowser: false

    Connections {
        target: typeof historyManager !== "undefined" ? historyManager : null
        function onPopRequested() {
            if (stackView.depth > 1) {
                isPoppingFromBrowser = true
                stackView.pop()
                isPoppingFromBrowser = false
            }
        }
    }

    // Web/Windows wrapper bounds
    Item {
        id: rootContainer
        anchors.centerIn: parent
        width: Math.min(parent.width, 480)
        height: parent.height

        StackView {
            id: stackView
            anchors.fill: parent
            initialItem: "Page1.qml"

            pushEnter: Transition {
                ParallelAnimation {
                    NumberAnimation { property: "x"; from: rootContainer.width * 0.3; to: 0; duration: Theme.baseDuration; easing.type: Theme.baseEasingType }
                    NumberAnimation { property: "opacity"; from: 0; to: 1; duration: Theme.baseDuration; easing.type: Theme.baseEasingType }
                }
            }
            pushExit: Transition {
                ParallelAnimation {
                    NumberAnimation { property: "x"; from: 0; to: -rootContainer.width * 0.1; duration: Theme.baseDuration; easing.type: Theme.baseEasingType }
                    NumberAnimation { property: "opacity"; from: 1; to: 0.6; duration: Theme.baseDuration; easing.type: Theme.baseEasingType }
                }
            }
            popEnter: Transition {
                ParallelAnimation {
                    NumberAnimation { property: "x"; from: -rootContainer.width * 0.1; to: 0; duration: Theme.baseDuration; easing.type: Theme.baseEasingType }
                    NumberAnimation { property: "opacity"; from: 0.6; to: 1; duration: Theme.baseDuration; easing.type: Theme.baseEasingType }
                }
            }
            popExit: Transition {
                ParallelAnimation {
                    NumberAnimation { property: "x"; from: 0; to: rootContainer.width * 0.3; duration: Theme.baseDuration; easing.type: Theme.baseEasingType }
                    NumberAnimation { property: "opacity"; from: 1; to: 0; duration: Theme.baseDuration; easing.type: Theme.baseEasingType }
                }
            }
        }

        // Global overlay for Hero Animation (C04)
        Rectangle {
            id: heroClone
            visible: false
            radius: 16

            property color color1: "transparent"
            property color color2: "transparent"

            gradient: Gradient {
                GradientStop { position: 0.0; color: heroClone.color1 }
                GradientStop { position: 1.0; color: heroClone.color2 }
            }

            Behavior on x { NumberAnimation { duration: Theme.baseDuration; easing.type: Theme.baseEasingType } }
            Behavior on y { NumberAnimation { duration: Theme.baseDuration; easing.type: Theme.baseEasingType } }
            Behavior on width { NumberAnimation { duration: Theme.baseDuration; easing.type: Theme.baseEasingType } }
            Behavior on height { NumberAnimation { duration: Theme.baseDuration; easing.type: Theme.baseEasingType } }
            Behavior on radius { NumberAnimation { duration: Theme.baseDuration; easing.type: Theme.baseEasingType } }
        }
    }

    function startHeroAnimation(startX, startY, startW, startH, color1, color2) {
        heroClone.x = startX
        heroClone.y = startY
        heroClone.width = startW
        heroClone.height = startH
        heroClone.radius = 16
        heroClone.color1 = color1
        heroClone.color2 = color2
        heroClone.visible = true

        // Animate to target
        heroClone.x = 0
        heroClone.y = 0
        heroClone.width = rootContainer.width
        heroClone.height = 240
        heroClone.radius = 0

        // Hide clone after animation
        heroTimer.start()
    }

    Timer {
        id: heroTimer
        interval: Theme.baseDuration
        onTriggered: {
            heroClone.visible = false
        }
    }
}
