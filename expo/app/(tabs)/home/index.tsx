import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Dimensions,
  TouchableOpacity,
  Easing,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, Sparkles, Search, Crown, ArrowRight, Droplets, Diamond, Star } from 'lucide-react-native';
import type { Href } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { Typography } from '@/constants/typography';
import {
  products,
  getFeaturedProducts,
  getNewArrivals,
  getLimitedEditions,
  getProductsByCategory,
  CATEGORIES,
  CATEGORY_LABELS,
  CATEGORY_IMAGES,
  type Category,
} from '@/mocks/products';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.68;
const CARD_HEIGHT = 380;
const CARD_GAP = 14;
const HERO_HEIGHT = height * 0.78;
const CAT_TILE_WIDTH = width * 0.38;
const CAT_TILE_HEIGHT = 200;
const WATCH_CARD_W = width * 0.52;
const WATCH_CARD_H = 300;
const RING_COUNT = 4;
const ORB_COUNT = 6;

interface FloatingOrb {
  anim: Animated.Value;
  x: number;
  size: number;
  startY: number;
  drift: number;
  duration: number;
  delay: number;
}

function createOrbs(): FloatingOrb[] {
  const arr: FloatingOrb[] = [];
  for (let i = 0; i < ORB_COUNT; i++) {
    arr.push({
      anim: new Animated.Value(0),
      x: Math.random() * width,
      size: 3 + Math.random() * 5,
      startY: HERO_HEIGHT * 0.5 + Math.random() * HERO_HEIGHT * 0.35,
      drift: (Math.random() - 0.5) * 60,
      duration: 4000 + Math.random() * 3000,
      delay: Math.random() * 3000,
    });
  }
  return arr;
}

