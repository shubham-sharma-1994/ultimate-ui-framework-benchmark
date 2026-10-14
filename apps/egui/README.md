# Pulse App - egui (Rust) implementation

This is the `egui` (Rust) implementation of the Pulse benchmark app, built with `eframe` (the official egui framework).

## Targets
- **Windows**: Native desktop executable (with default 480x900 viewport, min 360x640).
- **Web**: WebAssembly + WebGL/WebGPU canvas via `trunk build --release`.
- **Android**: Native APK compiled via `cargo-apk` + `android-native-activity` backend, featuring an expandable UI showcase drawer/navbar for mobile testing.

## Build & Run

### Native Desktop (Windows)
```bash
cargo run --release
```

### Web (Wasm)
Install `trunk` if not already present:
```bash
cargo install trunk
trunk serve
# or build static release files:
trunk build --release
```

### Android APK
```bash
cargo apk build --release --lib --target aarch64-linux-android
```
