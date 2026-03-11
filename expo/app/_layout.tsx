import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { CollectionProvider } from "@/providers/CollectionProvider";
import { WishlistProvider } from "@/providers/WishlistProvider";
import Colors from "@/constants/colors";

void SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.black },
        animation: 'fade',
        animationDuration: 350,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
      <Stack.Screen
        name="product/[id]"
        options={{
          headerShown: false,
          animation: 'slide_from_right',
          presentation: 'card',
          animationDuration: 300,
        }}
      />
      <Stack.Screen
        name="search"
        options={{
          headerShown: false,
          animation: 'fade',
          presentation: 'modal',
          animationDuration: 250,
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    void SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: Colors.black }}>
        <CollectionProvider>
          <WishlistProvider>
            <StatusBar style="light" />
            <RootLayoutNav />
          </WishlistProvider>
        </CollectionProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
