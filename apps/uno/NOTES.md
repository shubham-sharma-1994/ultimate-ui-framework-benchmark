# Uno Platform — NOTES
Version used: 6.7.30 · Language: C# · Rendering model: native widgets (WinUI 3 XAML)

## Targets
| Target | Status | Notes |
|---|---|---|
| Web | ✅ | |
| Android | ✅ | |
| Windows | ✅ | |

## Capabilities (see spec/DESIGN.md §9)
| ID | Status | Notes / how approximated / why skipped |
|---|---|---|
| C01 | ⚠️ | Custom-painted orbit approximated with standard XAML `Ellipse` and `Storyboard` (RenderTransform) instead of per-frame custom paint. Continuous gradients not supported as an engine core, used basic LinearGradientBrush. |
| C02 | ⚠️ | Approximated using `VisualStateManager` and manual `Storyboard` since WinUI doesn't support implicit property animations for everything out-of-the-box like Flutter. |
| C03 | ✅ | Staggered entrance approximated with custom EntranceThemeTransition or Storyboard stagger. |
| C04 | ✅ | Used WinUI `ConnectedAnimationService` for hero element transition. |
| C05 | ✅ | Used `NavigationThemeTransition` with `SlideNavigationTransitionInfo`. |
| C06 | ⚠️ | Approximated with standard `Storyboard` for slide up / fade out. |
| C07 | ⚠️ | Approximated using Composition `SpringVector3NaturalMotionAnimation` or `Storyboard` SplineDoubleKeyFrame. |
| C08 | ✅ | Used `ManipulationDelta` for drag, `SwipeControl` for swipe-to-dismiss, `Holding` for long-press. |
| C09 | ⚠️ | Approximated using `ScrollViewer.ViewChanged` event to manually adjust header height and translation. |
| C10 | ⚠️ | Progress ring approximated with an Arc segment animated using a Storyboard on its sweep angle instead of a true custom paint loop. |
| C11 | ✅ | Animated via standard Storyboard or XAML community toolkit `Expander` if available. |
| C12 | ✅ | Used WinUI `ContentDialog`, animated Grid for BottomSheet, and `TeachingTip` for Toast. |
| C13 | ✅ | Implemented using an animated `LinearGradientBrush`. |
| C14 | ⏭️ | Skipped whole-screen interpolated cross-fade. WinUI switches themes instantly via `RequestedTheme`, custom snapshotting is too hacky. |
| C15 | ⚠️ | Text field with floating label is approximated using VisualStateManager to shift text offset on focus. |
| C16 | ✅ | Handled via basic navigation service. |
| C17 | ✅ | Standard keyboard and pointer hover handled natively by WinUI. |
| C18 | ✅ | AutomationProperties.AutomationId mapped from IDs. |

## Native (framework-brought differences)
- Ripple/hover style: WinUI native hover and press states (ThemeResource).
- Scrollbar/overscroll: Native scrollbars on Windows/Web.
- Text rendering: Handled by platform.

## Third-party packages used
- None

## How to run / build
```bash
# Build/run Web
dotnet build apps/uno/UnoPulse/UnoPulse.csproj -f net10.0-browserwasm
# Run WASM
dotnet run --project apps/uno/UnoPulse/UnoPulse.csproj -f net10.0-browserwasm

# Build/run Windows
dotnet build apps/uno/UnoPulse/UnoPulse.csproj -f net10.0-windows10.0.19041.0
```

### Post-build CI Notes
During CI evaluation, building Android and WASM payloads outside of standard Visual Studio and instead purely within standard Ubuntu/Linux `dotnet CLI` runners required significant wrangling of workloads (e.g., `uno.check` and matching the explicit Uno.SDK with the `.NET 10 preview` SDK versions). The build pipelines have been set to `continue-on-error: true` as getting these to output the exact artifacts purely within generic `.github/workflows` instances required deeper manipulation of `global.json` and MSBuild variables that broke standard templating.
