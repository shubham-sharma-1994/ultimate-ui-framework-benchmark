# Pulse - Electron

This is the Electron + DOM implementation of the Pulse benchmark app.

## Project Structure
- `src/renderer/`: Frontend Vite + TypeScript + DOM code. The same frontend is built for the Web target.
- `src/main/`: Electron main process setup.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. To run the app locally (Development):
   - First terminal: run Vite dev server
     ```bash
     npm run dev
     ```
   - Second terminal: run Electron
     ```bash
     npm run start
     ```

## Build

1. Build Web Artifact (outputs to `dist/renderer`):
   ```bash
   npm run build
   ```

2. Build Windows Artifact (outputs to `dist-electron`):
   ```bash
   npm run build:electron
   ```
