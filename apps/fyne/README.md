# Pulse App - Fyne

This is the Fyne implementation of the Pulse benchmark app.

## Prerequisites

- Go 1.24+
- `gcc` and `xorg-dev` / `libgl1-mesa-dev` on Linux
- Android NDK (for Android)
- MinGW (for Windows)

## How to run / build

### Run locally (Desktop)
\`\`\`bash
go run .
\`\`\`

### Build for Android
\`\`\`bash
fyne package -os android -appID com.example.pulsefyne
\`\`\`

### Build for Windows
\`\`\`bash
fyne package -os windows
\`\`\`

### Build for Web (Experimental)
\`\`\`bash
fyne package -os wasm
\`\`\`
