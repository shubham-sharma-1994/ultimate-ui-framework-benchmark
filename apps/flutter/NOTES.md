# Flutter — NOTES
Version used: Flutter 3.24.0 (Dart 3.5.0) · Language: Dart · Rendering model: own canvas (Impeller/Skia)

## Targets
| Target | Status | Notes |
|---|---|---|
| Web | ✅ | Uses CanvasKit renderer for consistent fidelity |
| Android | ✅ | Full out-of-the-box support |
| Windows | ✅ | Full out-of-the-box support |

## Capabilities (see spec/DESIGN.md §9)
| ID | Status | Notes / how approximated / why skipped |
|---|---|---|
| C01 | ✅ | Standard `LinearGradient` and `CustomPainter` with explicit `AnimationController`. |
| C02 | ✅ | Achieved via explicit `AnimationController`, `AnimatedBuilder`, and `AnimatedSwitcher`. |
| C03 | ✅ | Achieved manually combining `Future.delayed` offset starts mapped to item index, leveraging `SlideTransition` and `FadeTransition`. |
| C04 | ✅ | Standard `Hero` widget, modified the flightShuttleBuilder to draw the gradient continuously. |
| C05 | ✅ | Implemented via custom `PageRouteBuilder` to control forward and reverse slide + fade transition sequences. |
| C06 | ✅ | Standard `AnimatedSwitcher` + custom `SlideTransition`. |
| C07 | ✅ | Integrated standard `SpringSimulation` to manually update Offset position on drag end. |
| C08 | ✅ | Provided directly via `GestureDetector` (onLongPress/onPanUpdate) and `Dismissible` (swipe-to-dismiss). |
| C09 | ✅ | Setup using `SliverAppBar` nested in `CustomScrollView`, manually mapping flexible offset heights to parallax scaling. |
| C10 | ✅ | Standard `CustomPainter` driving the Sweep gradient based on score + an animated counter mapped natively. |
| C11 | ✅ | Animated properties in custom `SizeTransition`. |
| C12 | ✅ | Default Material implementations mapped natively (`showDialog`, `showModalBottomSheet`, `ScaffoldMessenger.showSnackBar`). |
| C13 | ✅ | LinearGradient mapped into `ShaderMask`, swept using continuous loop offset. |
| C14 | ✅ | Set up an `AnimatedTheme` provider interpolating over `AppMotion.slow` duration. |
| C15 | ✅ | Standard Material `TextField` auto-floats labels. |
| C16 | ✅ | Mapped directly in `MaterialApp.onGenerateRoute` for Web URL navigation, keeping platform back navigation. |
| C17 | ✅ | Available inherently in native widgets. |
| C18 | ✅ | Implemented via mapping ids to standard `Key` definitions readable via standard `find.byKey`. |

## Native (framework-brought differences)
- Out of the box Material Design provides rich platform-matched gesture fidelity (overscroll stretch/bounce, ink ripples).
- Text rendering is strictly controlled by Skia/Impeller layout matching pixel design.
- Edge-swipe back is natively tied into Cupertion/Material routing boundaries by default.

## Third-party packages used
- flutter_svg (needed if logo requires rendering, though only static assets bundled currently).

## How to run / build
- Run: `flutter run -d chrome` (or target android/windows)
- Build: `flutter build web --web-renderer canvaskit` (or `apk`, `windows`)
