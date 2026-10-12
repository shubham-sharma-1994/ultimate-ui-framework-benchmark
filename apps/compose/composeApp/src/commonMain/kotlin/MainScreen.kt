package app.pulse.compose.screens

import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.*
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import app.pulse.compose.models.ItemData
import app.pulse.compose.theme.LocalPulseColors
import app.pulse.compose.theme.PulseMotion
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlin.math.PI
import kotlin.math.cos
import kotlin.math.sin

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainScreen(
    items: List<ItemData>,
    isDarkTheme: Boolean,
    onThemeToggle: () -> Unit,
    onItemClick: (ItemData) -> Unit
) {
    val colors = LocalPulseColors.current
    val scrollState = rememberScrollState()

    val appBarShadow by animateDpAsState(
        targetValue = if (scrollState.value > 0) 4.dp else 0.dp,
        animationSpec = tween(PulseMotion.fastDuration, easing = PulseMotion.fastCurve)
    )

    Scaffold(
        topBar = {
            Surface(
                modifier = Modifier
                    .shadow(appBarShadow)
                    .fillMaxWidth(),
                color = colors.surface,
                contentColor = colors.text
            ) {
                Row(
                    modifier = Modifier
                        .height(56.dp)
                        .padding(horizontal = 16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Pulse",
                        style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Bold),
                        modifier = Modifier.weight(1f)
                    )
                    Box(modifier = Modifier.clickable(onClick = onThemeToggle).testTag("theme-toggle")) {
                        val rotation by animateFloatAsState(
                            targetValue = if (isDarkTheme) 180f else 0f,
                            animationSpec = tween(PulseMotion.slowDuration, easing = PulseMotion.slowCurve)
                        )
                        Box(
                            modifier = Modifier
                                .size(48.dp)
                                .graphicsLayer { rotationZ = rotation },
                            contentAlignment = Alignment.Center
                        ) {
                            Text(if (isDarkTheme) "🌙" else "☀️", fontSize = 24.sp)
                        }
                    }
                }
            }
        },
        containerColor = colors.background
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(scrollState)
                .padding(padding)
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Spacer(modifier = Modifier.height(8.dp))
            HeroCard()
            CounterRow()
            ControlsCard()
            NameField()
            ListSection(items, onItemClick)
            Spacer(modifier = Modifier.height(32.dp))
        }
    }
}

@Composable
fun HeroCard() {
    val infiniteTransition = rememberInfiniteTransition()
    val rotation by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 360f,
        animationSpec = infiniteRepeatable(
            animation = tween(3000, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        )
    )

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(180.dp)
            .clip(RoundedCornerShape(20.dp))
            .background(
                Brush.linearGradient(
                    colors = listOf(LocalPulseColors.current.primary, LocalPulseColors.current.accent),
                    start = Offset(0f, 0f),
                    end = Offset(Float.POSITIVE_INFINITY, Float.POSITIVE_INFINITY)
                )
            )
            .testTag("orbit"),
        contentAlignment = Alignment.Center
    ) {
        Canvas(modifier = Modifier.size(120.dp)) {
            val ringRadius = 40.dp.toPx()
            drawCircle(
                color = Color.White.copy(alpha = 0.3f),
                radius = ringRadius,
                style = Stroke(width = 2.dp.toPx())
            )

            val dotRadius = 6.dp.toPx()
            val center = Offset(size.width / 2f, size.height / 2f)
            for (i in 0 until 3) {
                val angle = rotation + (i * 120)
                val angleRad = angle * (PI / 180f)
                val dotX = center.x + ringRadius * cos(angleRad).toFloat()
                val dotY = center.y + ringRadius * sin(angleRad).toFloat()
                drawCircle(
                    color = Color.White,
                    radius = dotRadius,
                    center = Offset(dotX, dotY)
                )
            }
        }

        Text(
            text = "Same app. Every framework.",
            style = MaterialTheme.typography.titleLarge.copy(color = Color.White),
            modifier = Modifier.align(Alignment.BottomStart).padding(16.dp)
        )
    }
}

@OptIn(ExperimentalAnimationApi::class, ExperimentalFoundationApi::class)
@Composable
fun CounterRow() {
    var count by remember { mutableStateOf(0) }
    var isShaking by remember { mutableStateOf(false) }

    val shakeOffset by animateFloatAsState(
        targetValue = if (isShaking) 6f else 0f,
        animationSpec = if (isShaking) {
            keyframes {
                durationMillis = 300
                0f at 0
                -6f at 50
                6f at 100
                -6f at 150
                6f at 200
                -6f at 250
                0f at 300
            }
        } else tween(0)
    )

    val coroutineScope = rememberCoroutineScope()

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .graphicsLayer { translationX = shakeOffset },
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text("Taps", style = MaterialTheme.typography.labelLarge, color = LocalPulseColors.current.textMuted)
        Spacer(modifier = Modifier.width(16.dp))

        AnimatedContent(
            targetState = count,
            transitionSpec = {
                if (targetState > initialState) {
                    (slideInVertically(tween(PulseMotion.baseDuration)) { height -> height } + fadeIn(tween(PulseMotion.baseDuration))).togetherWith(
                        slideOutVertically(tween(PulseMotion.baseDuration)) { height -> -height } + fadeOut(tween(PulseMotion.baseDuration)))
                } else {
                    (fadeIn(tween(PulseMotion.baseDuration))).togetherWith(fadeOut(tween(PulseMotion.baseDuration)))
                }
            }
        ) { targetCount ->
            Text(
                text = targetCount.toString(),
                style = MaterialTheme.typography.displayLarge,
                color = LocalPulseColors.current.text
            )
        }

        Spacer(modifier = Modifier.weight(1f))

        val interactionSource = remember { MutableInteractionSource() }
        val isPressed by interactionSource.collectIsPressedAsState()
        val scale by animateFloatAsState(
            targetValue = if (isPressed) 0.96f else 1f,
            animationSpec = tween(PulseMotion.fastDuration, easing = PulseMotion.fastCurve)
        )

        Box(
            modifier = Modifier
                .size(56.dp)
                .scale(scale)
                .clip(RoundedCornerShape(16.dp))
                .background(LocalPulseColors.current.primary)
                .testTag("counter-inc")
                .combinedClickable(
                    interactionSource = interactionSource,
                    indication = null,
                    onClick = { count++ },
                    onLongClick = {
                        count = 0
                        coroutineScope.launch {
                            isShaking = true
                            delay(300)
                            isShaking = false
                        }
                    }
                ),
            contentAlignment = Alignment.Center
        ) {
            Text("+", color = Color.White, style = MaterialTheme.typography.displayLarge)
        }
    }
}

