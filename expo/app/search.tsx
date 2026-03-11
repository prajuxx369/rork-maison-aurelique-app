import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Search, X, ArrowLeft, TrendingUp, Clock } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { products, CATEGORY_LABELS } from '@/mocks/products';

const _width = Dimensions.get('window').width;

const TRENDING = ['Lumière Noire', 'Gold Watch', 'Silk Dress', 'Leather Bag', 'Diamond Ring'];
const SUGGESTED_CATEGORIES = ['Perfumes', 'Watches', 'Evening Wear', 'Jewelry', 'Bags'];

export default function SearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const inputRef = useRef<TextInput>(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
    setTimeout(() => inputRef.current?.focus(), 300);
  }, [fadeAnim, slideAnim]);

  const filtered = query.length > 1
    ? products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.subcategory.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 12)
    : [];

  const handleSelect = useCallback((id: number) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/product/${id}`);
  }, [router]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <ArrowLeft color={Colors.whiteAlpha60} size={20} strokeWidth={1.5} />
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <Search color={Colors.whiteAlpha30} size={16} strokeWidth={1.5} />
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="Search the Maison..."
            placeholderTextColor={Colors.whiteAlpha20}
            value={query}
            onChangeText={setQuery}
            selectionColor={Colors.gold}
            autoCapitalize="none"
            testID="search-input"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} activeOpacity={0.7}>
              <X color={Colors.whiteAlpha30} size={16} strokeWidth={1.5} />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {query.length < 2 ? (
          <>
            <View style={styles.sectionBlock}>
              <View style={styles.sectionLabelRow}>
                <TrendingUp color={Colors.goldAlpha40} size={14} strokeWidth={1.5} />
                <Text style={styles.sectionLabel}>TRENDING</Text>
              </View>
              {TRENDING.map((term, i) => (
                <TouchableOpacity key={i} style={styles.suggestRow} onPress={() => setQuery(term)} activeOpacity={0.7}>
                  <Text style={styles.suggestText}>{term}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.sectionBlock}>
              <View style={styles.sectionLabelRow}>
                <Clock color={Colors.goldAlpha40} size={14} strokeWidth={1.5} />
                <Text style={styles.sectionLabel}>CATEGORIES</Text>
              </View>
              <View style={styles.tagRow}>
                {SUGGESTED_CATEGORIES.map((cat, i) => (
                  <TouchableOpacity key={i} style={styles.tag} onPress={() => setQuery(cat)} activeOpacity={0.7}>
                    <Text style={styles.tagText}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        ) : filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No results</Text>
            <Text style={styles.emptyDesc}>Try a different search term</Text>
          </View>
        ) : (
          <View style={styles.results}>
            <Text style={styles.resultCount}>{filtered.length} {filtered.length === 1 ? 'result' : 'results'}</Text>
            {filtered.map((p) => (
              <TouchableOpacity key={p.id} style={styles.resultCard} onPress={() => handleSelect(p.id)} activeOpacity={0.85}>
                <Image source={{ uri: p.imageUrl }} style={styles.resultImage} contentFit="cover" />
                <View style={styles.resultInfo}>
                  <Text style={styles.resultCategory}>{CATEGORY_LABELS[p.category]}</Text>
                  <Text style={styles.resultName} numberOfLines={1}>{p.name}</Text>
                  <Text style={styles.resultPrice}>${p.price.toLocaleString()}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.black },
  header: { flexDirection: 'row' as const, alignItems: 'center' as const, paddingHorizontal: 16, paddingVertical: 12, gap: 10 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.whiteAlpha05, justifyContent: 'center' as const, alignItems: 'center' as const },
  searchBar: { flex: 1, flexDirection: 'row' as const, alignItems: 'center' as const, backgroundColor: Colors.charcoalMedium, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, gap: 10, borderWidth: 0.5, borderColor: Colors.whiteAlpha08 },
  input: { flex: 1, fontFamily: Typography.sansFamily, color: Colors.white, fontSize: 15, fontWeight: '300' as const, padding: 0 },
  scrollContent: { paddingBottom: 48 },
  sectionBlock: { paddingHorizontal: 20, paddingTop: 28 },
  sectionLabelRow: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 8, marginBottom: 16 },
  sectionLabel: { fontFamily: Typography.sansFamily, color: Colors.goldAlpha40, fontSize: 9, letterSpacing: 4, fontWeight: '500' as const },
  suggestRow: { paddingVertical: 14, borderBottomWidth: 0.5, borderBottomColor: Colors.whiteAlpha05 },
  suggestText: { fontFamily: Typography.sansFamily, color: Colors.whiteAlpha60, fontSize: 15, fontWeight: '300' as const },
  tagRow: { flexDirection: 'row' as const, flexWrap: 'wrap' as const, gap: 10 },
  tag: { backgroundColor: Colors.whiteAlpha05, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, borderWidth: 0.5, borderColor: Colors.whiteAlpha08 },
  tagText: { fontFamily: Typography.sansFamily, color: Colors.whiteAlpha60, fontSize: 13, fontWeight: '300' as const },
  emptyState: { alignItems: 'center' as const, paddingTop: 80 },
  emptyTitle: { fontFamily: Typography.serifFamily, color: Colors.whiteAlpha30, fontSize: 22, fontWeight: '400' as const, marginBottom: 8 },
  emptyDesc: { fontFamily: Typography.sansFamily, color: Colors.whiteAlpha15, fontSize: 14, fontWeight: '300' as const },
  results: { paddingHorizontal: 20, paddingTop: 16 },
  resultCount: { fontFamily: Typography.sansFamily, color: Colors.whiteAlpha20, fontSize: 11, letterSpacing: 2, fontWeight: '300' as const, textTransform: 'uppercase' as const, marginBottom: 16 },
  resultCard: { flexDirection: 'row' as const, marginBottom: 14, backgroundColor: Colors.charcoalMedium, borderRadius: 10, overflow: 'hidden' as const, borderWidth: 0.5, borderColor: Colors.whiteAlpha05 },
  resultImage: { width: 90, height: 110 },
  resultInfo: { flex: 1, padding: 14, justifyContent: 'center' as const },
  resultCategory: { fontFamily: Typography.sansFamily, color: Colors.goldAlpha40, fontSize: 9, letterSpacing: 3, fontWeight: '400' as const, textTransform: 'uppercase' as const, marginBottom: 4 },
  resultName: { fontFamily: Typography.serifFamily, color: Colors.white, fontSize: 17, fontWeight: '400' as const, letterSpacing: 0.3, marginBottom: 6 },
  resultPrice: { fontFamily: Typography.serifFamily, color: Colors.gold, fontSize: 16, fontWeight: '400' as const },
});
