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
import { useRouter, Stack } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, Clock, Eye } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { useWishlist } from '@/providers/WishlistProvider';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 52) / 2;

interface RecentProduct {
  id: number;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  viewedAt: string;
}

const RECENT_PRODUCTS: RecentProduct[] = [
  { id: 1, name: 'Velours Sacré', price: 385, category: 'Perfumes', imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&q=80', viewedAt: '2 hours ago' },
  { id: 17, name: 'Chronographe Impérial', price: 12500, category: 'Watches', imageUrl: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&q=80', viewedAt: '3 hours ago' },
  { id: 25, name: 'Sac Duchesse', price: 4200, category: 'Bags', imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=80', viewedAt: '5 hours ago' },
  { id: 9, name: 'Manteau Opéra', price: 3800, category: 'Clothing', imageUrl: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e4?w=400&q=80', viewedAt: 'Yesterday' },
  { id: 41, name: 'Escarpin Étoile', price: 890, category: 'Shoes', imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=80', viewedAt: 'Yesterday' },
  { id: 51, name: 'Collier Céleste', price: 6800, category: 'Jewelry', imageUrl: 'https://images.unsplash.com/photo-1515562141589-67f0d569b6c4?w=400&q=80', viewedAt: '2 days ago' },
];

function ProductCard({ product, index }: { product: RecentProduct; index: number }) {
  const router = useRouter();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, delay: index * 80, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, delay: index * 80, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, slideAnim, index]);

  const wishlisted = isInWishlist(product.id);

  return (
    <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => { void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push(`/product/${product.id}`); }}
      >
        <View style={styles.cardImageWrap}>
          <Image source={{ uri: product.imageUrl }} style={styles.cardImage} contentFit="cover" />
          <LinearGradient colors={['transparent', 'rgba(0,0,0,0.7)']} style={styles.cardGradient} />
          <TouchableOpacity
            style={styles.heartBtn}
            onPress={() => { void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); toggleWishlist(product.id); }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Heart color={wishlisted ? Colors.gold : Colors.whiteAlpha40} size={16} strokeWidth={1.5} fill={wishlisted ? Colors.gold : 'transparent'} />
          </TouchableOpacity>
          <View style={styles.timeTag}>
            <Clock color={Colors.whiteAlpha40} size={10} strokeWidth={1.5} />
            <Text style={styles.timeText}>{product.viewedAt}</Text>
          </View>
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardCategory}>{product.category}</Text>
          <Text style={styles.cardName} numberOfLines={1}>{product.name}</Text>
          <Text style={styles.cardPrice}>${product.price.toLocaleString()}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function RecentlyViewedScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  }, [fadeAnim]);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: 'Recently Viewed', headerStyle: { backgroundColor: Colors.black }, headerTintColor: Colors.white, headerTitleStyle: { fontFamily: Typography.serifFamily, fontSize: 18, fontWeight: '400' as const } }} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Animated.View style={[styles.headerRow, { opacity: fadeAnim }]}>
          <Eye color={Colors.whiteAlpha30} size={18} strokeWidth={1.5} />
          <Text style={styles.headerText}>{RECENT_PRODUCTS.length} items viewed recently</Text>
        </Animated.View>
        <View style={styles.grid}>
          {RECENT_PRODUCTS.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.black },
  scrollContent: { paddingBottom: 40 },
  headerRow: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 10, paddingHorizontal: 20, paddingVertical: 16 },
  headerText: { fontFamily: Typography.sansFamily, color: Colors.whiteAlpha30, fontSize: 13, fontWeight: '300' as const },
  grid: { flexDirection: 'row' as const, flexWrap: 'wrap' as const, paddingHorizontal: 16, gap: 12 },
  card: { width: CARD_WIDTH, borderRadius: 14, backgroundColor: Colors.charcoalMedium, overflow: 'hidden' as const, borderWidth: 0.5, borderColor: Colors.whiteAlpha05 },
  cardImageWrap: { width: '100%' as const, aspectRatio: 0.85, position: 'relative' as const },
  cardImage: { width: '100%' as const, height: '100%' as const },
  cardGradient: { position: 'absolute' as const, bottom: 0, left: 0, right: 0, height: '50%' as const },
  heartBtn: { position: 'absolute' as const, top: 10, right: 10, width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center' as const, alignItems: 'center' as const },
  timeTag: { position: 'absolute' as const, bottom: 10, left: 10, flexDirection: 'row' as const, alignItems: 'center' as const, gap: 4, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  timeText: { fontFamily: Typography.sansFamily, color: Colors.whiteAlpha40, fontSize: 9, fontWeight: '400' as const },
  cardInfo: { padding: 12 },
  cardCategory: { fontFamily: Typography.sansFamily, color: Colors.goldAlpha40, fontSize: 9, fontWeight: '400' as const, letterSpacing: 2, textTransform: 'uppercase' as const },
  cardName: { fontFamily: Typography.serifFamily, color: Colors.whiteAlpha80, fontSize: 14, fontWeight: '400' as const, marginTop: 3 },
  cardPrice: { fontFamily: Typography.serifFamily, color: Colors.gold, fontSize: 14, fontWeight: '400' as const, marginTop: 4 },
});
