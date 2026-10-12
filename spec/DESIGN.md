# Reference Design — "Pulse" (2-page app)

Every framework builds **this exact app**. The look-and-feel is defined by Flutter/Material-3-style capabilities
(implicit animations, hero/shared-element, springs, custom painting, gestures) because Flutter is the
yardstick for UI capability. If a framework can't do something out of the box, **skip it and record it in
`apps/<fw>/NOTES.md`** (see COMPAT.md). Never hack around it.

## 1. Global rules
- **Viewport reference:** 390×844 logical px (phone). Wide screens (web/Windows): content is a single column,
  `max-width 480`, horizontally centred, page background fills the window. Windows default window 480×900, min 360×640.
- **Font:** Inter (Regular 400, Medium 500, SemiBold 600, Bold 700), bundled with the app (OFL; get it from Google Fonts / fontsource). No system-font fallback for design text.
- **Grid:** 8 px. Allowed spacing: 4, 8, 12, 16, 24, 32.
- **Radii:** card 20, button 14, chip 999, input 14, sheet top 28.
- **Elevation:** only two shadows. `e1` = 0 2 8 rgba(0,0,0,.08); `e2` = 0 8 24 rgba(0,0,0,.16).
- **No platform-native widgets for the design** where the framework allows custom drawing; use the framework's own
  controls only when the spec says "native".  Ripple / hover effects: whatever the framework brings (list under "Native").
- **Text scale:** fixed 1.0. Locale: en. Direction: LTR.

## 2. Tokens
| Token | Light | Dark |
|---|---|---|
| background | #F6F4FB | #121016 |
| surface | #FFFFFF | #1C1A22 |
| surfaceAlt | #EEEAF7 | #26232E |
| primary | #6750A4 | #CFBCFF |
| onPrimary | #FFFFFF | #381E72 |
| accent | #FF7A59 | #FF9E85 |
| text | #1D1B20 | #E6E0E9 |
| textMuted | #6B6674 | #A9A3B3 |
| outline | #D9D3E6 | #3A3644 |
| success | #2E9E6B | #5FD39B |

Type scale (size/line-height/weight): display 32/40/700, title 22/28/600, body 16/24/400, label 13/16/500, caption 12/16/400.

## 3. Motion tokens (identical everywhere)
| Name | Duration | Curve (cubic-bezier) |
|---|---|---|
| fast | 150 ms | (0.2, 0, 0, 1) |
| base | 300 ms | (0.65, 0, 0.35, 1) |
| slow | 500 ms | (0.05, 0.7, 0.1, 1) |
| spring | stiffness 300, damping 20, mass 1 | — (use a native spring, else approximate with `slow` + 8 % overshoot) |
Stagger step: 50 ms. Press feedback: scale to 0.96 in `fast`. Hover (web/Windows): surface → surfaceAlt in `fast`.

## 4. Page 1 — "Showcase" (route `/`)
Vertical scroll column, 16 px side padding, 16 px gaps.
1. **App bar** (56 px, surface, e1 on scroll): title "Pulse", trailing theme toggle (☀/🌙 icon button, id `theme-toggle`).
   *Animation:* app bar shadow fades in over `fast` once scroll offset > 0.
2. **Hero card** (height 180, radius 20, linear gradient primary→accent 135°): text "Same app. Every framework." (title, white) and an
   animated **orbit** custom-painted: 3 dots circling a ring (ring r=40, dot r=6, 3 s per revolution, linear, infinite). id `orbit`.
3. **Counter row**: label "Taps" + big number (display) + FAB-style filled button "+" (id `counter-inc`).
   *Interaction:* tap → number animates (old slides up & fades out, new slides in from below, `base`); button press scale 0.96; long-press resets to 0 with a shake (±6 px, 3 oscillations, 300 ms).
4. **Controls card** (surface, e1): `Switch` "Notifications" (id `switch`), `Slider` 0–100 "Intensity" (id `slider`, live value label above thumb), 3 **chips** "Low / Medium / High" single-select (ids `chip-low|medium|high`; selected chip animates fill to primary in `fast`).
5. **Text field** "Your name" (id `name-input`): label floats on focus (`fast`), outline animates outline→primary 2 px; typing mirrors into a greeting "Hello, {name}" below, which cross-fades (`fast`).
6. **List of 6 items** (id `item-1..6`), data from `data.json`. Each row: 56×56 rounded-16 gradient thumbnail (colour from data), title, subtitle, chevron.
   *Enter animation:* on first show each row fades+slides up 24 px, staggered 50 ms, `slow`.
   *Tap:* **Hero** shared-element — the thumbnail flies to Page 2's header (see transition) and row content cross-fades.
