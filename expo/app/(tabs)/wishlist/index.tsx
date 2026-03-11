import React, { useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, Sparkles, X, ShoppingBag } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { getProductById, CATEGORY_LABELS, products } from '@/mocks/products';
import { useWishlist } from '@/providers/WishlistProvider';
import { useCollection } from '@/providers/CollectionProvider';

export default function WishlistScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { wishlistIds, toggleWishlist } = useWishlist();
  const { addItem } = useCollection();

  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerFade, { toValue: 1, duration: 700, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(headerSlide, { toValue: 0, duration: 700, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, [headerFade, headerSlide]);

  const wishlistProducts = wishlistIds
    .map(id => getProductById(id))
    .filter((p): p is NonNullable<typeof p> => p != null);

  const recommended = products
    .filter(p => !wishlistIds.includes(p.id) && p.isFeatured)
    .slice(0, 4);

  const handleRemove = useCallback((id: number) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleWishlist(id);
  }, [toggleWishlist]);

  const handleAddToCollection = useCallback((id: number) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    addItem(id);
  }, [addItem]);

  const handleCardPress = useCallback((id: number) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/product/${id}`);
  }, [router]);

  if (wishlistProducts.length === 0) {
    return (
      <View style={[styles.container, styles.emptyContainer]}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=1200&q=80' }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
        />
        <LinearGradient
          colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.75)', 'rgba(0,0,0,0.95)']}
          locations={[0, 0.5, 1]}
          style={StyleSheet.absoluteFill}
        />
        <View style={[styles.emptyContent, { paddingTop: insets.top }]}>
          <View style={styles.emptyIconCircle}>
            <Heart color={Colors.goldAlpha40} size={36} strokeWidth={1} />
          </View>
          <Text style={styles.emptyTitle}>Your Wishlist</Text>
          <Text style={styles.emptySubtitle}>
            Save pieces you love and{'\n'}create your dream collection
          </Text>
          <View style={styles.emptyDividerRow}>
            <View style={styles.emptyDividerLine} />
            <Sparkles color={Colors.goldAlpha20} size={10} strokeWidth={1} />
            <View style={styles.emptyDividerLine} />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20 }]}
      >
        <Animated.View style={[styles.header, { opacity: headerFade, transform: [{ translateY: headerSlide }] }]}>
          <View style={styles.headerBrandRow}>
            <View style={styles.headerBrandLine} />
            <Text style={styles.headerLabel}>SAVED PIECES</Text>
            <View style={styles.headerBrandLine} />
          </View>
          <Text style={styles.headerTitle}>Wishlist</Text>
          <View style={styles.headerLine} />
          <Text style={styles.headerCount}>{wishlistProducts.length} {wishlistProducts.length === 1 ? 'piece' : 'pieces'}</Text>
        </Animated.View>

        {wishlistProducts.map((product) => (
          <TouchableOpacity
            key={product.id}
            style={styles.itemCard}
            activeOpacity={0.85}
            onPress={() => handleCardPress(product.id)}
          >
            <Image source={{ uri: product.imageUrl }} style={styles.itemImage} contentFit="cover" />
            <LinearGradient colors={['transparent', Colors.blackAlpha40]} style={styles.itemImageOverlay} />
            <View style={styles.itemInfo}>
              <View style={styles.itemTop}>
                <View style={styles.itemNameCol}>
                  <Text style={styles.itemCategory}>{CATEGORY_LABELS[product.category]}</Text>
                  <Text style={styles.itemName} numberOfLines={1}>{product.name}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleRemove(product.id)}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  style={styles.removeBtn}
                  activeOpacity={0.6}
                >
                  <X color={Colors.whiteAlpha30} size={14} strokeWidth={1.5} />
                </TouchableOpacity>
              </View>
              <View style={styles.itemBottom}>
                <Text style={styles.itemPrice}>${product.price.toLocaleString()}</Text>
                <TouchableOpacity
                  style={styles.addBtn}
                  onPress={() => handleAddToCollection(product.id)}
                  activeOpacity={0.7}
                >
                  <ShoppingBag color={Colors.gold} size={14} strokeWidth={1.5} />
                  <Text style={styles.addBtnText}>ADD</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {recommended.length > 0 && (
          <View style={styles.recommendedSection}>
            <View style={styles.recDividerRow}>
              <View style={styles.recDividerLine} />
              <Sparkles color={Colors.goldAlpha20} size={10} strokeWidth={1} />
              <View style={styles.recDividerLine} />
            </View>
            <Text style={styles.recLabel}>YOU MAY ALSO LOVE</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recRow}
            >
              {recommended.map((p) => (
                <TouchableOpacity
                  key={p.id}
                  style={styles.recCard}
                  activeOpacity={0.85}
                  onPress={() => handleCardPress(p.id)}
                >
                  <Image source={{ uri: p.imageUrl }} style={StyleSheet.absoluteFill} contentFit="cover" />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.85)']}
                    locations={[0.3, 1]}
                    style={StyleSheet.absoluteFill}
                  />
                  <View style={styles.recCardBorder} />
                  <View style={styles.recCardContent}>
                    <Text style={styles.recCardCategory}>{CATEGORY_LABELS[p.category]}</Text>
                    <Text style={styles.recCardName} numberOfLines={1}>{p.name}</Text>
                    <Text style={styles.recCardPrice}>${p.price.toLocaleString()}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.black },
  emptyContainer: { justifyContent: 'center' as const, alignItems: 'center' as const },
  emptyContent: { alignItems: 'center' as const, paddingHorizontal: 40 },
  emptyIconCircle: { width: 88, height: 88, borderRadius: 44, borderWidth: 0.5, borderColor: Colors.whiteAlpha08, backgroundColor: Colors.whiteAlpha05, justifyContent: 'center' as const, alignItems: 'center' as const, marginBottom: 28 },
  emptyTitle: { fontFamily: Typography.serifFamily, fontSize: 26, fontWeight: '400' as const, color: Colors.white, marginBottom: 12, letterSpacing: 0.5 },
  emptySubtitle: { fontFamily: Typography.sansFamily, color: Colors.whiteAlpha30, textAlign: 'center' as const, lineHeight: 22, fontSize: 14, fontWeight: '300' as const },
  emptyDividerRow: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 10, marginTop: 32 },
  emptyDividerLine: { width: 20, height: 0.5, backgroundColor: Colors.goldAlpha15 },
  scrollContent: { paddingBottom: 48 },
  header: { alignItems: 'center' as const, paddingBottom: 28 },
  headerBrandRow: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 10, marginBottom: 12 },
  headerBrandLine: { width: 16, height: 0.5, backgroundColor: Colors.goldAlpha20 },
  headerLabel: { fontFamily: Typography.sansFamily, color: Colors.goldAlpha30, letterSpacing: 5, fontSize: 9, fontWeight: '400' as const, textTransform: 'uppercase' as const },
  headerTitle: { fontFamily: Typography.serifFamily, fontSize: 34, fontWeight: '300' as const, color: Colors.white, letterSpacing: 1 },
  headerLine: { width: 30, height: 1, backgroundColor: Colors.gold, marginTop: 16, marginBottom: 8 },
  headerCount: { fontFamily: Typography.sansFamily, color: Colors.whiteAlpha30, fontSize: 12, fontWeight: '300' as const },
  itemCard: { flexDirection: 'row' as const, marginHorizontal: 20, marginBottom: 14, backgroundColor: Colors.charcoalMedium, borderRadius: 10, overflow: 'hidden' as const, borderWidth: 0.5, borderColor: Colors.whiteAlpha05 },
  itemImage: { width: 105, height: 135 },
  itemImageOverlay: { position: 'absolute' as const, left: 0, top: 0, width: 105, height: 135 },
  itemInfo: { flex: 1, padding: 16, justifyContent: 'space-between' as const },
  itemTop: { flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'flex-start' as const },
  itemNameCol: { flex: 1, marginRight: 8 },
  itemCategory: { fontFamily: Typography.sansFamily, color: Colors.goldAlpha40, fontSize: 9, letterSpacing: 3, fontWeight: '400' as const, textTransform: 'uppercase' as const, marginBottom: 4 },
  itemName: { fontFamily: Typography.serifFamily, color: Colors.white, fontSize: 17, fontWeight: '400' as const, letterSpacing: 0.3 },
  removeBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.whiteAlpha05, justifyContent: 'center' as const, alignItems: 'center' as const },
  itemBottom: { flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'center' as const, marginTop: 8 },
  itemPrice: { fontFamily: Typography.serifFamily, color: Colors.gold, fontSize: 19, fontWeight: '400' as const },
  addBtn: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 6, backgroundColor: Colors.goldAlpha08, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7, borderWidth: 0.5, borderColor: Colors.goldAlpha15 },
  addBtnText: { fontFamily: Typography.sansFamily, color: Colors.gold, fontSize: 10, fontWeight: '600' as const, letterSpacing: 2 },
  recommendedSection: { paddingTop: 32, alignItems: 'center' as const },
  recDividerRow: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 10, marginBottom: 16 },
  recDividerLine: { width: 20, height: 0.5, backgroundColor: Colors.goldAlpha15 },
  recLabel: { fontFamily: Typography.sansFamily, color: Colors.goldAlpha30, fontSize: 9, letterSpacing: 5, fontWeight: '400' as const, marginBottom: 20 },
  recRow: { paddingHorizontal: 20, gap: 12 },
  recCard: { width: 160, height: 220, borderRadius: 8, overflow: 'hidden' as const, backgroundColor: Colors.charcoalMedium },
  recCardBorder: { ...StyleSheet.absoluteFillObject, borderRadius: 8, borderWidth: 0.5, borderColor: Colors.whiteAlpha08 },
  recCardContent: { position: 'absolute' as const, bottom: 0, left: 0, right: 0, padding: 12 },
  recCardCategory: { fontFamily: Typography.sansFamily, color: Colors.goldAlpha40, fontSize: 8, letterSpacing: 3, fontWeight: '400' as const, textTransform: 'uppercase' as const, marginBottom: 4 },
  recCardName: { fontFamily: Typography.serifFamily, color: Colors.white, fontSize: 14, fontWeight: '400' as const, marginBottom: 4 },
  recCardPrice: { fontFamily: Typography.serifFamily, color: Colors.gold, fontSize: 14, fontWeight: '400' as const },
});
