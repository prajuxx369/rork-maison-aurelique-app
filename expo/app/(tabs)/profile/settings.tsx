import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Animated,
  Easing,
  Alert,
} from 'react-native';
import { Stack } from 'expo-router';
import {
  Globe,
  Moon,
  Shield,
  Smartphone,
  Palette,
  CreditCard,
  LogOut,
  ChevronRight,
  Info,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { Typography } from '@/constants/typography';

interface ToggleSetting {
  key: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  value: boolean;
}

const INITIAL_TOGGLES: ToggleSetting[] = [
  { key: 'biometric', icon: <Shield color={Colors.whiteAlpha40} size={18} strokeWidth={1.5} />, title: 'Biometric Login', subtitle: 'Face ID / Fingerprint', value: true },
  { key: 'darkMode', icon: <Moon color={Colors.whiteAlpha40} size={18} strokeWidth={1.5} />, title: 'Dark Mode', subtitle: 'Always on', value: true },
  { key: 'haptics', icon: <Smartphone color={Colors.whiteAlpha40} size={18} strokeWidth={1.5} />, title: 'Haptic Feedback', subtitle: 'Touch vibrations', value: true },
];

interface LinkSetting {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  action: () => void;
}

export default function SettingsScreen() {
  const [toggles, setToggles] = useState<ToggleSetting[]>(INITIAL_TOGGLES);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  }, [fadeAnim]);

  const handleToggle = (key: string) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setToggles(prev => prev.map(t => t.key === key ? { ...t, value: !t.value } : t));
  };

  const linkSettings: LinkSetting[] = [
    { icon: <Globe color={Colors.whiteAlpha40} size={18} strokeWidth={1.5} />, title: 'Language', subtitle: 'English', action: () => Alert.alert('Language', 'Language selector would open here.') },
    { icon: <Palette color={Colors.whiteAlpha40} size={18} strokeWidth={1.5} />, title: 'Currency', subtitle: 'USD ($)', action: () => Alert.alert('Currency', 'Currency selector would open here.') },
    { icon: <CreditCard color={Colors.whiteAlpha40} size={18} strokeWidth={1.5} />, title: 'Payment Methods', subtitle: 'Manage cards', action: () => Alert.alert('Payment Methods', 'Payment methods screen would open here.') },
    { icon: <Info color={Colors.whiteAlpha40} size={18} strokeWidth={1.5} />, title: 'About', subtitle: 'Version 2.0', action: () => Alert.alert('Maison Aurélique', 'Version 2.0\nLuxury Maison App\n\n© 2026 Maison Aurélique') },
  ];

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: 'Settings', headerStyle: { backgroundColor: Colors.black }, headerTintColor: Colors.white, headerTitleStyle: { fontFamily: Typography.serifFamily, fontSize: 18, fontWeight: '400' as const } }} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PREFERENCES</Text>
            {toggles.map((toggle) => (
              <View key={toggle.key} style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <View style={styles.settingIcon}>{toggle.icon}</View>
                  <View>
                    <Text style={styles.settingTitle}>{toggle.title}</Text>
                    <Text style={styles.settingSub}>{toggle.subtitle}</Text>
                  </View>
                </View>
                <Switch
                  value={toggle.value}
                  onValueChange={() => handleToggle(toggle.key)}
                  trackColor={{ false: Colors.charcoalLight, true: Colors.goldAlpha30 }}
                  thumbColor={toggle.value ? Colors.gold : Colors.whiteAlpha30}
                  ios_backgroundColor={Colors.charcoalLight}
                />
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>GENERAL</Text>
            {linkSettings.map((setting, i) => (
              <TouchableOpacity key={i} style={styles.settingRow} activeOpacity={0.7} onPress={() => { void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setting.action(); }}>
                <View style={styles.settingLeft}>
                  <View style={styles.settingIcon}>{setting.icon}</View>
                  <View>
                    <Text style={styles.settingTitle}>{setting.title}</Text>
                    <Text style={styles.settingSub}>{setting.subtitle}</Text>
                  </View>
                </View>
                <ChevronRight color={Colors.whiteAlpha15} size={16} strokeWidth={1.5} />
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={styles.logoutButton}
            activeOpacity={0.7}
            onPress={() => {
              void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
              Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Sign Out', style: 'destructive' },
              ]);
            }}
          >
            <LogOut color={Colors.danger} size={18} strokeWidth={1.5} />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.black },
  scrollContent: { paddingBottom: 40 },
  section: { marginBottom: 28 },
  sectionTitle: { fontFamily: Typography.sansFamily, color: Colors.whiteAlpha15, paddingHorizontal: 20, marginBottom: 6, marginTop: 20, letterSpacing: 4, fontSize: 9, fontWeight: '500' as const, textTransform: 'uppercase' as const },
  settingRow: { flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'space-between' as const, paddingVertical: 14, paddingHorizontal: 20, borderBottomWidth: 0.5, borderBottomColor: Colors.whiteAlpha05 },
  settingLeft: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 14, flex: 1 },
  settingIcon: { width: 38, height: 38, borderRadius: 19, backgroundColor: Colors.whiteAlpha05, justifyContent: 'center' as const, alignItems: 'center' as const },
  settingTitle: { fontFamily: Typography.sansFamily, color: Colors.whiteAlpha80, fontSize: 15, fontWeight: '400' as const },
  settingSub: { fontFamily: Typography.sansFamily, color: Colors.whiteAlpha20, fontSize: 11, fontWeight: '300' as const, marginTop: 2 },
  logoutButton: { flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'center' as const, gap: 10, marginHorizontal: 20, marginTop: 16, paddingVertical: 16, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(192,57,43,0.3)' },
  logoutText: { fontFamily: Typography.sansFamily, color: Colors.danger, fontSize: 15, fontWeight: '500' as const },
});
