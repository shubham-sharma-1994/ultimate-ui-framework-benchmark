package app.pulse.compose.screens

import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.*
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import app.pulse.compose.models.ItemData
import app.pulse.compose.theme.LocalPulseColors
import app.pulse.compose.theme.PulseMotion
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlin.math.roundToInt

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DetailScreen(
    item: ItemData,
    onBack: () -> Unit
) {
    val colors = LocalPulseColors.current
    val scrollState = rememberScrollState()

    var showDialog by remember { mutableStateOf(false) }
    var showSheet by remember { mutableStateOf(false) }
    val snackbarHostState = remember { SnackbarHostState() }
    val coroutineScope = rememberCoroutineScope()

    Scaffold(
        snackbarHost = { SnackbarHost(snackbarHostState) },
        containerColor = colors.background
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(scrollState)
                .padding(padding)
        ) {
            CollapsingHeader(item, scrollState, onBack)

            Column(
                modifier = Modifier.padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(24.dp)
            ) {
                ProgressRingSection(item.score)
                AccordionSection()
                DraggableCardSection()
                SwipeListSection()
                ButtonsSection(
                    onShowDialog = { showDialog = true },
                    onShowSheet = { showSheet = true },
                    onShowToast = {
                        coroutineScope.launch {
                            snackbarHostState.showSnackbar(
                                message = "Hello from Toast",
                                duration = SnackbarDuration.Short
                            )
                        }
                    }
                )
                ShimmerBodyText(item.body)
            }
        }
    }

    if (showDialog) {
        AlertDialog(
            onDismissRequest = { showDialog = false },
            title = { Text("Dialog Title", color = colors.text) },
            text = { Text("This is a modal dialog.", color = colors.textMuted) },
            confirmButton = {
                TextButton(onClick = { showDialog = false }) {
                    Text("OK", color = colors.primary)
                }
            },
            containerColor = colors.surface,
            modifier = Modifier.testTag("dialog")
        )
    }

    if (showSheet) {
        ModalBottomSheet(
            onDismissRequest = { showSheet = false },
            containerColor = colors.surface,
            dragHandle = { BottomSheetDefaults.DragHandle() },
            modifier = Modifier.testTag("sheet")
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text("Bottom Sheet", style = MaterialTheme.typography.titleLarge, color = colors.text)
                Spacer(modifier = Modifier.height(16.dp))
                Text("Drag down to dismiss", color = colors.textMuted)
                Spacer(modifier = Modifier.height(32.dp))
            }
        }
    }
}

@Composable
fun CollapsingHeader(item: ItemData, scrollState: ScrollState, onBack: () -> Unit) {
    val headerHeight = 240.dp
    val minHeaderHeight = 56.dp
    val scrollValue = scrollState.value.toFloat()

    val heightPx = with(androidx.compose.ui.platform.LocalDensity.current) { headerHeight.toPx() }
    val minHeightPx = with(androidx.compose.ui.platform.LocalDensity.current) { minHeaderHeight.toPx() }

    val currentHeightPx = (heightPx - scrollValue).coerceAtLeast(minHeightPx)
    val progress = 1f - ((currentHeightPx - minHeightPx) / (heightPx - minHeightPx)).coerceIn(0f, 1f)

    val titleFontSize = androidx.compose.ui.unit.lerp(32.sp, 20.sp, progress)

    val color1 = Color(item.colors[0].replace("#", "FF").toLong(16))
    val color2 = Color(item.colors[1].replace("#", "FF").toLong(16))

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(with(androidx.compose.ui.platform.LocalDensity.current) { currentHeightPx.toDp() })
            .graphicsLayer {
                translationY = scrollValue * 0.5f
            }
            .background(Brush.linearGradient(listOf(color1, color2)))
    ) {
        IconButton(
            onClick = onBack,
            modifier = Modifier
                .align(Alignment.TopStart)
                .padding(4.dp)
                .testTag("back")
        ) {
            Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = Color.White)
        }

        Text(
            text = item.title,
            color = Color.White,
            fontWeight = FontWeight.Bold,
            fontSize = titleFontSize,
            modifier = Modifier
                .align(Alignment.BottomStart)
                .padding(start = 16.dp, bottom = 16.dp)
        )
    }
}