7. Bottom spacing 32.

## 5. Page 2 — "Detail" (route `/detail/:id`)
1. **Collapsing header** (expanded 240, collapsed 56): thumbnail from Page 1 is the hero element, scaling to cover the header; title text shrinks 32→20 and moves to the app bar on scroll (parallax: background moves at 0.5× scroll speed). Back button (id `back`) top-left.
2. **Progress ring** (custom painted, 120 px, stroke 12, round caps): animates 0 → item.score % over `slow` on entry; centre shows the % counting up in sync (id `ring`). Tap → replays.
3. **Expandable panel** "Details" (id `accordion`): tap header toggles; height animates `base`, chevron rotates 180° `base`, content fades in last 50 %.
4. **Draggable card** (id `drag-card`, 96 px): can be dragged anywhere inside its 240 px play-area; on release it springs back to centre using the `spring` token.
5. **Swipe-to-dismiss list** of 3 tiles (id `swipe-1..3`): horizontal swipe > 40 % dismisses (slide out `base`, then collapse height `base`), red-ish (#E5484D) background with delete icon revealed beneath; "Reset" text button (id `swipe-reset`) restores them with fade-in.
6. **Buttons row**: "Show dialog" (id `btn-dialog`) → modal dialog (scale 0.9→1 + fade, `base`, scrim 40 % black); "Show sheet" (id `btn-sheet`) → bottom sheet slides up from bottom (`base`, radius 28, draggable handle, drag down to dismiss); "Toast" (id `btn-toast`) → snackbar slides up, stays 2 s, slides down.
7. **Loading shimmer** block (id `shimmer`, 3 text-lines skeleton, 1.2 s sweep loop) shown for 1.5 s after entry, then replaced by body text with cross-fade `base`.

## 6. Page transition (Page 1 ↔ Page 2)
- Forward: Page 2 slides in from right 30 % width + fade 0→1, `base`; Page 1 slides left 10 % + fades to 0.6. Hero thumbnail flies along an arc in `base`.
- Back (button, Esc/Backspace on Windows, browser back on web, system back on Android): exact reverse. Mobile edge-swipe back is **native**: keep if the framework gives it.
- Deep link `/detail/3` must open Page 2 directly on web.

## 7. Theme switch
Tap `theme-toggle`: all colours interpolate over `slow` (no flash). Icon rotates 180° and cross-fades. Initial theme = light (do not follow system), persisted nowhere.

## 8. Input & accessibility
- Every id above is set as accessibility label / automation id / `data-testid` (as the framework allows) so a UI-test driver can find it.
- Min tap target 44×44. Keyboard: Tab order top→bottom, Enter/Space activates (web/Windows).
- Mouse: hover states as in §3; cursor pointer on clickable items (web/Windows).

## 9. Capability checklist (each ID is reported per framework in NOTES.md as ✅ / ⚠️ approximated / ⏭️ skipped)
| ID | Capability |
|---|---|
| C01 | Custom gradient + custom-painted orbit (continuous animation) |
| C02 | Implicit animations (colour, size, opacity, rotation) |
| C03 | Staggered list entrance |
| C04 | Hero / shared-element transition |
| C05 | Page transition (slide + fade, reversible) |
| C06 | Animated number switcher |
| C07 | Spring physics (drag-card release) |
| C08 | Gesture: drag, long-press, swipe-to-dismiss |
| C09 | Collapsing header with parallax |
| C10 | Custom painter progress ring + count-up |
| C11 | Accordion height animation |
| C12 | Modal dialog / bottom sheet / toast |
| C13 | Shimmer skeleton |
| C14 | Animated theme switch |
| C15 | Text field with floating label |
| C16 | Deep link / back navigation |
| C17 | Keyboard & hover (web/Windows) |
| C18 | Accessibility labels / test ids |
