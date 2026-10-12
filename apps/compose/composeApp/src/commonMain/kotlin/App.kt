package app.pulse.compose

import androidx.compose.animation.*
import androidx.compose.animation.core.tween
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import app.pulse.compose.models.AppData
import app.pulse.compose.models.ItemData
import app.pulse.compose.screens.DetailScreen
import app.pulse.compose.screens.MainScreen
import app.pulse.compose.theme.PulseMotion
import app.pulse.compose.theme.PulseTheme
import kotlinx.coroutines.launch

@Composable
fun App() {
    var isDarkTheme by remember { mutableStateOf(false) }
    var appData by remember { mutableStateOf<AppData?>(null) }
    val coroutineScope = rememberCoroutineScope()

    LaunchedEffect(Unit) {
        coroutineScope.launch {
            appData = fetchAppData()
        }
    }

    PulseTheme(isDark = isDarkTheme) {
        var currentItem by remember { mutableStateOf<ItemData?>(null) }

        if (appData == null) {
            Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Text("Loading...", color = app.pulse.compose.theme.LocalPulseColors.current.text)
            }
        } else {
            AnimatedContent(
                targetState = currentItem,
                transitionSpec = {
                    if (targetState != null) {
                        // Forward
                        (slideInHorizontally(tween(PulseMotion.baseDuration)) { width -> (width * 0.3f).toInt() } + fadeIn(tween(PulseMotion.baseDuration)))
                            .togetherWith(slideOutHorizontally(tween(PulseMotion.baseDuration)) { width -> -(width * 0.1f).toInt() } + fadeOut(tween(PulseMotion.baseDuration)))
                    } else {
                        // Back
                        (slideInHorizontally(tween(PulseMotion.baseDuration)) { width -> -(width * 0.1f).toInt() } + fadeIn(tween(PulseMotion.baseDuration)))
                            .togetherWith(slideOutHorizontally(tween(PulseMotion.baseDuration)) { width -> (width * 0.3f).toInt() } + fadeOut(tween(PulseMotion.baseDuration)))
                    }
                }
            ) { item ->
                if (item == null) {
                    MainScreen(
                        items = appData!!.items,
                        isDarkTheme = isDarkTheme,
                        onThemeToggle = { isDarkTheme = !isDarkTheme },
                        onItemClick = { currentItem = it }
                    )
                } else {
                    DetailScreen(
                        item = item,
                        onBack = { currentItem = null }
                    )
                }
            }
        }
    }
}
