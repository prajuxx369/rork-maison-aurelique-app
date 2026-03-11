import { Tabs } from "expo-router";
import { Home, ShoppingBag, Gem, Heart, User } from "lucide-react-native";
import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import Colors from "@/constants/colors";
import { useCollection } from "@/providers/CollectionProvider";
import { useWishlist } from "@/providers/WishlistProvider";
import { Typography } from "@/constants/typography";

export default function TabLayout() {
  const { totalItems } = useCollection();
  const { count: wishlistCount } = useWishlist();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.gold,
        tabBarInactiveTintColor: Colors.whiteAlpha20,
        tabBarLabelStyle: styles.tabLabel,
        tabBarShowLabel: true,
        tabBarItemStyle: styles.tabItem,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              <Home color={color} size={20} strokeWidth={focused ? 1.8 : 1.2} />
              {focused && <View style={styles.activeGlow} />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: "Shop",
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              <ShoppingBag color={color} size={20} strokeWidth={focused ? 1.8 : 1.2} />
              {focused && <View style={styles.activeGlow} />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="collection"
        options={{
          title: "Collection",
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              <Gem color={color} size={20} strokeWidth={focused ? 1.8 : 1.2} />
              {focused && <View style={styles.activeGlow} />}
              {totalItems > 0 && (
                <View style={styles.badge}>
                  <View style={styles.badgeInner} />
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          title: "Wishlist",
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              <Heart
                color={color}
                size={20}
                strokeWidth={focused ? 1.8 : 1.2}
                fill={focused ? Colors.gold : 'transparent'}
              />
              {focused && <View style={styles.activeGlow} />}
              {wishlistCount > 0 && (
                <View style={styles.badge}>
                  <View style={styles.badgeInner} />
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              <User color={color} size={20} strokeWidth={focused ? 1.8 : 1.2} />
              {focused && <View style={styles.activeGlow} />}
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.charcoalMedium,
    borderTopWidth: 0.5,
    borderTopColor: Colors.whiteAlpha05,
    elevation: 0,
    shadowOpacity: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'transparent',
      },
      android: {},
      web: {},
    }),
  },
  tabLabel: {
    fontFamily: Typography.sansFamily,
    fontSize: 9,
    letterSpacing: 2,
    textTransform: 'uppercase' as const,
    fontWeight: '400' as const,
    marginTop: 2,
  },
  tabItem: {
    paddingTop: 4,
  },
  iconContainer: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    position: 'relative' as const,
    width: 28,
    height: 28,
  },
  activeGlow: {
    position: 'absolute' as const,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.goldAlpha08,
    zIndex: -1,
  },
  badge: {
    position: 'absolute' as const,
    top: 0,
    right: -4,
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: Colors.charcoalMedium,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  badgeInner: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Colors.gold,
  },
});
