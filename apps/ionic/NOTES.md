# Ionic React — NOTES
Version used: 8.3.3 (Ionic), React 18.3.1 · Language: TypeScript · Rendering model: DOM

## Targets
| Target | Status | Notes |
|---|---|---|
| Web | ✅ | Supported via standard React build |
| Android | ✅ | Supported via Capacitor |
| Windows | ✅ | Supported via Capacitor Community Electron wrapper. |

## Capabilities (see spec/DESIGN.md §9)
| ID | Status | Notes / how approximated / why skipped |
|---|---|---|
| C01 | ✅ | CSS/SVG |
| C02 | ✅ | Framer Motion |
| C03 | ✅ | Framer Motion staggered list |
| C04 | ⚠️ | Framer Motion AnimateSharedLayout handles shared element transitions, approximated nicely without deep hacks, but standard Ionic router gets in the way somewhat without manual overrides. |
| C05 | ✅ | Framer Motion page transitions on route changes with custom routes wrapper. |
| C06 | ✅ | React state with Framer Motion AnimatePresence `popLayout` |
| C07 | ✅ | Framer Motion drag physics |
| C08 | ✅ | Framer Motion drag gestures |
| C09 | ⚠️ | Scroll-linked animation implemented via React state & Framer motion, custom parallax since Ionic's collapsible headers are highly iOS-specific and don't match Material exactly. |
| C10 | ✅ | SVG custom painting and Framer Motion |
| C11 | ✅ | Framer Motion AnimatePresence |
| C12 | ⚠️ | Dialog is custom to exactly match the animation curves and scrim specs. Bottom sheet and Toast use Ionic's native components. |
| C13 | ✅ | Framer Motion repeating gradient loop |
| C14 | ✅ | Framer Motion interpolation for Theme toggle, CSS custom properties handle app-wide changes instantly and softly via CSS transition over 500ms. |
| C15 | ✅ | Framer motion and CSS for floating label. |
| C16 | ✅ | Standard React Router with Ionic bindings. |
| C17 | ✅ | Supported natively |
| C18 | ✅ | Passed as `id` and `data-testid` to DOM elements |

## Native (framework-brought differences)
- Ripple effect is used via standard Ionic buttons where relevant, though custom buttons follow the CSS hover properties.
- Scrolling bounce / edge behavior is standard Ionic (smooth on iOS/Mac, standard on Android).
- Back swipe is Ionic's native implementation, though page transitions are heavily customized to fit the spec via Framer Motion.

## Third-party packages used
- `framer-motion` for complex gestures, springs, and shared layout animations.
- `tailwindcss` for styling and quick layout/typography variables handling.
- `lucide-react` / `ionicons` for icons.
- `@fontsource/inter` for typography.

## How to run / build
- Install dependencies: `npm install`
- Dev server: `ionic serve`
- Web build: `ionic build` (outputs to `dist/`)
- Android build: `ionic build && npx cap sync android && npx cap open android`
- Windows build: `ionic build && npx cap add @capacitor-community/electron && cd electron && npm run electron:make`
