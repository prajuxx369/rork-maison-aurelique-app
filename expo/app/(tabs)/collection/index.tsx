import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Modal,
  Dimensions,
  Easing,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Minus, Plus, X, Check, ShoppingBag, Sparkles } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { getProductById, CATEGORY_LABELS } from '@/mocks/products';
import { useCollection } from '@/providers/CollectionProvider';
import GoldButton from '@/components/GoldButton';

const { width } = Dimensions.get('window');
const PARTICLE_COUNT = 20;

interface GoldParticle {
  x: Animated.Value;
  y: Animated.Value;
  opacity: Animated.Value;
  scale: Animated.Value;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  size: number;
  duration: number;
}

function createCelebrationParticles(): GoldParticle[] {
  const particles: GoldParticle[] = [];
  const centerX = width / 2;
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const angle = (Math.PI * 2 * i) / PARTICLE_COUNT + (Math.random() - 0.5) * 0.5;
    const distance = 80 + Math.random() * 160;
    particles.push({
      x: new Animated.Value(0),
      y: new Animated.Value(0),
      opacity: new Animated.Value(0),
      scale: new Animated.Value(0),
      startX: centerX,
      startY: 200,
      endX: centerX + Math.cos(angle) * distance,
      endY: 200 + Math.sin(angle) * distance - 40,
      size: 3 + Math.random() * 5,
      duration: 800 + Math.random() * 600,
    });
  }
  return particles;
}

