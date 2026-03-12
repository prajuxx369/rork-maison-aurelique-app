import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Easing,
  Linking,
  Alert,
} from 'react-native';
import { Stack } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import {
  MessageCircle,
  Phone,
  Mail,
  FileText,
  HelpCircle,
  ChevronRight,
  Clock,
  Shield,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { Typography } from '@/constants/typography';

interface SupportOption {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  action: () => void;
}

const FAQ_ITEMS = [
  { q: 'What is your return policy?', a: 'Items may be returned within 30 days of delivery in original condition with all packaging.' },
  { q: 'How long does shipping take?', a: 'Complimentary express shipping takes 3-5 business days. Priority shipping available at checkout.' },
  { q: 'Do you offer gift wrapping?', a: 'Every order arrives in our signature Maison Aurélique gift box with ribbon and tissue paper.' },
  { q: 'How do I track my order?', a: 'You will receive tracking information via email once your order has been dispatched.' },
  { q: 'Can I change my order?', a: 'Orders can be modified within 1 hour of placement. Contact our atelier for assistance.' },
];

export default function SupportScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [expandedFaq, setExpandedFaq] = React.useState<number | null>(null);

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  }, [fadeAnim]);

  const supportOptions: SupportOption[] = [
    { icon: <MessageCircle color={Colors.gold} size={20} strokeWidth={1.5} />, title: 'Live Chat', subtitle: 'Available 24/7', action: () => Alert.alert('Live Chat', 'Connecting you with a personal stylist...') },
    { icon: <Phone color={Colors.gold} size={20} strokeWidth={1.5} />, title: 'Call Us', subtitle: '+33 1 42 68 53 00', action: () => void Linking.openURL('tel:+33142685300').catch(() => {}) },
    { icon: <Mail color={Colors.gold} size={20} strokeWidth={1.5} />, title: 'Email', subtitle: 'concierge@maison-aurelique.com', action: () => void Linking.openURL('mailto:concierge@maison-aurelique.com').catch(() => {}) },
  ];

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: 'Support', headerStyle: { backgroundColor: Colors.black }, headerTintColor: Colors.white, headerTitleStyle: { fontFamily: Typography.serifFamily, fontSize: 18, fontWeight: '400' as const } }} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={styles.heroBanner}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&q=80' }}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
            />
            <LinearGradient
              colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)', Colors.black]}
              locations={[0, 0.6, 1]}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>Our Atelier</Text>
              <Text style={styles.heroSubtitle}>Personal concierge at your service</Text>
              <View style={styles.hoursRow}>
                <Clock color={Colors.goldAlpha40} size={12} strokeWidth={1.5} />
                <Text style={styles.hoursText}>Mon – Sun, 24 hours</Text>
              </View>
            </View>
          </View>

          <View style={styles.contactSection}>
            {supportOptions.map((option, i) => (
              <TouchableOpacity
                key={i}
                style={styles.contactCard}
                activeOpacity={0.7}
                onPress={() => { void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); option.action(); }}
              >
                <View style={styles.contactIcon}>{option.icon}</View>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactTitle}>{option.title}</Text>
                  <Text style={styles.contactSub}>{option.subtitle}</Text>
                </View>
                <ChevronRight color={Colors.whiteAlpha15} size={16} strokeWidth={1.5} />
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.faqSection}>
            <Text style={styles.sectionTitle}>FREQUENTLY ASKED</Text>
            {FAQ_ITEMS.map((item, i) => (
              <TouchableOpacity
                key={i}
                style={styles.faqItem}
                activeOpacity={0.7}
                onPress={() => {
                  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setExpandedFaq(expandedFaq === i ? null : i);
                }}
              >
                <View style={styles.faqHeader}>
                  <HelpCircle color={Colors.whiteAlpha30} size={16} strokeWidth={1.5} />
                  <Text style={styles.faqQuestion}>{item.q}</Text>
                </View>
                {expandedFaq === i && (
                  <Text style={styles.faqAnswer}>{item.a}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.legalSection}>
            <TouchableOpacity style={styles.legalRow} activeOpacity={0.7} onPress={() => Alert.alert('Terms', 'Terms & Conditions')}>
              <FileText color={Colors.whiteAlpha20} size={16} strokeWidth={1.5} />
              <Text style={styles.legalText}>Terms & Conditions</Text>
              <ChevronRight color={Colors.whiteAlpha10} size={14} strokeWidth={1.5} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.legalRow} activeOpacity={0.7} onPress={() => Alert.alert('Privacy', 'Privacy Policy')}>
              <Shield color={Colors.whiteAlpha20} size={16} strokeWidth={1.5} />
              <Text style={styles.legalText}>Privacy Policy</Text>
              <ChevronRight color={Colors.whiteAlpha10} size={14} strokeWidth={1.5} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.black },
  scrollContent: { paddingBottom: 40 },
  heroBanner: { height: 200, justifyContent: 'flex-end' as const },
  heroContent: { padding: 24 },
  heroTitle: { fontFamily: Typography.serifFamily, color: Colors.white, fontSize: 28, fontWeight: '400' as const, letterSpacing: 0.5 },
  heroSubtitle: { fontFamily: Typography.sansFamily, color: Colors.whiteAlpha40, fontSize: 14, fontWeight: '300' as const, marginTop: 4 },
  hoursRow: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 6, marginTop: 10 },
  hoursText: { fontFamily: Typography.sansFamily, color: Colors.goldAlpha40, fontSize: 11, fontWeight: '300' as const, letterSpacing: 0.5 },
  contactSection: { paddingHorizontal: 20, marginBottom: 32, gap: 10 },
  contactCard: { flexDirection: 'row' as const, alignItems: 'center' as const, padding: 18, borderRadius: 14, backgroundColor: Colors.charcoalMedium, borderWidth: 0.5, borderColor: Colors.whiteAlpha05, gap: 14 },
  contactIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.goldAlpha08, justifyContent: 'center' as const, alignItems: 'center' as const },
  contactInfo: { flex: 1 },
  contactTitle: { fontFamily: Typography.sansFamily, color: Colors.whiteAlpha80, fontSize: 15, fontWeight: '500' as const },
  contactSub: { fontFamily: Typography.sansFamily, color: Colors.whiteAlpha30, fontSize: 12, fontWeight: '300' as const, marginTop: 2 },
  faqSection: { paddingHorizontal: 20, marginBottom: 32 },
  sectionTitle: { fontFamily: Typography.sansFamily, color: Colors.whiteAlpha15, letterSpacing: 4, fontSize: 9, fontWeight: '500' as const, textTransform: 'uppercase' as const, marginBottom: 14 },
  faqItem: { borderBottomWidth: 0.5, borderBottomColor: Colors.whiteAlpha05, paddingVertical: 16 },
  faqHeader: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 12 },
  faqQuestion: { fontFamily: Typography.sansFamily, color: Colors.whiteAlpha60, fontSize: 14, fontWeight: '400' as const, flex: 1 },
  faqAnswer: { fontFamily: Typography.sansFamily, color: Colors.whiteAlpha30, fontSize: 13, fontWeight: '300' as const, lineHeight: 20, marginTop: 10, marginLeft: 28 },
  legalSection: { paddingHorizontal: 20, gap: 2 },
  legalRow: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 12, paddingVertical: 14, borderBottomWidth: 0.5, borderBottomColor: Colors.whiteAlpha05 },
  legalText: { fontFamily: Typography.sansFamily, color: Colors.whiteAlpha30, fontSize: 14, fontWeight: '300' as const, flex: 1 },
});
