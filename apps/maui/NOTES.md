# .NET MAUI — NOTES
Version used: .NET 8.0 · Language: C# / XAML · Rendering model: Native Widgets with custom drawing via IDrawable

## Targets
| Target | Status | Notes |
|---|---|---|
| Web | ⏭️ | Native .NET MAUI does not support Web targets natively without Blazor WebAssembly wrappers which significantly breaks the scope/style. Skipped. |
| Android | ✅ | Supported natively. |
| Windows | ✅ | Supported via WinUI 3. |

## Capabilities (see spec/DESIGN.md §9)
| ID | Status | Notes / how approximated / why skipped |
|---|---|---|
| C01 | ✅ | Custom gradient on Border, custom-painted orbit using `IDrawable`. |
| C02 | ⚠️ | Approximated using `FadeTo`, `ScaleTo`, `TranslateTo` extension methods. MAUI doesn't have true "implicit" animations out of the box like Flutter. |
| C03 | ⚠️ | Staggered list entrance approximated by creating items, setting initial transforms/opacity, and using a `Task.Delay` loop to animate them sequentially. |
| C04 | ⚠️ | Hero / shared-element transition approximated using a custom Border clone animated over a root Grid to the destination size. True native shared elements are not natively supported out of the box. |
| C05 | ⚠️ | Page transition is native MAUI NavigationPage transition. Does not perfectly match the specific spec slide+fade, but provides standard reversible navigation. |
| C06 | ⚠️ | Animated number switcher approximated by manually cross-fading and translating two separate Labels inside a Grid. |
| C07 | ⚠️ | Spring physics approximated using a custom tick-based physics simulation via MAUI's `Animation` class. MAUI lacks a native true physics simulation engine out of the box. |
| C08 | ✅ | Gesture: drag (PanGestureRecognizer), long-press (simulated via Tapped due to lack of native LongPress), swipe-to-dismiss (SwipeView). |
| C09 | ⚠️ | Collapsing header with parallax approximated by subscribing to ScrollView.Scrolled and modifying TranslationY. |
| C10 | ✅ | Custom painter progress ring + count-up built using `IDrawable` and an `IDispatcherTimer`. |
| C11 | ✅ | Accordion height animation approximated by fading out content and collapsing visibility. Height animation specifically requires measure updates which are clunky in MAUI. |
| C12 | ⚠️ | Modal dialog implemented as a custom Grid overlay. Bottom sheet and Toast skipped as MAUI does not have native support for these without CommunityToolkit. |
| C13 | ⚠️ | Shimmer skeleton approximated via simple fade animation loop on BoxViews. |
| C14 | ⚠️ | Animated theme switch partially approximated. Colours switch immediately via `AppThemeBinding`, icon rotates and fades manually. |
| C15 | ⚠️ | Text field with floating label approximated by animating a Label above an Entry when focused. |
| C16 | ⚠️ | Deep link skipped for now due to complexity in basic MAUI without Shell routes. |
| C17 | ⚠️ | Hover states approximated using `PointerGestureRecognizer` to animate scale and opacity. Native key events for Windows are unsupported out of the box so true keyboard navigation is skipped. |
| C18 | ✅ | Accessibility labels / test ids set using `AutomationId`. |

## Native (framework-brought differences)
- MAUI uses native components per platform, so Ripple is Android-specific native behavior on Buttons, and hover states map to Windows pointer states.
- The `NavigationPage` uses native platform navigation bars, which we hid to implement the custom one.

## Third-party packages used
- None.

## How to run / build
**Note:** Compiling in a pure Linux CLI environment may fail due to workload incompatibilities. Use Visual Studio 2022 on Windows or a clean CI pipeline. MAUI Windows packaging in CI is also known to be fragile.

- `dotnet build -c Release -f net9.0-android`
- `dotnet build -c Release -f net9.0-windows10.0.19041.0`
