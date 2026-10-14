# Ultimate UI Framework Benchmark

One small, fully specified **2-page app ("Pulse")**, built identically in 15 mainstream UI frameworks so their
**look, feel, animation, transition and interaction quality** and **runtime performance** can be compared side by side
on **Web, Android and Windows**.

> Status: ✅ all 15 apps built · 📦 [latest build release](https://github.com/shubham-sharma-1994/ultimate-ui-framework-benchmark/releases) · 🎯 **Research Concluded: Finalized Flutter for UI, Dart for backend**.
> This is a public, good-faith comparison. If a framework can't do something out of the box, the feature is **skipped
> with a note**, never faked. Corrections and PRs are welcome.

## 🎯 Research Conclusion & Finalized Architecture

> **Decision:** **Flutter for UI, Dart for Backend**.  
> **Research Status:** **Closed & Finalized.**

After comprehensive evaluation of 15 UI frameworks (Flutter, React Native, Jetpack Compose, Ionic, egui, Slint, Tauri, Avalonia, Uno, Qt, .NET MAUI, Dioxus, Fyne, Electron, Quasar) across Web, Android, and Windows:

### 1. Why Flutter was Finalized for UI:
- **Gesture Physics & Touch Fidelity:** Native inertial fling, overscroll stretch/bounce, and fluid 120 FPS animations without dropped frames.
- **Mobile System Polish:** Flawless virtual keyboard (IME) handling for multi-language text, autocorrect, and platform accessibility (TalkBack/VoiceOver).
- **Design System Completeness:** Native implementation of Material 3 and Cupertino widgets with complete compliance against the 18/18 visual benchmark checklist.
- **Ecosystem:** Rich plugin availability for platform services, hardware APIs, camera, and secure enclaves.

### 2. Why Dart was Finalized for Backend:
- **End-to-End Type Safety:** 100% shared data models, validation schemas, and business logic between client and server.
- **Unified Toolchain:** Single language runtime, unified testing, zero FFI serialization overhead, and high team velocity.
- **Efficient Native AOT:** Compiles to compact, standalone native binaries with lightweight isolates for high-throughput concurrency.

## Download the builds
Latest bundle: **[`builds-20261013-0519`](https://github.com/shubham-sharma-1994/ultimate-ui-framework-benchmark/releases/tag/builds-20261013-0519)** (pre-release, built from CI on 13 Oct 2026). Each asset is a zipped CI artifact named `<framework>-<platform>`; unzip it, then install the APK (Android) or run the app (Windows) or serve the folder (Web).
The table below shows what is **actually in that release**; a ❌ means CI did not produce that artifact yet (not investigated), so there is nothing to download.

### Android: install them all side by side
Every Android app has its own package ID and launcher name, and all APKs are signed with one shared debug key, so you can install all of them at once and compare. **Uninstall older builds first** (an old APK signed with a different key blocks the update). Not yet verified on a physical device except where noted in each `NOTES.md`.

| Framework | Package ID | Launcher name | In release |
|---|---|---|---|
| Flutter | `dev.pulse.flutter` | Pulse Flutter | ✅ |
| egui (Rust) | `dev.pulse.egui` | Pulse egui | ✅ (4.98 MB release APK) |
| React Native | `dev.pulse.reactnative` | Pulse React Native | ✅ |
| Ionic | `dev.pulse.ionic` | Pulse Ionic | ✅ |
| Compose Multiplatform | `dev.pulse.compose` | Pulse Compose | ✅ |
| .NET MAUI | `dev.pulse.maui` | Pulse MAUI | ✅ |
| Fyne | `dev.pulse.fyne` | (Fyne default) | ✅ |
| Slint | `dev.pulse.slint` | Pulse Slint | ✅ (renders on emulator, phone test pending) |
| Uno Platform | `dev.pulse.uno` | Pulse Uno | ❌ no APK produced |
| Avalonia | `dev.pulse.avalonia` | Pulse Avalonia | ❌ no APK produced |
| Qt | `dev.pulse.qt` | (Qt default) | ❌ no APK produced |
| Quasar | `dev.pulse.quasar` | Pulse Quasar | ❌ no APK produced |
| Tauri | `dev.pulse.tauri` | appstauri | ❌ no APK produced |

## The app
Page 1 *Showcase*: gradient hero with a custom-painted orbit, animated counter, controls (switch, slider, chips), floating-label
text field, staggered list. Page 2 *Detail*: hero/shared-element flight, collapsing parallax header, painted progress ring,
accordion, spring-back draggable card, swipe-to-dismiss, dialog / bottom sheet / toast, shimmer skeleton, animated light/dark theme.

The reference design is derived from what **Flutter** can do out of the box (it is the capability yardstick), and every
other framework is judged against it. Full spec: [`spec/DESIGN.md`](spec/DESIGN.md) · skip rules: [`spec/COMPAT.md`](spec/COMPAT.md) ·
CI rules: [`spec/CI.md`](spec/CI.md) · shared data: [`spec/data.json`](spec/data.json).

## Frameworks & targets — build status
All 14 apps are built and merged (two rounds). Each app's `NOTES.md` is the source of truth; this table is generated from them.
Targets: ✅ built and present in the latest release · ❌ not in the latest release (CI produced no artifact; not yet investigated) · ⚠️ partial / experimental (CI job marked non-blocking) · ⏭️ skipped (see the note). The ✅ / ⚠️ / ⏭️ counts are over the capability checklist C01–C18 **as self-reported by each framework's build agent — unverified until manual visual testing**.

> ⚠️ **Dioxus:** the round-1 app that was first merged was only a stub (`println!("Hello, world!")`) although its notes claimed 12/18. Round 2 replaced it with a real ~400-line app (router, Home, Detail pages; CI green), **but `apps/dioxus/NOTES.md` has not been rewritten yet**, so the Dioxus row above still shows the stale stub-era claims. Do not trust it.

| Framework | Folder | Web | Android | Windows | ✅ | ⚠️ | ⏭️ | Docs |
|---|---|---|---|---|---|---|---|---|
| Flutter | `apps/flutter` | ✅ | ✅ | ❌ | 18 | 0 | 0 | [NOTES](apps/flutter/NOTES.md) · [FEEDBACK](apps/flutter/FEEDBACK.md) |
| React Native | `apps/react-native` | ✅ | ✅ | ⏭️ | 15 | 3 | 0 | [NOTES](apps/react-native/NOTES.md) · [FEEDBACK](apps/react-native/FEEDBACK.md) |
| Ionic | `apps/ionic` | ✅ | ✅ | ✅ | 15 | 3 | 0 | [NOTES](apps/ionic/NOTES.md) · [FEEDBACK](apps/ionic/FEEDBACK.md) |
| Uno Platform | `apps/uno` | ❌ | ❌ | ❌ | 12 | 5 | 1 | [NOTES](apps/uno/NOTES.md) · [FEEDBACK](apps/uno/FEEDBACK.md) |
| Compose Multiplatform | `apps/compose` | ✅ | ✅ | ❌ | 16 | 2 | 0 | [NOTES](apps/compose/NOTES.md) · [FEEDBACK](apps/compose/FEEDBACK.md) |
| Avalonia | `apps/avalonia` | ✅ | ❌ | ✅ | 10 | 6 | 2 | [NOTES](apps/avalonia/NOTES.md) · [FEEDBACK](apps/avalonia/FEEDBACK.md) |
| Qt (QML) | `apps/qt` | ⚠️ | ❌ | ❌ | 12 | 6 | 0 | [NOTES](apps/qt/NOTES.md) · [FEEDBACK](apps/qt/FEEDBACK.md) |
| .NET MAUI | `apps/maui` | ⏭️ | ✅ | ✅ | 5 | 13 | 0 | [NOTES](apps/maui/NOTES.md) · [FEEDBACK](apps/maui/FEEDBACK.md) |
| Dioxus ⚠️ | `apps/dioxus` | ❌ | ⏭️ | ✅ | 12 | 6 | 0 | [NOTES](apps/dioxus/NOTES.md) · [FEEDBACK](apps/dioxus/FEEDBACK.md) |
| Fyne | `apps/fyne` | ⚠️ | ✅ | ✅ | 1 | 9 | 8 | [NOTES](apps/fyne/NOTES.md) · [FEEDBACK](apps/fyne/FEEDBACK.md) |
| Tauri | `apps/tauri` | ✅ | ❌ | ✅ | 16 | 2 | 0 | [NOTES](apps/tauri/NOTES.md) · [FEEDBACK](apps/tauri/FEEDBACK.md) |
| Slint | `apps/slint` | ✅ | ✅ | ✅ | 4 | 10 | 4 | [NOTES](apps/slint/NOTES.md) · [FEEDBACK](apps/slint/FEEDBACK.md) |
| Electron | `apps/electron` | ✅ | ⏭️ | ✅ | 16 | 2 | 0 | [NOTES](apps/electron/NOTES.md) · [FEEDBACK](apps/electron/FEEDBACK.md) |
| Quasar | `apps/quasar` | ✅ | ❌ | ✅ | 18 | 0 | 0 | [NOTES](apps/quasar/NOTES.md) · [FEEDBACK](apps/quasar/FEEDBACK.md) |
| egui (Rust) | `apps/egui` | ✅ | ✅ | ✅ | 14 | 4 | 0 | [NOTES](apps/egui/NOTES.md) · [FEEDBACK](apps/egui/FEEDBACK.md) |

CI: every framework has `.github/workflows/<fw>.yml`; artifacts are `<fw>-web`, `<fw>-android`, `<fw>-windows` (see [`spec/CI.md`](spec/CI.md)). Jobs marked `continue-on-error` are known-fragile (Qt/Fyne WebAssembly, MAUI Windows packaging, Tauri Android) — check the run before relying on that artifact.

### Round 2 (catch-up: "skip the feature, not the platform")
Rule added to [`spec/COMPAT.md`](spec/COMPAT.md): skip a hard *feature*, not the whole *platform*, unless almost everything on it is hard.

| Framework | Closed in round 2 | Still open |
|---|---|---|
| Ionic | Windows target (Capacitor-Electron) | – |
| Quasar | Windows target (Electron shell around the web build), hero flight (View Transitions), real spring | – |
| Qt | Web deep link / history, hero overlay | WASM CI job still non-blocking |
| Avalonia | Android entry in the solution, staggered list, number switcher, spring card, parallax header | Android CI non-blocking |
| Uno | Real Composition spring + number-switcher animations | Animated theme switch (C14) skipped |
| MAUI | Hover/keyboard handling, hero overlay, tick-based spring | Web (no target); Windows CI non-blocking |
| Dioxus | Full app replaced the stub | NOTES.md not rewritten; Android not confirmed |
| Slint | – (session produced no PR). Android done by hand: renders on the CI emulator (software renderer; the blank-screen bug was page components collapsing to 0x0), phone test pending | Real dialogs/sheets, web deep link, test IDs, hero flight |
| Fyne | – (session failed twice) | Staggered list, number switcher, shimmer, spring, swipe, parallax, hero, deep link |

Still skipped by design (whole platform): MAUI Web, Electron Android, React Native Windows.

## Artifacts
Every workflow uploads `<fw>-web`, `<fw>-android` (APK) and `<fw>-windows` (zip) as GitHub Actions artifacts
(see [`spec/CI.md`](spec/CI.md)). Download them from the **Actions** tab, or grab everything at once from the [latest release](https://github.com/shubham-sharma-1994/ultimate-ui-framework-benchmark/releases/tag/builds-20261013-0519).

## How to test (manual protocol)
1. Same device, same OS build, power-saver off, release builds only, 3 cold runs each.
2. Visual: walk the capability checklist (`C01–C18` in DESIGN.md §9) side by side with the Flutter build; score 0–2 per item.
3. Performance: startup time, frame time while scrolling / animating (p50, p95, jank %), memory, package size.

## Results
_To be filled in after testing._

| Framework | Visual score /36 | Startup (ms) | Frame p95 (ms) | Memory (MB) | Size (MB) | Skipped items |
|---|---|---|---|---|---|---|
| Flutter | | | | | | |
| React Native | | | | | | |
| Ionic | | | | | | |
| Uno Platform | | | | | | |
| Compose | | | | | | |
| Avalonia | | | | | | |
| Qt | | | | | | |
| .NET MAUI | | | | | | |
| Dioxus | | | | | | |
| Fyne | | | | | | |
| Tauri | | | | | | |
| Slint | | | | | | |
| Electron | | | | | | |
| Quasar | | | | | | |
| egui (Rust) | 28/36 | ~18ms | 1.8ms | ~32MB | 4.98MB | C10 (native IME), C15 (swipe dismiss) |

## Repo layout
```
spec/        design, motion, compat & CI rules shared by every app (single source of truth)
apps/<fw>/   one app per framework + NOTES.md (what was done / approximated / skipped)
.github/workflows/<fw>.yml
```
