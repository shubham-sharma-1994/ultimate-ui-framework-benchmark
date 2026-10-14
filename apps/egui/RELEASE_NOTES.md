# Release Notes — Pulse UI Benchmark & Finalized Architecture

**Release Tag:** `builds-20261015-final`  
**Date:** October 15, 2026  
**Status:** Research Concluded · Architecture Finalized

---

## 🎯 Architecture Decision & Research Conclusion

> **Final Decision:** **Flutter for UI, Dart for Backend**  
> **Research Status:** **Closed and Finalized**

After benchmarking **15 mainstream UI frameworks** (Flutter, React Native, Jetpack Compose, Ionic, egui, Slint, Tauri, Avalonia, Uno Platform, Qt, .NET MAUI, Dioxus, Fyne, Electron, and Quasar) across Android, Web, and Windows:

### Why Flutter was selected for the Frontend:
1. **Unmatched Touch & Gesture Physics:** Fluid 120 FPS inertial scrolling, spring-back drag physics, and overscroll bounce without frame drops.
2. **Mobile Platform Polish:** Complete virtual keyboard (IME) integration with full autocorrect, multivariant language scripts, accessibility (TalkBack/VoiceOver), and system haptics.
3. **Reference Benchmark Baseline:** Flutter completed 18/18 visual design checklist items (`C01–C18` in `spec/DESIGN.md`) with zero approximations or skipped features.
4. **Rich Production Ecosystem:** Deepest cross-platform widget catalog (Material 3 and Cupertino) and drop-in plugins for native device capabilities.

### Why Dart was selected for the Backend:
1. **Fullstack Type Sharing:** 100% shared models, validation schemas, and business logic between frontend and backend without FFI or serialization boilerplate.
2. **Unified Toolchain & High Velocity:** Single language runtime, unified test runner, and zero context-switching across the engineering team.
3. **High-Performance Async Architecture:** Native AOT compilation, lightweight memory footprint, and isolate-based concurrency for scalable backend microservices.

---

## 📦 What's New in this Build

### 1. `egui` (Rust) Benchmark Implementation
The 15th framework implementation has been added under `apps/egui`:
- **Immediate Mode GUI (IMGUI):** Entire UI rendered directly per-frame with zero retained DOM/widget tree and zero garbage collection overhead.
- **Micro-Footprint Android APK:** Release APK weighs only **4.98 MB** (signed with v2/v3 signature schemes, fully zipaligned for Android 11+).
- **Custom Shader & Physics Fidelity:**
  - 135° mesh gradient hero with a custom-painted continuous 3-dot orbit animation.
  - 120px circular progress ring with animated count-up.
  - 2D damped harmonic oscillator spring simulation (`stiffness: 300, damping: 20`).
  - 3-line skeleton shimmer with 1.2s gradient sweep.
  - Floating label input field with focus state transitions.
- **Android UI Showcase Drawer:** Top-right floating hamburger menu (`☰ UI Demos`) allowing direct switching on Android between:
  - *Pulse Showcase (Page 1)*
  - *Pulse Detail (Page 2)*
  - *egui Demo Windows* (official interactive widgets)
  - *egui Color Test* (sRGB gamma and color gradient test)
  - *egui Settings & Memory Inspector*

---

## 📱 Release Assets

- **`pulse-egui.apk`** (4.98 MB) — Production Android release build for ARM64 (`aarch64-linux-android`).
- **`pulse-egui-unaligned.apk`** (4.98 MB) — Unaligned archive prior to zipalign.
- **`pulse-egui-debug.apk`** (168.9 MB) — Full debug build containing unstripped native debug symbols and panic backtraces.
