# Feedback: Fyne

## Pros
- **Single Codebase**: Go is a very pleasant language to write in, and Fyne's single codebase approach makes it very fast to spin up a desktop and mobile app simultaneously.
- **Fast compilation**: Go compiles incredibly quickly compared to many other toolchains (like Rust/Cargo or C++/CMake).
- **Tooling**: The `fyne` CLI is straightforward to use. `fyne package` abstracts away a lot of the pain of building for Android (APK) and Windows.

## Cons
- **Rigid UI Framework**: Fyne is very opinionated about how it draws its UI. It is extremely difficult to perfectly match a specific design spec (like custom gradients, floating labels, or specific padding/margins) without dropping down to the raw canvas and writing significant amounts of boilerplate.
- **Animations and Gestures**: Out of the box, Fyne lacks complex layout animations (like staggered list entrances or shared-element hero transitions) and complex gesture support (like swipe-to-dismiss or spring physics). Approximating these requires significant effort and custom math on the canvas.
- **Web Support**: Web support via WASM is still experimental and heavily reliant on WebGL, making it less robust than frameworks that compile to standard DOM elements.

## Ease of Use
- Very easy for internal tools or simple utilitarian apps where the default theme is acceptable.
- Poor for consumer-facing apps that demand high-fidelity design matching and fluid animations.

## Tooling / CI Pain Points
- Managing native dependencies (`libgl1-mesa-dev`, `xorg-dev`, Wayland headers) on headless CI environments (like Ubuntu runners) can be tricky to get right, as Fyne requires a working graphics stack to even initialize properly in some contexts.
