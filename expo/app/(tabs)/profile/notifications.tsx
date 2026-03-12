import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Animated,
  Easing,
} from 'react-native';
import { Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Bell,
  ShoppingBag,
  Tag,
  Truck,
  Sparkles,
  MessageCircle,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { Typography } from '@/constants/typography';

interface NotifSetting {
  key: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  value: boolean;
}

const INITIAL_SETTINGS: NotifSetting[] = [
  { key: 'orders', icon: <ShoppingBag color={Colors.gold} size={18} strokeWidth={1.5} />, title: 'Order Updates', description: 'Shipping confirmations & delivery alerts', value: true },
  { key: 'shipping', icon: <Truck color={Colors.gold} size={18} strokeWidth={1.5} />, title: 'Delivery Tracking', description: 'Real-time tracking notifications', value: true },
  { key: 'promotions', icon: <Tag color={Colors.gold} size={18} strokeWidth={1.5} />, title: 'Exclusive Offers', description: 'Private sales & member-only promotions', value: true },
  { key: 'newArrivals', icon: <Sparkles color={Colors.gold} size={18} strokeWidth={1.5} />, title: 'New Arrivals', description: 'Be first to discover new collections', value: false },
  { key: 'messages', icon: <MessageCircle color={Colors.gold} size={18} strokeWidth={1.5} />, title: 'Messages', description: 'Personal stylist communications', value: true },
  { key: 'general', icon: <Bell color={Colors.gold} size={18} strokeWidth={1.5} />, title: 'General', description: 'App updates & announcements', value: false },
];

export default function NotificationsScreen() {
  const [settings, setSettings] = useState<NotifSetting[]>(INITIAL_SETTINGS);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  }, [fadeAnim]);

  const handleToggle = (key: string) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSettings(prev => prev.map(s => s.key === key ? { ...s, value: !s.value } : s));
  };

  const enabledCount = settings.filter(s => s.value).length;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: 'Notifications', headerStyle: { backgroundColor: Colors.black }, headerTintColor: Colors.white, headerTitleStyle: { fontFamily: Typography.serifFamily, fontSize: 18, fontWeight: '400' as const } }} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={styles.summaryCard}>
            <LinearGradient
              colors={[Colors.goldAlpha08, 'transparent']}
              style={StyleSheet.absoluteFill}
            />
            <Bell color={Colors.gold} size={24} strokeWidth={1.5} />
            <Text style={styles.summaryTitle}>{enabledCount} of {settings.length} enabled</Text>
            <Text style={styles.summarySubtitle}>Manage what matters to you</Text>
          </View>

          <View style={styles.section}>
            {settings.map((setting) => (
              <View key={setting.key} style={styles.notifRow}>
                <View style={styles.notifIcon}>{setting.icon}</View>
                <View style={styles.notifInfo}>
                  <Text style={styles.notifTitle}>{setting.title}</Text>
                  <Text style={styles.notifDesc}>{setting.description}</Text>
                </View>
                <Switch
                  value={setting.value}
                  onValueChange={() => handleToggle(setting.key)}
                  trackColor={{ false: Colors.charcoalLight, true: Colors.goldAlpha30 }}
                  thumbColor={setting.value ? Colors.gold : Colors.whiteAlpha30}
                  ios_backgroundColor={Colors.charcoalLight}
                />
              </View>
            ))}
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.black },
  scrollContent: { paddingBottom: 40 },
  summaryCard: { alignItems: 'center' as const, marginHorizontal: 20, marginTop: 16, marginBottom: 28, padding: 28, borderRadius: 14, borderWidth: 0.5, borderColor: Colors.goldAlpha10, overflow: 'hidden' as const },
  summaryTitle: { fontFamily: Typography.serifFamily, color: Colors.white, fontSize: 20, fontWeight: '400' as const, marginTop: 14 },
  summarySubtitle: { fontFamily: Typography.sansFamily, color: Colors.whiteAlpha30, fontSize: 12, fontWeight: '300' as const, marginTop: 4 },
  section: { marginHorizontal: 20 },
  notifRow: { flexDirection: 'row' as const, alignItems: 'center' as const, paddingVertical: 16, borderBottomWidth: 0.5, borderBottomColor: Colors.whiteAlpha05, gap: 14 },
  notifIcon: { width: 42, height: 42, borderRadius: 21, backgroundColor: Colors.goldAlpha08, justifyContent: 'center' as const, alignItems: 'center' as const },
  notifInfo: { flex: 1 },
  notifTitle: { fontFamily: Typography.sansFamily, color: Colors.whiteAlpha80, fontSize: 15, fontWeight: '400' as const },
  notifDesc: { fontFamily: Typography.sansFamily, color: Colors.whiteAlpha20, fontSize: 12, fontWeight: '300' as const, marginTop: 2 },
});
