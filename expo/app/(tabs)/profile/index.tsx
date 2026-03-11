import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import {
  User,
  Bell,
  Heart,
  MapPin,
  HelpCircle,
  ChevronRight,
  Crown,
  Package,
  Settings,
  Sparkles,
  Eye,
  Star,
  Lock,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { useWishlist } from '@/providers/WishlistProvider';
import { useCollection } from '@/providers/CollectionProvider';

const { width: _SCREEN_WIDTH } = Dimensions.get('window');
const HEADER_HEIGHT = 280;

interface MenuItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  index: number;
  badge?: string;
}

function MenuItem({ icon, title, subtitle, index, badge }: MenuItemProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;
  const pressScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, delay: 300 + index * 80, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, delay: 300 + index * 80, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, slideAnim, index]);

  const handlePressIn = () => {
    Animated.timing(pressScale, { toValue: 0.98, duration: 80, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressScale, { toValue: 1, friction: 5, useNativeDriver: true }).start();
  };

  const handlePress = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateX: slideAnim }, { scale: pressScale }] }}>
      <TouchableOpacity
        style={styles.menuItem}
        activeOpacity={0.7}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
      >
        <View style={styles.menuItemLeft}>
          <View style={styles.menuIcon}>{icon}</View>
          <View>
            <Text style={styles.menuTitle}>{title}</Text>
            {subtitle && <Text style={styles.menuSub}>{subtitle}</Text>}
          </View>
        </View>
        <View style={styles.menuItemRight}>
          {badge && (
            <View style={styles.menuBadge}>
              <Text style={styles.menuBadgeText}>{badge}</Text>
            </View>
          )}
          <ChevronRight color={Colors.whiteAlpha15} size={16} strokeWidth={1.5} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { count: wishlistCount } = useWishlist();
  const { totalItems } = useCollection();

  const headerFade = useRef(new Animated.Value(0)).current;
  const headerScale = useRef(new Animated.Value(0.95)).current;
  const tierFade = useRef(new Animated.Value(0)).current;
  const tierSlide = useRef(new Animated.Value(20)).current;
  const exclusiveFade = useRef(new Animated.Value(0)).current;
  const exclusiveSlide = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerFade, { toValue: 1, duration: 800, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(headerScale, { toValue: 1, duration: 800, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(tierFade, { toValue: 1, duration: 600, delay: 200, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(tierSlide, { toValue: 0, duration: 600, delay: 200, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(exclusiveFade, { toValue: 1, duration: 600, delay: 400, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(exclusiveSlide, { toValue: 0, duration: 600, delay: 400, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, [headerFade, headerScale, tierFade, tierSlide, exclusiveFade, exclusiveSlide]);

  let menuIndex = 0;

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20 }]}
      >
        <View style={styles.headerBanner}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1200&q=80' }}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.95)', Colors.black]}
            locations={[0, 0.4, 0.75, 1]}
            style={StyleSheet.absoluteFill}
          />
          <Animated.View style={[styles.header, { opacity: headerFade, transform: [{ scale: headerScale }] }]}>
            <View style={styles.avatarOuter}>
              <LinearGradient
                colors={[Colors.goldAlpha20, Colors.goldAlpha05]}
                style={styles.avatarGradient}
              />
              <View style={styles.avatarInner}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80' }}
                  style={styles.avatarImage}
                  contentFit="cover"
                />
              </View>
            </View>
            <Text style={styles.welcomeText}>Welcome</Text>
            <View style={styles.memberRow}>
              <View style={styles.memberLine} />
              <Text style={styles.memberLabel}>DISTINGUISHED MEMBER</Text>
              <View style={styles.memberLine} />
            </View>
          </Animated.View>
        </View>

        <Animated.View style={[styles.tierCard, { opacity: tierFade, transform: [{ translateY: tierSlide }] }]}>
          <View style={styles.tierIconContainer}>
            <Crown color={Colors.gold} size={20} strokeWidth={1.5} />
          </View>
          <View style={styles.tierInfo}>
            <Text style={styles.tierTitle}>Aurélique Gold</Text>
            <Text style={styles.tierSub}>Exclusive access to limited editions</Text>
          </View>
          <View style={styles.tierBadge}>
            <Sparkles color={Colors.gold} size={12} strokeWidth={1.5} />
          </View>
        </Animated.View>

        <Animated.View style={[styles.exclusiveBanner, { opacity: exclusiveFade, transform: [{ translateY: exclusiveSlide }] }]}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=1200&q=80' }}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.8)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.exclusiveBannerBorder} />
          <View style={styles.exclusiveBannerContent}>
            <Lock color={Colors.gold} size={18} strokeWidth={1.5} />
            <View style={styles.exclusiveBannerText}>
              <Text style={styles.exclusiveBannerTitle}>Private Access</Text>
              <Text style={styles.exclusiveBannerSub}>Unlock early access to new collections</Text>
            </View>
            <ChevronRight color={Colors.goldAlpha40} size={16} strokeWidth={1.5} />
          </View>
        </Animated.View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{wishlistCount}</Text>
            <Text style={styles.statLabel}>Wishlist</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totalItems}</Text>
            <Text style={styles.statLabel}>In Bag</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionLabel}>ACCOUNT</Text>
          <MenuItem icon={<User color={Colors.whiteAlpha40} size={18} strokeWidth={1.5} />} title="Personal Details" subtitle="Name, email, phone" index={menuIndex++} />
          <MenuItem icon={<Package color={Colors.whiteAlpha40} size={18} strokeWidth={1.5} />} title="Order History" subtitle="View past purchases" index={menuIndex++} badge="3" />
          <MenuItem icon={<MapPin color={Colors.whiteAlpha40} size={18} strokeWidth={1.5} />} title="Delivery Addresses" subtitle="Manage your addresses" index={menuIndex++} />
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionLabel}>PREFERENCES</Text>
          <MenuItem icon={<Heart color={Colors.whiteAlpha40} size={18} strokeWidth={1.5} />} title="Saved Items" subtitle="Your wishlist" index={menuIndex++} badge={wishlistCount > 0 ? String(wishlistCount) : undefined} />
          <MenuItem icon={<Eye color={Colors.whiteAlpha40} size={18} strokeWidth={1.5} />} title="Recently Viewed" subtitle="Browse history" index={menuIndex++} />
          <MenuItem icon={<Star color={Colors.whiteAlpha40} size={18} strokeWidth={1.5} />} title="Style Preferences" subtitle="Categories & interests" index={menuIndex++} />
          <MenuItem icon={<Bell color={Colors.whiteAlpha40} size={18} strokeWidth={1.5} />} title="Notifications" subtitle="Preferences & alerts" index={menuIndex++} />
          <MenuItem icon={<Settings color={Colors.whiteAlpha40} size={18} strokeWidth={1.5} />} title="Settings" subtitle="App preferences" index={menuIndex++} />
          <MenuItem icon={<HelpCircle color={Colors.whiteAlpha40} size={18} strokeWidth={1.5} />} title="Support" subtitle="Contact our atelier" index={menuIndex++} />
        </View>

        <View style={styles.footer}>
          <View style={styles.footerDividerRow}>
            <View style={styles.footerDividerLine} />
            <Sparkles color={Colors.goldAlpha15} size={10} strokeWidth={1} />
            <View style={styles.footerDividerLine} />
          </View>
          <Text style={styles.footerBrand}>MAISON AURÉLIQUE</Text>
          <Text style={styles.footerVersion}>Version 2.0 — Luxury Maison</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.black },
  scrollContent: { paddingBottom: 48 },
  headerBanner: { height: HEADER_HEIGHT, position: 'relative' as const, justifyContent: 'flex-end' as const },
  header: { alignItems: 'center' as const, paddingVertical: 28 },
  avatarOuter: { width: 88, height: 88, borderRadius: 44, justifyContent: 'center' as const, alignItems: 'center' as const, marginBottom: 18, overflow: 'hidden' as const },
  avatarGradient: { ...StyleSheet.absoluteFillObject },
  avatarInner: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.charcoalMedium, justifyContent: 'center' as const, alignItems: 'center' as const, borderWidth: 0.5, borderColor: Colors.goldAlpha15, overflow: 'hidden' as const },
  avatarImage: { width: 80, height: 80, borderRadius: 40 },
  welcomeText: { fontFamily: Typography.serifFamily, fontSize: 28, fontWeight: '400' as const, color: Colors.white, marginBottom: 8, letterSpacing: 0.5 },
  memberRow: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 10 },
  memberLine: { width: 14, height: 0.5, backgroundColor: Colors.goldAlpha20 },
  memberLabel: { fontFamily: Typography.sansFamily, color: Colors.goldAlpha30, letterSpacing: 5, fontSize: 9, fontWeight: '400' as const, textTransform: 'uppercase' as const },
  tierCard: { flexDirection: 'row' as const, alignItems: 'center' as const, marginHorizontal: 20, marginBottom: 14, padding: 18, borderRadius: 12, backgroundColor: Colors.charcoalMedium, borderWidth: 0.5, borderColor: Colors.goldAlpha10, gap: 14 },
  tierIconContainer: { width: 42, height: 42, borderRadius: 21, backgroundColor: Colors.goldAlpha08, justifyContent: 'center' as const, alignItems: 'center' as const },
  tierInfo: { flex: 1 },
  tierTitle: { fontFamily: Typography.serifFamily, color: Colors.gold, fontSize: 17, fontWeight: '400' as const, letterSpacing: 0.3 },
  tierSub: { fontFamily: Typography.sansFamily, color: Colors.whiteAlpha30, marginTop: 3, fontSize: 12, fontWeight: '300' as const },
  tierBadge: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.goldAlpha08, justifyContent: 'center' as const, alignItems: 'center' as const },
  exclusiveBanner: { marginHorizontal: 20, marginBottom: 24, borderRadius: 12, overflow: 'hidden' as const },
  exclusiveBannerBorder: { ...StyleSheet.absoluteFillObject, borderRadius: 12, borderWidth: 0.5, borderColor: Colors.goldAlpha15 },
  exclusiveBannerContent: { flexDirection: 'row' as const, alignItems: 'center' as const, padding: 18, gap: 14 },
  exclusiveBannerText: { flex: 1 },
  exclusiveBannerTitle: { fontFamily: Typography.sansFamily, color: Colors.gold, fontSize: 14, fontWeight: '500' as const, letterSpacing: 0.3 },
  exclusiveBannerSub: { fontFamily: Typography.sansFamily, color: Colors.whiteAlpha30, fontSize: 12, fontWeight: '300' as const, marginTop: 2 },
  statsRow: { flexDirection: 'row' as const, marginHorizontal: 20, marginBottom: 28, paddingVertical: 20, borderTopWidth: 0.5, borderBottomWidth: 0.5, borderColor: Colors.whiteAlpha05 },
  statItem: { flex: 1, alignItems: 'center' as const },
  statValue: { fontFamily: Typography.serifFamily, color: Colors.white, fontSize: 24, fontWeight: '400' as const, marginBottom: 4 },
  statLabel: { fontFamily: Typography.sansFamily, color: Colors.whiteAlpha30, fontSize: 11, fontWeight: '300' as const, letterSpacing: 1, textTransform: 'uppercase' as const },
  statDivider: { width: 0.5, backgroundColor: Colors.whiteAlpha08 },
  menuSection: { marginBottom: 24 },
  sectionLabel: { fontFamily: Typography.sansFamily, color: Colors.whiteAlpha15, paddingHorizontal: 20, marginBottom: 6, letterSpacing: 4, fontSize: 9, fontWeight: '500' as const, textTransform: 'uppercase' as const },
  menuItem: { flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'space-between' as const, paddingVertical: 15, paddingHorizontal: 20, borderBottomWidth: 0.5, borderBottomColor: Colors.whiteAlpha05 },
  menuItemLeft: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 14 },
  menuItemRight: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 8 },
  menuIcon: { width: 38, height: 38, borderRadius: 19, backgroundColor: Colors.whiteAlpha05, justifyContent: 'center' as const, alignItems: 'center' as const },
  menuTitle: { fontFamily: Typography.sansFamily, color: Colors.whiteAlpha80, fontWeight: '400' as const, fontSize: 15, letterSpacing: 0.2 },
  menuSub: { fontFamily: Typography.sansFamily, color: Colors.whiteAlpha20, fontSize: 11, marginTop: 2, fontWeight: '300' as const },
  menuBadge: { backgroundColor: Colors.goldAlpha10, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2, borderWidth: 0.5, borderColor: Colors.goldAlpha20 },
  menuBadgeText: { fontFamily: Typography.sansFamily, color: Colors.gold, fontSize: 11, fontWeight: '500' as const },
  footer: { alignItems: 'center' as const, paddingTop: 32, paddingBottom: 16, gap: 14 },
  footerDividerRow: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 10 },
  footerDividerLine: { width: 20, height: 0.5, backgroundColor: Colors.whiteAlpha08 },
  footerBrand: { fontFamily: Typography.sansFamily, color: Colors.whiteAlpha15, letterSpacing: 6, fontSize: 9, fontWeight: '400' as const, textTransform: 'uppercase' as const },
  footerVersion: { fontFamily: Typography.sansFamily, color: Colors.whiteAlpha08, fontSize: 11, fontWeight: '300' as const },
});
