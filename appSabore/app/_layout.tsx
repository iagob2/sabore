import React, { useEffect, useState } from 'react';
import { Platform, StatusBar, View, Image } from 'react-native';
import { Stack } from 'expo-router';
import { AuthProvider } from '../contexts/AuthContext';
import { CartProvider } from '../contexts/CartContext';

const splashSource = require('../assets/logo-sabore.png');
const splashBackground = '#FFBD24';

export default function RootLayout() {
  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0;
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const content = showSplash ? (
    <View style={{ flex: 1, backgroundColor: splashBackground }}>
      <Image
        source={splashSource}
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
          resizeMode: 'contain',
        }}
      />
    </View>
  ) : (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          paddingTop: statusBarHeight,
        },
      }}
    />
  );

  return (
    <AuthProvider>
      <CartProvider>
        <View style={{ flex: 1, backgroundColor: splashBackground }}>{content}</View>
      </CartProvider>
    </AuthProvider>
  );
}