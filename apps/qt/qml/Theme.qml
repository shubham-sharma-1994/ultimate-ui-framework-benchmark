pragma Singleton
import QtQuick

QtObject {
    id: theme
    property bool isDark: false

    // Tokens
    readonly property color light_background: "#F6F4FB"
    readonly property color dark_background: "#121016"
    readonly property color background: isDark ? dark_background : light_background

    readonly property color light_surface: "#FFFFFF"
    readonly property color dark_surface: "#1C1A22"
    readonly property color surface: isDark ? dark_surface : light_surface

    readonly property color light_surfaceAlt: "#EEEAF7"
    readonly property color dark_surfaceAlt: "#26232E"
    readonly property color surfaceAlt: isDark ? dark_surfaceAlt : light_surfaceAlt

    readonly property color light_primary: "#6750A4"
    readonly property color dark_primary: "#CFBCFF"
    readonly property color primary: isDark ? dark_primary : light_primary

    readonly property color light_onPrimary: "#FFFFFF"
    readonly property color dark_onPrimary: "#381E72"
    readonly property color onPrimary: isDark ? dark_onPrimary : light_onPrimary

    readonly property color light_accent: "#FF7A59"
    readonly property color dark_accent: "#FF9E85"
    readonly property color accent: isDark ? dark_accent : light_accent

    readonly property color light_text: "#1D1B20"
    readonly property color dark_text: "#E6E0E9"
    readonly property color text: isDark ? dark_text : light_text

    readonly property color light_textMuted: "#6B6674"
    readonly property color dark_textMuted: "#A9A3B3"
    readonly property color textMuted: isDark ? dark_textMuted : light_textMuted

    readonly property color light_outline: "#D9D3E6"
    readonly property color dark_outline: "#3A3644"
    readonly property color outline: isDark ? dark_outline : light_outline

    readonly property color light_success: "#2E9E6B"
    readonly property color dark_success: "#5FD39B"
    readonly property color success: isDark ? dark_success : light_success

    // Typography
    property font displayFont: Qt.font({ family: "Inter", pixelSize: 32, weight: 700 })
    property font titleFont: Qt.font({ family: "Inter", pixelSize: 22, weight: 600 })
    property font bodyFont: Qt.font({ family: "Inter", pixelSize: 16, weight: 400 })
    property font labelFont: Qt.font({ family: "Inter", pixelSize: 13, weight: 500 })
    property font captionFont: Qt.font({ family: "Inter", pixelSize: 12, weight: 400 })

    // Motions
    readonly property int fastDuration: 150
    readonly property int baseDuration: 300
    readonly property int slowDuration: 500
    // Approximate cubic beziers using Qt Quick easing types if bezier isn't directly usable in all animation types
    readonly property int fastEasingType: Easing.OutCubic
    readonly property int baseEasingType: Easing.InOutCubic
    readonly property int slowEasingType: Easing.OutQuart

    // Theme animation transitions are handled per-component or using Behaviors where applicable,
    // unfortunately QtObject cannot hold Behaviors directly for its properties, so we will use
    // Behaviors on the UI components themselves where necessary, or rely on bindings.
    // However, we can create a central animated properties object for theme colors:

    // It's actually easier to just bind colors in QML and use Behaviors on those target properties,
    // or use a custom property in an Item to animate. We'll stick to bindings for simplicity,
    // and rely on the fact that we can use Behaviors on color properties in our QML components.

    function toggleTheme() {
        isDark = !isDark
    }
}
