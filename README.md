# Ultimate UI Framework Benchmark

One small, fully specified **2-page app ("Pulse")**, built identically in 14 mainstream UI frameworks so their
**look, feel, animation, transition and interaction quality** and **runtime performance** can be compared side by side
on **Web, Android and Windows**.

> Status: 🚧 apps are being built; results tables below are filled in after manual visual testing & benchmarking.
> This is a public, good-faith comparison. If a framework can't do something out of the box, the feature is **skipped
> with a note**, never faked. Corrections and PRs are welcome.

## The app
Page 1 *Showcase*: gradient hero with a custom-painted orbit, animated counter, controls (switch, slider, chips), floating-label
text field, staggered list. Page 2 *Detail*: hero/shared-element flight, collapsing parallax header, painted progress ring,
accordion, spring-back draggable card, swipe-to-dismiss, dialog / bottom sheet / toast, shimmer skeleton, animated light/dark theme.

The reference design is derived from what **Flutter** can do out of the box (it is the capability yardstick), and every
other framework is judged against it. Full spec: [`spec/DESIGN.md`](spec/DESIGN.md) · skip rules: [`spec/COMPAT.md`](spec/COMPAT.md) ·
CI rules: [`spec/CI.md`](spec/CI.md) · shared data: [`spec/data.json`](spec/data.json).

## Frameworks & targets
✅ expected supported · ⚠️ experimental / needs extra tooling · ❌ not supported. Final status per app is in `apps/<fw>/NOTES.md`.

| Framework | Folder | Web | Android | Windows | CI workflow |
|---|---|---|---|---|---|
| Flutter | `apps/flutter` | ✅ | ✅ | ✅ | `flutter.yml` |
| React Native | `apps/react-native` | ✅ (react-native-web) | ✅ | ✅ (react-native-windows) | `react-native.yml` |
| Ionic | `apps/ionic` | ✅ | ✅ (Capacitor) | ⚠️ | `ionic.yml` |
| Uno Platform | `apps/uno` | ✅ (WASM) | ✅ | ✅ | `uno.yml` |
| Jetpack / Compose Multiplatform | `apps/compose` | ✅ (Wasm) | ✅ | ✅ (Desktop) | `compose.yml` |
| Avalonia | `apps/avalonia` | ✅ (Browser) | ✅ | ✅ | `avalonia.yml` |
| Qt (QML) | `apps/qt` | ⚠️ (WebAssembly) | ✅ | ✅ | `qt.yml` |
| .NET MAUI | `apps/maui` | ❌ | ✅ | ✅ | `maui.yml` |
| Dioxus | `apps/dioxus` | ✅ | ⚠️ | ✅ | `dioxus.yml` |
| Fyne | `apps/fyne` | ⚠️ | ✅ | ✅ | `fyne.yml` |
| Tauri | `apps/tauri` | ✅ (frontend) | ✅ (v2) | ✅ | `tauri.yml` |
| Slint | `apps/slint` | ✅ (WASM) | ✅ | ✅ | `slint.yml` |
| Electron | `apps/electron` | ✅ (renderer) | ❌ | ✅ | `electron.yml` |
| Quasar | `apps/quasar` | ✅ | ✅ (Capacitor) | ✅ (Electron mode) | `quasar.yml` |

## Artifacts
Every workflow uploads `<fw>-web`, `<fw>-android` (APK) and `<fw>-windows` (zip) as GitHub Actions artifacts
(see [`spec/CI.md`](spec/CI.md)). Download them from the **Actions** tab to test on your own device.

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

## Repo layout
```
spec/        design, motion, compat & CI rules shared by every app (single source of truth)
apps/<fw>/   one app per framework + NOTES.md (what was done / approximated / skipped)
.github/workflows/<fw>.yml
```
