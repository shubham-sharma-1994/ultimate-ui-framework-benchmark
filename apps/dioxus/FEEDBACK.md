# Dioxus Developer Feedback

- Setting up Dioxus was relatively straightforward for Web and Desktop using the CLI and `dx` command.
- Standard CSS handling makes porting UI styles very fast, mapping almost 1:1 with generic React/Vue logic.
- Dioxus routing (`dioxus-router`) is type-safe and very convenient.
- Lacking built-in advanced transition support means many layout animations like Shared Element Transitions have to be heavily approximated.
- Dioxus 0.6 does not seem to easily support raw DOM element bindings for things like "shake" without dropping down to web-sys directly, so raw `eval` scripts are used where appropriate to simulate it without heavy FFI.
- Target split dependencies needed specific manual tuning in `Cargo.toml`. E.g., `web-sys` causes problems on desktop if not gated.
- Dioxus Desktop relies on Tao/Wry (webview), which failed compilation easily when compiling indiscriminately for WASM if the features were not gated correctly.

## Round 2

- Since round 1 was only a "Hello World" stub, the entire application was built from scratch in round 2.
- The `dioxus::document::eval` escape hatch proved invaluable for interacting directly with the DOM when native bindings fell short. For example, the parallax scrolling effect (C09) was easily solved by injecting a raw JS event listener to modify CSS transforms on scroll.
- Managing asynchronous tasks across platforms in Dioxus requires careful attention. WebAssembly requires `gloo-timers`, whereas native targets (Windows Desktop and Android) need `tokio`. Conditionally compiling these based on `target_arch` was necessary to ensure cross-platform compatibility.
- The application relies heavily on standard CSS for animations (staggered lists, hover states, basic transitions), taking advantage of Dioxus's webview-based rendering model.
- Building for Android via `dx build --platform android` was configured for the CI but remains difficult to run locally without a full NDK setup on Linux environments.
