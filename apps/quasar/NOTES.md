# Quasar — NOTES
Version used: 2.16.4 (Vue 3.4.29) · Language: Javascript · Rendering model: DOM (SPA Web) / WebView (Capacitor Android)

## Targets
| Target | Status | Notes |
|---|---|---|
| Web | ✅ | Built using Vite. Fully supported. |
| Android | ✅ | Built using Capacitor. |
| Windows | ✅ | Wrapped existing Vite web build in a standalone Electron shell to preserve web targets seamlessly. |

## Capabilities (see spec/DESIGN.md §9)
| ID | Status | Notes / how approximated / why skipped |
|---|---|---|
| C01 | ✅ | CSS Custom animated orbit works flawlessly. |
| C02 | ✅ | Vue `<transition>` and CSS transitions handle implicit animations effectively. |
| C03 | ✅ | Implemented via `animation-delay` staggered CSS fade up. |
| C04 | ✅ | Implemented using the View Transitions API (`document.startViewTransition`) since Vue Router lacks native shared element support. |
| C05 | ✅ | Implemented `slide-fade` Vue router transition based on routing direction meta properties. |
| C06 | ✅ | Standard Vue transition over relative element `slide-up`. |
| C07 | ✅ | Real JS spring logic using requestAnimationFrame for the drag card release. |
| C08 | ✅ | Used custom pointer events for drag and long-press; Quasar's native `q-slide-item` for swipe-to-dismiss. |
| C09 | ✅ | Vue `onScroll` binding with reactive calculations handles parallax naturally. |
| C10 | ✅ | Standard reactive SVG stroke-dashoffset drawing via Vue state. |
| C11 | ✅ | Used native Quasar `q-expansion-item` which provides exact requested behaviors. |
| C12 | ✅ | Used native Quasar `q-dialog` and `notify` plugin. |
| C13 | ✅ | Custom CSS Shimmer implementation per specs. |
| C14 | ✅ | Standard Quasar `Dark.set` with CSS variable mappings for colors. |
| C15 | ✅ | Native `q-input` with outlined prop supports floating labels natively. |
| C16 | ✅ | Supported via standard Vue Router HTML5 history. |
| C17 | ✅ | Hover states mapped in CSS and Quasar standard behaviors. |
| C18 | ✅ | Assigned `id` attributes directly as requested. |

## Native (framework-brought differences)
- Edge swipe back: Depends on the Capacitor Webview on Android, and the standard browser back behavior on Web.
- Ripple effects: Quasar natively implements Material ripples on buttons and clickable list items.
- Focus rings: Default Quasar styles outline focus.
- Scrollbars: Standard browser scrollbars.

## Third-party packages used
- `@vueuse/core`: (Not used heavily but added to dependencies)
- `@fontsource/inter`: Font bundling.
- `@capacitor/*`: Capacitor setup for Android generation.

## How to run / build
- Run web: `cd apps/quasar && pnpm install && pnpm dev`
- Build web: `cd apps/quasar && pnpm build`
