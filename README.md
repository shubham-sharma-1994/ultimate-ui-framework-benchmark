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
All 14 apps are built and merged (two rounds). Each app's `NOTES.md` is the source of truth; this table is generated from them.
Targets: ✅ built · ⚠️ partial / experimental (CI job marked non-blocking) · ⏭️ skipped (see the note). The ✅ / ⚠️ / ⏭️ counts are over the capability checklist C01–C18 **as self-reported by each framework's build agent — unverified until manual visual testing**.

> ⚠️ **Dioxus:** the round-1 app that was first merged was only a stub (`println!("Hello, world!")`) although its notes claimed 12/18. Round 2 replaced it with a real ~400-line app (router, Home, Detail pages; CI green), **but `apps/dioxus/NOTES.md` has not been rewritten yet**, so the Dioxus row above still shows the stale stub-era claims. Do not trust it.

| Framework | Folder | Web | Android | Windows | ✅ | ⚠️ | ⏭️ | Docs |
|---|---|---|---|---|---|---|---|---|
| Flutter | `apps/flutter` | ✅ | ✅ | ✅ | 18 | 0 | 0 | [NOTES](apps/flutter/NOTES.md) · [FEEDBACK](apps/flutter/FEEDBACK.md) |
| React Native | `apps/react-native` | ✅ | ✅ | ⏭️ | 15 | 3 | 0 | [NOTES](apps/react-native/NOTES.md) · [FEEDBACK](apps/react-native/FEEDBACK.md) |
| Ionic | `apps/ionic` | ✅ | ✅ | ✅ | 15 | 3 | 0 | [NOTES](apps/ionic/NOTES.md) · [FEEDBACK](apps/ionic/FEEDBACK.md) |
| Uno Platform | `apps/uno` | ✅ | ✅ | ✅ | 12 | 5 | 1 | [NOTES](apps/uno/NOTES.md) · [FEEDBACK](apps/uno/FEEDBACK.md) |
| Compose Multiplatform | `apps/compose` | ✅ | ✅ | ✅ | 16 | 2 | 0 | [NOTES](apps/compose/NOTES.md) · [FEEDBACK](apps/compose/FEEDBACK.md) |
| Avalonia | `apps/avalonia` | ✅ | ✅ | ✅ | 10 | 6 | 2 | [NOTES](apps/avalonia/NOTES.md) · [FEEDBACK](apps/avalonia/FEEDBACK.md) |
| Qt (QML) | `apps/qt` | ⚠️ | ✅ | ✅ | 12 | 6 | 0 | [NOTES](apps/qt/NOTES.md) · [FEEDBACK](apps/qt/FEEDBACK.md) |
| .NET MAUI | `apps/maui` | ⏭️ | ✅ | ✅ | 5 | 13 | 0 | [NOTES](apps/maui/NOTES.md) · [FEEDBACK](apps/maui/FEEDBACK.md) |
| Dioxus ⚠️ | `apps/dioxus` | ✅ | ⏭️ | ✅ | 12 | 6 | 0 | [NOTES](apps/dioxus/NOTES.md) · [FEEDBACK](apps/dioxus/FEEDBACK.md) |
| Fyne | `apps/fyne` | ⚠️ | ✅ | ✅ | 1 | 9 | 8 | [NOTES](apps/fyne/NOTES.md) · [FEEDBACK](apps/fyne/FEEDBACK.md) |
| Tauri | `apps/tauri` | ✅ | ⚠️ | ✅ | 16 | 2 | 0 | [NOTES](apps/tauri/NOTES.md) · [FEEDBACK](apps/tauri/FEEDBACK.md) |
| Slint | `apps/slint` | ✅ | ✅ | ✅ | 4 | 10 | 4 | [NOTES](apps/slint/NOTES.md) · [FEEDBACK](apps/slint/FEEDBACK.md) |
| Electron | `apps/electron` | ✅ | ⏭️ | ✅ | 16 | 2 | 0 | [NOTES](apps/electron/NOTES.md) · [FEEDBACK](apps/electron/FEEDBACK.md) |
| Quasar | `apps/quasar` | ✅ | ✅ | ✅ | 18 | 0 | 0 | [NOTES](apps/quasar/NOTES.md) · [FEEDBACK](apps/quasar/FEEDBACK.md) |

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
| Slint | – (session produced no PR; Android done by hand, built in CI, untested on device) | Real dialogs/sheets, web deep link, test IDs, hero flight |
| Fyne | – (session failed twice) | Staggered list, number switcher, shimmer, spring, swipe, parallax, hero, deep link |

Still skipped by design (whole platform): MAUI Web, Electron Android, React Native Windows.

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
