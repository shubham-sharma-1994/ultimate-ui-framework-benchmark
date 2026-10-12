# Pulse App - React Native (Expo)

This is the React Native implementation of the Pulse benchmark app, built using Expo.

## Features implemented
- Standard layout and component specs (List, Parallax Header, Theme toggling).
- 60fps animations utilizing `react-native-reanimated`.
- Physics gestures via `react-native-gesture-handler`.
- Custom graphics approximated via `react-native-svg`.

## Setup

1. Make sure you have Node.js installed.
2. Install dependencies:
   `npm install`

## Development

Run the Expo development server:

`npx expo start`

Press `w` to open the web version, `a` to open Android, or `i` to open iOS (if on Mac).

## Build for Production

### Web
`npx expo export -p web`

The output will be in the `dist/` directory, which can be served with any static web server (e.g. `npx serve dist`).

### Android
For a local release APK (requires Java 17 and Android SDK):
`npx expo prebuild --platform android --clean`
`cd android && ./gradlew assembleRelease`

The APK will be located at `android/app/build/outputs/apk/release/app-release.apk`.
