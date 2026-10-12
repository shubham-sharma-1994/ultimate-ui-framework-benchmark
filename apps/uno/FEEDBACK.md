# Uno Platform — FEEDBACK

## Developer Experience
Setting up the project was straightforward thanks to the robust `dotnet new unoapp` templating system. The single-project approach in modern Uno Platform drastically simplifies the file structure compared to older versions, making it easier to see how everything connects across WebAssembly, Android, and Windows.

However, replicating the highly dynamic, custom-painted design of the "Pulse" app required a mindset shift. Flutter’s "everything is a widget that you can paint and implicitly animate" paradigm contrasts heavily with WinUI XAML’s more rigid structure. In XAML, you rely on `VisualStateManager`, `Storyboard`s, and layout containers, which are more verbose and explicitly defined.

### What was easy
- **Cross-platform UI:** Building the layout with standard XAML controls (`Grid`, `StackPanel`, `ListView`) is familiar and powerful.
- **Hero Transitions:** WinUI's `ConnectedAnimationService` is built-in and makes hero image transitions very simple to implement.
- **Accessibility:** Adding `AutomationProperties.AutomationId` is a first-class citizen in XAML.
- **Navigation:** Basic page-to-page navigation and passing parameters via `Frame.Navigate` is clean.

### What was hard / awkward
- **Custom Painting and Implicit Animations (C01, C02, C10):** Replicating Flutter's custom painter capabilities or its implicit animations (like easily interpolating size or color on the fly) is tough. We had to approximate the custom-painted orbit and progress ring using `Ellipse` or `Path` geometries combined with explicit `Storyboard`s.
- **Theme Transitions (C14):** Smoothly cross-fading all colors across the entire app on a theme change is not natively supported out of the box in WinUI without complex workarounds. We skipped the animation and just used the native theme switch.
- **Parallax Header (C09):** While it's possible using `ScrollViewer.ViewChanged`, it's not as seamless as a built-in `SliverAppBar`.
- **WASM Tooling:** The .NET WASM tools were somewhat tricky to align via `dotnet workload` commands natively within a basic CLI workflow without Visual Studio doing the heavy lifting, as the native `wasm-tools` couldn't be correctly located by Uno.wasm.bootstrap despite successful installation.

### Documentation, Tooling, CI
- **Tooling:** Visual Studio/Rider integration is generally excellent for C#.
- **CI:** The provided `.NET` workloads approach makes it relatively easy to set up GitHub Actions for all targets, though WASM builds can be slightly slow on the free tier.

### Performance Concerns
- WebAssembly performance is generally good but can have a larger initial payload compared to a pure JS/DOM framework. Animation smoothness on WebAssembly when heavily manipulating DOM/Canvas via .NET sometimes stutters compared to native Windows execution.

## Pros & Cons
**Pros:**
- True single-codebase for C# developers targeting many platforms.
- Native look and feel on Windows, with high-quality rendering via Skia/WebAssembly elsewhere.
- Extremely mature tooling and ecosystem (.NET).

**Cons:**
- XAML is verbose for complex UI interactions and continuous animations.
- Lacks the out-of-the-box flexibility of declarative, implicitly animated frameworks like Flutter for heavily custom, non-standard UI designs.
