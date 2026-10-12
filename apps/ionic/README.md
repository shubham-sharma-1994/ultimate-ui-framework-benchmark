# Ionic Pulse App

This is the Ionic (React) implementation of the Pulse benchmark app.

## Project Setup

The project was initialized using standard `@ionic/cli` for React with Capacitor.

### Commands

- **Install dependencies:**
  ```bash
  npm install
  ```

- **Run in browser:**
  ```bash
  npm run dev
  # or
  ionic serve
  ```

- **Build for Web:**
  ```bash
  npm run build
  ```
  The build artifacts will be placed in the `dist` directory.

- **Build for Android:**
  Ensure you have built the web app first.
  ```bash
  npx cap sync android
  npx cap open android
  ```
  This will open Android Studio where you can build and run the APK.
