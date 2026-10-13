# Slint — NOTES
Version used: 1.8.0 · Language: Rust · Rendering model: own canvas (Femtovg / Software)

## Targets
| Target | Status | Notes |
|---|---|---|
| Web | ✅ | Compiled to WASM via `cargo build --target wasm32-unknown-unknown` |
| Android | ✅ | Built in CI (arm64 APK, signed with a shared debug key) with `cargo-apk` + Slint `backend-android-activity-06`, **software renderer** on Android. CI also boots an x86_64 emulator, launches the app and checks the screenshot has real UI (`android-smoke` job). Renders on the emulator; on-device touch behaviour and performance not yet verified. |
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

## Android / rendering notes
- **Components need an explicit size.** `Page1`/`Page2` (roots without a base element) collapsed to 0x0 inside a plain `Rectangle`, so only the window background drew (a blank screen). Fixed with `width: parent.width; height: parent.height` in `ui/main.slint`.
- Page 2 is hidden (`visible`) when not shown so its Flickable does not swallow taps meant for page 1; an opaque backdrop stops page 1 showing through.
- Debug loop: `cargo run --release --example snapshot` renders the UI headlessly with the software renderer and prints a coarse picture (`PAGE=2` for page 2).
