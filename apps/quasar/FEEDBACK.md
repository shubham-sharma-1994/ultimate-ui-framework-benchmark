# Developer Feedback: Quasar (Vue 3) implementation of Pulse

Building the Pulse app using Quasar was a generally smooth experience, particularly for developers familiar with Vue 3 and its Composition API. Quasar offers a rich set of pre-built UI components that align well with Material Design, which made implementing several requirements straightforward.

## What was Easy
- **Component Availability:** Core requirements like Modals (`q-dialog`), Toasts (`Notify`), and the expandable accordion (`q-expansion-item`) were virtually plug-and-play.
- **Theming & Variables:** Quasar's structure makes it very easy to plug into the dark mode system (`$q.dark.set`), and mapping the tokens via CSS custom properties aligned effortlessly with Quasar's design system structure.
- **Swipe-to-Dismiss:** The `q-slide-item` component provided this capability natively without needing any external touch-handling library.
- **Reactivity & Animation:** The Composition API coupled with Vue's built-in `<transition>` and `<transition-group>` components made most implicit and entry animations trivial to implement.

## What was Hard / Awkward
- **Shared Element Transitions (Hero):** Vue Router lacks out-of-the-box support for shared element transitions between routes. Implementing this faithfully would require complex global state management combined with absolute positioning hacks, or relying on experimental 3rd party libraries. Consequently, it was skipped to adhere to the "no deep hacks" rule.
- **Spring Physics:** Native spring physics aren't built into Vue or Quasar's animation engine. Approximating it using a carefully tuned `cubic-bezier` curve is workable, but true dynamic spring behavior (e.g., velocity inheritance) would require an external physics library.
- **Capacitor / Build Tooling Initial Setup:** Scaffolding via the Quasar CLI interactive prompts can be rigid in automated environments, prompting a fallback to a more manual setup approach combining Vite, Vue Router, and Quasar Vite Plugin directly.

## Performance / Quality Concerns
- Because it relies primarily on Web DOM and CSS transitions, performance is heavily dependent on the target platform's Webview. While smooth on modern Web and Desktop environments, Android Webview performance (especially for the continuous custom-painted orbit and rapid DOM updates) might not match true native rendering (like Flutter).
- Staggered entrances are handled via CSS `animation-delay`, which is efficient but less flexible if data elements were to dynamically enter or leave the viewport midway.

## Pros / Cons Summary

**Pros:**
- Rapid development pace due to a vast, high-quality component library.
- Vue 3's reactivity model makes complex interactive states (like the parallax header and custom ring counter) declarative and clean.
- Excellent documentation for the framework.

**Cons:**
- Lacks native API for complex route transitions (like Hero shared elements).
- Spring animations require custom implementations or third-party dependencies.
- Relies on Webview performance, inheriting the usual DOM-based rendering limitations on mobile.
