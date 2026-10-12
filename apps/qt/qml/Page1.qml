import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import PulseAppExe
import "components"

Page {
    id: page1
    background: Rectangle { color: Theme.background }

    // Load Data
    property var listData: []
    Component.onCompleted: {
        var request = new XMLHttpRequest()
        request.open('GET', 'qrc:/PulseAppExe/assets/data.json')
        request.onreadystatechange = function() {
            if (request.readyState === XMLHttpRequest.DONE) {
                var response = JSON.parse(request.responseText)
                listData = response.items
            }
        }
        request.send()
    }

    // Header
    header: ToolBar {
        id: appBar
        height: 56
        background: Rectangle {
            color: Theme.surface
            Rectangle {
                anchors.bottom: parent.bottom
                anchors.left: parent.left
                anchors.right: parent.right
                height: 2
                color: "black"
                opacity: (scrollView.contentY > 0 ? 0.08 : 0.0)
                Behavior on opacity { NumberAnimation { duration: Theme.fastDuration; easing.type: Theme.fastEasingType } }
            }
        }

        RowLayout {
            anchors.fill: parent
            anchors.margins: 16

            Label {
                text: "Pulse"
                font: Theme.titleFont
                color: Theme.text
                Layout.fillWidth: true
            }

            ToolButton {
                id: themeToggle
                objectName: "theme-toggle"
                text: Theme.isDark ? "☀" : "🌙"
                font.pixelSize: 20
                onClicked: {
                    Theme.toggleTheme();
                    rotationAnim.start()
                }
                contentItem: Text {
                    text: parent.text
                    font: parent.font
                    color: Theme.text
                    horizontalAlignment: Text.AlignHCenter
                    verticalAlignment: Text.AlignVCenter
                }
                background: Item {} // remove default background

                RotationAnimation {
                    id: rotationAnim
                    target: themeToggle
                    from: 0; to: 180
                    duration: Theme.slowDuration
                    easing.type: Theme.slowEasingType
                }
            }
        }
    }

    ScrollView {
        id: scrollView
        anchors.fill: parent
        anchors.margins: 16
        contentWidth: availableWidth
        clip: true

        ColumnLayout {
            width: parent.width
            spacing: 16

            // Hero Card
            Rectangle {
                id: heroCard
                Layout.fillWidth: true
                height: 180
                radius: 20

                // QML doesn't have an easy angled linear gradient natively without GraphicalEffects,
                // but Qt 6 allows gradient property.
                gradient: Gradient {
                    orientation: Gradient.Horizontal // approximate 135 deg
                    GradientStop { position: 0.0; color: Theme.primary }
                    GradientStop { position: 1.0; color: Theme.accent }
                }

                RowLayout {
                    anchors.fill: parent
                    anchors.margins: 24

                    Label {
                        text: "Same app.\nEvery framework."
                        font: Theme.titleFont
                        color: "white"
                        Layout.fillWidth: true
                        wrapMode: Text.WordWrap
                    }

                    OrbitPainter {
                        objectName: "orbit"
                        Layout.alignment: Qt.AlignVCenter
                    }
                }
            }

            // Counter Row
            RowLayout {
                Layout.fillWidth: true
                spacing: 16

                Label {
                    text: "Taps"
                    font: Theme.labelFont
                    color: Theme.textMuted
                    Layout.alignment: Qt.AlignVCenter
                }

                Item {
                    Layout.fillWidth: true
                    height: 40
                    clip: true

                    property int taps: 0

                    Text {
                        id: tapText
                        text: parent.taps
                        font: Theme.displayFont
                        color: Theme.text
                        anchors.centerIn: parent

                        Behavior on text {
                            SequentialAnimation {
                                NumberAnimation { target: tapText; property: "y"; to: -20; duration: Theme.baseDuration / 2; easing.type: Theme.baseEasingType }
                                NumberAnimation { target: tapText; property: "opacity"; to: 0; duration: Theme.baseDuration / 2 }
                                PropertyAction { target: tapText; property: "y"; value: 20 }
                                ParallelAnimation {
                                    NumberAnimation { target: tapText; property: "y"; to: 0; duration: Theme.baseDuration / 2; easing.type: Theme.baseEasingType }
                                    NumberAnimation { target: tapText; property: "opacity"; to: 1; duration: Theme.baseDuration / 2 }
                                }
                            }
                        }
                    }
                }

                Button {
                    objectName: "counter-inc"
                    text: "+"
                    font: Theme.displayFont
                    contentItem: Text {
                        text: parent.text
                        font: parent.font
                        color: Theme.onPrimary
                        horizontalAlignment: Text.AlignHCenter
                        verticalAlignment: Text.AlignVCenter
                    }
                    background: Rectangle {
                        color: Theme.primary
                        radius: 14
                        implicitWidth: 56
                        implicitHeight: 56
                        scale: parent.pressed ? 0.96 : 1.0
                        Behavior on scale { NumberAnimation { duration: Theme.fastDuration; easing.type: Theme.fastEasingType } }
                    }

                    onClicked: parent.children[1].taps++

                    // Shake on long press
                    Timer {
                        id: longPressTimer
                        interval: 500
                        onTriggered: {
                            parent.parent.children[1].taps = 0;
                            shakeAnim.start();
                        }
                    }
                    onPressed: longPressTimer.start()
                    onReleased: longPressTimer.stop()
                    onCanceled: longPressTimer.stop()

                    SequentialAnimation {
                        id: shakeAnim
                        NumberAnimation { target: tapText; property: "x"; by: 6; duration: 50 }
                        NumberAnimation { target: tapText; property: "x"; by: -12; duration: 100 }
                        NumberAnimation { target: tapText; property: "x"; by: 12; duration: 100 }
                        NumberAnimation { target: tapText; property: "x"; by: -12; duration: 100 }
                        NumberAnimation { target: tapText; property: "x"; to: 0; duration: 50 }
                    }
                }
            }

            // Controls Card
            Rectangle {
                Layout.fillWidth: true
                radius: 20
                color: Theme.surface
                implicitHeight: controlsLayout.implicitHeight + 32

                ColumnLayout {
                    id: controlsLayout
                    anchors.fill: parent
                    anchors.margins: 16
                    spacing: 16

                    RowLayout {
                        Layout.fillWidth: true
                        Label {
                            text: "Notifications"
                            font: Theme.bodyFont
                            color: Theme.text
                            Layout.fillWidth: true
                        }
                        Switch {
                            objectName: "switch"
                            checked: true
                        }
                    }

                    ColumnLayout {
                        Layout.fillWidth: true
                        spacing: 4
                        Label {
                            text: Math.round(slider.value)
                            font: Theme.captionFont
                            color: Theme.primary
                            Layout.alignment: Qt.AlignHCenter
                            // Simple binding for moving text above thumb could be complex, keeping centered above slider
                        }
                        Slider {
                            id: slider
                            objectName: "slider"
                            Layout.fillWidth: true
                            from: 0
                            to: 100
                            value: 50
                        }
                    }

                    RowLayout {
                        Layout.fillWidth: true
                        spacing: 8

                        property int selectedChip: 1

                        Repeater {
                            model: ["Low", "Medium", "High"]
                            Rectangle {
                                id: chip
                                property bool isSelected: parent.selectedChip === index
                                objectName: "chip-" + modelData.toLowerCase()
                                color: isSelected ? Theme.primary : "transparent"
                                border.color: isSelected ? "transparent" : Theme.outline
                                border.width: 1
                                radius: 999
                                implicitWidth: chipText.implicitWidth + 24
                                implicitHeight: 32

                                Behavior on color { ColorAnimation { duration: Theme.fastDuration } }

                                Text {
                                    id: chipText
                                    text: modelData
                                    font: Theme.labelFont
                                    color: chip.isSelected ? Theme.onPrimary : Theme.text
                                    anchors.centerIn: parent
                                    Behavior on color { ColorAnimation { duration: Theme.fastDuration } }
                                }

                                MouseArea {
                                    anchors.fill: parent
                                    onClicked: chip.parent.selectedChip = index
                                }
                            }
                        }
                    }
                }
            }

            // Text Field
            ColumnLayout {
                Layout.fillWidth: true
                spacing: 8

                TextField {
                    id: nameInput
                    objectName: "name-input"
                    Layout.fillWidth: true
                    placeholderText: "Your name"
                    font: Theme.bodyFont
                    color: Theme.text

                    background: Rectangle {
                        radius: 14
                        border.color: nameInput.activeFocus ? Theme.primary : Theme.outline
                        border.width: nameInput.activeFocus ? 2 : 1
                        color: Theme.surface
                        Behavior on border.color { ColorAnimation { duration: Theme.fastDuration } }
                        Behavior on border.width { NumberAnimation { duration: Theme.fastDuration } }
                    }
                }

                Label {
                    text: nameInput.text.length > 0 ? "Hello, " + nameInput.text : ""
                    font: Theme.bodyFont
                    color: Theme.text
                    opacity: text.length > 0 ? 1 : 0
                    Behavior on opacity { NumberAnimation { duration: Theme.fastDuration } }
                }
            }

            // List
            ColumnLayout {
                Layout.fillWidth: true
                spacing: 16

                Repeater {
                    model: page1.listData

                    delegate: Rectangle {
                        id: listItem
                        objectName: "item-" + modelData.id
                        Layout.fillWidth: true
                        height: 72
                        color: "transparent"

                        // Enter animation
                        property bool showed: false
                        Component.onCompleted: {
                            enterTimer.start()
                        }
                        Timer {
                            id: enterTimer
                            interval: index * 50
                            onTriggered: listItem.showed = true
                        }

                        opacity: showed ? 1 : 0
                        y: showed ? 0 : 24
                        Behavior on opacity { NumberAnimation { duration: Theme.slowDuration; easing.type: Theme.slowEasingType } }
                        Behavior on y { NumberAnimation { duration: Theme.slowDuration; easing.type: Theme.slowEasingType } }

                        RowLayout {
                            anchors.fill: parent
                            spacing: 16

                            Rectangle {
                                id: thumb
                                width: 56
                                height: 56
                                radius: 16
                                gradient: Gradient {
                                    GradientStop { position: 0.0; color: modelData.colors[0] }
                                    GradientStop { position: 1.0; color: modelData.colors[1] }
                                }
                            }

                            ColumnLayout {
                                Layout.fillWidth: true
                                spacing: 4
                                Label {
                                    text: modelData.title
                                    font: Theme.bodyFont
                                    color: Theme.text
                                }
                                Label {
                                    text: modelData.subtitle
                                    font: Theme.captionFont
                                    color: Theme.textMuted
                                }
                            }

                            Label {
                                text: ">"
                                font: Theme.titleFont
                                color: Theme.textMuted
                            }
                        }

                        MouseArea {
                            anchors.fill: parent
                            onClicked: {
                                // QML StackView push
                                if (typeof historyManager !== "undefined" && !mainWindow.isPoppingFromBrowser) { historyManager.pushState(); }
                                var globalCoords = thumb.mapToItem(rootContainer, 0, 0);
                                mainWindow.startHeroAnimation(globalCoords.x, globalCoords.y, thumb.width, thumb.height, modelData.colors[0], modelData.colors[1]);
                                stackView.push("Page2.qml", { "itemData": modelData })
                            }
                        }
                    }
                }
            }

            Item {
                Layout.fillWidth: true
                height: 32
            }
        }
    }
}
