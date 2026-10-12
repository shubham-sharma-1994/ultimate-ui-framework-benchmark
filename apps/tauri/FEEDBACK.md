# Tauri Feedback

## Pros
- Extremely small bundle size out of the box for desktop since it relies on the system WebView.
- Total freedom for the frontend: using vanilla TS + CSS provides an un-opinionated and purely web-standard way to implement logic, animations, and gestures.
- Great Vite integration: fast HMR and standard JS tooling feels incredibly familiar.
- Mobile support in Tauri v2 expands the reach to Android/iOS seamlessly using the same codebase, essentially turning it into a lightweight capacitor alternative but with a Rust backend.

## Cons
- The mobile SDK setup (`tauri android init`) can be brittle when running in headless CI environments or without the full Android Studio bundle setup. It requires manual environment setups that can fail on clean installs.
- Implementing native-feeling mobile gestures (like edge-swipe back or native overscroll bounce) purely in the webview is difficult and never feels exactly 100% native without bridging to the Rust layer.
- Because there is no bundled UI toolkit, implementing basic mobile patterns (BottomSheet, Toasts, Shared Element Transitions) requires writing everything from scratch in CSS/JS or pulling in heavy JS libraries, which somewhat defeats the lightweight purpose.

## Summary
Tauri is an excellent framework for bringing web applications to desktop with near-zero overhead. For mobile (v2), it's promising but shares the traditional webview pitfalls of mimicking native OS gestures inside a DOM environment.
