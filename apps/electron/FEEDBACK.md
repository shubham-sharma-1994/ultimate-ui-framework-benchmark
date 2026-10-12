# Developer Feedback - Electron / Vanilla DOM

## General Experience
Building a highly interactive UI with purely vanilla DOM APIs, CSS, and TypeScript is incredibly fast to boot and lightweight, but gets progressively tedious as the complexity of state and animations grows. Modern CSS (`var()`, `calc()`, modern pseudo-classes) handles a huge chunk of what used to require heavy JS (like floating labels or custom switches). However, choreographing shared-element transitions and gesture-driven animations (like swipe-to-dismiss or spring-back physics) without a framework requires a lot of manual DOM measurement and `requestAnimationFrame` plumbing.

## Pros
- **Zero UI Dependency Overhead:** The final bundle size for the web renderer is microscopic compared to React/Flutter.
- **Universal CSS Skills:** Styling gradients, shadows, and flexbox layouts is universally understood and doesn't require learning a new widget tree paradigm.
- **Vite & Electron:** Combining Vite with Electron is a breath of fresh air. HMR works instantly.
- **Native Browser APIs:** Utilizing modern web features (SVG, Pointer Events) directly without a Virtual DOM middleman is powerful and generally very performant on modern devices.

## Cons
- **Lack of Built-in Physics:** Approximating a spring with `cubic-bezier` works okay, but true dynamic spring physics (where mass and velocity carry over) is a massive pain to write from scratch.
- **View Transitions API Limits:** While the new View Transitions API is exciting, orchestrating a perfect "Hero flight" with rounded corners changing and backgrounds interpolating seamlessly across un-related DOM branches usually requires custom JS bounding-box math (which I did here) rather than purely declarative code.
- **Boilerplate for Routing and State:** Managing route transitions and retaining scroll positions / previous page state is tedious without a router or state management library.

## Spec Fidelity
Most spec items were achievable out of the box using CSS transitions. The primary compromises were:
- **Hero Flight (C04):** Needed manual fixed-position DOM nodes injected mid-transition to fake the flight.
- **Spring (C07):** A bezier curve overshoot is technically not a true dynamic spring.

## Summary
For a desktop/web app where bundle size and absolute raw rendering control are paramount, vanilla DOM inside Electron is viable. However, for a production application with this level of micro-interaction, a declarative UI library (even a tiny one) and an animation engine (like Motion) would drastically improve maintainability over raw DOM manipulation.
