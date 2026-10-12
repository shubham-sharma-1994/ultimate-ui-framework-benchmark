# Compose Multiplatform: Developer Feedback

Building the Pulse app using Compose Multiplatform (Kotlin) was an overall excellent, but occasionally nuanced, experience. Since its core premise relies on Skia (drawing its own pixels) rather than wrapping native views, the outcome across Android, Desktop, and Web (Wasm) is shockingly identical.

## What was easy
- **UI Consistency:** Because it draws on its own canvas, writing the UI once in `commonMain` worked natively across all targets without any weird layout inconsistencies.
- **Animations:** The Compose animation APIs (`animateFloatAsState`, `AnimatedVisibility`, `AnimatedContent`) are powerful and deeply integrated. Implementing spring physics, custom cubic-bezier curves, and state-driven motion was incredibly simple.
- **Custom Drawing:** Using the `Canvas` composable to build the orbit animation and progress ring felt like writing standard high-performance graphics code. The APIs map nicely to common concepts (paths, arcs, circles).
- **Theming:** Passing down custom colors that animate on theme switch via `CompositionLocalProvider` was nearly effortless and required zero changes to individual components.

## What was hard / awkward
- **Shared Element Transitions:** True shared-element transitions (like flying the thumbnail from Page 1 to Page 2 during a route change) are historically tricky in Compose. While Android has some experimental APIs (`LookaheadScope`, `SharedTransitionLayout`), doing this fully multi-platform without a robust third-party routing library (like Voyager or Decompose) is practically unattainable for a simple benchmark. We skipped it and approximated it with slide/fade page transitions.
- **Routing & Deep Links:** Compose Multiplatform does not yet provide a fully standardized, multi-platform out-of-the-box navigation router that syncs with browser URLs for Web, back stacks for Android, and window states for Desktop. To avoid heavy third-party dependencies, we relied on simple state hoisting (`var currentItem`), meaning we lose out on deep-linking and browser back button support on Web.
- **Wasm Ecosystem:** The Wasm target is relatively new. While Compose itself works flawlessly, reading local JSON files via the experimental `Res` Resource API requires some boilerplate and specific Gradle setup compared to the more mature Android resource handling.

## Build and CI Tooling
The Kotlin Multiplatform Gradle plugin is powerful but incredibly verbose and prone to configuration cache issues or weird JVM mismatch problems on fresh environments. Setting up the CI was straightforward thanks to Gradle wrappers, but compiling the Web (Wasm) target is slow, and assembling Desktop distributions requires specific underlying OS tools (e.g., `jpackage`, Wix/WiX toolset for Windows).

## Pros & Cons

**Pros:**
- "Write once, run everywhere" is a reality for UI and animations.
- Expressive, type-safe declarative UI driven by Kotlin.
- Strong Material 3 component library built-in.
- High performance, smooth 60fps animations due to direct Skia rendering.

**Cons:**
- Gradle builds can be complex and slow.
- Lacks a standard, robust cross-platform navigation library out of the box.
- Wasm target is still maturing, resulting in larger bundle sizes compared to native DOM frameworks.
