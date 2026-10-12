# Avalonia UI — NOTES
Version used: 11.0.6 · Language: C# · Rendering model: own canvas

## Targets
| Target | Status | Notes |
|---|---|---|
| Web | ✅ | WASM target, tested using `dotnet workload install wasm-tools` |
| Android | ⏭️ | Skipped due to local .NET SDK 10 preview workload conflicts preventing successful android builds. |
| Windows | ✅ | Standard Desktop build |

## Capabilities (see spec/DESIGN.md §9)
| ID | Status | Notes / how approximated / why skipped |
|---|---|---|
| C01 | ✅ | Custom `OrbitControl` doing manual draw with `DispatcherTimer`. Linear gradients used for Hero. |
| C02 | ⚠️ | Approximated where possible. Simple crossfades/property updates used for dynamic visual states since ImplicitAnimations are present in Avalonia but not perfectly suited for all complex timing constraints. |
| C03 | ⏭️ | Skipped staggered list entrance animation. Requires complex Behaviors or code-behind orchestration. Items display immediately. |
| C04 | ⏭️ | Skipped shared-element transition. Avalonia does not have a native shared element transition capability out of the box. Used simple crossfade routing. |
| C05 | ⚠️ | Approximated using `TransitioningContentControl` with `PageSlide` horizontal transition. Crossfade in opposite direction is simple slide. |
| C06 | ⏭️ | Skipped number switcher animation. Number just updates directly upon command. |
| C07 | ⏭️ | Skipped spring physics on draggable card. Handled as a static approximation layout due to pointer capture and math complexity. |
| C08 | ⚠️ | Skipped pointer drag swipe-to-dismiss gesture, replaced with simple "Dismiss" buttons per item. |
| C09 | ⏭️ | Skipped parallax collapsing header. Used fixed height gradient header instead. |
| C10 | ✅ | Custom `ProgressRingControl` using `StreamGeometry` and an explicit loop in ViewModel to animate the score text over time. |
| C11 | ✅ | Out of the box `Expander` control handles basic collapsible content. |
| C12 | ⚠️ | Approximated Dialog, Sheet, and Toast using fixed mock overlays and `IsVisible` bindings over the top of the app content, rather than real Window/Flyout popups, for cross-platform fidelity. |
| C13 | ⚠️ | Shimmer approximated using an overlay panel that hides after 1.5 seconds. No moving sweep animation. |
| C14 | ✅ | DynamicResource bindings used for all colors, updated natively via `RequestedThemeVariant` toggle. Interpolation is instantaneous rather than `slow`. |
| C15 | ⚠️ | Floating label approximated with Avalonia `TextBox.PlaceholderText` (watermark). |
| C16 | ⏭️ | Back navigation handled in-app. No deep links mapped to router. |
| C17 | ✅ | Mouse interactions and focus work out of the box in WASM/Windows. |
| C18 | ✅ | Used `AutomationProperties.AutomationId` across all relevant controls to act as test anchors. |

## Native (framework-brought differences)
- Native Avalonia ripple effects appear in FluentTheme by default.
- Font rendering is identical across platforms thanks to Avalonia's SKIA backend.

## Third-party packages used
- Newtonsoft.Json (for JSON deserialization)
- CommunityToolkit.Mvvm (for ViewModel base classes and RelayCommands)

## How to run / build
- **Windows**: `dotnet run --project Pulse.Desktop`
- **Web**: `dotnet workload install wasm-tools` then `dotnet run --project Pulse.Browser`
- **Android**: `dotnet build -t:Run -f net8.0-android --project Pulse.Android`
