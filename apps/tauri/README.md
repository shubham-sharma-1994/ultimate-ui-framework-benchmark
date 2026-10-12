# Pulse - Tauri

The Tauri framework implementation of the Pulse application.

## Running locally

### Prerequisites
- Node.js (v20+)
- Rust toolchain
- Tauri prerequisites (e.g., build-essential, webkit2gtk on Linux)

### Setup
```bash
npm install
```

### Web
```bash
npm run dev
npm run build
```

### Desktop
```bash
npm run tauri dev
npm run tauri build
```

### Mobile (Android)
```bash
npm run tauri android init
npm run tauri android dev
npm run tauri android build
```