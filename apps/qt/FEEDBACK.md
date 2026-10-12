# Qt QML / C++ Developer Feedback

Building "Pulse" in Qt Quick (QML) highlighted both the immense power of Qt's declarative UI system and some of its structural rigidities when attempting to clone a highly specific, Flutter/Material-3-centric design verbatim.

## What was easy
- **Property Bindings and Reactive UI:** Creating a global `Theme` singleton and having the entire app instantly react to dark/light mode toggling is trivially easy in QML. You simply define a color property binding, add a `Behavior` block, and Qt handles the interpolation without an explicit animation controller.
- **Physics and Core Animations:** `SpringAnimation` and standard `NumberAnimation` are built-in, performant, and simple to apply. Implementing the draggable physics card or the modal entry/exit transitions felt natural.
- **Data Binding:** Loading `data.json` via a quick `XMLHttpRequest` (or C++ backend if desired) and passing it to a `Repeater` or `StackView` page was straightforward.

## What was hard or awkward
- **Hero / Shared Element Transitions:** Qt Quick's `StackView` is powerful for basic push/pop page transitions, but it does not have an out-of-the-box system for "Hero" animations (morphing an element from Page 1 into Page 2 across the routing boundary). Implementing this manually in QML requires significant scaffolding (re-parenting items to a global overlay, calculating absolute screen coordinates, and manually animating them while the route transitions). For a moderate-effort build, this had to be skipped.
- **Custom Canvas Drawing:** While `Canvas` exists in QML, it can be somewhat heavy, and QML strongly prefers using Scene Graph nodes (custom C++ `QQuickItem` drawing). Writing the orbit and progress ring in JavaScript `Canvas` inside QML works but isn't as performant or idiomatic as writing a custom C++ painter.
- **Material Specifics:** Qt provides `QtQuick.Controls.Material`, but overriding the intricate behaviors (like floating text labels on inputs) to match exact specifications often requires re-writing the component's `contentItem` and `background` entirely.
- **Staggered Animations:** Firing sequential animations for list items upon appearance required setting up individual timers per index. QML lacks a declarative `StaggeredEntrance` container out of the box.

## Tooling and CI
- **CMake and Qt6:** The transition to CMake in Qt 6 is excellent. Building the project was fairly standard.
- **CI Environments:** Using `jurplel/install-qt-action` makes GitHub Actions viable, but compiling Qt projects (especially for Android and WebAssembly) takes significant time and bandwidth in CI due to the massive size of the Qt SDK. Caching is absolutely vital here.

## Pros & Cons
**Pros:**
- Incredible performance on desktop/embedded via Scene Graph.
- QML's declarative syntax + property bindings make state management very clean.
- Genuine write-once, run-anywhere (including WebAssembly, iOS, Android, Desktop, Embedded).
- Excellent built-in easing curves and physics (Springs).

**Cons:**
- Missing out-of-the-box "modern" app transition patterns like shared-element routing.
- The default component sets can be difficult to micro-style without rebuilding them from scratch.
- The SDK footprint and build times are significantly heavier than web frameworks.

## Round 2

- **WebAssembly Integration (C16):** Implementing history navigation for WebAssembly targets in Qt required breaking out of QML/C++ and writing direct Emscripten JavaScript callbacks (`EM_ASM`). This is quite powerful since Qt sets up the Emscripten environment well, but it adds boilerplate to connect JS `popstate` events to C++ signals, and then back up to QML's `StackView` to pop the router. It highlights that for standard web features (like back button), Qt Wasm apps feel more like embedded canvas elements than standard web apps unless manually wired up.
- **Hero Animations (C04):** QML's `StackView` does not have a native "shared element transition" API. Approximating the hero flight required creating a global, absolutely-positioned `Rectangle` overlay on the root `Window`, grabbing coordinates via `mapToItem`, animating it manually in parallel to the `StackView` push transition, and then swapping visibilities. This is cumbersome and manual compared to frameworks that have native Hero widgets, but it's achievable given QML's declarative animations.
- **WebAssembly CI Tooling:** Setting up reliable WebAssembly CI with Qt requires downloading heavy toolchains, and the standard action (`jurplel/install-qt-action`) can fail sporadically (e.g. XML parsing errors when fetching archives). Disabling the cache for Wasm target helps alleviate state corruption in the CI environment.