export default function CollectionScreen() {
  const insets = useSafeAreaInsets();
  const { items, updateQuantity, removeItem, clearCollection, totalItems } = useCollection();
  const [showSuccess, setShowSuccess] = useState(false);

  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(20)).current;
  const successScale = useRef(new Animated.Value(0.8)).current;
  const successOpacity = useRef(new Animated.Value(0)).current;
  const checkScale = useRef(new Animated.Value(0)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const qtyAnims = useRef(new Map<number, Animated.Value>()).current;

  const celebrationParticles = useMemo(() => createCelebrationParticles(), []);

  const itemAnims = useRef(new Map<number, { fade: Animated.Value; slide: Animated.Value }>()).current;

  const getItemAnim = useCallback((productId: number) => {
    if (!itemAnims.has(productId)) {
      const fade = new Animated.Value(0);
      const slide = new Animated.Value(30);
      itemAnims.set(productId, { fade, slide });
      Animated.parallel([
        Animated.timing(fade, { toValue: 1, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(slide, { toValue: 0, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]).start();
    }
    return itemAnims.get(productId)!;
  }, [itemAnims]);

  const getQtyAnim = useCallback((productId: number) => {
    if (!qtyAnims.has(productId)) {
      qtyAnims.set(productId, new Animated.Value(1));
    }
    return qtyAnims.get(productId)!;
  }, [qtyAnims]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerFade, { toValue: 1, duration: 700, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(headerSlide, { toValue: 0, duration: 700, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, [headerFade, headerSlide]);

  const subtotal = items.reduce((sum, item) => {
    const product = getProductById(item.productId);
    return sum + (product?.price ?? 0) * item.quantity;
  }, 0);

  const handleCheckout = useCallback(() => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setShowSuccess(true);
  }, []);

  const handleQuantityChange = useCallback((productId: number, newQty: number) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    updateQuantity(productId, newQty);
    const anim = getQtyAnim(productId);
    Animated.sequence([
      Animated.timing(anim, { toValue: 1.25, duration: 80, useNativeDriver: true }),
      Animated.spring(anim, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();
  }, [updateQuantity, getQtyAnim]);

  const handleRemove = useCallback((productId: number) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const anim = itemAnims.get(productId);
    if (anim) {
      Animated.parallel([
        Animated.timing(anim.fade, { toValue: 0, duration: 250, useNativeDriver: true }),
        Animated.timing(anim.slide, { toValue: -20, duration: 250, useNativeDriver: true }),
      ]).start(() => {
        removeItem(productId);
        itemAnims.delete(productId);
      });
    } else {
      removeItem(productId);
    }
  }, [removeItem, itemAnims]);

  useEffect(() => {
    if (showSuccess) {
      successScale.setValue(0.8);
      successOpacity.setValue(0);
      checkScale.setValue(0);
      overlayOpacity.setValue(0);

      Animated.parallel([
        Animated.timing(overlayOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.sequence([
          Animated.delay(100),
          Animated.parallel([
            Animated.spring(successScale, { toValue: 1, friction: 7, tension: 60, useNativeDriver: true }),
            Animated.timing(successOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
          ]),
        ]),
        Animated.sequence([
          Animated.delay(500),
          Animated.spring(checkScale, { toValue: 1, friction: 4, tension: 80, useNativeDriver: true }),
        ]),
      ]).start();

      celebrationParticles.forEach((p) => {
        p.x.setValue(0);
        p.y.setValue(0);
        p.opacity.setValue(0);
        p.scale.setValue(0);

        Animated.sequence([
          Animated.delay(600 + Math.random() * 300),
          Animated.parallel([
            Animated.timing(p.x, { toValue: 1, duration: p.duration, easing: Easing.out(Easing.quad), useNativeDriver: true }),
            Animated.timing(p.y, { toValue: 1, duration: p.duration, easing: Easing.out(Easing.quad), useNativeDriver: true }),
            Animated.sequence([
              Animated.parallel([
                Animated.timing(p.opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
                Animated.spring(p.scale, { toValue: 1, friction: 4, useNativeDriver: true }),
              ]),
              Animated.delay(p.duration * 0.4),
              Animated.timing(p.opacity, { toValue: 0, duration: 400, useNativeDriver: true }),
            ]),
          ]),
        ]).start();
      });
    }
  }, [showSuccess, successScale, successOpacity, checkScale, overlayOpacity, celebrationParticles]);

  const handleCloseSuccess = useCallback(() => {
    Animated.parallel([
      Animated.timing(successOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
      Animated.timing(overlayOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(() => {
      setShowSuccess(false);
      clearCollection();
      itemAnims.clear();
    });
  }, [clearCollection, successOpacity, overlayOpacity, itemAnims]);

  if (items.length === 0 && !showSuccess) {
    return (
      <View style={[styles.container, styles.emptyContainer]}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=1200&q=80' }}
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
            <ShoppingBag color={Colors.goldAlpha40} size={36} strokeWidth={1} />
          </View>
          <Text style={styles.emptyTitle}>Your Collection</Text>
          <Text style={styles.emptySubtitle}>
            Your curated selection of luxury{'\n'}pieces will appear here
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
            <Text style={styles.headerLabel}>YOUR SELECTION</Text>
            <View style={styles.headerBrandLine} />
          </View>
          <Text style={styles.headerTitle}>Collection</Text>
          <View style={styles.headerLine} />
        </Animated.View>

        {items.map((item) => {
          const product = getProductById(item.productId);
          if (!product) return null;

          const anim = getItemAnim(product.id);
          const qtyAnimVal = getQtyAnim(product.id);

          return (
            <Animated.View
              key={product.id}
              style={{ opacity: anim.fade, transform: [{ translateY: anim.slide }] }}
            >
              <View style={styles.itemCard}>
                <Image source={{ uri: product.imageUrl }} style={styles.itemImage} contentFit="cover" />
                <LinearGradient colors={['transparent', Colors.blackAlpha40]} style={styles.itemImageOverlay} />
                <View style={styles.itemInfo}>
                  <View style={styles.itemTop}>
                    <View style={styles.itemNameCol}>
                      <Text style={styles.itemCategory}>{CATEGORY_LABELS[product.category]}</Text>
                      <Text style={styles.itemName}>{product.name}</Text>
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
                    <Text style={styles.itemPrice}>
                      ${(product.price * item.quantity).toLocaleString()}
                    </Text>
                    <View style={styles.stepper}>
                      <TouchableOpacity
                        style={styles.stepperBtn}
                        onPress={() => handleQuantityChange(product.id, item.quantity - 1)}
                        activeOpacity={0.7}
                      >
                        <Minus color={Colors.gold} size={13} strokeWidth={1.5} />
                      </TouchableOpacity>
                      <Animated.Text style={[styles.stepperValue, { transform: [{ scale: qtyAnimVal }] }]}>
                        {item.quantity}
                      </Animated.Text>
                      <TouchableOpacity
                        style={styles.stepperBtn}
                        onPress={() => handleQuantityChange(product.id, item.quantity + 1)}
                        activeOpacity={0.7}
                      >
                        <Plus color={Colors.gold} size={13} strokeWidth={1.5} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </Animated.View>
          );
        })}

        <View style={styles.summary}>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </Text>
            <Text style={styles.summaryTotal}>${subtotal.toLocaleString()}</Text>
          </View>
          <Text style={styles.shippingNote}>Complimentary shipping on all orders</Text>
        </View>

        <View style={styles.checkoutSection}>
          <GoldButton title="Complete Purchase" onPress={handleCheckout} />
        </View>
      </ScrollView>

      <Modal visible={showSuccess} transparent animationType="none" onRequestClose={handleCloseSuccess}>
        <Animated.View style={[styles.modalOverlay, { opacity: overlayOpacity }]}>
          {celebrationParticles.map((p, i) => (
            <Animated.View
              key={i}
              style={[
                styles.celebrationParticle,
                {
                  width: p.size,
                  height: p.size,
                  borderRadius: p.size / 2,
                  opacity: p.opacity,
                  transform: [
                    { translateX: p.x.interpolate({ inputRange: [0, 1], outputRange: [p.startX, p.endX] }) },
                    { translateY: p.y.interpolate({ inputRange: [0, 1], outputRange: [p.startY, p.endY] }) },
                    { scale: p.scale },
                  ],
                },
              ]}
            />
          ))}

          <Animated.View style={[styles.modalContent, { opacity: successOpacity, transform: [{ scale: successScale }] }]}>
            <Animated.View style={[styles.checkCircle, { transform: [{ scale: checkScale }] }]}>
              <Check color={Colors.black} size={30} strokeWidth={2.5} />
            </Animated.View>
            <Text style={styles.modalTitle}>Order Confirmed</Text>
            <View style={styles.modalDivider} />
            <Text style={styles.modalText}>
              Your order has been placed with{'\n'}Maison Aurélique
            </Text>
            <Text style={styles.modalSub}>A confirmation will be sent to your email</Text>
            <GoldButton title="Continue" onPress={handleCloseSuccess} style={{ marginTop: 36 }} />
          </Animated.View>
        </Animated.View>
      </Modal>
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
  headerLine: { width: 30, height: 1, backgroundColor: Colors.gold, marginTop: 16 },
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
  stepper: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 10, backgroundColor: Colors.blackAlpha40, borderRadius: 24, paddingHorizontal: 4, paddingVertical: 4, borderWidth: 0.5, borderColor: Colors.goldAlpha08 },
  stepperBtn: { width: 30, height: 30, borderRadius: 15, backgroundColor: Colors.goldAlpha08, justifyContent: 'center' as const, alignItems: 'center' as const },
  stepperValue: { fontFamily: Typography.serifFamily, color: Colors.white, fontWeight: '400' as const, fontSize: 15, minWidth: 18, textAlign: 'center' as const },
  summary: { marginHorizontal: 20, marginTop: 8, paddingVertical: 20 },
  summaryDivider: { height: 0.5, backgroundColor: Colors.whiteAlpha08, marginBottom: 20 },
  summaryRow: { flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'center' as const },
  summaryLabel: { fontFamily: Typography.sansFamily, color: Colors.whiteAlpha40, fontSize: 14, fontWeight: '300' as const },
  summaryTotal: { fontFamily: Typography.serifFamily, color: Colors.gold, fontSize: 28, fontWeight: '400' as const },
  shippingNote: { fontFamily: Typography.sansFamily, color: Colors.whiteAlpha15, marginTop: 8, fontSize: 11, fontWeight: '300' as const, letterSpacing: 1, textTransform: 'uppercase' as const },
  checkoutSection: { paddingHorizontal: 20, paddingTop: 8 },
  modalOverlay: { flex: 1, backgroundColor: Colors.blackAlpha90, justifyContent: 'center' as const, alignItems: 'center' as const },
  celebrationParticle: { position: 'absolute' as const, backgroundColor: Colors.gold },
  modalContent: { backgroundColor: Colors.charcoalMedium, borderRadius: 16, paddingVertical: 48, paddingHorizontal: 36, alignItems: 'center' as const, marginHorizontal: 28, borderWidth: 0.5, borderColor: Colors.goldAlpha15 },
  checkCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: Colors.gold, justifyContent: 'center' as const, alignItems: 'center' as const, marginBottom: 28 },
  modalTitle: { fontFamily: Typography.serifFamily, fontSize: 26, fontWeight: '400' as const, color: Colors.white, textAlign: 'center' as const, letterSpacing: 0.5 },
  modalDivider: { width: 30, height: 0.5, backgroundColor: Colors.goldAlpha30, marginVertical: 18 },
  modalText: { fontFamily: Typography.sansFamily, color: Colors.whiteAlpha60, textAlign: 'center' as const, lineHeight: 24, fontSize: 15, fontWeight: '300' as const },
  modalSub: { fontFamily: Typography.sansFamily, color: Colors.whiteAlpha20, textAlign: 'center' as const, marginTop: 8, fontSize: 12, fontWeight: '300' as const },
});
