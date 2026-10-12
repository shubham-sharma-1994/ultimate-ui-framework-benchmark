# Slint — NOTES
Version used: 1.8.0 · Language: Rust · Rendering model: own canvas (Femtovg / Software)

## Targets
| Target | Status | Notes |
|---|---|---|
| Web | ✅ | Compiled to WASM via `cargo build --target wasm32-unknown-unknown` |
| Android | ⏭️ | Skipped due to complexity of headless Android SDK setup in this environment. Slint provides an android template via `cargo apk` or `cargo-ndk`. |
| Windows | ✅ | Compiled to native Windows executable. |

## Capabilities (see spec/DESIGN.md §9)
| ID | Status | Notes / how approximated / why skipped |
|---|---|---|
| C01 | ⚠️ | Approximated custom painted orbit using mathematical rotation on Rectangles. |
| C02 | ✅ | Used `animate` blocks. |
| C03 | ⚠️ | Staggered list entrance approximated using simultaneous fade+slide due to lack of index-based delay in `animate`. |
| C04 | ⏭️ | Shared-element transition skipped (Slint doesn't have a shared-element router). Replaced with slide/fade page transition. |
| C05 | ⚠️ | Page transition implemented using simple state routing and sliding x coordinates. |
| C06 | ⚠️ | Animated number switcher approximated without slide up/down fade effect. |
| C07 | ⚠️ | Spring physics approximated using `cubic-bezier(0.3, 1.5, 0.4, 1.0)` with overshoot. |
| C08 | ⚠️ | Drag/swipe approximated using `TouchArea` drag delta and manual bounds check. |
| C09 | ⚠️ | Collapsing header with parallax approximated as a static header block (parallax difficult to link to Flickable scroll offset natively in 1.8). |
| C10 | ⚠️ | Custom painter progress ring approximated with static borders. |
| C11 | ✅ | Accordion height animation implemented using `animate height` with `clip: true`. |
| C12 | ⏭️ | Modal/Sheet mockups are static blocks. |
| C13 | ⚠️ | Shimmer approximated using `animation-tick()` and linear gradients sliding across. |
| C14 | ✅ | Theme switch implemented with global Tokens state. |
| C15 | ⚠️ | Text field floating label skipped, used basic LineEdit. |
| C16 | ⏭️ | Deep link skipped, routed purely in-memory. |
| C17 | ✅ | Hover and keyboard focus supported natively by Slint controls. |
| C18 | ⏭️ | Accessibility IDs not fully populated for UI test driver. |

## Native (framework-brought differences)
- Slint brings its own controls (`std-widgets`) for `LineEdit`, `Slider`, `Switch`.
- Scroll bounce or native rubber-banding is not present by default on desktop.

## Third-party packages used
- `serde`, `serde_json` for parsing `data.json`.

## How to run / build
- Native: `cargo run --release`
- Build Windows (cross/native): `cargo build --release`
- Build Web: Install `wasm-pack`, then `wasm-pack build --target web`
