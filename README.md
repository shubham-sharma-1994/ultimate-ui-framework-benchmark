# Ultimate UI Framework Benchmark

One small, fully specified **2-page app ("Pulse")**, built identically in 14 mainstream UI frameworks so their
**look, feel, animation, transition and interaction quality** and **runtime performance** can be compared side by side
on **Web, Android and Windows**.

> Status: ✅ all 14 apps built and merged · ⏳ visual testing & benchmarking results pending (tables below to be filled in).
> This is a public, good-faith comparison. If a framework can't do something out of the box, the feature is **skipped
> with a note**, never faked. Corrections and PRs are welcome.

## The app
Page 1 *Showcase*: gradient hero with a custom-painted orbit, animated counter, controls (switch, slider, chips), floating-label
text field, staggered list. Page 2 *Detail*: hero/shared-element flight, collapsing parallax header, painted progress ring,
accordion, spring-back draggable card, swipe-to-dismiss, dialog / bottom sheet / toast, shimmer skeleton, animated light/dark theme.

The reference design is derived from what **Flutter** can do out of the box (it is the capability yardstick), and every
other framework is judged against it. Full spec: [`spec/DESIGN.md`](spec/DESIGN.md) · skip rules: [`spec/COMPAT.md`](spec/COMPAT.md) ·
CI rules: [`spec/CI.md`](spec/CI.md) · shared data: [`spec/data.json`](spec/data.json).

## Frameworks & targets — build status
All 14 apps are built and merged. Each app's own `NOTES.md` is the source of truth; the table below is generated from them.
Targets: ✅ built · ⚠️ partial / experimental (CI job marked non-blocking) · ⏭️ skipped (see the note). The ✅ / ⚠️ / ⏭️ counts are over the capability checklist C01–C18 as self-reported by each framework's build agent — **they are unverified until manual visual testing**.

| Framework | Folder | Web | Android | Windows | ✅ | ⚠️ | ⏭️ | Docs |
|---|---|---|---|---|---|---|---|---|
| Flutter | `apps/flutter` | ✅ | ✅ | ✅ | 18 | 0 | 0 | [NOTES](apps/flutter/NOTES.md) · [FEEDBACK](apps/flutter/FEEDBACK.md) |
| React Native | `apps/react-native` | ✅ | ✅ | ⏭️ | 15 | 3 | 0 | [NOTES](apps/react-native/NOTES.md) · [FEEDBACK](apps/react-native/FEEDBACK.md) |
| Ionic | `apps/ionic` | ✅ | ✅ | ⏭️ | 15 | 3 | 0 | [NOTES](apps/ionic/NOTES.md) · [FEEDBACK](apps/ionic/FEEDBACK.md) |
| Uno Platform | `apps/uno` | ✅ | ✅ | ✅ | 10 | 7 | 1 | [NOTES](apps/uno/NOTES.md) · [FEEDBACK](apps/uno/FEEDBACK.md) |
| Compose Multiplatform | `apps/compose` | ✅ | ✅ | ✅ | 16 | 2 | 0 | [NOTES](apps/compose/NOTES.md) · [FEEDBACK](apps/compose/FEEDBACK.md) |
| Avalonia | `apps/avalonia` | ✅ | ⏭️ | ✅ | 6 | 6 | 6 | [NOTES](apps/avalonia/NOTES.md) · [FEEDBACK](apps/avalonia/FEEDBACK.md) |
| Qt (QML) | `apps/qt` | ⚠️ | ✅ | ✅ | 11 | 5 | 2 | [NOTES](apps/qt/NOTES.md) · [FEEDBACK](apps/qt/FEEDBACK.md) |
| .NET MAUI | `apps/maui` | ⏭️ | ✅ | ✅ | 5 | 11 | 2 | [NOTES](apps/maui/NOTES.md) · [FEEDBACK](apps/maui/FEEDBACK.md) |
| Dioxus | `apps/dioxus` | ✅ | ⏭️ | ✅ | 12 | 6 | 0 | [NOTES](apps/dioxus/NOTES.md) · [FEEDBACK](apps/dioxus/FEEDBACK.md) |
| Fyne | `apps/fyne` | ⚠️ | ✅ | ✅ | 1 | 9 | 8 | [NOTES](apps/fyne/NOTES.md) · [FEEDBACK](apps/fyne/FEEDBACK.md) |
| Tauri | `apps/tauri` | ✅ | ⚠️ | ✅ | 16 | 2 | 0 | [NOTES](apps/tauri/NOTES.md) · [FEEDBACK](apps/tauri/FEEDBACK.md) |
| Slint | `apps/slint` | ✅ | ⏭️ | ✅ | 4 | 10 | 4 | [NOTES](apps/slint/NOTES.md) · [FEEDBACK](apps/slint/FEEDBACK.md) |
| Electron | `apps/electron` | ✅ | ⏭️ | ✅ | 16 | 2 | 0 | [NOTES](apps/electron/NOTES.md) · [FEEDBACK](apps/electron/FEEDBACK.md) |
| Quasar | `apps/quasar` | ✅ | ✅ | ⏭️ | 16 | 1 | 1 | [NOTES](apps/quasar/NOTES.md) · [FEEDBACK](apps/quasar/FEEDBACK.md) |

> ⚠️ **Dioxus correction:** the round-1 Dioxus app that was merged contained only a stub (`println!("Hello, world!")`), although its `NOTES.md` claimed 12/18 capabilities. This was found in round 2 and the app is being rebuilt from scratch; treat the Dioxus row as invalid until that lands. Lesson: green CI + self-reported notes is not proof of an implemented app — verify visually.

CI: every framework has `.github/workflows/<fw>.yml`; artifacts are named `<fw>-web`, `<fw>-android`, `<fw>-windows` (see [`spec/CI.md`](spec/CI.md)). Jobs marked `continue-on-error` in a workflow are known-fragile (e.g. Qt/Fyne WebAssembly, MAUI/Tauri packaging) — check the run before relying on that artifact.

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
