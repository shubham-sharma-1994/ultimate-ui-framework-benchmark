# Pulse App — Developer Feedback: Avalonia UI

Building the Pulse app in Avalonia UI highlighted the framework's strengths as a true pixel-perfect, cross-platform UI toolkit, but also revealed some of its architectural rigidities when trying to replicate highly fluid, mobile-first micro-interactions.

## What was easy
- **Pixel-Perfect Canvas**: Because Avalonia uses Skia (or its own composition engine) under the hood and draws its own widgets, achieving identical visual fidelity across Windows, Web (WASM), and Android is incredibly straightforward. You don't have to fight native platform bugs; if you set an elevation shadow or a specific border radius, it renders identically everywhere.
- **Styling and Theming**: Setting up the custom tokens (`App.axaml`) and utilizing `DynamicResource` made theming very natural. Switching the entire app's theme at runtime with `RequestedThemeVariant` is fully supported and works instantly without needing third-party libraries.
- **MVVM Integration**: Coupling Avalonia with `CommunityToolkit.Mvvm` makes structuring the data layer, commands, and logic trivial and type-safe.

## What was hard / awkward
- **Complex UI Animations**: Implementing the specific spec requirements (like Hero shared-element flights, parallax collapsing headers, and drag-spring-physics) is notoriously difficult in a pure XAML/MVVM paradigm. Avalonia provides `Transitions` and `KeyFrame` animations, but they are relatively basic compared to Flutter or React Native Reanimated. We had to skip or approximate shared-element transitions and gesture-driven animations, as writing them would require dropping down into low-level pointer handling and math, which violates the "moderate effort" constraint.
- **Missing "Mobile" Paradigms**: Out of the box, Avalonia relies on traditional desktop paradigms. While things like `TransitioningContentControl` exist, mobile-standard behaviors like Swipe-to-Dismiss or bottom sheets require writing entirely custom controls or relying on overlays.
- **Boilerplate**: Doing manual custom painting (like the `OrbitControl` and `ProgressRingControl`) is well-supported via overriding `Render(DrawingContext context)`, but manipulating vectors directly in C# code without a declarative graphics language is verbose.

## Performance / Quality Concerns
- The Web (WASM) target takes a significantly longer time to compile and the initial load payload is heavy compared to pure JS frameworks, though execution is fast once loaded.
- C# `DispatcherTimer` manual animation loops (used for the `OrbitControl`) may suffer from slight jitter compared to native Composition animations if the UI thread gets blocked.

## Pros
- True "write once, run anywhere" with guaranteed visual consistency.
- Excellent tooling in Rider/Visual Studio with XAML previewers.
- Very mature data-binding engine and typed ViewModel support.

## Cons
- XAML can be verbose.
- Lack of built-in modern, mobile-first gesture and layout choreography (hero transitions, advanced scroll-linking, physics-based springs).
- Steep learning curve for extending controls or writing complex behaviors from scratch compared to declarative UI frameworks.
