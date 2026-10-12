# Developer Feedback: Building Pulse in Flutter

## Overview
Building the "Pulse" benchmark app in Flutter was a straightforward process because Flutter is designed exactly around these types of UI primitives and paradigms. The capability list heavily aligns with Flutter's core strengths (custom painting, explicit and implicit animations, explicit gesture physics), making it the baseline for comparison.

## What was easy
- **Theming and Tokens**: Setting up the strict token requirements mapping to standard `ThemeData` properties (or using `ThemeExtension` for outliers) was simple.
- **Custom Painting (C01, C10)**: Defining complex visual logic (like drawing the animated orbit or progress ring) was completely frictionless inside `CustomPainter`. There is an immense level of control without dipping into low-level boilerplate.
- **Hero Transitions (C04)**: Standard `Hero` widgets map perfectly to shared-element transitions. The single edge case (handling gradient backgrounds) was quickly resolved overriding the flight shuttle builder.
- **Standard Overlays (C12)**: Triggering Bottom Sheets, Dialogs, and Snackbars comes directly from standard library Material design.

## What was hard / awkward
- **Staggered Animations (C03)**: Writing a sequenced staggered list entrance natively without third-party plugins (like `flutter_staggered_animations`) required tracking `Future.delayed` mapped closely to explicit `AnimationController`s. It's perfectly doable, but adds significantly more boilerplate logic inside the Widget's `State` lifecycle compared to other declarative engines.
- **Physics-based Gestures (C07)**: Creating the draggable spring-back card took manual wiring between `GestureDetector` deltas, `SpringSimulation`, and dynamically creating unbounded `AnimationController`s to simulate the momentum. While giving infinite control, it is an extremely heavy and verbose API surface compared to frameworks that have abstracted physics states directly into declarative props.
- **Page Transitions (C05)**: Creating the bespoke Page 1/Page 2 dual-animation requirements required peeling away default `MaterialPageRoute` defaults and building explicit `PageRouteBuilder` layers, tapping deeply into forward/reverse states of the secondary animations manually inside nested `SlideTransition` nodes.

## Pros & Cons
**Pros:**
- **Incredible capability out-of-the-box**: Zero external packages were needed for very bespoke physics and custom paint requirements. Everything is provided in the core framework.
- **Pixel perfection**: Because it draws its own canvas, we can be confident that the specific shadows, radii, and curves map exactly 1:1 on Web, Android, and Windows targets.
- **Excellent tooling**: Fast analyzer support and robust layout constraints made assembling the rigid design guidelines simple.

**Cons:**
- **Verbosity**: Getting into specific interactions (like physics or bespoke transition stagger routing) involves heavy object-oriented setup overhead that feels bulky for simple effects.
- **Web artifact size**: Targeting CanvasKit for high fidelity carries an initial download cost payload for the Skia engine that needs consideration on Web endpoints.
