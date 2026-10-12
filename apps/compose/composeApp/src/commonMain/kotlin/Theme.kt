package app.pulse.compose.theme

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.CubicBezierEasing
import androidx.compose.animation.core.tween
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Typography
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.*
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

// 1. Theme tokens
object PulseColors {
    // Light Theme
    val backgroundLight = Color(0xFFF9F9FB)
    val surfaceLight = Color(0xFFFFFFFF)
    val surfaceAltLight = Color(0xFFF3F2F6)
    val primaryLight = Color(0xFF3B82F6)
    val accentLight = Color(0xFF8B5CF6)
    val textLight = Color(0xFF1E1B24)
    val textMutedLight = Color(0xFF6B6674)
    val outlineLight = Color(0xFFD9D3E6)
    val successLight = Color(0xFF2E9E6B)

    // Dark Theme
    val backgroundDark = Color(0xFF121114)
    val surfaceDark = Color(0xFF1E1D24)
    val surfaceAltDark = Color(0xFF2A2830)
    val primaryDark = Color(0xFF60A5FA)
    val accentDark = Color(0xFFA78BFA)
    val textDark = Color(0xFFF9F9FB)
    val textMutedDark = Color(0xFFA9A3B3)
    val outlineDark = Color(0xFF3A3644)
    val successDark = Color(0xFF5FD39B)
}

// 3. Motion tokens
object PulseMotion {
    val fastDuration = 150
    val baseDuration = 300
    val slowDuration = 500

    val fastCurve = CubicBezierEasing(0.2f, 0f, 0f, 1f)
    val baseCurve = CubicBezierEasing(0.65f, 0f, 0.35f, 1f)
    val slowCurve = CubicBezierEasing(0.05f, 0.7f, 0.1f, 1f)
}

val Typography = Typography(
    displayLarge = TextStyle(fontSize = 32.sp, lineHeight = 40.sp, fontWeight = FontWeight(700)),
    titleLarge = TextStyle(fontSize = 22.sp, lineHeight = 28.sp, fontWeight = FontWeight(600)),
    bodyLarge = TextStyle(fontSize = 16.sp, lineHeight = 24.sp, fontWeight = FontWeight(400)),
    labelLarge = TextStyle(fontSize = 13.sp, lineHeight = 16.sp, fontWeight = FontWeight(500)),
    labelSmall = TextStyle(fontSize = 12.sp, lineHeight = 16.sp, fontWeight = FontWeight(400))
)

class PulseThemeColors(
    background: Color,
    surface: Color,
    surfaceAlt: Color,
    primary: Color,
    accent: Color,
    text: Color,
    textMuted: Color,
    outline: Color,
    success: Color
) {
    var background by mutableStateOf(background)
        internal set
    var surface by mutableStateOf(surface)
        internal set
    var surfaceAlt by mutableStateOf(surfaceAlt)
        internal set
    var primary by mutableStateOf(primary)
        internal set
    var accent by mutableStateOf(accent)
        internal set
    var text by mutableStateOf(text)
        internal set
    var textMuted by mutableStateOf(textMuted)
        internal set
    var outline by mutableStateOf(outline)
        internal set
    var success by mutableStateOf(success)
        internal set
}

val LocalPulseColors = staticCompositionLocalOf<PulseThemeColors> {
    error("No PulseThemeColors provided")
}

@Composable
fun PulseTheme(
    isDark: Boolean = false,
    content: @Composable () -> Unit
) {
    val targetColors = if (isDark) {
        PulseThemeColors(
            background = PulseColors.backgroundDark,
            surface = PulseColors.surfaceDark,
            surfaceAlt = PulseColors.surfaceAltDark,
            primary = PulseColors.primaryDark,
            accent = PulseColors.accentDark,
            text = PulseColors.textDark,
            textMuted = PulseColors.textMutedDark,
            outline = PulseColors.outlineDark,
            success = PulseColors.successDark
        )
    } else {
        PulseThemeColors(
            background = PulseColors.backgroundLight,
            surface = PulseColors.surfaceLight,
            surfaceAlt = PulseColors.surfaceAltLight,
            primary = PulseColors.primaryLight,
            accent = PulseColors.accentLight,
            text = PulseColors.textLight,
            textMuted = PulseColors.textMutedLight,
            outline = PulseColors.outlineLight,
            success = PulseColors.successLight
        )
    }

    val animatedColors = PulseThemeColors(
        background = animateColorAsState(targetColors.background, tween(PulseMotion.slowDuration, easing = PulseMotion.slowCurve)).value,
        surface = animateColorAsState(targetColors.surface, tween(PulseMotion.slowDuration, easing = PulseMotion.slowCurve)).value,
        surfaceAlt = animateColorAsState(targetColors.surfaceAlt, tween(PulseMotion.slowDuration, easing = PulseMotion.slowCurve)).value,
        primary = animateColorAsState(targetColors.primary, tween(PulseMotion.slowDuration, easing = PulseMotion.slowCurve)).value,
        accent = animateColorAsState(targetColors.accent, tween(PulseMotion.slowDuration, easing = PulseMotion.slowCurve)).value,
        text = animateColorAsState(targetColors.text, tween(PulseMotion.slowDuration, easing = PulseMotion.slowCurve)).value,
        textMuted = animateColorAsState(targetColors.textMuted, tween(PulseMotion.slowDuration, easing = PulseMotion.slowCurve)).value,
        outline = animateColorAsState(targetColors.outline, tween(PulseMotion.slowDuration, easing = PulseMotion.slowCurve)).value,
        success = animateColorAsState(targetColors.success, tween(PulseMotion.slowDuration, easing = PulseMotion.slowCurve)).value
    )

    CompositionLocalProvider(LocalPulseColors provides animatedColors) {
        MaterialTheme(
            typography = Typography,
            content = content
        )
    }
}
