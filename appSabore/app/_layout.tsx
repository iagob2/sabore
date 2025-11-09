import React from 'react';
import { Stack } from 'expo-router';
import { Platform, StatusBar } from 'react-native';
import { AuthProvider } from '../contexts/AuthContext';
import { CartProvider } from '../contexts/CartContext';

export default function RootLayout() {
  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0;

  return (
    <AuthProvider>
      <CartProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              paddingTop: statusBarHeight,
            },
          }}
        />
      </CartProvider>
    </AuthProvider>
  );
}
