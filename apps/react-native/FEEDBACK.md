# React Native (Expo) - Developer Feedback

Building the "Pulse" benchmark app in React Native using Expo provides an interesting snapshot into the current state of cross-platform app development in the JS ecosystem.

### What was easy / smooth
- **Expo Router:** Routing feels significantly more modern and comparable to web metaframeworks (like Next.js) than older React Navigation setups. Deep linking and back behavior are largely free.
- **Styling and Theming:** Building a custom theme toggler from scratch using `react-native-reanimated` was straightforward. Interpolating colors for every view simultaneously is easy using `useAnimatedStyle` and performant enough to not drop frames.
- **Gesture Handling:** Drag and swipe-to-dismiss features built with `react-native-gesture-handler` are best-in-class for React Native. Tying them to physics (`withSpring`) works flawlessly across the JS/Native bridge.

### What was hard / awkward
- **Custom Painting:** The lack of a native `<Canvas>` API in React Native remains a sore spot for highly customized shapes or low-level rendering benchmarks. Having to install and bridge `react-native-svg` and then animate its props via `react-native-reanimated` is an approximation that can get cumbersome and potentially unperformant for very complex scenes compared to Flutter's `CustomPaint` or Web's Canvas.
- **Web vs Native disparities:** While `react-native-web` handles 90% of basic views beautifully, hover states, nuanced keyboard navigation, and scrollbars sometimes feel like bolted-on additions. Some Reanimated layout animations (like Shared Elements) can also behave idiosyncratically when deployed strictly as a web application.
- **Overlays (Dialog/Sheet):** While there are fantastic community libraries for bottom sheets (e.g. `@gorhom/bottom-sheet`), building them from scratch just to avoid bloat highlights how bare-bones the core `Modal` component is.

### Docs / Tooling / CI
- **Tooling:** Expo's local developer experience is superb. `npx create-expo-app` gives a ready-to-run environment instantly.
- **CI/Builds:** Standard Expo web exports (`npx expo export -p web`) are trivial to set up in CI. However, bare Android/iOS builds are computationally heavy. Windows is typically ignored due to massive C++ toolchain requirements that do not align with standard Node.js CI containers.

### Performance Concerns
- Animating layout changes and interpolating multiple colors globally used to be a bottleneck, but `react-native-reanimated` largely solves this by pushing the work to the UI thread.
- The sheer number of layout animations on the list stagger entry can slightly lag older Android devices during initial render.

### Pros & Cons
**Pros:**
- Incredible ecosystem of animation and gesture libraries.
- Expo Router provides top-tier developer experience for file-based routing.
- Fast iteration with Hot Module Replacement (HMR).
- "Learn once, write anywhere" mostly holds true for Web/Android/iOS.

**Cons:**
- Heavy reliance on native third-party modules (`react-native-svg`, etc.) to fill gaps in the core framework (like custom painting).
- "Windows" target is an entirely different ecosystem (`react-native-windows`) and does not blend well into the standard Expo workflow.
- High initial setup weight (Node modules, Metro bundler).