function useStaggeredFade(count: number, baseDelay = 400, stagger = 100) {
  const anims = useRef(
    Array.from({ length: count }, () => ({
      fade: new Animated.Value(0),
      slide: new Animated.Value(30),
    }))
  ).current;

  useEffect(() => {
    anims.forEach((a, i) => {
      Animated.parallel([
        Animated.timing(a.fade, {
          toValue: 1,
          duration: 600,
          delay: baseDelay + i * stagger,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(a.slide, {
          toValue: 0,
          duration: 600,
          delay: baseDelay + i * stagger,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, [anims, baseDelay, stagger]);

  return anims;
}

function GoldShimmerBar({ delay = 0, barWidth = 60 }: { delay?: number; barWidth?: number }) {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 2400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [shimmer, delay]);

  const translateX = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-barWidth * 2, barWidth * 2],
  });

  return (
    <View style={{ width: barWidth, height: 1, backgroundColor: Colors.goldAlpha15, overflow: 'hidden' as const }}>
      <Animated.View style={{ position: 'absolute' as const, top: 0, left: 0, width: barWidth, height: 1, transform: [{ translateX }] }}>
        <LinearGradient
          colors={['transparent', Colors.goldAlpha60, 'transparent']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{ width: barWidth, height: 1 }}
        />
      </Animated.View>
    </View>
  );
}

function ExpandingRing({ delay = 0, maxSize = 200 }: { delay?: number; maxSize?: number }) {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(scale, { toValue: 1, duration: 4000, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0, duration: 4000, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(scale, { toValue: 0, duration: 0, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0.5, duration: 0, useNativeDriver: true }),
        ]),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [scale, opacity, delay]);

  return (
    <Animated.View
      style={{
        position: 'absolute' as const,
        width: maxSize,
        height: maxSize,
        borderRadius: maxSize / 2,
        borderWidth: 1,
        borderColor: Colors.goldAlpha20,
        alignSelf: 'center' as const,
        top: '35%',
        opacity,
        transform: [{ scale }],
      }}
    />
  );
}

function BreathingGlow({ size = 240, delay = 0 }: { size?: number; delay?: number }) {
  const pulse = useRef(new Animated.Value(0.2)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(pulse, { toValue: 0.7, duration: 3500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.2, duration: 3500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [pulse, delay]);

  return (
    <Animated.View
      style={{
        position: 'absolute' as const,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: 'rgba(212,175,55,0.04)',
        top: '28%',
        alignSelf: 'center' as const,
        opacity: pulse,
      }}
    />
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const heroImageFade = useRef(new Animated.Value(0)).current;
  const heroImageScale = useRef(new Animated.Value(1.18)).current;
  const heroBrandFade = useRef(new Animated.Value(0)).current;
  const heroBrandSlide = useRef(new Animated.Value(-20)).current;
  const heroTitleFade = useRef(new Animated.Value(0)).current;
  const heroTitleSlide = useRef(new Animated.Value(50)).current;
  const heroDescFade = useRef(new Animated.Value(0)).current;
  const heroCtaFade = useRef(new Animated.Value(0)).current;
  const heroCtaScale = useRef(new Animated.Value(0.9)).current;
  const heroLineExpand = useRef(new Animated.Value(0)).current;
  const heroVerticalLine = useRef(new Animated.Value(0)).current;
  const heroSideLabelFade = useRef(new Animated.Value(0)).current;
  const heroBottomFade = useRef(new Animated.Value(0)).current;
  const heroGlowBreath = useRef(new Animated.Value(0)).current;
  const heroOverlayShimmer = useRef(new Animated.Value(-1)).current;
  const heroDiamondSpin = useRef(new Animated.Value(0)).current;
  const scrollIndicator = useRef(new Animated.Value(0)).current;

  const sectionFades = useRef(
    Array.from({ length: 10 }, () => ({
      fade: new Animated.Value(0),
      slide: new Animated.Value(40),
    }))
  ).current;

  const orbs = useMemo(() => createOrbs(), []);

  const featured = getFeaturedProducts().slice(0, 4);
  const newArrivals = getNewArrivals().slice(0, 6);
  const _limited = getLimitedEditions().slice(0, 4);
  const watches = getProductsByCategory('watches').slice(0, 4);
  const clothing = getProductsByCategory('clothing').slice(0, 4);
  const bags = getProductsByCategory('bags').slice(0, 4);

  const featuredAnims = useStaggeredFade(featured.length, 600, 120);

  useEffect(() => {
    Animated.stagger(200, [
      Animated.parallel([
        Animated.timing(heroImageFade, { toValue: 1, duration: 1800, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(heroImageScale, { toValue: 1, duration: 15000, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(heroBrandFade, { toValue: 1, duration: 1000, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(heroBrandSlide, { toValue: 0, duration: 1000, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(heroLineExpand, { toValue: 1, duration: 900, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
        Animated.timing(heroVerticalLine, { toValue: 1, duration: 700, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
      ]),
      Animated.parallel([
        Animated.timing(heroTitleFade, { toValue: 1, duration: 1200, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(heroTitleSlide, { toValue: 0, duration: 1200, easing: Easing.bezier(0.22, 1, 0.36, 1), useNativeDriver: true }),
      ]),
      Animated.timing(heroDescFade, { toValue: 1, duration: 800, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(heroCtaFade, { toValue: 1, duration: 700, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.spring(heroCtaScale, { toValue: 1, friction: 8, tension: 60, useNativeDriver: true }),
      ]),
      Animated.timing(heroSideLabelFade, { toValue: 1, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(heroBottomFade, { toValue: 1, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();

    const glowAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(heroGlowBreath, { toValue: 0.8, duration: 4000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(heroGlowBreath, { toValue: 0, duration: 4000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );
    glowAnim.start();

    const shimmerAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(heroOverlayShimmer, { toValue: 1, duration: 4500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.delay(2000),
        Animated.timing(heroOverlayShimmer, { toValue: -1, duration: 0, useNativeDriver: true }),
      ])
    );
    shimmerAnim.start();

    const diamondAnim = Animated.loop(
      Animated.timing(heroDiamondSpin, { toValue: 1, duration: 12000, easing: Easing.linear, useNativeDriver: true })
    );
    diamondAnim.start();

    const scrollAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(scrollIndicator, { toValue: 1, duration: 1500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(scrollIndicator, { toValue: 0, duration: 1500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );
    scrollAnim.start();

    orbs.forEach((orb) => {
      const animateOrb = () => {
        orb.anim.setValue(0);
        Animated.sequence([
          Animated.delay(orb.delay),
          Animated.timing(orb.anim, { toValue: 1, duration: orb.duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        ]).start(() => animateOrb());
      };
      animateOrb();
    });

    sectionFades.forEach((s, i) => {
      Animated.parallel([
        Animated.timing(s.fade, { toValue: 1, duration: 800, delay: 500 + i * 220, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(s.slide, { toValue: 0, duration: 800, delay: 500 + i * 220, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]).start();
    });

    return () => {
      glowAnim.stop();
      shimmerAnim.stop();
      diamondAnim.stop();
      scrollAnim.stop();
    };
  }, [heroImageFade, heroImageScale, heroBrandFade, heroBrandSlide, heroTitleFade, heroTitleSlide, heroDescFade, heroCtaFade, heroCtaScale, heroLineExpand, heroVerticalLine, heroSideLabelFade, heroBottomFade, heroGlowBreath, heroOverlayShimmer, heroDiamondSpin, scrollIndicator, sectionFades, orbs]);

  const navigateProduct = useCallback((id: number) => {
    if (Platform.OS !== 'web') {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push(`/product/${id}`);
  }, [router]);

  const navigateShop = useCallback((_cat?: Category) => {
    if (Platform.OS !== 'web') {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push('/(tabs)/shop');
  }, [router]);

  const heroLineW = heroLineExpand.interpolate({ inputRange: [0, 1], outputRange: [0, 60] });
  const heroVLineH = heroVerticalLine.interpolate({ inputRange: [0, 1], outputRange: [0, 40] });
  const shimmerTranslateX = heroOverlayShimmer.interpolate({ inputRange: [-1, 0, 1], outputRange: [-width, 0, width] });
  const diamondRotate = heroDiamondSpin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const scrollBounce = scrollIndicator.interpolate({ inputRange: [0, 1], outputRange: [0, 8] });

  const renderSectionHeader = (label: string, title: string, onSeeAll?: () => void, withShimmer = false) => (
    <View style={styles.sectionHeader}>
      <View>
        <View style={styles.sectionLabelRow}>
          {withShimmer && <GoldShimmerBar delay={200} barWidth={32} />}
          <Text style={styles.sectionLabel}>{label}</Text>
        </View>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {onSeeAll && (
        <TouchableOpacity onPress={onSeeAll} style={styles.seeAllBtn} activeOpacity={0.7}>
          <Text style={styles.seeAllText}>See All</Text>
          <ChevronRight color={Colors.gold} size={14} strokeWidth={1.5} />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderProductCard = (p: typeof products[0], w: number, h: number, showCategory = false) => (
    <TouchableOpacity
      key={p.id}
      style={[styles.productCard, { width: w, height: h }]}
      activeOpacity={0.85}
      onPress={() => navigateProduct(p.id)}
      testID={`product-card-${p.id}`}
    >
      <Image source={{ uri: p.imageUrl }} style={StyleSheet.absoluteFill} contentFit="cover" />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.92)']}
        locations={[0.2, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.cardBorder} />
      {p.isNew && (
        <View style={styles.newBadge}>
          <Text style={styles.newBadgeText}>NEW</Text>
        </View>
      )}
      {p.isLimited && (
        <View style={styles.limitedBadge}>
          <Text style={styles.limitedBadgeText}>LIMITED</Text>
        </View>
      )}
      <View style={styles.cardContent}>
        {showCategory && (
          <Text style={styles.cardCategory}>{CATEGORY_LABELS[p.category]}</Text>
        )}
        <Text style={styles.cardName} numberOfLines={1}>{p.name}</Text>
        <View style={styles.cardBottom}>
          <Text style={styles.cardPrice}>${p.price.toLocaleString()}</Text>
          <View style={styles.cardArrow}>
            <ChevronRight color={Colors.gold} size={14} strokeWidth={2} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 48 }}>
        {/* ========== NEW HERO ========== */}
        <View style={[styles.heroContainer, { paddingTop: insets.top }]}>
          <Animated.View style={[StyleSheet.absoluteFill, { opacity: heroImageFade, transform: [{ scale: heroImageScale }] }]}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=1200&q=80' }}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
            />
          </Animated.View>

          <LinearGradient
            colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.15)', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,0.7)', Colors.black]}
            locations={[0, 0.25, 0.45, 0.72, 1]}
            style={StyleSheet.absoluteFill}
          />

          <BreathingGlow size={300} delay={500} />
          <Animated.View style={[styles.heroGlowCenter, { opacity: heroGlowBreath }]} />

          {Array.from({ length: RING_COUNT }).map((_, i) => (
            <ExpandingRing key={`ring-${i}`} delay={i * 1200} maxSize={180 + i * 80} />
          ))}

          {orbs.map((orb, i) => {
            const orbOpacity = orb.anim.interpolate({ inputRange: [0, 0.3, 0.7, 1], outputRange: [0, 0.6, 0.6, 0] });
            const orbY = orb.anim.interpolate({ inputRange: [0, 1], outputRange: [orb.startY, orb.startY - 120] });
            const orbX = orb.anim.interpolate({ inputRange: [0, 1], outputRange: [orb.x, orb.x + orb.drift] });
            return (
              <Animated.View
                key={`orb-${i}`}
                style={{
                  position: 'absolute' as const,
                  width: orb.size,
                  height: orb.size,
                  borderRadius: orb.size / 2,
                  backgroundColor: Colors.gold,
                  opacity: orbOpacity,
                  transform: [{ translateX: orbX }, { translateY: orbY }],
                }}
              />
            );
          })}

          <Animated.View style={[styles.heroShimmerOverlay, { transform: [{ translateX: shimmerTranslateX }] }]}>
            <LinearGradient
              colors={['transparent', 'rgba(212,175,55,0.05)', 'transparent']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={{ width: width * 0.6, height: HERO_HEIGHT }}
            />
          </Animated.View>

          <TouchableOpacity
            style={[styles.searchBtn, { top: insets.top + 12 }]}
            onPress={() => router.push('/search' as Href)}
            activeOpacity={0.7}
          >
            <Search color={Colors.whiteAlpha60} size={18} strokeWidth={1.5} />
          </TouchableOpacity>

          {/* Brand mark top-left */}
          <Animated.View style={[styles.heroBrandMark, { top: insets.top + 14, opacity: heroBrandFade, transform: [{ translateX: heroBrandSlide }] }]}>
            <Text style={styles.heroBrandMarkText}>MAISON</Text>
            <Text style={styles.heroBrandMarkAccent}>AURÉLIQUE</Text>
          </Animated.View>

          {/* Vertical gold accent line */}
          <Animated.View style={[styles.heroVerticalLine, { height: heroVLineH }]} />

          {/* Side label */}
          <Animated.View style={[styles.heroSideLabel, { opacity: heroSideLabelFade }]}>
            <Text style={styles.heroSideLabelText}>EST. MMXXIV</Text>
          </Animated.View>

          {/* Rotating diamond accent */}
          <Animated.View style={[styles.heroDiamondWrap, { transform: [{ rotate: diamondRotate }] }]}>
            <Diamond color={Colors.goldAlpha30} size={16} strokeWidth={1} />
          </Animated.View>

          {/* Main hero content - centered dramatic layout */}
          <View style={styles.heroContentWrap}>
            <Animated.View style={[styles.heroLabelRow, { opacity: heroBrandFade }]}>
              <Animated.View style={[styles.heroLabelLine, { width: heroLineW }]} />
              <Droplets color={Colors.gold} size={11} strokeWidth={1.2} />
              <Text style={styles.heroLabelText}>LA COLLECTION</Text>
              <Animated.View style={[styles.heroLabelLine, { width: heroLineW }]} />
            </Animated.View>

            <Animated.Text style={[styles.heroTitle, { opacity: heroTitleFade, transform: [{ translateY: heroTitleSlide }] }]}>
              {"The Art of\nRefined\nLuxury"}
            </Animated.Text>

            <Animated.View style={[styles.heroDescWrap, { opacity: heroDescFade }]}>
              <Text style={styles.heroDesc}>
                {"Where rare craftsmanship meets\ntimeless elegance"}
              </Text>
            </Animated.View>

            <Animated.View style={{ opacity: heroCtaFade, transform: [{ scale: heroCtaScale }] }}>
              <TouchableOpacity
                style={styles.heroCtaBtn}
                activeOpacity={0.8}
                onPress={() => navigateShop('perfumes')}
              >
                <LinearGradient
                  colors={[Colors.goldDark, Colors.gold, Colors.goldLight]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
                <Star color={Colors.black} size={12} strokeWidth={2} style={{ marginRight: 8 }} />
                <Text style={styles.heroCtaText}>EXPLORE THE MAISON</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* Bottom info row */}
          <Animated.View style={[styles.heroBottomRow, { opacity: heroBottomFade }]}>
            <View style={styles.heroBottomItem}>
              <Text style={styles.heroBottomNumber}>58</Text>
              <Text style={styles.heroBottomLabel}>PIECES</Text>
            </View>
            <View style={styles.heroBottomDivider} />
            <View style={styles.heroBottomItem}>
              <Text style={styles.heroBottomNumber}>7</Text>
              <Text style={styles.heroBottomLabel}>COLLECTIONS</Text>
            </View>
            <View style={styles.heroBottomDivider} />
            <View style={styles.heroBottomItem}>
              <Text style={styles.heroBottomNumber}>1</Text>
              <Text style={styles.heroBottomLabel}>MAISON</Text>
            </View>
          </Animated.View>

          {/* Scroll indicator */}
          <Animated.View style={[styles.scrollIndicator, { transform: [{ translateY: scrollBounce }] }]}>
            <View style={styles.scrollLine} />
          </Animated.View>
        </View>

        {/* ========== SECTIONS ========== */}
        <Animated.View style={[styles.section, { opacity: sectionFades[0].fade, transform: [{ translateY: sectionFades[0].slide }] }]}>
          {renderSectionHeader('EXPLORE', 'The Maison', () => navigateShop(), true)}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={styles.catTile}
                activeOpacity={0.85}
                onPress={() => navigateShop(cat)}
              >
                <Image source={{ uri: CATEGORY_IMAGES[cat] }} style={StyleSheet.absoluteFill} contentFit="cover" />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.75)']}
                  locations={[0.3, 1]}
                  style={StyleSheet.absoluteFill}
                />
                <View style={styles.catTileBorder} />
                <View style={styles.catTileContent}>
                  <Text style={styles.catTileName}>{CATEGORY_LABELS[cat]}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        <View style={styles.dividerRow}>
          <GoldShimmerBar delay={0} barWidth={80} />
          <Sparkles color={Colors.goldAlpha30} size={10} strokeWidth={1} />
          <GoldShimmerBar delay={400} barWidth={80} />
        </View>

        <Animated.View style={[styles.section, { opacity: sectionFades[1].fade, transform: [{ translateY: sectionFades[1].slide }] }]}>
          {renderSectionHeader('JUST ARRIVED', 'New Arrivals', () => navigateShop(), true)}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carouselContent} decelerationRate="fast" snapToInterval={CARD_WIDTH + CARD_GAP}>
            {newArrivals.map((p, i) => (
              <Animated.View key={p.id} style={{ opacity: featuredAnims[Math.min(i, featuredAnims.length - 1)]?.fade ?? 1, transform: [{ translateY: featuredAnims[Math.min(i, featuredAnims.length - 1)]?.slide ?? 0 }] }}>
                {renderProductCard(p, CARD_WIDTH, CARD_HEIGHT, true)}
              </Animated.View>
            ))}
          </ScrollView>
        </Animated.View>

        <Animated.View style={[styles.section, { opacity: sectionFades[2].fade, transform: [{ translateY: sectionFades[2].slide }] }]}>
          {renderSectionHeader('ICONIC', 'Signature Collection', () => navigateShop())}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carouselContent} decelerationRate="fast" snapToInterval={CARD_WIDTH + CARD_GAP}>
            {featured.map((p) => renderProductCard(p, CARD_WIDTH, CARD_HEIGHT, true))}
          </ScrollView>
        </Animated.View>

        <View style={styles.dividerRow}>
          <GoldShimmerBar delay={200} barWidth={60} />
          <Crown color={Colors.goldAlpha20} size={10} strokeWidth={1} />
          <GoldShimmerBar delay={600} barWidth={60} />
        </View>

        <Animated.View style={[styles.section, { opacity: sectionFades[3].fade, transform: [{ translateY: sectionFades[3].slide }] }]}>
          <View style={styles.spotlightHeader}>
            <GoldShimmerBar delay={0} barWidth={28} />
            <Text style={styles.spotlightLabel}>HAUTE HORLOGERIE</Text>
            <GoldShimmerBar delay={300} barWidth={28} />
          </View>
          <Text style={styles.spotlightTitle}>Watches</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carouselContent} decelerationRate="fast" snapToInterval={WATCH_CARD_W + CARD_GAP}>
            {watches.map((p) => renderProductCard(p, WATCH_CARD_W, WATCH_CARD_H))}
          </ScrollView>
        </Animated.View>

        <Animated.View style={[styles.section, { opacity: sectionFades[4].fade, transform: [{ translateY: sectionFades[4].slide }] }]}>
          {renderSectionHeader('THE EDIT', 'Fashion', () => navigateShop())}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carouselContent} decelerationRate="fast" snapToInterval={CARD_WIDTH + CARD_GAP}>
            {clothing.map((p) => renderProductCard(p, CARD_WIDTH, CARD_HEIGHT))}
          </ScrollView>
        </Animated.View>

        <Animated.View style={[styles.section, { opacity: sectionFades[5].fade, transform: [{ translateY: sectionFades[5].slide }] }]}>
          {renderSectionHeader('LEATHER GOODS', 'Bags', () => navigateShop())}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carouselContent} decelerationRate="fast" snapToInterval={CARD_WIDTH + CARD_GAP}>
            {bags.map((p) => renderProductCard(p, CARD_WIDTH, CARD_HEIGHT))}
          </ScrollView>
        </Animated.View>

        <Animated.View style={[styles.storySection, { opacity: sectionFades[6].fade, transform: [{ translateY: sectionFades[6].slide }] }]}>
          <View style={styles.storyDividerRow}>
            <GoldShimmerBar delay={0} barWidth={32} />
            <Sparkles color={Colors.goldAlpha40} size={14} strokeWidth={1} />
            <GoldShimmerBar delay={400} barWidth={32} />
          </View>
          <Text style={styles.storyLabel}>THE ATELIER</Text>
          <Text style={styles.storyText}>
            Founded in the heart of Paris, Maison Aurélique crafts each piece as a work of art — blending rare materials with time-honored techniques to create objects that transcend the ordinary. From fragrance to fashion, watches to jewelry, every creation embodies quiet luxury and uncompromising craft.
          </Text>
          <View style={styles.storyDividerRow}>
            <GoldShimmerBar delay={200} barWidth={32} />
            <Sparkles color={Colors.goldAlpha40} size={14} strokeWidth={1} />
            <GoldShimmerBar delay={600} barWidth={32} />
          </View>
        </Animated.View>

        <Animated.View style={[styles.section, { opacity: sectionFades[7].fade, transform: [{ translateY: sectionFades[7].slide }] }]}>
          <TouchableOpacity style={styles.limitedBanner} activeOpacity={0.85} onPress={() => navigateShop()}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=1200&q=80' }}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
            />
            <LinearGradient
              colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.85)']}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.limitedBannerBorder} />
            <View style={styles.limitedBannerContent}>
              <View style={styles.limitedBannerRow}>
                <Crown color={Colors.gold} size={16} strokeWidth={1.5} />
                <Text style={styles.limitedBannerLabel}>EXCLUSIVE</Text>
              </View>
              <Text style={styles.limitedBannerTitle}>{"Limited\nEditions"}</Text>
              <Text style={styles.limitedBannerDesc}>Discover rare pieces available for a limited time</Text>
              <View style={styles.limitedBannerCta}>
                <Text style={styles.limitedBannerCtaText}>EXPLORE</Text>
                <ArrowRight color={Colors.gold} size={14} strokeWidth={2} />
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[styles.ctaSection, { opacity: sectionFades[8].fade, transform: [{ translateY: sectionFades[8].slide }] }]}>
          <Text style={styles.ctaLabel}>YOUR JOURNEY</Text>
          <Text style={styles.ctaTitle}>{"Enter the World of\nMaison Aurélique"}</Text>
          <TouchableOpacity
            style={styles.ctaButton}
            activeOpacity={0.85}
            onPress={() => navigateShop()}
          >
            <LinearGradient
              colors={[Colors.goldLight, Colors.gold, Colors.goldDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <Text style={styles.ctaButtonText}>DISCOVER THE MAISON</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.black },

  heroContainer: { height: HERO_HEIGHT, position: 'relative' as const, overflow: 'hidden' as const },
  heroGlowCenter: {
    position: 'absolute' as const,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(212,175,55,0.05)',
    top: '30%',
    alignSelf: 'center' as const,
  },
  heroShimmerOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  searchBtn: {
    position: 'absolute' as const,
    right: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.blackAlpha60,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    borderWidth: 0.5,
    borderColor: Colors.whiteAlpha10,
  },

  heroBrandMark: {
    position: 'absolute' as const,
    left: 24,
    zIndex: 10,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 6,
  },
  heroBrandMarkText: {
    fontFamily: Typography.sansFamily,
    color: Colors.whiteAlpha40,
    fontSize: 10,
    letterSpacing: 4,
    fontWeight: '300' as const,
  },
  heroBrandMarkAccent: {
    fontFamily: Typography.serifFamily,
    color: Colors.gold,
    fontSize: 10,
    letterSpacing: 3,
    fontWeight: '400' as const,
  },

  heroVerticalLine: {
    position: 'absolute' as const,
    left: 28,
    top: '22%',
    width: 1,
    backgroundColor: Colors.goldAlpha20,
  },

  heroSideLabel: {
    position: 'absolute' as const,
    right: -18,
    top: '45%',
    transform: [{ rotate: '90deg' }],
    zIndex: 5,
  },
  heroSideLabelText: {
    fontFamily: Typography.sansFamily,
    color: Colors.goldAlpha20,
    fontSize: 8,
    letterSpacing: 6,
    fontWeight: '300' as const,
  },

  heroDiamondWrap: {
    position: 'absolute' as const,
    left: 22,
    top: '38%',
    zIndex: 5,
  },

  heroContentWrap: {
    position: 'absolute' as const,
    bottom: 110,
    left: 0,
    right: 0,
    alignItems: 'center' as const,
    zIndex: 5,
    paddingHorizontal: 28,
  },
  heroLabelRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 12,
    marginBottom: 20,
  },
  heroLabelLine: { height: 1, backgroundColor: Colors.goldAlpha30 },
  heroLabelText: {
    fontFamily: Typography.sansFamily,
    color: Colors.gold,
    fontSize: 9,
    letterSpacing: 6,
    fontWeight: '400' as const,
  },
  heroTitle: {
    fontFamily: Typography.serifFamily,
    color: Colors.white,
    fontSize: 44,
    fontWeight: '300' as const,
    letterSpacing: 1.5,
    lineHeight: 54,
    textAlign: 'center' as const,
    marginBottom: 16,
  },
  heroDescWrap: {
    marginBottom: 28,
  },
  heroDesc: {
    fontFamily: Typography.sansFamily,
    color: Colors.whiteAlpha40,
    fontSize: 13,
    lineHeight: 22,
    fontWeight: '300' as const,
    letterSpacing: 0.5,
    textAlign: 'center' as const,
  },
  heroCtaBtn: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: 15,
    paddingHorizontal: 32,
    borderRadius: 3,
    overflow: 'hidden' as const,
  },
  heroCtaText: {
    fontFamily: Typography.sansFamily,
    color: Colors.black,
    fontSize: 10,
    fontWeight: '700' as const,
    letterSpacing: 3,
  },

  heroBottomRow: {
    position: 'absolute' as const,
    bottom: 44,
    left: 0,
    right: 0,
    flexDirection: 'row' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    gap: 24,
    zIndex: 5,
  },
  heroBottomItem: {
    alignItems: 'center' as const,
  },
  heroBottomNumber: {
    fontFamily: Typography.serifFamily,
    color: Colors.gold,
    fontSize: 20,
    fontWeight: '300' as const,
    letterSpacing: 1,
  },
  heroBottomLabel: {
    fontFamily: Typography.sansFamily,
    color: Colors.whiteAlpha30,
    fontSize: 8,
    letterSpacing: 3,
    fontWeight: '400' as const,
    marginTop: 2,
  },
  heroBottomDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.whiteAlpha10,
  },

  scrollIndicator: {
    position: 'absolute' as const,
    bottom: 16,
    alignSelf: 'center' as const,
    zIndex: 5,
  },
  scrollLine: {
    width: 1,
    height: 16,
    backgroundColor: Colors.goldAlpha30,
  },

  section: { paddingTop: 44 },
  sectionHeader: { flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'flex-end' as const, paddingHorizontal: 28, marginBottom: 20 },
  sectionLabelRow: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 8, marginBottom: 6 },
  sectionLabel: { fontFamily: Typography.sansFamily, color: Colors.goldAlpha40, fontSize: 9, letterSpacing: 4, fontWeight: '400' as const, textTransform: 'uppercase' as const },
  sectionTitle: { fontFamily: Typography.serifFamily, fontSize: 26, fontWeight: '400' as const, color: Colors.white, letterSpacing: 0.5 },
  seeAllBtn: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 4, paddingBottom: 4 },
  seeAllText: { fontFamily: Typography.sansFamily, color: Colors.gold, fontSize: 11, letterSpacing: 2, fontWeight: '400' as const, textTransform: 'uppercase' as const },
  dividerRow: { flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'center' as const, gap: 14, paddingVertical: 32 },
  catRow: { paddingHorizontal: 28, gap: 12 },
  catTile: { width: CAT_TILE_WIDTH, height: CAT_TILE_HEIGHT, borderRadius: 10, overflow: 'hidden' as const, backgroundColor: Colors.charcoalMedium },
  catTileBorder: { ...StyleSheet.absoluteFillObject, borderRadius: 10, borderWidth: 0.5, borderColor: Colors.whiteAlpha08 },
  catTileContent: { position: 'absolute' as const, bottom: 0, left: 0, right: 0, padding: 14 },
  catTileName: { fontFamily: Typography.serifFamily, color: Colors.white, fontSize: 16, fontWeight: '400' as const, letterSpacing: 0.3 },
  carouselContent: { paddingHorizontal: 28, gap: CARD_GAP },
  productCard: { borderRadius: 10, overflow: 'hidden' as const, backgroundColor: Colors.charcoalMedium },
  cardBorder: { ...StyleSheet.absoluteFillObject, borderRadius: 10, borderWidth: 0.5, borderColor: Colors.whiteAlpha08 },
  newBadge: { position: 'absolute' as const, top: 14, left: 14, backgroundColor: Colors.gold, borderRadius: 3, paddingHorizontal: 8, paddingVertical: 3 },
  newBadgeText: { fontFamily: Typography.sansFamily, color: Colors.black, fontSize: 8, fontWeight: '700' as const, letterSpacing: 2 },
  limitedBadge: { position: 'absolute' as const, top: 14, right: 14, backgroundColor: Colors.blackAlpha60, borderRadius: 3, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 0.5, borderColor: Colors.goldAlpha30 },
  limitedBadgeText: { fontFamily: Typography.sansFamily, color: Colors.gold, fontSize: 8, fontWeight: '600' as const, letterSpacing: 2 },
  cardContent: { position: 'absolute' as const, bottom: 0, left: 0, right: 0, padding: 18 },
  cardCategory: { fontFamily: Typography.sansFamily, color: Colors.goldAlpha40, fontSize: 9, letterSpacing: 3, fontWeight: '400' as const, textTransform: 'uppercase' as const, marginBottom: 6 },
  cardName: { fontFamily: Typography.serifFamily, fontSize: 20, fontWeight: '400' as const, color: Colors.white, letterSpacing: 0.3, marginBottom: 8 },
  cardBottom: { flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'center' as const },
  cardPrice: { fontFamily: Typography.serifFamily, fontSize: 18, color: Colors.gold, fontWeight: '400' as const },
  cardArrow: { width: 30, height: 30, borderRadius: 15, backgroundColor: Colors.goldAlpha10, justifyContent: 'center' as const, alignItems: 'center' as const },
  spotlightHeader: { flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'center' as const, gap: 14, marginBottom: 8 },
  spotlightTitle: { fontFamily: Typography.serifFamily, fontSize: 30, fontWeight: '300' as const, color: Colors.white, textAlign: 'center' as const, letterSpacing: 1, marginBottom: 20 },
  spotlightLabel: { fontFamily: Typography.sansFamily, color: Colors.goldAlpha40, fontSize: 9, letterSpacing: 5, fontWeight: '400' as const },
  storySection: { paddingHorizontal: 32, paddingVertical: 52, alignItems: 'center' as const },
  storyDividerRow: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 12 },
  storyLabel: { fontFamily: Typography.sansFamily, color: Colors.gold, marginTop: 24, marginBottom: 18, letterSpacing: 6, fontSize: 10, fontWeight: '400' as const, textTransform: 'uppercase' as const },
  storyText: { fontFamily: Typography.sansFamily, color: Colors.whiteAlpha40, textAlign: 'center' as const, lineHeight: 26, fontSize: 14, fontWeight: '300' as const, letterSpacing: 0.3, marginBottom: 28 },
  limitedBanner: { marginHorizontal: 20, height: 280, borderRadius: 12, overflow: 'hidden' as const, backgroundColor: Colors.charcoalMedium },
  limitedBannerBorder: { ...StyleSheet.absoluteFillObject, borderRadius: 12, borderWidth: 0.5, borderColor: Colors.goldAlpha15 },
  limitedBannerContent: { position: 'absolute' as const, bottom: 0, left: 0, right: 0, padding: 24 },
  limitedBannerRow: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 8, marginBottom: 10 },
  limitedBannerLabel: { fontFamily: Typography.sansFamily, color: Colors.gold, fontSize: 9, letterSpacing: 5, fontWeight: '500' as const },
  limitedBannerTitle: { fontFamily: Typography.serifFamily, color: Colors.white, fontSize: 32, fontWeight: '300' as const, lineHeight: 38, marginBottom: 8 },
  limitedBannerDesc: { fontFamily: Typography.sansFamily, color: Colors.whiteAlpha40, fontSize: 13, fontWeight: '300' as const, marginBottom: 16 },
  limitedBannerCta: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 8 },
  limitedBannerCtaText: { fontFamily: Typography.sansFamily, color: Colors.gold, fontSize: 11, letterSpacing: 3, fontWeight: '500' as const },
  ctaSection: { paddingHorizontal: 28, paddingVertical: 52, alignItems: 'center' as const },
  ctaLabel: { fontFamily: Typography.sansFamily, color: Colors.goldAlpha40, fontSize: 9, letterSpacing: 5, fontWeight: '400' as const, marginBottom: 14 },
  ctaTitle: { fontFamily: Typography.serifFamily, color: Colors.white, fontSize: 28, fontWeight: '300' as const, textAlign: 'center' as const, lineHeight: 36, letterSpacing: 0.5, marginBottom: 32 },
  ctaButton: { paddingVertical: 17, paddingHorizontal: 40, borderRadius: 4, overflow: 'hidden' as const, alignItems: 'center' as const },
  ctaButtonText: { fontFamily: Typography.sansFamily, color: Colors.black, fontSize: 13, fontWeight: '600' as const, letterSpacing: 3 },
});
