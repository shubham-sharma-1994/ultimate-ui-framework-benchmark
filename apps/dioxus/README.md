# Pulse - Dioxus Implementation

This is the Dioxus (Rust) implementation of the "Pulse" benchmark application.

It targets:
- Web (wasm32-unknown-unknown)
- Windows (Desktop Webview)

Mobile (Android) is unsupported out of the box with moderate effort and thus skipped.

## Build and Run

Make sure you have Rust and the Dioxus CLI (`dx`) installed.

```bash
cargo install dioxus-cli --version 0.6.3
```

### Web
```bash
# Build for production
dx build --release
```

### Desktop (Windows/Linux)
```bash
# Build for production
dx build --release --platform desktop
```
