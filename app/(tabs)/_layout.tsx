import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/src/presentation/components/HapticTab';
import { IconSymbol } from '@/src/presentation/components/ui/IconSymbol';
import TabBarBackground from '@/src/presentation/components/ui/TabBarBackground';
import { Colors } from '@/src/shared/constants/Colors';
import { useColorScheme } from '@/src/presentation/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="record"
        options={{
          title: 'Record',
          tabBarIcon: ({ color }) => <Ionicons name="mic" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="onboarding"
        options={{
          title: 'Onboarding',
          tabBarIcon: ({ color }) => <Ionicons name="person-remove-outline" size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}
