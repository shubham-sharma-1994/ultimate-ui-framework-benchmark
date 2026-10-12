# Pulse App — Compose Multiplatform

A Kotlin Multiplatform / Compose Multiplatform implementation of the Pulse benchmark app.

## How to run / build

### Desktop (JVM)
```bash
# Run
./gradlew run

# Build distribution (MSI, DMG, DEB depending on OS)
./gradlew packageDistributionForCurrentOS
```

### Android
```bash
# Build APK
./gradlew assembleRelease
```

### Web (Wasm)
```bash
# Run Dev Server
./gradlew wasmJsBrowserRun

# Build Production
./gradlew wasmJsBrowserDistribution
```
