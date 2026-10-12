# Electron — NOTES
Version used: Electron 33, Vite 5, TS 5 · Language: TypeScript · Rendering model: DOM/CSS/Web Animations

## Targets
| Target | Status | Notes |
|---|---|---|
| Web | ✅ | Servable static build from Vite. |
| Android | ⏭️ | Skipped. Electron does not support Android natively. |
| Windows | ✅ | Portable zip via electron-builder. |

## Capabilities (see spec/DESIGN.md §9)
| ID | Status | Notes / how approximated / why skipped |
|---|---|---|
| C01 | ✅ | CSS gradients and `@keyframes` for the orbit. |
| C02 | ✅ | Implicit CSS transitions used for hover/state changes. |
| C03 | ✅ | Staggered entrance via CSS classes applied sequentially in JS on load. |
| C04 | ⚠️ | Approximated. Vanilla View Transitions API is quite limited for complex manual flight trajectories across single page apps without heavier libraries. Implemented with a manual fixed position element animating its bounds from thumb to full header size during JS cross-fade. |
| C05 | ✅ | CSS transforms and opacity mapped during route change. |
| C06 | ✅ | CSS transforms for old/new element sliding up and down. |
| C07 | ⚠️ | Approximated. Vanilla JS has no built-in spring engine. Used `cubic-bezier(0.175, 0.885, 0.32, 1.275)` to approximate a damped spring upon release. |
| C08 | ✅ | Vanilla pointer events (`pointerdown`, `pointermove`, `pointerup`) with `setPointerCapture`. |
| C09 | ✅ | Window `scroll` event used to adjust `transform` scale and translation of title and background. |
| C10 | ✅ | SVG circle with animated `stroke-dashoffset`. JS `requestAnimationFrame` used to sync the count up text. |
| C11 | ✅ | Height interpolation using CSS `transition: height`. |
| C12 | ✅ | Plain DOM absolute positioning, pointer events, and CSS transitions. |
| C13 | ✅ | Linear gradient mask with CSS translation. |
| C14 | ✅ | CSS variables scoped under `[data-theme="dark"]`, body background transitions, icon rotation. |
| C15 | ✅ | HTML `input` with `+ label` CSS combinators and `:placeholder-shown` hack for float logic. |
| C16 | ✅ | Manual parsing of `window.location.hash` on load for deep linking. Back navigation implemented via UI. |
| C17 | ✅ | `keydown` events mapped for basic Escape (close modals) and Backspace (navigate back). |
| C18 | ✅ | Spec `id` attributes matched exactly in HTML markup. |

## Native (framework-brought differences)
- Standard browser text rendering and scrollbars are present.
- Mouse interaction relies on CSS `:hover` instead of custom ripples (consistent with DOM defaults).
- Default focus outlines on keyboard navigation.

## Third-party packages used
- `electron` and `electron-builder` (build system).
- `vite` (bundler).
- No UI libraries used. Vanilla DOM and CSS only.

## How to run / build
- **Dev:** `npm run dev` (starts Vite), then in another terminal `npm run start` (starts Electron pointing to dev server).
- **Build Web:** `npm run build` (outputs to `dist/renderer`).
- **Build Windows:** `npm run build:electron` (outputs to `dist-electron/`).
