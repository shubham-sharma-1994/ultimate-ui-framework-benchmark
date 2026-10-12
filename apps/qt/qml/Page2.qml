import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import PulseAppExe
import "components"

Page {
    id: page2
    background: Rectangle { color: Theme.background }

    property var itemData: null

    // For simplicity, we are approximating the hero transition by letting the header
    // expand/slide in on enter. StackView takes care of the whole page slide,
    // so parallax header comes inside it.

    ScrollView {
        id: scrollView
        anchors.fill: parent
        contentWidth: availableWidth
        clip: true

        ColumnLayout {
            width: parent.width
            spacing: 0

            // Header block for parallax effect
            Item {
                Layout.fillWidth: true
                height: 240

                // Parallax background (moves at 0.5x speed)
                // We clip it or just shift y based on ScrollView's contentY
                Rectangle {
                    width: parent.width
                    height: 240
                    y: scrollView.contentY > 0 ? scrollView.contentY * 0.5 : 0

                    gradient: Gradient {
                        GradientStop { position: 0.0; color: itemData ? itemData.colors[0] : Theme.primary }
                        GradientStop { position: 1.0; color: itemData ? itemData.colors[1] : Theme.accent }
                    }
                }

                // Back button
                ToolButton {
                    objectName: "back"
                    text: "<"
                    font.pixelSize: 20
                    anchors.top: parent.top
                    anchors.left: parent.left
                    anchors.margins: 8
                    contentItem: Text {
                        text: parent.text
                        color: "white"
                        font.pixelSize: 24
                    }
                    background: Item {}
                    onClicked: stackView.pop()
                }

                // Title Parallax (moves up and scales down)
                Label {
                    text: itemData ? itemData.title : ""
                    color: "white"
                    font: Theme.displayFont // 32

                    // Simple parallax transformation for title
                    property real scrollFactor: Math.min(1.0, Math.max(0, scrollView.contentY / (240 - 56)))

                    // font size 32 -> 20
                    font.pixelSize: 32 - (12 * scrollFactor)

                    // x, y calculation
                    x: 16 + (40 * scrollFactor) // moves right to make room for back button
                    y: (240 - 48) - ((240 - 56 - 16) * scrollFactor)
                }
            }

            // Content
            ColumnLayout {
                Layout.fillWidth: true
                Layout.margins: 16
                spacing: 24

                // Shimmer / Body Text
                Item {
                    Layout.fillWidth: true
                    height: shimmerText.implicitHeight

                    property bool loaded: false
                    Timer {
                        interval: 1500
                        running: true
                        onTriggered: parent.loaded = true
                    }

                    // Shimmer skeleton
                    Item {
                        id: shimmerBlock
                        objectName: "shimmer"
                        anchors.fill: parent
                        opacity: parent.loaded ? 0 : 1
                        Behavior on opacity { NumberAnimation { duration: Theme.baseDuration } }
                        visible: opacity > 0

                        Column {
                            spacing: 8
                            width: parent.width
                            Rectangle { width: parent.width; height: 16; color: Theme.outline; radius: 4 }
                            Rectangle { width: parent.width * 0.8; height: 16; color: Theme.outline; radius: 4 }
                            Rectangle { width: parent.width * 0.6; height: 16; color: Theme.outline; radius: 4 }
                        }

                        // Sweep animation approximation
                        Rectangle {
                            width: parent.width * 0.5
                            height: parent.height
                            color: "white"
                            opacity: 0.3
                            x: -width

                            NumberAnimation on x {
                                from: -shimmerBlock.width
                                to: shimmerBlock.width
                                duration: 1200
                                loops: Animation.Infinite
                                running: !shimmerBlock.parent.loaded
                            }
                        }
                    }

                    Label {
                        id: shimmerText
                        anchors.fill: parent
                        text: itemData ? itemData.body : ""
                        font: Theme.bodyFont
                        color: Theme.text
                        wrapMode: Text.WordWrap
                        opacity: parent.loaded ? 1 : 0
                        Behavior on opacity { NumberAnimation { duration: Theme.baseDuration } }
                    }
                }

                // Progress Ring
                Item {
                    Layout.fillWidth: true
                    height: 120
                    ProgressRing {
                        objectName: "ring"
                        anchors.centerIn: parent
                        score: itemData ? itemData.score : 0
                        colorStart: itemData ? itemData.colors[0] : Theme.primary
                        colorEnd: itemData ? itemData.colors[1] : Theme.accent
                    }
                }

                // Accordion
                Rectangle {
                    id: accordionCard
                    objectName: "accordion"
                    Layout.fillWidth: true
                    color: Theme.surface
                    radius: 20
                    clip: true

                    property bool expanded: false

                    implicitHeight: 56 + (expanded ? accordionContent.implicitHeight + 16 : 0)
                    Behavior on implicitHeight { NumberAnimation { duration: Theme.baseDuration; easing.type: Theme.baseEasingType } }

                    MouseArea {
                        anchors.fill: parent
                        onClicked: parent.expanded = !parent.expanded
                    }

                    Item {
                        width: parent.width
                        height: 56

                        Label {
                            anchors.left: parent.left
                            anchors.verticalCenter: parent.verticalCenter
                            anchors.margins: 16
                            text: "Details"
                            font: Theme.titleFont
                            color: Theme.text
                        }

                        Label {
                            anchors.right: parent.right
                            anchors.verticalCenter: parent.verticalCenter
                            anchors.margins: 16
                            text: "^"
                            font: Theme.titleFont
                            color: Theme.textMuted
                            rotation: accordionCard.expanded ? 180 : 0
                            Behavior on rotation { NumberAnimation { duration: Theme.baseDuration; easing.type: Theme.baseEasingType } }
                        }
                    }

                    Label {
                        id: accordionContent
                        y: 56
                        width: parent.width - 32
                        x: 16
                        text: "Extra details content goes here. It animates and fades in."
                        font: Theme.bodyFont
                        color: Theme.text
                        wrapMode: Text.WordWrap

                        // Fades in last 50%
                        opacity: accordionCard.implicitHeight > (56 + (accordionContent.implicitHeight + 16) * 0.5) ? 1 : 0
                        Behavior on opacity { NumberAnimation { duration: Theme.baseDuration / 2 } }
                    }
                }

                // Draggable Card
                Rectangle {
                    Layout.fillWidth: true
                    height: 240
                    color: Theme.surfaceAlt
                    radius: 20
                    clip: true

                    Rectangle {
                        id: dragCard
                        objectName: "drag-card"
                        width: 96
                        height: 96
                        radius: 20
                        color: Theme.primary

                        // Initial center
                        x: (parent.width - width) / 2
                        y: (parent.height - height) / 2

                        Drag.active: dragArea.drag.active

                        // Spring back animation (using SpringAnimation for x and y)
                        Behavior on x {
                            SpringAnimation { spring: 300; damping: 20; mass: 1; enabled: !dragArea.drag.active }
                        }
                        Behavior on y {
                            SpringAnimation { spring: 300; damping: 20; mass: 1; enabled: !dragArea.drag.active }
                        }

                        MouseArea {
                            id: dragArea
                            anchors.fill: parent
                            drag.target: parent
                            drag.minimumX: 0
                            drag.maximumX: dragCard.parent.width - dragCard.width
                            drag.minimumY: 0
                            drag.maximumY: dragCard.parent.height - dragCard.height

                            onReleased: {
                                // Snap back to center
                                dragCard.x = (dragCard.parent.width - dragCard.width) / 2
                                dragCard.y = (dragCard.parent.height - dragCard.height) / 2
                            }
                        }

                        Label {
                            anchors.centerIn: parent
                            text: "Drag me"
                            color: Theme.onPrimary
                            font: Theme.labelFont
                        }
                    }
                }

                // Swipe-to-dismiss list
                ColumnLayout {
                    Layout.fillWidth: true
                    spacing: 8

                    property int dismissedCount: 0

                    Repeater {
                        model: 3

                        Item {
                            id: swipeItem
                            objectName: "swipe-" + (index + 1)
                            Layout.fillWidth: true
                            height: 72

                            property bool dismissed: false
                            visible: !dismissed || (implicitHeight > 0)

                            implicitHeight: dismissed ? 0 : 72
                            Behavior on implicitHeight { NumberAnimation { duration: Theme.baseDuration; easing.type: Theme.baseEasingType } }

                            Rectangle {
                                anchors.fill: parent
                                radius: 16
                                color: "#E5484D" // Red-ish delete background
                                Label {
                                    anchors.right: parent.right
                                    anchors.verticalCenter: parent.verticalCenter
                                    anchors.margins: 16
                                    text: "Delete"
                                    color: "white"
                                    font: Theme.labelFont
                                }
                            }

                            Rectangle {
                                id: swipeContent
                                width: parent.width
                                height: parent.height
                                radius: 16
                                color: Theme.surface

                                x: dragSwipe.drag.active ? dragSwipe.mouseX - startDragX : 0
                                property real startDragX: 0

                                Behavior on x {
                                    NumberAnimation { duration: Theme.baseDuration; easing.type: Theme.baseEasingType; enabled: !dragSwipe.drag.active }
                                }

                                Label {
                                    anchors.left: parent.left
                                    anchors.verticalCenter: parent.verticalCenter
                                    anchors.margins: 16
                                    text: "Swipe item " + (index + 1)
                                    color: Theme.text
                                    font: Theme.bodyFont
                                }

                                MouseArea {
                                    id: dragSwipe
                                    anchors.fill: parent
                                    drag.target: parent
                                    drag.axis: Drag.XAxis
                                    drag.minimumX: -parent.width
                                    drag.maximumX: 0

                                    onPressed: swipeContent.startDragX = mouseX

                                    onReleased: {
                                        if (swipeContent.x < -parent.width * 0.4) {
                                            // dismiss
                                            swipeContent.x = -parent.width
                                            swipeItem.dismissed = true
                                            swipeItem.parent.dismissedCount++
                                        } else {
                                            // spring back
                                            swipeContent.x = 0
                                        }
                                    }
                                }
                            }

                            // Restore binding logic for reset
                            Connections {
                                target: swipeItem.parent
                                function onDismissedCountChanged() {
                                    if (swipeItem.parent.dismissedCount === -1) {
                                        swipeItem.dismissed = false
                                        swipeContent.x = 0
                                    }
                                }
                            }
                        }
                    }

                    Button {
                        objectName: "swipe-reset"
                        Layout.alignment: Qt.AlignHCenter
                        text: "Reset"
                        visible: parent.dismissedCount > 0
                        onClicked: {
                            parent.dismissedCount = -1 // trigger restore
                            parent.dismissedCount = 0
                        }
                    }
                }

                // Buttons Row
                RowLayout {
                    Layout.fillWidth: true
                    spacing: 16

                    Button {
                        objectName: "btn-dialog"
                        text: "Show dialog"
                        Layout.fillWidth: true
                        onClicked: dialogPopup.open()
                    }
                    Button {
                        objectName: "btn-sheet"
                        text: "Show sheet"
                        Layout.fillWidth: true
                        onClicked: sheetPopup.open()
                    }
                    Button {
                        objectName: "btn-toast"
                        text: "Toast"
                        Layout.fillWidth: true
                        onClicked: toastPopup.show()
                    }
                }

                Item { Layout.fillWidth: true; height: 32 }
            }
        }
    }

    // Popups

    // Modal Dialog
    Popup {
        id: dialogPopup
        anchors.centerIn: parent
        width: 300
        height: 200
        modal: true
        focus: true
        closePolicy: Popup.CloseOnEscape | Popup.CloseOnPressOutside

        background: Rectangle {
            color: Theme.surface
            radius: 20
        }

        Overlay.modal: Rectangle {
            color: "black"
            opacity: 0.4
        }

        enter: Transition {
            ParallelAnimation {
                NumberAnimation { property: "scale"; from: 0.9; to: 1.0; duration: Theme.baseDuration }
                NumberAnimation { property: "opacity"; from: 0.0; to: 1.0; duration: Theme.baseDuration }
            }
        }
        exit: Transition {
            ParallelAnimation {
                NumberAnimation { property: "scale"; from: 1.0; to: 0.9; duration: Theme.baseDuration }
                NumberAnimation { property: "opacity"; from: 1.0; to: 0.0; duration: Theme.baseDuration }
            }
        }

        Label {
            anchors.centerIn: parent
            text: "Dialog Content"
            color: Theme.text
            font: Theme.titleFont
        }
    }

    // Bottom Sheet
    Popup {
        id: sheetPopup
        width: parent.width
        height: 300
        y: parent.height - height
        modal: true
        focus: true
        closePolicy: Popup.CloseOnEscape | Popup.CloseOnPressOutside

        background: Rectangle {
            color: Theme.surface
            radius: 28
            // Flatten bottom corners
            Rectangle {
                width: parent.width
                height: 28
                anchors.bottom: parent.bottom
                color: Theme.surface
            }
        }

        Overlay.modal: Rectangle {
            color: "black"
            opacity: 0.4
        }

        enter: Transition {
            NumberAnimation { property: "y"; from: page2.height; to: page2.height - 300; duration: Theme.baseDuration; easing.type: Theme.baseEasingType }
        }
        exit: Transition {
            NumberAnimation { property: "y"; from: page2.height - 300; to: page2.height; duration: Theme.baseDuration; easing.type: Theme.baseEasingType }
        }

        ColumnLayout {
            anchors.fill: parent
            anchors.margins: 16

            Rectangle {
                width: 40
                height: 4
                radius: 2
                color: Theme.outline
                Layout.alignment: Qt.AlignHCenter

                // Very basic drag-to-dismiss handle
                MouseArea {
                    anchors.fill: parent
                    anchors.margins: -20
                    property real startY: 0
                    onPressed: startY = mouseY
                    onReleased: {
                        if (mouseY - startY > 50) {
                            sheetPopup.close()
                        }
                    }
                }
            }

            Item { Layout.fillHeight: true }
        }
    }

    // Toast / Snackbar
    Popup {
        id: toastPopup
        width: 300
        height: 48
        x: (parent.width - width) / 2
        y: parent.height - height - 32

        background: Rectangle {
            color: Theme.surfaceAlt
            radius: 14
        }

        enter: Transition {
            NumberAnimation { property: "y"; from: page2.height; to: page2.height - 48 - 32; duration: Theme.baseDuration; easing.type: Theme.baseEasingType }
        }
        exit: Transition {
            NumberAnimation { property: "y"; from: page2.height - 48 - 32; to: page2.height; duration: Theme.baseDuration; easing.type: Theme.baseEasingType }
        }

        Label {
            anchors.centerIn: parent
            text: "This is a toast message"
            color: Theme.text
            font: Theme.bodyFont
        }

        Timer {
            id: toastTimer
            interval: 2000
            onTriggered: toastPopup.close()
        }

        function show() {
            open()
            toastTimer.restart()
        }
    }
}
