# Dioxus Developer Feedback

- Setting up Dioxus was relatively straightforward for Web and Desktop using the CLI and `dx` command.
- Standard CSS handling makes porting UI styles very fast, mapping almost 1:1 with generic React/Vue logic.
- Dioxus routing (`dioxus-router`) is type-safe and very convenient.
- Lacking built-in advanced transition support means many layout animations like Shared Element Transitions have to be heavily approximated.
- Dioxus 0.6 does not seem to easily support raw DOM element bindings for things like "shake" without dropping down to web-sys directly, so raw `eval` scripts are used where appropriate to simulate it without heavy FFI.
- Target split dependencies needed specific manual tuning in `Cargo.toml`. E.g., `web-sys` causes problems on desktop if not gated.
- Dioxus Desktop relies on Tao/Wry (webview), which failed compilation easily when compiling indiscriminately for WASM if the features were not gated correctly.
