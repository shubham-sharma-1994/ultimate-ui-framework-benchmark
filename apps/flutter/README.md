# Pulse App - Flutter Reference Implementation

This is the reference implementation of the "Pulse" benchmark app built with Flutter.
It serves as the gold standard yardstick against which other frameworks are compared for UI capability, animations, and transitions.

## Prerequisites

- Flutter SDK (stable channel, >=3.5.0)

## How to run

```bash
cd apps/flutter
flutter pub get
flutter run
```

## How to build

Web:
```bash
flutter build web --web-renderer canvaskit
```

Android:
```bash
flutter build apk
```

Windows:
```bash
flutter build windows
```
