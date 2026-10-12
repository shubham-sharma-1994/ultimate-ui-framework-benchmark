# Developer Feedback: Slint (Rust)

Building the Pulse app in Slint was a unique experience that highlights both the strengths and current limitations of the framework.

## What was easy / smooth
- **Declarative UI**: Slint's domain-specific language (.slint files) is very clean, concise, and easy to read. It resembles QML or SwiftUI and makes setting up layouts straightforward.
- **Rust Integration**: Binding Rust data models to the Slint UI was surprisingly seamless. Using `ModelRc` and `VecModel` to pass a parsed JSON structure into the UI worked out of the box.
- **Implicit Animations**: The `animate` block is extremely powerful. Changing a color or a width and letting Slint handle the transition is very satisfying and requires minimal boilerplate.

## What was hard / awkward
- **Complex Capabilities**: Replicating specific complex capabilities like Hero/shared-element transitions, staggered lists with index-based delays, and scroll-linked parallax animations is currently very difficult or impossible without heavy Rust workarounds or custom elements.
- **Drawing and Paths**: Slint's built-in drawing primitives (Paths) are limited when it comes to dynamic arcs (like a progress ring) without dropping down to Rust-side custom drawing, which ruins the declarative flow.
- **Custom Gestures**: Implementing swipe-to-dismiss and draggable cards was clunky. Slint's `TouchArea` provides basic pointer events, but calculating drag deltas manually and snapping back required manual math rather than using built-in drag/pan gesture recognizers.
- **Lack of standard components**: While `std-widgets` exists, creating a text field with a floating label or a bottom sheet requires building them from scratch using low-level primitives.

## Performance and Tooling
- **Performance**: The app feels very snappy. The memory footprint and startup time of the resulting native binary are excellent compared to heavy webviews or JS-based frameworks.
- **Tooling**: The VSCode extension for Slint is great, providing instant preview. The `slint-build` crate integrated perfectly with `cargo`.

## Pros & Cons
**Pros:**
- Extremely lightweight and fast native binaries.
- Very clean and intuitive DSL for UI layout.
- Excellent two-way binding with Rust.

**Cons:**
- Missing advanced animation primitives (stagger, spring physics, shared elements).
- Limited gesture recognition compared to Flutter or React Native.
- Smaller ecosystem of pre-built complex components (like floating label inputs, bottom sheets).
