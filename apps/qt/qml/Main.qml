import PulseAppExe
import QtQuick
import QtQuick.Controls
import QtQuick.Window

Window {
    width: 390
    height: 844
    visible: true
    title: qsTr("Pulse")
    color: Theme.background

    Behavior on color { ColorAnimation { duration: Theme.slowDuration; easing.type: Theme.slowEasingType } }

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
    }
}
