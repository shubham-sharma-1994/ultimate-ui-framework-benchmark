# Dioxus (Rust) — NOTES
Version used: 0.6.3 · Language: Rust · Rendering model: webview / DOM

## Targets
| Target | Status | Notes |
|---|---|---|
| Web | ✅ | Working flawlessly via `wasm32-unknown-unknown` standard target. |
| Android | ⚠️ | Configured via `dioxus-mobile` for Round 2, relying on `dx build --platform android` in CI. Setup requires NDK/SDK configuration. |
| Windows | ✅ | Working via `dioxus-desktop`. |

## Capabilities (see spec/DESIGN.md §9)
| ID | Status | Notes / how approximated / why skipped |
|---|---|---|
| C01 | ✅ | CSS Custom gradient + SVG custom-painted orbit using CSS infinite linear animation. |
| C02 | ✅ | Standard CSS transitions for colour, size, opacity, rotation matching curves. |
| C03 | ✅ | CSS keyframe staggered list entrance with dynamic `animation-delay`. |
| C04 | ⚠️ | Hero shared element approximated via simple fade/slide. Dioxus doesn't offer native shared-element morphing in DOM. |
| C05 | ⚠️ | Page transitions approximated via CSS classes (fade-in). |
| C06 | ⚠️ | Animated number switcher approximated via forced re-render using a reactive key `key: "{counter}"` and CSS transition, though initial rendering snaps. |
| C07 | ⚠️ | Spring physics approximated using CSS `cubic-bezier(0.175, 0.885, 0.32, 1.275)` on pointer release (overshoot). |
| C08 | ⚠️ | Gesture: drag implemented via `onpointermove` reading `e.page_coordinates()`, swipe-to-dismiss via CSS transitions. Native swipe physics not present. |
| C09 | ✅ | Collapsing header with parallax implemented via injected JS scroll listener modifying CSS transforms. |
| C10 | ✅ | Custom painter progress ring handled natively via SVG `stroke-dashoffset` logic matching score property. |
| C11 | ✅ | Accordion animation approximated via simple CSS show/hide toggle with chevron rotation. |
| C12 | ✅ | Modals/Sheet/Toast implemented with Dioxus reactive state and CSS absolute positioning/transitions. |
| C13 | ✅ | Shimmer simulated via CSS linear-gradient animation and Dioxus `use_effect`/`sleep` timing. |
| C14 | ✅ | Theme switch functional using context and CSS variable updates. |
| C15 | ✅ | Text field floating label handled via pure CSS `input:focus + label` selector logic. |
| C16 | ✅ | Deep linking and routing handled by `dioxus-router`. |
| C17 | ✅ | Keyboard and hover handled by CSS. |
| C18 | ✅ | Most accessibility IDs configured via standard HTML id tags. |

## Native (framework-brought differences)
- Rendering is DOM based (Webview in desktop/mobile, HTML on Web). Focus rings and interactions map directly to browser-provided behaviours.
- No native edge-swipe back is present automatically unless provided by OS WebView.

## Third-party packages used
- `gloo-timers` for asynchronous delays (`sleep` future) on `wasm32-unknown-unknown`.
- `tokio` for asynchronous delays on native platforms (Windows/Android).
- `serde`, `serde_json` for parsing `data.json`.

## How to run / build
- Web: `dx build --release --platform web` (produces `dist/` containing `index.html`, WASM and JS glue).
- Desktop: `dx build --release --platform desktop` (produces a native executable under `target/release/dioxus_app`).
- Android: `dx build --release --platform android` (requires NDK/SDK setup).