@Composable
fun ControlsCard() {
    val colors = LocalPulseColors.current
    var isNotificationsEnabled by remember { mutableStateOf(false) }
    var intensity by remember { mutableStateOf(50f) }
    var selectedChip by remember { mutableStateOf("Medium") }

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .shadow(1.dp, RoundedCornerShape(16.dp))
            .clip(RoundedCornerShape(16.dp))
            .background(colors.surface)
            .padding(16.dp)
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Text("Notifications", color = colors.text, modifier = Modifier.weight(1f))
            Switch(
                checked = isNotificationsEnabled,
                onCheckedChange = { isNotificationsEnabled = it },
                modifier = Modifier.testTag("switch")
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        Text("Intensity: ${intensity.toInt()}", color = colors.text)
        Slider(
            value = intensity,
            onValueChange = { intensity = it },
            valueRange = 0f..100f,
            modifier = Modifier.testTag("slider")
        )

        Spacer(modifier = Modifier.height(16.dp))

        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            listOf("Low", "Medium", "High").forEach { chip ->
                val isSelected = selectedChip == chip
                val bgColor by animateColorAsState(
                    targetValue = if (isSelected) colors.primary else colors.surfaceAlt,
                    animationSpec = tween(PulseMotion.fastDuration, easing = PulseMotion.fastCurve)
                )
                val textColor by animateColorAsState(
                    targetValue = if (isSelected) Color.White else colors.text,
                    animationSpec = tween(PulseMotion.fastDuration, easing = PulseMotion.fastCurve)
                )

                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(16.dp))
                        .background(bgColor)
                        .clickable { selectedChip = chip }
                        .padding(horizontal = 16.dp, vertical = 8.dp)
                        .testTag("chip-${chip.lowercase()}")
                ) {
                    Text(chip, color = textColor, style = MaterialTheme.typography.labelLarge)
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun NameField() {
    var name by remember { mutableStateOf("") }
    val colors = LocalPulseColors.current

    Column(modifier = Modifier.fillMaxWidth()) {
        OutlinedTextField(
            value = name,
            onValueChange = { name = it },
            label = { Text("Your name") },
            modifier = Modifier.fillMaxWidth().testTag("name-input"),
            colors = TextFieldDefaults.outlinedTextFieldColors(
                focusedBorderColor = colors.primary,
                unfocusedBorderColor = colors.outline,
                focusedTextColor = colors.text,
                unfocusedTextColor = colors.text,
                cursorColor = colors.primary
            ),
            singleLine = true
        )

        AnimatedVisibility(
            visible = name.isNotEmpty(),
            enter = fadeIn(tween(PulseMotion.fastDuration))
        ) {
            Text(
                text = "Hello, $name",
                color = colors.textMuted,
                modifier = Modifier.padding(top = 8.dp)
            )
        }
    }
}

@Composable
fun ListSection(items: List<ItemData>, onItemClick: (ItemData) -> Unit) {
    Column {
        items.forEachIndexed { index, item ->
            ListItemRow(item, index, onItemClick)
        }
    }
}

@Composable
fun ListItemRow(item: ItemData, index: Int, onClick: (ItemData) -> Unit) {
    var isVisible by remember { mutableStateOf(false) }

    LaunchedEffect(Unit) {
        delay((index * 50).toLong())
        isVisible = true
    }

    val alpha by animateFloatAsState(
        targetValue = if (isVisible) 1f else 0f,
        animationSpec = tween(PulseMotion.slowDuration, easing = PulseMotion.slowCurve)
    )
    val offsetY by animateDpAsState(
        targetValue = if (isVisible) 0.dp else 24.dp,
        animationSpec = tween(PulseMotion.slowDuration, easing = PulseMotion.slowCurve)
    )

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .graphicsLayer {
                this.alpha = alpha
                this.translationY = offsetY.toPx()
            }
            .clickable { onClick(item) }
            .padding(vertical = 8.dp)
            .testTag("item-${item.id}"),
        verticalAlignment = Alignment.CenterVertically
    ) {
        val color1 = Color(item.colors[0].replace("#", "FF").toLong(16))
        val color2 = Color(item.colors[1].replace("#", "FF").toLong(16))
        Box(
            modifier = Modifier
                .size(56.dp)
                .clip(RoundedCornerShape(16.dp))
                .background(Brush.linearGradient(listOf(color1, color2)))
        )

        Spacer(modifier = Modifier.width(16.dp))

        Column(modifier = Modifier.weight(1f)) {
            Text(item.title, color = LocalPulseColors.current.text, style = MaterialTheme.typography.titleLarge)
            Text(item.subtitle, color = LocalPulseColors.current.textMuted, style = MaterialTheme.typography.bodyLarge)
        }

        Text(">", color = LocalPulseColors.current.textMuted)
    }
}
