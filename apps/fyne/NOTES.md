# Fyne — NOTES
Version used: 2.8.1 · Language: Go · Rendering model: own canvas

## Targets
| Target | Status | Notes |
|---|---|---|
| Web | ⚠️ | Fyne Web (WASM) is experimental. Configured with `continue-on-error: true` in CI. |
| Android | ✅ | Supported via `fyne package -os android`. |
| Windows | ✅ | Supported via `fyne package -os windows`. |

## Capabilities (see spec/DESIGN.md §9)
| ID | Status | Notes / how approximated / why skipped |
|---|---|---|
| C01 | ⚠️ | Approximated. Fyne doesn't have an out-of-the-box orbit animation widget or a linear gradient canvas object that seamlessly supports animation without custom rendering loop, so fell back to solid colour headers. |
| C02 | ⚠️ | Approximated. Some implicit animations like widget hover and simple transitions exist, but comprehensive shared element transitions are not supported. |
| C03 | ⏭️ | Skipped. Staggered list entrances are not built-in and require complex manual canvas animation. |
| C04 | ⏭️ | Skipped. Hero shared-element transition between pages is not supported out of the box. |
| C05 | ⚠️ | Approximated. Simple page replacement used; sliding page transitions are not native to Fyne's layout model. |
| C06 | ⏭️ | Skipped. Number switcher animation is not a standard widget, used simple text update. |
| C07 | ⏭️ | Skipped. Spring physics and draggable cards are skipped due to complexity in recreating physics-based gestures on generic canvas objects. |
| C08 | ⏭️ | Skipped. Swipe-to-dismiss list items are not a standard Fyne widget. |
| C09 | ⏭️ | Skipped. Collapsing header with parallax requires custom scroll view extensions which are non-trivial. |
| C10 | ⚠️ | Approximated using a standard progress bar instead of a custom painted ring. |
| C11 | ⚠️ | Approximated using a VBox that hides/shows its content, no smooth height animation. |
| C12 | ⚠️ | Approximated. Used Fyne's native `dialog.NewInformation`, but Bottom Sheet and Toast are skipped as they are not standard widgets. |
| C13 | ⏭️ | Skipped. Shimmer effect is not available out of the box. |
| C14 | ⚠️ | Approximated. Theme switch works but transitions instantly, not animated. |
| C15 | ⚠️ | Approximated. Text field used standard placeholder, floating label not supported natively. |
| C16 | ⏭️ | Skipped. Deep link routing is not implemented; basic stack navigation used. |
| C17 | ✅ | Fyne supports keyboard focus and hover states automatically. |
| C18 | ⚠️ | Approximated. Fyne has some a11y support but setting specific test IDs on standard widgets is limited. |

## Native (framework-brought differences)
- Standard Fyne widgets (Buttons, Inputs, Sliders, Checkboxes) have a distinct look and feel that overrides the exact visual design of the spec.
- Scrolling physics and hover effects are Fyne's default.

## Third-party packages used
- None

## How to run / build
- Local: `go run .`
- Android: `fyne package -os android -appID com.example.pulsefyne`
- Windows: `fyne package -os windows`
- Web (WASM): `fyne package -os wasm`
