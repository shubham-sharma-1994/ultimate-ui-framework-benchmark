1. **C17 Keyboard + Hover States**:
   - Add `PointerGestureRecognizer` to interactive elements (`Button`, `Border`, list items) in `MainPage.xaml` and `DetailPage.xaml`.
   - Implement `OnPointerEntered` and `OnPointerExited` handlers to animate scale/opacity.
   - Add keyboard handling to Windows via `VisualElement.Loaded` event or by overriding `OnKeyDown` where possible, or simply add `KeyboardAccelerator` or handled events. Wait, MAUI has basic keyboard shortcuts but native arrow key nav might just work. Let's add basic hover scaling first.

2. **C04 Hero Flight Overlay**:
   - In `MainPage.xaml.cs`, when tapping an item, create a clone overlay of the item card on top of the root `Grid`.
   - Calculate absolute position using `GetLocationOnScreen`.
   - Animate the clone from its initial size/position to the final Hero card size/position before pushing the `DetailPage`.
   - Since we don't have true shared element transition, an overlay is the standard workaround.

3. **C07 Spring Physics**:
   - In `DetailPage.xaml.cs`, for `OnDragCardPanUpdated`, use the new real spring physics (or `Easing.SpringOut` with a custom implementation, or `Animate` method with a physics-based tick) instead of default `TranslateTo`. A manual tick-based spring simulation works perfectly in `IDispatcherTimer` or `Animation`.

4. **Stabilize Windows CI**:
   - Keep .NET 8.0 SDK (modified already).
   - `build-windows` step in CI changed to net8.0 and added `-r win10-x64` to avoid architecture restore errors. Keep it `continue-on-error`.

5. **Docs**:
   - Update `NOTES.md` and `FEEDBACK.md`.
