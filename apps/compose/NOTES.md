# Compose Multiplatform — NOTES
Version used: 1.6.10 · Language: Kotlin 1.9.23 · Rendering model: own canvas

## Targets
| Target | Status | Notes |
|---|---|---|
| Web | ✅ | Wasm target using Compose HTML/Canvas rendering |
| Android | ✅ | Standard Compose for Android |
| Windows | ✅ | Desktop JVM target using Compose for Desktop |

## Capabilities (see spec/DESIGN.md §9)
| ID | Status | Notes / how approximated / why skipped |
|---|---|---|
| C01 | ✅ | Custom gradient & Canvas drawing for orbit works natively |
| C02 | ✅ | `animateColorAsState` & `animateDpAsState` |
| C03 | ✅ | Staggered entrance using Coroutine `delay()` and `LaunchedEffect` |
| C04 | ⚠️ | Approximated via custom page transitions (SharedElement transition is still experimental/complex for multiplatform routing) |
| C05 | ✅ | AnimatedContent with `slideInHorizontally` + `fadeIn` |
| C06 | ✅ | Used `AnimatedContent` for sliding number switcher with `slideInVertically` |
| C07 | ✅ | `spring()` animation spec in `animateOffsetAsState` |
| C08 | ✅ | Used `detectDragGestures` and `SwipeToDismissBox` |
| C09 | ✅ | Offset tracking via `ScrollState` and calculating Parallax translations |
| C10 | ✅ | Custom `Canvas` using `drawArc` for the progress ring |
| C11 | ✅ | `AnimatedVisibility` with `expandVertically` |
| C12 | ✅ | `AlertDialog` and `ModalBottomSheet` and `SnackbarHost` |
| C13 | ✅ | Infinite transition `animateFloat` used with a sweeping `Brush.linearGradient` |
| C14 | ✅ | Dynamic `CompositionLocalProvider` pushing animated colors via `animateColorAsState` |
| C15 | ✅ | `OutlinedTextField` natively floats labels |
| C16 | ⚠️ | Deep Link / Browser back navigation skipped on Wasm (requires third-party router library which is skipped to keep it simple & standard) |
| C17 | ✅ | Built-in hover/keyboard focus via standard interaction states |
| C18 | ✅ | `Modifier.testTag()` applied to elements |

## Native (framework-brought differences)
- Built-in material ripple effects for clicks are used out-of-the-box instead of custom ones.
- Scrollbars and edge-overscroll bounce come from platform default behavior in Compose.
- Focus rings on Desktop/Web rely on standard Compose interaction focus.

## Third-party packages used
- `org.jetbrains.kotlinx:kotlinx-serialization-json` for JSON parsing

## How to run / build
- Web (Run): `./gradlew wasmJsBrowserRun`
- Web (Build): `./gradlew wasmJsBrowserDistribution`
- Android (Build): `./gradlew assembleRelease`
- Desktop (Run): `./gradlew run`
- Desktop (Build): `./gradlew packageDistributionForCurrentOS`
