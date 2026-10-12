# React Native (Expo) — NOTES
Version used: React Native 0.77+ / Expo SDK 57 · Language: TypeScript · Rendering model: native widgets & DOM (web)

## Targets
| Target | Status | Notes |
|---|---|---|
| Web | ✅ | Handled via Expo + `react-native-web`. |
| Android | ✅ | Built via Expo CLI (Metro/Hermes). |
| Windows | ⏭️ | Skipped per 'moderate effort' directive. `react-native-windows` requires C++ build dependencies, does not integrate with Expo static web outputs easily without breaking out of the managed workflow. |

## Capabilities (see spec/DESIGN.md §9)
| ID | Status | Notes / how approximated / why skipped |
|---|---|---|
| C01 | ⚠️ | Custom painting (Orbit) approximated using `react-native-svg` and `react-native-reanimated`. React Native has no built-in Canvas API. |
| C02 | ✅ | Implicit animations implemented via `react-native-reanimated` hook (`useAnimatedStyle`) with timings. |
| C03 | ✅ | Staggered entrance implemented using Reanimated Layout Animations (`FadeInUp.delay()`). |
| C04 | ✅ | Shared element transition implemented natively using Reanimated `sharedTransitionTag`. |
| C05 | ✅ | Route page transition natively supported by `expo-router` using the `slide_from_right` animation. |
| C06 | ✅ | Number switcher approximated using layout entering/exiting animations (`SlideInDown` / `SlideOutUp`). |
| C07 | ✅ | Spring physics natively supported via `withSpring` from Reanimated for the DragCard. |
| C08 | ✅ | Gestures natively processed on the UI thread via `react-native-gesture-handler`. |
| C09 | ✅ | Collapsing header with parallax synced to Reanimated scroll handler values. |
| C10 | ⚠️ | Progress ring (Custom painter) approximated using `react-native-svg` and animated dash offsets. |
| C11 | ✅ | Accordion height animation fully functional using Reanimated values. |
| C12 | ✅ | Modal / Sheet / Toast implemented using React Native `<Modal>` component plus Reanimated. No heavy external library. |
| C13 | ✅ | Shimmer skeleton created using repeated `withTiming` opacity animation. |
| C14 | ✅ | Animated theme switch interpolating all text/surface colors concurrently. |
| C15 | ✅ | Text field floating label using Reanimated interpolating top and size. |
| C16 | ✅ | Deep linking / back navigation natively supported by `expo-router`. |
| C17 | ⚠️ | Keyboard & Hover mostly supported on Web (via RNW), natively less pronounced on Android due to missing hover paradigm. |
| C18 | ✅ | Test IDs injected across standard elements. |

## Native (framework-brought differences)
- Edge-swipe back is native to iOS and gesture-nav Android, automatically tied into Expo Router's stack.
- Text rendering on Web relies on CSS fonts, while Android relies on native text views.
- No native ripple is explicitly created without using `Pressable` with `android_ripple`, so it was omitted to favor the simple scaled animations.

## Third-party packages used
- `react-native-reanimated`: Community standard for 60fps animations.
- `react-native-gesture-handler`: Community standard for fluid cross-platform touch processing.
- `react-native-svg`: Community standard for scalable vector graphics and simple custom shapes in RN.
- `expo-linear-gradient`: Cross-platform gradient backgrounds.
- `@react-native-community/slider`, `@react-native-picker/picker`, `expo-router`: Navigation and standard UI elements.

## How to run / build
- **Install deps**: `npm install`
- **Run Android**: `npx expo run:android` or `npx expo start --android`
- **Run Web**: `npx expo start --web`
