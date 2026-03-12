import React, { useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  TouchableOpacity,
  Dimensions,
  Easing,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Check, Heart, Minus, Plus, Shield, ShoppingBag } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { getProductById, CATEGORY_LABELS } from '@/mocks/products';
import { useCollection } from '@/providers/CollectionProvider';
import { useWishlist } from '@/providers/WishlistProvider';
import GoldButton from '@/components/GoldButton';

const { height } = Dimensions.get('window');
const HERO_HEIGHT = height * 0.50;

interface DetailRowProps {
  label: string;
  value: string;
  delay: number;
}

function DetailRow({ label, value, delay }: DetailRowProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, delay, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, delay, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, slideAnim, delay]);

  return (
    <Animated.View style={[styles.detailRow, { opacity: fadeAnim, transform: [{ translateX: slideAnim }] }]}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </Animated.View>
  );
}

interface NoteBarProps {
  label: string;
  note: string;
  delay: number;
  level: number;
}

function NoteBar({ label, note, delay, level }: NoteBarProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;
  const barWidth = useRef(new Animated.Value(0)).current;
  const widths = [0.55, 0.72, 0.9];
  const targetWidth = widths[level] ?? 0.7;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, delay, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 700, delay, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(barWidth, { toValue: targetWidth, duration: 900, delay: delay + 200, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
    ]).start();
  }, [fadeAnim, slideAnim, barWidth, delay, targetWidth]);

  const animatedBarWidth = barWidth.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <Animated.View style={[styles.noteRow, { opacity: fadeAnim, transform: [{ translateX: slideAnim }] }]}>
      <View style={styles.noteHeader}>
        <View style={styles.noteLabelContainer}>
          <View style={styles.noteDot} />
          <Text style={styles.noteLabelText}>{label}</Text>
        </View>
        <Text style={styles.noteValue}>{note}</Text>
      </View>
      <View style={styles.noteBarTrack}>
        <Animated.View style={[styles.noteBarFill, { width: animatedBarWidth }]} />
      </View>
    </Animated.View>
  );
}

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addItem, isInCollection, items, updateQuantity } = useCollection();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const product = getProductById(Number(id));
  const alreadyAdded = product ? isInCollection(product.id) : false;
  const collectionItem = product ? items.find(i => i.productId === product.id) : undefined;
  const wishlisted = product ? isInWishlist(product.id) : false;

  const heroScale = useRef(new Animated.Value(1.06)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const contentSlide = useRef(new Animated.Value(50)).current;
  const badgeFade = useRef(new Animated.Value(0)).current;
  const badgeSlide = useRef(new Animated.Value(20)).current;
  const addedScale = useRef(new Animated.Value(0)).current;
  const qtyAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(heroScale, { toValue: 1, duration: 6000, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, delay: 200, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(contentSlide, { toValue: 0, duration: 800, delay: 200, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(badgeFade, { toValue: 1, duration: 600, delay: 800, useNativeDriver: true }),
      Animated.timing(badgeSlide, { toValue: 0, duration: 600, delay: 800, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, [heroScale, fadeAnim, contentSlide, badgeFade, badgeSlide]);

  useEffect(() => {
    if (alreadyAdded) {
      Animated.spring(addedScale, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }).start();
    } else {
      addedScale.setValue(0);
    }
  }, [alreadyAdded, addedScale]);

  const handleAdd = useCallback(() => {
    if (!product) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    addItem(product.id);
  }, [product, addItem]);

  const handleWishlistToggle = useCallback(() => {
    if (!product) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleWishlist(product.id);
  }, [product, toggleWishlist]);

  const handleQuantityChange = useCallback((delta: number) => {
    if (!product || !collectionItem) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newQty = collectionItem.quantity + delta;
    if (newQty >= 1) {
      updateQuantity(product.id, newQty);
      Animated.sequence([
        Animated.timing(qtyAnim, { toValue: 1.2, duration: 100, useNativeDriver: true }),
        Animated.spring(qtyAnim, { toValue: 1, friction: 4, useNativeDriver: true }),
      ]).start();
    }
  }, [product, collectionItem, updateQuantity, qtyAnim]);

  if (!product) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Product not found</Text>
      </View>
    );
  }

  const isPerfume = product.category === 'perfumes';
  const details = product.details;
  const detailKeys = Object.keys(details).filter(k =>
    isPerfume ? !['top', 'middle', 'base'].includes(k) : true
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <View style={styles.heroContainer}>
          <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ scale: heroScale }] }]}>
            <Image source={{ uri: product.imageUrl }} style={StyleSheet.absoluteFill} contentFit="cover" />
          </Animated.View>
          <LinearGradient
            colors={['rgba(0,0,0,0.35)', 'transparent', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.95)', Colors.black]}
            locations={[0, 0.25, 0.55, 0.8, 1]}
            style={StyleSheet.absoluteFill}
          />
          <View style={[styles.topBar, { top: insets.top + 8 }]}>
            <TouchableOpacity
              style={styles.backButtonInner}
              onPress={() => router.back()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              testID="back-button"
              activeOpacity={0.7}
            >
              <ArrowLeft color={Colors.white} size={20} strokeWidth={1.5} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.backButtonInner}
              onPress={handleWishlistToggle}
              activeOpacity={0.7}
            >
              <Heart
                color={wishlisted ? Colors.gold : Colors.white}
                size={20}
                strokeWidth={1.5}
                fill={wishlisted ? Colors.gold : 'transparent'}
              />
            </TouchableOpacity>
          </View>
        </View>

        <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: contentSlide }] }]}>
          <View style={styles.brandRow}>
            <View style={styles.brandLine} />
            <Text style={styles.brandLabel}>MAISON AURÉLIQUE</Text>
          </View>

          <Text style={styles.categoryLabel}>{CATEGORY_LABELS[product.category]}</Text>
          <Text style={styles.name}>{product.name}</Text>

          <View style={styles.priceLine}>
            <Text style={styles.price}>${product.price.toLocaleString()}</Text>
            {product.isLimited && (
              <View style={styles.limitedPill}>
                <Text style={styles.limitedPillText}>LIMITED</Text>
              </View>
            )}
          </View>

          <View style={styles.divider} />

          <Text style={styles.description}>{product.description}</Text>

          <View style={styles.divider} />

          {isPerfume && details.top && details.middle && details.base && (
            <>
              <View style={styles.pyramidSection}>
                <View style={styles.pyramidHeader}>
                  <Text style={styles.pyramidTitle}>FRAGRANCE PYRAMID</Text>
                  <View style={styles.pyramidTitleLine} />
                </View>
                <View style={styles.pyramidContainer}>
                  <NoteBar label="TOP" note={details.top} delay={400} level={0} />
                  <NoteBar label="HEART" note={details.middle} delay={600} level={1} />
                  <NoteBar label="BASE" note={details.base} delay={800} level={2} />
                </View>
              </View>
              <View style={styles.divider} />
            </>
          )}

          {detailKeys.length > 0 && (
            <>
              <View style={styles.detailsSection}>
                <Text style={styles.detailsSectionTitle}>DETAILS</Text>
                <View style={styles.detailsTitleLine} />
                {detailKeys.map((key, i) => (
                  <DetailRow
                    key={key}
                    label={key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
                    value={details[key]}
                    delay={400 + i * 100}
                  />
                ))}
              </View>
              <View style={styles.divider} />
            </>
          )}

          <Animated.View style={[styles.badge, { opacity: badgeFade, transform: [{ translateY: badgeSlide }] }]}>
            <View style={styles.badgeIconContainer}>
              <Shield color={Colors.gold} size={20} strokeWidth={1.5} />
            </View>
            <View style={styles.badgeText}>
              <Text style={styles.badgeTitle}>Maison Aurélique Certified</Text>
              <Text style={styles.badgeSub}>Authenticity guaranteed by the Maison</Text>
            </View>
          </Animated.View>

          <View style={styles.addSection}>
            {alreadyAdded && collectionItem ? (
              <Animated.View style={[styles.quantitySection, { transform: [{ scale: addedScale }] }]}>
                <View style={styles.addedRow}>
                  <Check color={Colors.gold} size={16} strokeWidth={2} />
                  <Text style={styles.addedText}>In Your Collection</Text>
                </View>
                <View style={styles.stepper}>
                  <TouchableOpacity style={styles.stepperBtn} onPress={() => handleQuantityChange(-1)} activeOpacity={0.7}>
                    <Minus color={Colors.gold} size={16} strokeWidth={1.5} />
                  </TouchableOpacity>
                  <Animated.Text style={[styles.stepperValue, { transform: [{ scale: qtyAnim }] }]}>
                    {collectionItem.quantity}
                  </Animated.Text>
                  <TouchableOpacity style={styles.stepperBtn} onPress={() => handleQuantityChange(1)} activeOpacity={0.7}>
                    <Plus color={Colors.gold} size={16} strokeWidth={1.5} />
                  </TouchableOpacity>
                </View>
              </Animated.View>
            ) : null}
            <GoldButton
              title={alreadyAdded ? 'Add Another' : 'Add to Collection'}
              onPress={handleAdd}
            />
          </View>
        </Animated.View>
      </ScrollView>

      <View style={[styles.buyNowBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <View style={styles.buyNowPriceCol}>
          <Text style={styles.buyNowPriceLabel}>Price</Text>
          <Text style={styles.buyNowPrice}>${product.price.toLocaleString()}</Text>
        </View>
        <TouchableOpacity
          style={styles.buyNowButton}
          onPress={handleAdd}
          activeOpacity={0.8}
          testID="buy-now-button"
        >
          <ShoppingBag color={Colors.black} size={18} strokeWidth={2} />
          <Text style={styles.buyNowButtonText}>BUY NOW</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.black },
  centered: { justifyContent: 'center' as const, alignItems: 'center' as const },
  errorText: { ...Typography.body, color: Colors.whiteAlpha40 },
  heroContainer: { height: HERO_HEIGHT, position: 'relative' as const },
  topBar: {
    position: 'absolute' as const,
    left: 20,
    right: 20,
    zIndex: 10,
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
  },
  backButtonInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.blackAlpha60,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    borderWidth: 0.5,
    borderColor: Colors.whiteAlpha10,
  },
  content: { paddingHorizontal: 28, paddingTop: 4, paddingBottom: 120 },
  brandRow: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 10, marginBottom: 12 },
  brandLine: { width: 20, height: 0.5, backgroundColor: Colors.goldAlpha30 },
  brandLabel: { fontFamily: Typography.sansFamily, color: Colors.goldAlpha30, letterSpacing: 5, fontSize: 9, fontWeight: '400' as const, textTransform: 'uppercase' as const },
  categoryLabel: { fontFamily: Typography.sansFamily, color: Colors.goldAlpha40, fontSize: 10, letterSpacing: 4, fontWeight: '400' as const, textTransform: 'uppercase' as const, marginBottom: 6 },
  name: { fontFamily: Typography.serifFamily, color: Colors.white, fontSize: 36, fontWeight: '300' as const, letterSpacing: 1, lineHeight: 44, marginBottom: 14 },
  priceLine: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 12 },
  price: { fontFamily: Typography.serifFamily, color: Colors.gold, fontSize: 28, fontWeight: '400' as const },
  limitedPill: { backgroundColor: Colors.goldAlpha10, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 0.5, borderColor: Colors.goldAlpha30 },
  limitedPillText: { fontFamily: Typography.sansFamily, color: Colors.gold, fontSize: 8, fontWeight: '600' as const, letterSpacing: 2 },
  divider: { height: 0.5, backgroundColor: Colors.whiteAlpha08, marginVertical: 28 },
  description: { fontFamily: Typography.sansFamily, color: Colors.whiteAlpha60, lineHeight: 26, fontSize: 15, fontWeight: '300' as const, letterSpacing: 0.2 },
  pyramidSection: { gap: 20 },
  pyramidHeader: { gap: 10 },
  pyramidTitle: { fontFamily: Typography.sansFamily, color: Colors.gold, fontSize: 10, letterSpacing: 5, fontWeight: '500' as const },
  pyramidTitleLine: { width: 24, height: 0.5, backgroundColor: Colors.goldAlpha20 },
  pyramidContainer: { gap: 4 },
  noteRow: { paddingVertical: 14 },
  noteHeader: { flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'space-between' as const, marginBottom: 10 },
  noteLabelContainer: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 10 },
  noteDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: Colors.gold },
  noteLabelText: { fontFamily: Typography.sansFamily, color: Colors.whiteAlpha30, letterSpacing: 4, fontSize: 9, fontWeight: '500' as const, textTransform: 'uppercase' as const },
  noteValue: { fontFamily: Typography.serifFamily, color: Colors.white, fontSize: 18, fontWeight: '400' as const, letterSpacing: 0.5 },
  noteBarTrack: { height: 2, backgroundColor: Colors.whiteAlpha05, borderRadius: 1, overflow: 'hidden' as const },
  noteBarFill: { height: 2, backgroundColor: Colors.goldAlpha30, borderRadius: 1 },
  detailsSection: { gap: 4 },
  detailsSectionTitle: { fontFamily: Typography.sansFamily, color: Colors.gold, fontSize: 10, letterSpacing: 5, fontWeight: '500' as const, marginBottom: 4 },
  detailsTitleLine: { width: 24, height: 0.5, backgroundColor: Colors.goldAlpha20, marginBottom: 12 },
  detailRow: { flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'center' as const, paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: Colors.whiteAlpha05 },
  detailLabel: { fontFamily: Typography.sansFamily, color: Colors.whiteAlpha30, fontSize: 12, fontWeight: '400' as const, letterSpacing: 1, textTransform: 'capitalize' as const },
  detailValue: { fontFamily: Typography.sansFamily, color: Colors.whiteAlpha60, fontSize: 13, fontWeight: '400' as const, textAlign: 'right' as const, maxWidth: '55%' as const },
  badge: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 16, padding: 20, borderRadius: 10, backgroundColor: Colors.charcoalMedium, borderWidth: 0.5, borderColor: Colors.goldAlpha10 },
  badgeIconContainer: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.goldAlpha08, justifyContent: 'center' as const, alignItems: 'center' as const },
  badgeText: { flex: 1 },
  badgeTitle: { fontFamily: Typography.sansFamily, color: Colors.white, fontWeight: '500' as const, fontSize: 14, letterSpacing: 0.2 },
  badgeSub: { fontFamily: Typography.sansFamily, color: Colors.whiteAlpha30, marginTop: 3, fontSize: 12, fontWeight: '300' as const },
  addSection: { marginTop: 40, gap: 20, alignItems: 'center' as const },
  quantitySection: { alignItems: 'center' as const, gap: 14 },
  addedRow: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 8 },
  addedText: { fontFamily: Typography.sansFamily, color: Colors.gold, fontSize: 11, letterSpacing: 2, fontWeight: '400' as const, textTransform: 'uppercase' as const },
  stepper: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 20, backgroundColor: Colors.charcoalMedium, borderRadius: 30, paddingHorizontal: 6, paddingVertical: 6, borderWidth: 0.5, borderColor: Colors.goldAlpha10 },
  stepperBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: Colors.goldAlpha08, justifyContent: 'center' as const, alignItems: 'center' as const },
  stepperValue: { fontFamily: Typography.serifFamily, color: Colors.white, fontWeight: '400' as const, fontSize: 18, minWidth: 24, textAlign: 'center' as const },
  buyNowBar: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingHorizontal: 24,
    paddingTop: 16,
    backgroundColor: Colors.black,
    borderTopWidth: 0.5,
    borderTopColor: Colors.goldAlpha10,
  },
  buyNowPriceCol: {
    gap: 2,
  },
  buyNowPriceLabel: {
    fontFamily: Typography.sansFamily,
    color: Colors.whiteAlpha40,
    fontSize: 11,
    fontWeight: '400' as const,
    letterSpacing: 1,
    textTransform: 'uppercase' as const,
  },
  buyNowPrice: {
    fontFamily: Typography.serifFamily,
    color: Colors.gold,
    fontSize: 22,
    fontWeight: '400' as const,
  },
  buyNowButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 10,
    backgroundColor: Colors.gold,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 4,
  },
  buyNowButtonText: {
    fontFamily: Typography.sansFamily,
    color: Colors.black,
    fontSize: 13,
    fontWeight: '700' as const,
    letterSpacing: 3,
  },
});
