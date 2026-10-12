# .NET MAUI Developer Feedback

## Ease of Use & Tooling
Building a highly custom, spec-faithful design like "Pulse" in .NET MAUI out-of-the-box is **difficult and verbose**. MAUI is heavily geared towards mapping XAML definitions to platform-native controls. The moment you need to deviate from native paradigms (like custom app bars, specific custom animations, springs, shared element transitions), you have to fight the framework.
The tooling is generally okay if you live inside Visual Studio on Windows, but using the `dotnet` CLI in a Linux/sandbox environment is fraught with workload mismatch issues and compilation errors related to `wasm-tools` or other hidden dependencies.

## Animations and Motion
MAUI fundamentally lacks the concept of declarative or implicit animations that frameworks like SwiftUI or Flutter possess. To achieve animations, you must drop into code-behind and manually trigger `FadeTo`, `TranslateTo`, and `ScaleTo` methods using `Task.Delay` and async/await. This makes building rich, motion-heavy UIs extremely imperative and prone to spaghetti code. Spring physics do not exist natively; you have to fake them using basic custom easing curves (`Easing.SpringOut`), which doesn't allow for mass/stiffness configuration.

## Custom Graphics (IDrawable)
The `Microsoft.Maui.Graphics` API (`IDrawable`) is actually quite good and performant. Building the custom `Orbit` and `ProgressRing` was straightforward, provided you understand how to trigger redraws (`Invalidate()`) using a custom `IDispatcherTimer`.

## Capabilities Out-of-the-Box
Many modern mobile patterns require third-party libraries in the MAUI ecosystem (specifically the `CommunityToolkit.Maui`). Without it:
- There are no native Bottom Sheets.
- There are no native Toasts/Snackbars.
- There are no simple Hero/Shared-Element transitions.
- There are no true floating-label text inputs (Material style).

## Pros & Cons
**Pros:**
- True native controls mapping (when you want them).
- C# and .NET ecosystem is powerful and familiar to enterprise developers.
- `Microsoft.Maui.Graphics` is a solid 2D drawing API.

**Cons:**
- Very weak out-of-the-box animation system.
- Highly imperative UI manipulation for anything dynamic.
- Missing crucial modern UI components (Bottom Sheets, Toasts).
- CLI tooling and workload management on non-Windows machines is extremely brittle.