@Composable
fun ProgressRingSection(targetScore: Int) {
    var animatedScore by remember { mutableStateOf(0) }
    var key by remember { mutableStateOf(0) }

    val scoreFloat by animateFloatAsState(
        targetValue = animatedScore.toFloat(),
        animationSpec = tween(PulseMotion.slowDuration, easing = PulseMotion.slowCurve)
    )

    LaunchedEffect(key) {
        animatedScore = 0
        delay(100)
        animatedScore = targetScore
    }

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { key++ },
        contentAlignment = Alignment.Center
    ) {
        Box(modifier = Modifier.size(120.dp).testTag("ring")) {
            val colors = LocalPulseColors.current
            val accentColor = colors.accent
            Canvas(modifier = Modifier.fillMaxSize()) {
                drawArc(
                    color = colors.outline,
                    startAngle = 0f,
                    sweepAngle = 360f,
                    useCenter = false,
                    style = Stroke(width = 12.dp.toPx(), cap = StrokeCap.Round)
                )
                drawArc(
                    color = accentColor,
                    startAngle = -90f,
                    sweepAngle = (scoreFloat / 100f) * 360f,
                    useCenter = false,
                    style = Stroke(width = 12.dp.toPx(), cap = StrokeCap.Round)
                )
            }
            Text(
                text = "${scoreFloat.toInt()}%",
                style = MaterialTheme.typography.displayLarge,
                color = colors.text,
                modifier = Modifier.align(Alignment.Center)
            )
        }
    }
}

@Composable
fun AccordionSection() {
    val colors = LocalPulseColors.current
    var expanded by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .background(colors.surface)
            .testTag("accordion")
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .clickable { expanded = !expanded }
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text("Details", color = colors.text, style = MaterialTheme.typography.titleLarge, modifier = Modifier.weight(1f))

            val rotation by animateFloatAsState(
                targetValue = if (expanded) 180f else 0f,
                animationSpec = tween(PulseMotion.baseDuration, easing = PulseMotion.baseCurve)
            )
            Text("v", color = colors.textMuted, modifier = Modifier.graphicsLayer { rotationZ = rotation })
        }

        AnimatedVisibility(
            visible = expanded,
            enter = expandVertically(tween(PulseMotion.baseDuration, easing = PulseMotion.baseCurve)) + fadeIn(tween(PulseMotion.baseDuration / 2, delayMillis = PulseMotion.baseDuration / 2))
        ) {
            Text(
                "These are some extra details inside the accordion. It animates height smoothly and fades content in.",
                color = colors.textMuted,
                modifier = Modifier.padding(start = 16.dp, end = 16.dp, bottom = 16.dp)
            )
        }
    }
}

