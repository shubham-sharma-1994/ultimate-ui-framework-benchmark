# Developer Feedback: egui / eframe (Rust)

Building the Pulse app in `egui` via `eframe` was a fast, enjoyable experience that showcases the unique strengths of immediate-mode GUI programming in Rust.

## What was easy / smooth
- **Immediate-mode ergonomics**: Not having to manage complex two-way synchronization or retain widget hierarchies made creating dynamic interfaces very simple. State lives directly in Rust structs.
- **Custom painting (`Painter` and `Mesh`)**: Drawing custom shapes, 135° linear gradient cards, arcs with round caps, and continuous orbit animations was effortless with `ui.painter()`.
- **Performance**: Startup time is nearly instant, and memory usage is low. The GPU-accelerated pipeline runs at 60/120fps with minimal CPU overhead.
- **Cross-platform compilation**: Compilation to Windows desktop and WebAssembly was direct and well-integrated.

## What was hard / awkward
- **Immediate-mode animations**: Unlike retained frameworks that manage tween controllers automatically, immediate-mode requires driving animations either through `ctx.animate_*` helpers or manual delta-time interpolation.
- **Shared-element transitions**: Hero shared-element flights between views don't have an off-the-shelf router component, so geometry interpolation had to be coordinated between view states.
- **Android toolchain**: Setting up Android for Rust GUI apps requires `cargo-apk` and handling native activity lifecycle bindings, though `eframe`'s `android-native-activity` feature provides a clean zero-Gradle path.

## Overall Verdict
`egui` is an outstanding choice for lightweight, high-performance developer tools, dashboards, desktop utilities, and custom cross-platform applications where developer iteration speed and low resource usage are top priorities.
