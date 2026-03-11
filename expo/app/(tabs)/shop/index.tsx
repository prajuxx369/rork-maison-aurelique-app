import React, { useRef, useEffect, useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Easing,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Heart, Sparkles } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { Typography } from '@/constants/typography';
import {
  products,
  CATEGORIES,
  CATEGORY_LABELS,
  type Category,
  type Product,
} from '@/mocks/products';
import { useWishlist } from '@/providers/WishlistProvider';

const _width = Dimensions.get('window').width;
const COLUMN_GAP = 14;
const PADDING = 24;

const ALL_TABS: Array<{ key: 'all' | Category; label: string }> = [
  { key: 'all', label: 'All' },
  ...CATEGORIES.map(c => ({ key: c, label: CATEGORY_LABELS[c] })),
];

export default function ShopScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [activeTab, setActiveTab] = useState<'all' | Category>('all');

  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(20)).current;
  const headerLineWidth = useRef(new Animated.Value(0)).current;
  const gridFade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerFade, { toValue: 1, duration: 800, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(headerSlide, { toValue: 0, duration: 800, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(headerLineWidth, { toValue: 1, duration: 900, delay: 300, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
    ]).start();
  }, [headerFade, headerSlide, headerLineWidth]);

  const filtered = activeTab === 'all' ? products : products.filter(p => p.category === activeTab);

  const handleTabChange = useCallback((tab: 'all' | Category) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    gridFade.setValue(0.3);
    setActiveTab(tab);
    Animated.timing(gridFade, { toValue: 1, duration: 350, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  }, [gridFade]);

  const handleCardPress = useCallback((id: number) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/product/${id}`);
  }, [router]);

  const handleWishlist = useCallback((id: number) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleWishlist(id);
  }, [toggleWishlist]);

  const leftColumn = filtered.filter((_, i) => i % 2 === 0);
  const rightColumn = filtered.filter((_, i) => i % 2 !== 0);

  const animatedLineW = headerLineWidth.interpolate({ inputRange: [0, 1], outputRange: [0, 30] });

  const renderCard = (product: Product, isLeft: boolean) => {
    const cardHeight = isLeft ? 270 : 230;
    const wishlisted = isInWishlist(product.id);

    return (
      <TouchableOpacity
        key={product.id}
        style={[styles.card, { height: cardHeight }]}
        activeOpacity={0.85}
        onPress={() => handleCardPress(product.id)}
        testID={`shop-card-${product.id}`}
      >
        <Image source={{ uri: product.imageUrl }} style={StyleSheet.absoluteFill} contentFit="cover" />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.92)']}
          locations={[0.15, 0.5, 1]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.cardBorder} />
        <TouchableOpacity
          style={styles.wishlistBtn}
          onPress={() => handleWishlist(product.id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          activeOpacity={0.7}
        >
          <Heart
            color={wishlisted ? Colors.gold : Colors.whiteAlpha40}
            size={16}
            strokeWidth={1.5}
            fill={wishlisted ? Colors.gold : 'transparent'}
          />
        </TouchableOpacity>
        {product.isNew && (
          <View style={styles.newTag}>
            <Text style={styles.newTagText}>NEW</Text>
          </View>
        )}
        {product.isLimited && !product.isNew && (
          <View style={styles.limitedTag}>
            <Text style={styles.limitedTagText}>LIMITED</Text>
          </View>
        )}
        <View style={styles.cardContent}>
          <Text style={styles.cardCategory}>{CATEGORY_LABELS[product.category]}</Text>
          <Text style={styles.cardName} numberOfLines={1}>{product.name}</Text>
          <Text style={styles.cardPrice}>${product.price.toLocaleString()}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20 }]}
      >
        <Animated.View style={[styles.header, { opacity: headerFade, transform: [{ translateY: headerSlide }] }]}>
          <View style={styles.headerBrandRow}>
            <View style={styles.headerBrandLine} />
            <Text style={styles.headerLabel}>MAISON AURÉLIQUE</Text>
            <View style={styles.headerBrandLine} />
          </View>
          <Text style={styles.headerTitle}>The Boutique</Text>
          <View style={styles.headerLineContainer}>
            <Animated.View style={[styles.headerLine, { width: animatedLineW }]} />
          </View>
          <Text style={styles.headerSub}>{filtered.length} luxury pieces</Text>
        </Animated.View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsRow}
        >
          {ALL_TABS.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.tabActive]}
              onPress={() => handleTabChange(tab.key)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Animated.View style={[styles.grid, { opacity: gridFade }]}>
          <View style={styles.column}>
            {leftColumn.map((p) => renderCard(p, true))}
          </View>
          <View style={[styles.column, { marginTop: 44 }]}>
            {rightColumn.map((p) => renderCard(p, false))}
          </View>
        </Animated.View>

        <View style={styles.footerSection}>
          <View style={styles.footerDividerRow}>
            <View style={styles.footerDividerLine} />
            <Sparkles color={Colors.goldAlpha30} size={12} strokeWidth={1} />
            <View style={styles.footerDividerLine} />
          </View>
          <Text style={styles.footerText}>Crafted with distinction</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.black },
  scrollContent: { paddingBottom: 48 },
  header: { paddingHorizontal: PADDING, paddingBottom: 24, alignItems: 'center' as const },
  headerBrandRow: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 10, marginBottom: 14 },
  headerBrandLine: { width: 16, height: 0.5, backgroundColor: Colors.goldAlpha20 },
  headerLabel: { fontFamily: Typography.sansFamily, color: Colors.goldAlpha30, letterSpacing: 5, fontSize: 9, fontWeight: '400' as const, textTransform: 'uppercase' as const },
  headerTitle: { fontFamily: Typography.serifFamily, fontSize: 34, fontWeight: '300' as const, color: Colors.white, textAlign: 'center' as const, letterSpacing: 1 },
  headerLineContainer: { alignItems: 'center' as const, marginVertical: 16 },
  headerLine: { height: 1, backgroundColor: Colors.gold },
  headerSub: { fontFamily: Typography.sansFamily, fontSize: 13, color: Colors.whiteAlpha30, textAlign: 'center' as const, fontWeight: '300' as const, letterSpacing: 0.3 },
  tabsRow: { paddingHorizontal: PADDING, gap: 8, marginBottom: 24 },
  tab: { paddingHorizontal: 18, paddingVertical: 9, borderRadius: 20, backgroundColor: Colors.whiteAlpha05, borderWidth: 0.5, borderColor: Colors.whiteAlpha08 },
  tabActive: { backgroundColor: Colors.goldAlpha10, borderColor: Colors.goldAlpha30 },
  tabText: { fontFamily: Typography.sansFamily, color: Colors.whiteAlpha30, fontSize: 12, fontWeight: '400' as const, letterSpacing: 1 },
  tabTextActive: { color: Colors.gold },
  grid: { flexDirection: 'row' as const, paddingHorizontal: PADDING, gap: COLUMN_GAP },
  column: { flex: 1, gap: 14 },
  card: { width: '100%' as const, borderRadius: 8, overflow: 'hidden' as const, backgroundColor: Colors.charcoalMedium },
  cardBorder: { ...StyleSheet.absoluteFillObject, borderRadius: 8, borderWidth: 0.5, borderColor: Colors.whiteAlpha08, zIndex: 2 },
  wishlistBtn: {
    position: 'absolute' as const,
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.blackAlpha60,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    zIndex: 5,
  },
  newTag: { position: 'absolute' as const, top: 10, left: 10, backgroundColor: Colors.gold, borderRadius: 3, paddingHorizontal: 7, paddingVertical: 3, zIndex: 3 },
  newTagText: { fontFamily: Typography.sansFamily, color: Colors.black, fontSize: 8, fontWeight: '700' as const, letterSpacing: 2 },
  limitedTag: { position: 'absolute' as const, top: 10, left: 10, backgroundColor: Colors.blackAlpha60, borderRadius: 3, paddingHorizontal: 7, paddingVertical: 3, borderWidth: 0.5, borderColor: Colors.goldAlpha30, zIndex: 3 },
  limitedTagText: { fontFamily: Typography.sansFamily, color: Colors.gold, fontSize: 8, fontWeight: '600' as const, letterSpacing: 2 },
  cardContent: { position: 'absolute' as const, bottom: 0, left: 0, right: 0, padding: 14 },
  cardCategory: { fontFamily: Typography.sansFamily, color: Colors.goldAlpha40, fontSize: 8, letterSpacing: 3, fontWeight: '400' as const, textTransform: 'uppercase' as const, marginBottom: 4 },
  cardName: { fontFamily: Typography.serifFamily, fontSize: 15, fontWeight: '400' as const, color: Colors.white, marginBottom: 6, letterSpacing: 0.3 },
  cardPrice: { fontFamily: Typography.serifFamily, fontSize: 17, color: Colors.gold, fontWeight: '400' as const },
  footerSection: { alignItems: 'center' as const, paddingTop: 40, paddingHorizontal: 32, gap: 16 },
  footerDividerRow: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 10 },
  footerDividerLine: { width: 24, height: 0.5, backgroundColor: Colors.goldAlpha15 },
  footerText: { fontFamily: Typography.sansFamily, color: Colors.whiteAlpha20, fontSize: 11, letterSpacing: 2, fontWeight: '300' as const, textTransform: 'uppercase' as const },
});
