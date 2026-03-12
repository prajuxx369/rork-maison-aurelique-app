import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { Stack } from 'expo-router';
import { Image } from 'expo-image';
import { Check, Sparkles } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { Typography } from '@/constants/typography';

interface StyleCategory {
  id: string;
  name: string;
  imageUrl: string;
  selected: boolean;
}

const STYLE_CATEGORIES: StyleCategory[] = [
  { id: 'perfumes', name: 'Perfumes', imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&q=80', selected: true },
  { id: 'fashion', name: 'Fashion', imageUrl: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400&q=80', selected: true },
  { id: 'watches', name: 'Watches', imageUrl: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&q=80', selected: false },
  { id: 'bags', name: 'Bags', imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=80', selected: true },
  { id: 'shoes', name: 'Shoes', imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=80', selected: false },
  { id: 'accessories', name: 'Accessories', imageUrl: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&q=80', selected: false },
  { id: 'jewelry', name: 'Jewelry', imageUrl: 'https://images.unsplash.com/photo-1515562141589-67f0d569b6c4?w=400&q=80', selected: true },
];

interface StyleVibe {
  id: string;
  name: string;
  selected: boolean;
}

const STYLE_VIBES: StyleVibe[] = [
  { id: 'classic', name: 'Classic Elegance', selected: true },
  { id: 'modern', name: 'Modern Luxury', selected: true },
  { id: 'minimalist', name: 'Minimalist', selected: false },
  { id: 'bold', name: 'Bold Statement', selected: false },
  { id: 'avant', name: 'Avant-Garde', selected: true },
  { id: 'romantic', name: 'Romantic', selected: false },
  { id: 'streetlux', name: 'Street Luxe', selected: false },
  { id: 'heritage', name: 'Heritage', selected: true },
];

export default function StylePreferencesScreen() {
  const [categories, setCategories] = useState<StyleCategory[]>(STYLE_CATEGORIES);
  const [vibes, setVibes] = useState<StyleVibe[]>(STYLE_VIBES);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  }, [fadeAnim]);

  const toggleCategory = (id: string) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCategories(prev => prev.map(c => c.id === id ? { ...c, selected: !c.selected } : c));
  };

  const toggleVibe = (id: string) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setVibes(prev => prev.map(v => v.id === id ? { ...v, selected: !v.selected } : v));
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: 'Style Preferences', headerStyle: { backgroundColor: Colors.black }, headerTintColor: Colors.white, headerTitleStyle: { fontFamily: Typography.serifFamily, fontSize: 18, fontWeight: '400' as const } }} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={styles.introSection}>
            <Sparkles color={Colors.gold} size={24} strokeWidth={1.5} />
            <Text style={styles.introTitle}>Your Style Profile</Text>
            <Text style={styles.introText}>Help us curate a personalized experience by selecting your interests and aesthetic preferences.</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>CATEGORIES OF INTEREST</Text>
            <View style={styles.categoryGrid}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.categoryCard, cat.selected && styles.categoryCardSelected]}
                  activeOpacity={0.7}
                  onPress={() => toggleCategory(cat.id)}
                >
                  <Image source={{ uri: cat.imageUrl }} style={StyleSheet.absoluteFill} contentFit="cover" />
                  <View style={[StyleSheet.absoluteFill, styles.categoryOverlay, cat.selected && styles.categoryOverlaySelected]} />
                  {cat.selected && (
                    <View style={styles.checkCircle}>
                      <Check color={Colors.black} size={14} strokeWidth={2.5} />
                    </View>
                  )}
                  <Text style={styles.categoryName}>{cat.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>AESTHETIC PREFERENCES</Text>
            <View style={styles.vibeGrid}>
              {vibes.map((vibe) => (
                <TouchableOpacity
                  key={vibe.id}
                  style={[styles.vibeChip, vibe.selected && styles.vibeChipSelected]}
                  activeOpacity={0.7}
                  onPress={() => toggleVibe(vibe.id)}
                >
                  <Text style={[styles.vibeText, vibe.selected && styles.vibeTextSelected]}>{vibe.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.black },
  scrollContent: { paddingBottom: 40 },
  introSection: { alignItems: 'center' as const, paddingHorizontal: 40, paddingTop: 24, paddingBottom: 32 },
  introTitle: { fontFamily: Typography.serifFamily, color: Colors.white, fontSize: 22, fontWeight: '400' as const, marginTop: 14, marginBottom: 8 },
  introText: { fontFamily: Typography.sansFamily, color: Colors.whiteAlpha30, fontSize: 13, fontWeight: '300' as const, textAlign: 'center' as const, lineHeight: 20 },
  section: { marginBottom: 32 },
  sectionTitle: { fontFamily: Typography.sansFamily, color: Colors.whiteAlpha15, paddingHorizontal: 20, marginBottom: 14, letterSpacing: 4, fontSize: 9, fontWeight: '500' as const, textTransform: 'uppercase' as const },
  categoryGrid: { flexDirection: 'row' as const, flexWrap: 'wrap' as const, paddingHorizontal: 16, gap: 10 },
  categoryCard: { width: '30%' as const, aspectRatio: 0.8, borderRadius: 14, overflow: 'hidden' as const, justifyContent: 'flex-end' as const, padding: 10, borderWidth: 1, borderColor: Colors.whiteAlpha05 },
  categoryCardSelected: { borderColor: Colors.gold },
  categoryOverlay: { backgroundColor: 'rgba(0,0,0,0.55)' },
  categoryOverlaySelected: { backgroundColor: 'rgba(212,175,55,0.15)' },
  checkCircle: { position: 'absolute' as const, top: 8, right: 8, width: 22, height: 22, borderRadius: 11, backgroundColor: Colors.gold, justifyContent: 'center' as const, alignItems: 'center' as const },
  categoryName: { fontFamily: Typography.sansFamily, color: Colors.white, fontSize: 11, fontWeight: '500' as const, letterSpacing: 0.5, zIndex: 1 },
  vibeGrid: { flexDirection: 'row' as const, flexWrap: 'wrap' as const, paddingHorizontal: 20, gap: 10 },
  vibeChip: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 24, borderWidth: 1, borderColor: Colors.whiteAlpha10, backgroundColor: Colors.charcoalMedium },
  vibeChipSelected: { borderColor: Colors.gold, backgroundColor: Colors.goldAlpha10 },
  vibeText: { fontFamily: Typography.sansFamily, color: Colors.whiteAlpha30, fontSize: 13, fontWeight: '400' as const },
  vibeTextSelected: { color: Colors.gold },
});
