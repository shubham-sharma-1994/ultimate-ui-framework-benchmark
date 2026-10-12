# Tauri — NOTES
Version used: 2.0.0 · Language: TypeScript/CSS · Rendering model: webview / DOM

## Targets
| Target | Status | Notes |
|---|---|---|
| Web | ✅ | Standard Vite build. |
| Android | ⚠️ | Tauri mobile is available but build setup in CI and local Linux requires deep Android SDK config; kept `continue-on-error: true` in CI per framework constraints. |
| Windows | ✅ | Standard Tauri webview build. |

## Capabilities (see spec/DESIGN.md §9)
| ID | Status | Notes / how approximated / why skipped |
|---|---|---|
| C01 | ✅ | Custom gradient via CSS, custom orbit painted continuously on a standard HTML Canvas. |
| C02 | ✅ | Implicit animations handled by CSS transitions. |
| C03 | ✅ | Staggered list entrance via CSS keyframes with dynamically calculated animation delays. |
| C04 | ✅ | Hero shared element done by absolutely positioning a clone of the thumbnail and animating it over. |
| C05 | ✅ | Page transition slide+fade executed by managing DOM insertion and applying CSS transforms/opacity. |
| C06 | ✅ | Animated number switcher uses DOM element cloning and the Web Animations API for smooth slide up. |
| C07 | ⚠️ | Spring physics approximated using JS pointer events for drag and standard CSS easing `var(--spring)` on release. |
| C08 | ✅ | Gestures via Pointer Events API: drag for card, swipe-to-dismiss via translation threshold. |
| C09 | ✅ | Collapsing header and parallax managed via scroll event listener and translateY scaling. |
| C10 | ✅ | Custom painter progress ring done with HTML Canvas Arc stroke and requestAnimationFrame. |
| C11 | ✅ | Accordion height animation via CSS `max-height`. |
| C12 | ✅ | Modal, bottom sheet, and toast rendered as DOM overlays using CSS transforms and z-index. |
| C13 | ✅ | Shimmer skeleton animated with CSS linear gradient translating over background position. |
| C14 | ✅ | Theme switch using `data-theme="dark"` toggled on the root element, CSS interpolates variables over `var(--slow)`. |
| C15 | ✅ | Floating label with CSS `:focus` and `:placeholder-shown` pseudo-class tricks. |
| C16 | ⚠️ | Back navigation is custom-handled with HTML5 History API state pushing, works natively in browsers but edge-swipe back requires native shell integration in Tauri. Deep links work natively if statically served. |
| C17 | ✅ | Standard DOM interactions provide tab orders, hover states, and standard mouse integration. |
| C18 | ✅ | Added `data-testid` and `id` to all required elements. |

## Native (framework-brought differences)
- Standard web behavior: text selection is disabled using `user-select: none`.
- System back gesture relies on standard browser popstate (Web) but may not map 1:1 to Tauri webview native gestures.

## Third-party packages used
- `@fontsource/inter`: Standard Inter font inclusion.

## How to run / build
- Web (Dev): `npm run dev`
- Web (Build): `npm run build`
- Windows (Dev): `npm run tauri dev`
- Windows (Build): `npm run tauri build`
