# egui — NOTES
Version used: 0.36.2 (eframe 0.36.2) · Language: Rust · Rendering model: own canvas (wgpu / WebGL)

## Targets
| Target | Status | Notes |
|---|---|---|
| Web | ✅ | Compiled to WASM via `cargo build --target wasm32-unknown-unknown` and bundled via Trunk. |
| Android | ✅ | Built in CI (arm64 APK, signed with a shared debug key) with `cargo-apk` + `android-native-activity` backend. Features a dedicated expandable UI navigation drawer to spawn and test multiple egui UI interfaces. |
| Windows | ✅ | Compiled to native Windows executable with default 480x900 viewport (min 360x640). |

## Capabilities (see spec/DESIGN.md §9)
| ID | Status | Notes / how approximated / why skipped |
|---|---|---|
| C01 | ✅ | Custom painted 135° mesh gradient hero card and continuous rotating 3-dot orbit (r=40, dot r=6, 3s/rev). |
| C02 | ✅ | Frame-interpolated transitions using egui animation context (`animate_value_with_time`, `animate_bool_with_time`) and delta-time easing. |
| C03 | ✅ | Staggered entrance animation: 24px vertical slide + fade with 50ms delay per row index using `ease_slow`. |
| C04 | ⚠️ | Hero / shared-element transition approximated with thumbnail geometry interpolation and cross-fading rows. |
| C05 | ✅ | Reversible page transition with slide (30% width) and cross-fade over `base` curve (300ms). |
| C06 | ✅ | Animated number switcher: old number slides up & fades out, new number slides in from below; long-press resets to 0 with 3-oscillation shake (±6px over 300ms). |
| C07 | ✅ | Numerical damped harmonic oscillator spring physics (`stiffness: 300, damping: 20, mass: 1`) on card release. |
| C08 | ✅ | Drag gesture, press duration timer (long-press), and horizontal swipe-to-dismiss (>40% threshold reveals red delete background). |
| C09 | ✅ | Collapsing parallax header (240px -> 56px) with background translating at 0.5× scroll speed and title shrinking 32->20 into the app bar. |
| C10 | ✅ | Custom painter progress ring (120px, stroke 12, round caps) with synchronized score counting and tap-to-replay. |
| C11 | ✅ | Expandable accordion panel with animated height, 180° chevron rotation, and 50% delayed content fade. |
| C12 | ✅ | 40% scrim modal dialog with scale/fade, draggable bottom sheet with top radius 28, and auto-dismissing toast snackbar. |
| C13 | ✅ | Skeleton shimmer block with 1.2s continuous sweep loop for 1.5s then cross-fading to content. |
| C14 | ✅ | Smooth color token interpolation over 500ms slow curve with 180° icon spin. |
| C15 | ✅ | Custom text field with animated floating label and 2px border transition on focus. |
| C16 | ⚠️ | In-memory stack routing with back button; hash-based routing on web. |
| C17 | ✅ | Native egui keyboard focus rings and `surface` -> `surfaceAlt` hover states. |
| C18 | ⚠️ | Persistent widget IDs and AccessKit accessibility labels assigned. |

## Extra Feature: Android UI Showcase Navbar
As targeted in the official egui demo apps, an extra collapsible sidebar navbar is integrated (opened by default on Android and toggleable via the hamburger icon in the app bar on all platforms). This navbar provides selection buttons to spawn and switch between:
1. **Pulse Showcase** (Page 1)
2. **Pulse Detail** (Page 2)
3. **egui Demo Windows** (`egui_demo_lib::DemoWindows`)
4. **egui Color Test** (`egui_demo_lib::ColorTest`)
5. **egui Settings & Style** (live inspection UI)

## Native (framework-brought differences)
- Immediate-mode rendering model re-evaluates UI layout each frame on a custom GPU canvas.
- Native desktop scrollbars and canvas rendering driven via `wgpu`.

## Third-party packages used
- `eframe`, `egui`, `egui_demo_lib`
- `serde`, `serde_json` for parsing `data.json`

## How to run / build
- Native desktop: `cargo run --release`
- Web: `trunk build --release`
- Android APK: `cargo apk build --release --lib --target aarch64-linux-android`
