# Compatibility & skipping rules

1. **Do not force-fit.** If a capability is not available out of the box (or needs a third-party hack / native plugin
   just for this demo), skip it. A well-supported third-party library that is the *community standard* for that framework
   (e.g. Reanimated for React Native, Framer-less CSS for web stacks) is allowed — note it.
2. Record every deviation in `apps/<fw>/NOTES.md` using the table in `apps/_TEMPLATE_NOTES.md`
   (✅ done / ⚠️ approximated + how / ⏭️ skipped + why).
3. Framework-brought behaviour is **expected to differ** and should be listed under "Native": ripple/hover style,
   scrollbar, overscroll/bounce, text rendering, edge-swipe back, IME, focus rings.
4. Targets: **Web, Android, Windows**. If a target isn't supported by the framework, or only experimentally, mark the
   target ⏭️ in NOTES.md with the reason (experimental targets are optional — attempt once, then skip).
5. Don't redesign. Colours, sizes, durations and curves come from DESIGN.md only.
6. Escalate (ask in the Jules session) only when blocked on something that isn't covered by rules 1–5.
7. Never edit files outside `apps/<fw>/` and `.github/workflows/<fw>.yml`.

## Skip granularity (added after round 1)
- **Skip the feature, not the platform.** If a few capabilities (say a, b, c) are very hard on a platform, skip only those and build the rest.
- **Skip the whole platform only if** almost everything on it is hard — i.e. only a handful of capabilities are achievable and the majority are not. Otherwise build the platform.
- A feature is "hard" if it needs custom native code, a non-standard plugin, or a rewrite of the framework's rendering/routing just for this demo. "Complex" alone is not a reason: if the framework's own animation/gesture/scroll APIs can do it, build it.
- Document every skipped feature per platform in `NOTES.md` (table rows per target when they differ).
