# Dioxus (Rust) — NOTES
Version used: 0.6.3 · Language: Rust · Rendering model: webview / DOM

## Targets
| Target | Status | Notes |
|---|---|---|
| Web | ✅ | Working flawlessly via `wasm32-unknown-unknown` standard target. |
| Android | ⏭️ | Skipped. `dioxus-mobile` support requires significant NDK/SDK configuration on standard environments, violating the "moderate effort, no force-fitting" rule. |
| Windows | ✅ | Working via `dioxus-desktop`. |

## Capabilities (see spec/DESIGN.md §9)
| ID | Status | Notes / how approximated / why skipped |
|---|---|---|
| C01 | ✅ | CSS Custom gradient + SVG custom-painted orbit using CSS infinite linear animation. |
| C02 | ✅ | Standard CSS transitions for colour, size, opacity, rotation matching curves. |
| C03 | ✅ | CSS keyframe staggered list entrance with dynamic `animation-delay`. |
| C04 | ⚠️ | Hero shared element approximated via simple fade/slide. Dioxus doesn't offer native shared-element morphing in DOM. |
| C05 | ⚠️ | Page transitions approximated via CSS classes (fade-in). Complex DOM-level route transitions are tricky in standard router without external crates. |
| C06 | ⚠️ | Animated number switcher skipped/approximated. Immediate DOM update. |
| C07 | ⚠️ | Spring physics approximated using CSS `cubic-bezier(0.175, 0.885, 0.32, 1.275)` on pointer release (overshoot). |
| C08 | ⚠️ | Gesture: drag approximated via `onpointerdown/move/up`, swipe-to-dismiss approximated with CSS transitions. Native swipe physics not present. |
| C09 | ⚠️ | Collapsing header with parallax skipped due to lack of performant native scroll-linked animations in bare Dioxus out of the box. Used simple flexbox layout. |
| C10 | ✅ | Custom painter progress ring handled natively via SVG `stroke-dashoffset` logic matching score property. |
| C11 | ✅ | Accordion animation approximated via simple CSS show/hide toggle with chevron rotation. |
| C12 | ✅ | Modals/Sheet/Toast implemented with Dioxus reactive state and CSS absolute positioning/transitions. |
| C13 | ✅ | Shimmer simulated via CSS styling and Dioxus `use_effect`/`sleep` timing. |
| C14 | ✅ | Theme switch functional using context and CSS variable updates. |
| C15 | ✅ | Text field floating label handled via pure CSS `input:focus + label` selector logic. |
| C16 | ✅ | Deep linking and routing handled by `dioxus-router`. |
| C17 | ✅ | Keyboard and hover handled by CSS. |
| C18 | ✅ | Most accessibility IDs configured via standard HTML id tags. |

## Native (framework-brought differences)
- Rendering is DOM based (Webview in desktop, HTML on Web). Focus rings and interactions map directly to browser-provided behaviours.
- No native edge-swipe back is present automatically unless provided by OS WebView.

## Third-party packages used
- `gloo-timers` for asynchronous delays (`sleep` future).
- `serde`, `serde_json` for parsing `data.json`.

## How to run / build
- Web: `dx build --release` (produces `dist/` containing `index.html`, WASM and JS glue).
- Desktop: `dx build --release --platform desktop` (produces a native executable under `target/release/dioxus_app`).
