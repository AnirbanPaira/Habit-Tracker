import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <View style={{ flex: 1 }}>
      <Header/>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarStyle: { display: 'none' }, // Hide default tab bar
        }}
        tabBar={(props) => <Footer {...props} />}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <Ionicons size={28} name="home-outline" color={color} />,
          }}
        />
        <Tabs.Screen
          name="reminder"
          options={{
            title: 'Reminder',
            tabBarIcon: ({ color }) => <Ionicons size={28} name="alarm-outline" color={color} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color }) => <Ionicons size={28} name="settings" color={color} />,
          }}
        />
      </Tabs>
    </View>
  );
}
