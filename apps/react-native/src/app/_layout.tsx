import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from '../components/ThemeProvider';
import { Motion } from '../constants/Theme';

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <Stack screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          animationDuration: Motion.base.duration
        }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="detail/[id]" />
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
