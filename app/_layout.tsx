import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { router, Stack } from 'expo-router';
import 'expo-router/entry';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/src/presentation/hooks/useColorScheme';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect, useState } from 'react';
import { getUserStatus } from '@/src/presentation/hooks/useUserStatus';
import { ActivityIndicator } from 'react-native';
import { setupDb } from '@/src/data/db/DbClient';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [dbReady, setDbReady] = useState(false);

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    const init = async () => {
      await setupDb();
      console.log("setupDb completed");
      setDbReady(true);
    };
    init();
  }, []);

  if (!dbReady || !loaded) {
    return <ActivityIndicator />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <AppNavigator />
        <StatusBar style="auto" />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

function AppNavigator() {
  const { loading, hasUser } = getUserStatus();

  useEffect(() => {
    if (!loading && !hasUser) {
      router.push("/onboarding");
    }
  }, [loading, hasUser]);

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="onboarding"
        options={{ presentation: "modal", headerShown: false }}
      />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
