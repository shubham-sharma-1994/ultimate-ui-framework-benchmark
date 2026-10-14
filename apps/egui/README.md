# Pulse App - egui (Rust) implementation

This is the `egui` (Rust) implementation of the Pulse benchmark app, built with `eframe` 0.36 (the official egui cross-platform framework).

## Architectural Overview
- **UI Paradigm:** Immediate Mode GUI (IMGUI). The entire interface is drawn directly every frame with zero retained widget tree and zero garbage collection overhead.
- **Styling & Design Tokens:** Matches `spec/DESIGN.md` dark theme (`#0B0E14` base, `#151922` surface, `#6366F1` indigo primary, `#EC4899` pink accent). Inter font family embedded.
- **Custom Graphics & Motion:**
  - 135° mesh gradient hero with a continuous custom-painted 3-dot orbit animation.
  - 120px circular progress ring with custom stroke and animated counter.
  - 2D damped harmonic oscillator spring simulation (`stiffness: 300, damping: 20, mass: 1`).
  - 3-line skeleton shimmer with 1.2s gradient sweep loop.
  - Floating label text field with focus animation.

## Android Features
- **Android Target:** Native `aarch64-linux-android` shared library packaged via `cargo-apk` and `android-native-activity`.
- **UI Showcase Drawer (Android exclusive):** Floating hamburger button on the top-right (`☰ UI Demos`) opening an Android navigation drawer to switch between:
  - **Pulse Showcase (Page 1)**
  - **Pulse Detail (Page 2)**
  - **egui Demo Windows** (official interactive `egui_demo_lib` windows)
  - **egui Color Test** (sRGB gamma and gradient calibration)
  - **egui Settings & Inspection** (memory, style, and widget inspector)
- **APK Size:** **4.98 MB** (Release signed with v2/v3 signature schemes, fully zipaligned).

## Build & Run

### 1. Android APK
```bash
# Requires Android SDK, NDK, and cargo-apk
cargo apk build --release --lib --target aarch64-linux-android
# Output: target/release/apk/pulse-egui.apk (4.98 MB)
```

### 2. Native Desktop (Windows)
```bash
cargo run --release
```

### 3. Web (WebAssembly)
```bash
cargo install trunk
trunk serve
# For production web bundle:
trunk build --release
```

## Research Conclusion
Evaluated against Flutter, Jetpack Compose, Slint, and React Native.  
- **Result:** **Finalized Flutter for UI, Dart for Backend.**
- **Takeaway:** While `egui` excels at raw compute speed, zero-GC memory control, and minimal binary size (4.98 MB), Flutter provides the complete mobile gesture physics, native virtual keyboard (IME) integration, and rich widget ecosystem required for consumer-facing production apps.