@Composable
fun DraggableCardSection() {
    val colors = LocalPulseColors.current
    var offset by remember { mutableStateOf(Offset.Zero) }
    var isDragging by remember { mutableStateOf(false) }

    val animatedOffset by animateOffsetAsState(
        targetValue = if (isDragging) offset else Offset.Zero,
        animationSpec = if (isDragging) snap() else spring(stiffness = 300f, dampingRatio = 20f / (2 * kotlin.math.sqrt(300f * 1f)))
    )

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(240.dp)
            .clip(RoundedCornerShape(16.dp))
            .background(colors.surfaceAlt),
        contentAlignment = Alignment.Center
    ) {
        Box(
            modifier = Modifier
                .offset { IntOffset(animatedOffset.x.roundToInt(), animatedOffset.y.roundToInt()) }
                .size(96.dp)
                .clip(RoundedCornerShape(16.dp))
                .background(colors.primary)
                .testTag("drag-card")
                .pointerInput(Unit) {
                    detectDragGestures(
                        onDragStart = { isDragging = true },
                        onDragEnd = { isDragging = false; offset = Offset.Zero },
                        onDragCancel = { isDragging = false; offset = Offset.Zero },
                        onDrag = { change, dragAmount ->
                            change.consume()
                            offset += dragAmount
                        }
                    )
                },
            contentAlignment = Alignment.Center
        ) {
            Text("Drag me", color = Color.White)
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SwipeListSection() {
    val colors = LocalPulseColors.current
    val items = remember { mutableStateListOf(1, 2, 3) }

    Column {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Text("Swipe to dismiss", color = colors.text, style = MaterialTheme.typography.titleLarge, modifier = Modifier.weight(1f))
            if (items.size < 3) {
                TextButton(onClick = {
                    items.clear()
                    items.addAll(listOf(1, 2, 3))
                }, modifier = Modifier.testTag("swipe-reset")) {
                    Text("Reset", color = colors.primary)
                }
            }
        }
        Spacer(modifier = Modifier.height(16.dp))

        items.forEach { id ->
            val dismissState = androidx.compose.material3.rememberSwipeToDismissBoxState(
                confirmValueChange = {
                    if (it == androidx.compose.material3.SwipeToDismissBoxValue.EndToStart || it == androidx.compose.material3.SwipeToDismissBoxValue.StartToEnd) {
                        items.remove(id)
                        true
                    } else false
                }
            )

            AnimatedVisibility(
                visible = items.contains(id),
                enter = fadeIn()
            ) {
                androidx.compose.material3.SwipeToDismissBox(
                    state = dismissState,
                    backgroundContent = {
                        val color = Color(0xFFE5484D)
                        Box(
                            modifier = Modifier
                                .fillMaxSize()
                                .clip(RoundedCornerShape(8.dp))
                                .background(color)
                                .padding(horizontal = 20.dp),
                            contentAlignment = Alignment.CenterEnd
                        ) {
                            Icon(Icons.Default.Delete, contentDescription = "Delete", tint = Color.White)
                        }
                    },
                    content = {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(8.dp))
                                .background(colors.surface)
                                .padding(16.dp)
                        ) {
                            Text("Swipeable Item $id", color = colors.text)
                        }
                    },
                    modifier = Modifier.padding(bottom = 8.dp).testTag("swipe-$id")
                )
            }
        }
    }
}

@Composable
fun ButtonsSection(onShowDialog: () -> Unit, onShowSheet: () -> Unit, onShowToast: () -> Unit) {
    val colors = LocalPulseColors.current
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceEvenly
    ) {
        Button(onClick = onShowDialog, colors = ButtonDefaults.buttonColors(containerColor = colors.primary), modifier = Modifier.testTag("btn-dialog")) {
            Text("Dialog", color = Color.White)
        }
        Button(onClick = onShowSheet, colors = ButtonDefaults.buttonColors(containerColor = colors.primary), modifier = Modifier.testTag("btn-sheet")) {
            Text("Sheet", color = Color.White)
        }
        Button(onClick = onShowToast, colors = ButtonDefaults.buttonColors(containerColor = colors.primary), modifier = Modifier.testTag("btn-toast")) {
            Text("Toast", color = Color.White)
        }
    }
}

@Composable
fun ShimmerBodyText(body: String) {
    val colors = LocalPulseColors.current
    var showBody by remember { mutableStateOf(false) }

    LaunchedEffect(Unit) {
        delay(1500)
        showBody = true
    }

    AnimatedContent(
        targetState = showBody,
        transitionSpec = {
            fadeIn(tween(PulseMotion.baseDuration)).togetherWith(fadeOut(tween(PulseMotion.baseDuration)))
        }
    ) { isLoaded ->
        if (isLoaded) {
            Text(body, color = colors.text, style = MaterialTheme.typography.bodyLarge)
        } else {
            Column(modifier = Modifier.testTag("shimmer"), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                val infiniteTransition = rememberInfiniteTransition()
                val offset by infiniteTransition.animateFloat(
                    initialValue = 0f,
                    targetValue = 1000f,
                    animationSpec = infiniteRepeatable(
                        animation = tween(1200, easing = LinearEasing),
                        repeatMode = RepeatMode.Restart
                    )
                )

                val brush = Brush.linearGradient(
                    colors = listOf(colors.surfaceAlt, colors.outline, colors.surfaceAlt),
                    start = Offset(offset, 0f),
                    end = Offset(offset + 200f, 0f)
                )

                Box(modifier = Modifier.fillMaxWidth().height(24.dp).clip(RoundedCornerShape(4.dp)).background(brush))
                Box(modifier = Modifier.fillMaxWidth().height(24.dp).clip(RoundedCornerShape(4.dp)).background(brush))
                Box(modifier = Modifier.fillMaxWidth(0.7f).height(24.dp).clip(RoundedCornerShape(4.dp)).background(brush))
            }
        }
    }
}
