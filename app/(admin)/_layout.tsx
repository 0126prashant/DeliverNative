import React from 'react';
import { Stack } from 'expo-router';
import Colors from '@/constants/colors';

export default function AdminLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.secondary,
        },
        headerTintColor: Colors.white,
        headerTitleStyle: {
          fontWeight: '600',
        },
        contentStyle: {
          backgroundColor: Colors.background,
        },
      }}
    />
  );
}