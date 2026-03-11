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
import { ChevronRight, Sparkles, Search, Crown, ArrowRight, Droplets } from 'lucide-react-native';
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
const HERO_HEIGHT = height * 0.68;
const CAT_TILE_WIDTH = width * 0.38;
const CAT_TILE_HEIGHT = 200;
const WATCH_CARD_W = width * 0.52;
const WATCH_CARD_H = 300;
const MIST_COUNT = 18;

interface MistParticle {
  x: Animated.Value;
  y: Animated.Value;
  opacity: Animated.Value;
  size: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  duration: number;
  delay: number;
}

function createMistParticles(): MistParticle[] {
  const arr: MistParticle[] = [];
  for (let i = 0; i < MIST_COUNT; i++) {
    const startX = Math.random() * width;
    const startY = HERO_HEIGHT * 0.3 + Math.random() * HERO_HEIGHT * 0.5;
    arr.push({
      x: new Animated.Value(0),
      y: new Animated.Value(0),
      opacity: new Animated.Value(0),
      size: 2 + Math.random() * 4,
      startX,
      startY,
      endX: startX + (Math.random() - 0.5) * 100,
      endY: startY - 40 - Math.random() * 140,
      duration: 3000 + Math.random() * 2500,
      delay: Math.random() * 2200,
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

function PulsingGlow({ size = 200, color = Colors.goldAlpha08, topPercent = 40, delay = 0 }: { size?: number; color?: string; topPercent?: number; delay?: number }) {
  const pulse = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.4,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [pulse, delay]);

  const topValue = (topPercent / 100) * HERO_HEIGHT;

  return (
    <Animated.View
      style={{
        position: 'absolute' as const,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        top: topValue,
        alignSelf: 'center' as const,
        opacity: pulse,
      }}
    />
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const heroFade = useRef(new Animated.Value(0)).current;
  const heroSlide = useRef(new Animated.Value(40)).current;
  const heroScale = useRef(new Animated.Value(1.12)).current;
  const labelLineWidth = useRef(new Animated.Value(0)).current;
  const heroTitlePulse = useRef(new Animated.Value(0.85)).current;
  const heroGlowPulse = useRef(new Animated.Value(0)).current;
  const heroShimmer = useRef(new Animated.Value(-1)).current;
  const heroDropletOpacity = useRef(new Animated.Value(0)).current;

  const sectionFades = useRef(
    Array.from({ length: 10 }, () => ({
      fade: new Animated.Value(0),
      slide: new Animated.Value(40),
    }))
  ).current;

  const mistParticles = useMemo(() => createMistParticles(), []);

  const featured = getFeaturedProducts().slice(0, 4);
  const newArrivals = getNewArrivals().slice(0, 6);
  const _limited = getLimitedEditions().slice(0, 4);
  const watches = getProductsByCategory('watches').slice(0, 4);
  const clothing = getProductsByCategory('clothing').slice(0, 4);
  const bags = getProductsByCategory('bags').slice(0, 4);

  const featuredAnims = useStaggeredFade(featured.length, 600, 120);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(heroFade, { toValue: 1, duration: 1400, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(heroSlide, { toValue: 0, duration: 1400, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(heroScale, { toValue: 1, duration: 12000, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(labelLineWidth, { toValue: 1, duration: 1000, delay: 700, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
      Animated.timing(heroDropletOpacity, { toValue: 1, duration: 1800, delay: 400, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();

    const titlePulseAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(heroTitlePulse, { toValue: 1, duration: 3500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(heroTitlePulse, { toValue: 0.85, duration: 3500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );
    titlePulseAnim.start();

    const glowAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(heroGlowPulse, { toValue: 0.6, duration: 4000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(heroGlowPulse, { toValue: 0, duration: 4000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );
    glowAnim.start();

    const shimmerAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(heroShimmer, { toValue: 1, duration: 3200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.delay(1500),
        Animated.timing(heroShimmer, { toValue: -1, duration: 0, useNativeDriver: true }),
      ])
    );
    shimmerAnim.start();

    mistParticles.forEach((p) => {
      const animateP = () => {
        p.x.setValue(0);
        p.y.setValue(0);
        p.opacity.setValue(0);
        Animated.sequence([
          Animated.delay(p.delay),
          Animated.parallel([
            Animated.timing(p.x, { toValue: 1, duration: p.duration, easing: Easing.out(Easing.quad), useNativeDriver: true }),
            Animated.timing(p.y, { toValue: 1, duration: p.duration, easing: Easing.out(Easing.quad), useNativeDriver: true }),
            Animated.sequence([
              Animated.timing(p.opacity, { toValue: 0.5, duration: p.duration * 0.25, useNativeDriver: true }),
              Animated.timing(p.opacity, { toValue: 0, duration: p.duration * 0.75, useNativeDriver: true }),
            ]),
          ]),
        ]).start(() => animateP());
      };
      animateP();
    });

    sectionFades.forEach((s, i) => {
      Animated.parallel([
        Animated.timing(s.fade, { toValue: 1, duration: 800, delay: 500 + i * 220, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(s.slide, { toValue: 0, duration: 800, delay: 500 + i * 220, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]).start();
    });

    return () => {
      titlePulseAnim.stop();
      glowAnim.stop();
      shimmerAnim.stop();
    };
  }, [heroFade, heroSlide, heroScale, labelLineWidth, sectionFades, heroTitlePulse, heroGlowPulse, heroShimmer, heroDropletOpacity, mistParticles]);

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

  const animatedLineW = labelLineWidth.interpolate({ inputRange: [0, 1], outputRange: [0, 44] });
  const heroShimmerTranslate = heroShimmer.interpolate({ inputRange: [-1, 0, 1], outputRange: [-width, 0, width] });

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
        <View style={[styles.heroContainer, { paddingTop: insets.top }]}>
          <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ scale: heroScale }] }]}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=1200&q=80' }}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
            />
          </Animated.View>
          <LinearGradient
            colors={['rgba(0,0,0,0.45)', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.55)', 'rgba(0,0,0,0.92)', Colors.black]}
            locations={[0, 0.2, 0.5, 0.78, 1]}
            style={StyleSheet.absoluteFill}
          />

          <Animated.View style={[styles.heroGlowOrb, { opacity: heroGlowPulse }]} />
          <PulsingGlow size={120} color="rgba(212,175,55,0.04)" topPercent={20} delay={1500} />

          {mistParticles.map((p, i) => (
            <Animated.View
              key={`mist-${i}`}
              style={[
                styles.mistParticle,
                {
                  width: p.size,
                  height: p.size,
                  borderRadius: p.size / 2,
                  opacity: p.opacity,
                  transform: [
                    { translateX: p.x.interpolate({ inputRange: [0, 1], outputRange: [p.startX, p.endX] }) },
                    { translateY: p.y.interpolate({ inputRange: [0, 1], outputRange: [p.startY, p.endY] }) },
                  ],
                },
              ]}
            />
          ))}

          <Animated.View style={[styles.heroShimmerOverlay, { transform: [{ translateX: heroShimmerTranslate }] }]}>
            <LinearGradient
              colors={['transparent', 'rgba(212,175,55,0.06)', 'transparent']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={{ width: width * 0.5, height: HERO_HEIGHT }}
            />
          </Animated.View>

          <TouchableOpacity
            style={[styles.searchBtn, { top: insets.top + 12 }]}
            onPress={() => router.push('/search' as Href)}
            activeOpacity={0.7}
          >
            <Search color={Colors.whiteAlpha60} size={18} strokeWidth={1.5} />
          </TouchableOpacity>

          <Animated.View style={[styles.heroContent, { opacity: heroFade, transform: [{ translateY: heroSlide }] }]}>
            <View style={styles.heroLabelRow}>
              <Animated.View style={[styles.heroLabelLine, { width: animatedLineW }]} />
              <Droplets color={Colors.gold} size={12} strokeWidth={1.2} />
              <Text style={styles.heroSubtitle}>PARFUMERIE</Text>
            </View>
            <Animated.Text style={[styles.heroTitle, { opacity: heroTitlePulse }]}>
              {"Timeless\nScents"}
            </Animated.Text>
            <Text style={styles.heroDesc}>
              {"An olfactory journey through the\nrarest essences of Maison Aurélique"}
            </Text>
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
              <Text style={styles.heroCtaText}>DISCOVER FRAGRANCES</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={[styles.heroBrandWatermark, { opacity: heroDropletOpacity }]}>
            <Text style={styles.heroBrandWatermarkText}>MA</Text>
          </Animated.View>
        </View>

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
          <PulsingGlow size={160} color="rgba(212,175,55,0.03)" topPercent={10} delay={800} />
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
  heroContainer: { height: HERO_HEIGHT, position: 'relative' as const },
  heroGlowOrb: {
    position: 'absolute' as const,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(212,175,55,0.06)',
    top: '30%',
    alignSelf: 'center',
  },
  mistParticle: {
    position: 'absolute' as const,
    backgroundColor: Colors.gold,
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
  heroContent: { position: 'absolute' as const, bottom: 48, left: 28, right: 28, zIndex: 2 },
  heroLabelRow: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 10, marginBottom: 14 },
  heroLabelLine: { height: 1, backgroundColor: Colors.gold },
  heroSubtitle: { fontFamily: Typography.sansFamily, color: Colors.gold, fontSize: 10, letterSpacing: 5, fontWeight: '400' as const, textTransform: 'uppercase' as const },
  heroTitle: { fontFamily: Typography.serifFamily, color: Colors.white, fontSize: 46, fontWeight: '300' as const, letterSpacing: 1, lineHeight: 54 },
  heroDesc: { fontFamily: Typography.sansFamily, color: Colors.whiteAlpha40, fontSize: 13, lineHeight: 20, marginTop: 14, fontWeight: '300' as const, letterSpacing: 0.3 },
  heroCtaBtn: {
    marginTop: 22,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 3,
    alignSelf: 'flex-start' as const,
    overflow: 'hidden' as const,
  },
  heroCtaText: { fontFamily: Typography.sansFamily, color: Colors.black, fontSize: 10, fontWeight: '700' as const, letterSpacing: 3 },
  heroBrandWatermark: {
    position: 'absolute' as const,
    top: '18%',
    right: 24,
    zIndex: 2,
  },
  heroBrandWatermarkText: {
    fontFamily: Typography.serifFamily,
    color: 'rgba(212,175,55,0.08)',
    fontSize: 72,
    fontWeight: '200' as const,
    fontStyle: 'italic' as const,
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
