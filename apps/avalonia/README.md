# Pulse - Avalonia UI

## Targets
- Web (Browser/WASM)
- Android
- Windows (Desktop)

## How to run
- Windows: `dotnet run --project Pulse.Desktop`
- Web: `dotnet run --project Pulse.Browser` (requires `dotnet workload install wasm-tools`)
- Android: `dotnet build -t:Run -f net8.0-android --project Pulse.Android` (requires android workload)

## Notes
See [NOTES.md](NOTES.md) for deviations from the spec.
