import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Easing,
  Alert,
} from 'react-native';
import { Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Plus,
  Star,
  Trash2,
  Building2,
  Home,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { Typography } from '@/constants/typography';

interface Address {
  id: string;
  label: string;
  type: 'home' | 'office';
  name: string;
  street: string;
  city: string;
  country: string;
  postalCode: string;
  isDefault: boolean;
}

const INITIAL_ADDRESSES: Address[] = [
  {
    id: '1',
    label: 'Home',
    type: 'home',
    name: 'Isabelle Moreau',
    street: '42 Avenue Montaigne',
    city: 'Paris',
    country: 'France',
    postalCode: '75008',
    isDefault: true,
  },
  {
    id: '2',
    label: 'Office',
    type: 'office',
    name: 'Isabelle Moreau',
    street: '15 Rue du Faubourg Saint-Honoré',
    city: 'Paris',
    country: 'France',
    postalCode: '75008',
    isDefault: false,
  },
  {
    id: '3',
    label: 'Holiday Home',
    type: 'home',
    name: 'Isabelle Moreau',
    street: '8 Promenade des Anglais',
    city: 'Nice',
    country: 'France',
    postalCode: '06000',
    isDefault: false,
  },
];

function AddressCard({ address, index, onSetDefault, onDelete }: { address: Address; index: number; onSetDefault: (id: string) => void; onDelete: (id: string) => void }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, delay: index * 100, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, delay: index * 100, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, slideAnim, index]);

  return (
    <Animated.View style={[styles.addressCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }, address.isDefault && styles.addressCardDefault]}>
      {address.isDefault && (
        <LinearGradient
          colors={[Colors.goldAlpha08, 'transparent']}
          style={StyleSheet.absoluteFill}
        />
      )}
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <View style={[styles.typeIcon, address.isDefault && styles.typeIconDefault]}>
            {address.type === 'home' ? <Home color={address.isDefault ? Colors.gold : Colors.whiteAlpha30} size={16} strokeWidth={1.5} /> : <Building2 color={address.isDefault ? Colors.gold : Colors.whiteAlpha30} size={16} strokeWidth={1.5} />}
          </View>
          <Text style={[styles.cardLabel, address.isDefault && styles.cardLabelDefault]}>{address.label}</Text>
          {address.isDefault && (
            <View style={styles.defaultBadge}>
              <Star color={Colors.gold} size={10} strokeWidth={2} fill={Colors.gold} />
              <Text style={styles.defaultText}>Default</Text>
            </View>
          )}
        </View>
        <TouchableOpacity onPress={() => { void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onDelete(address.id); }} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Trash2 color={Colors.whiteAlpha15} size={16} strokeWidth={1.5} />
        </TouchableOpacity>
      </View>
      <Text style={styles.addressName}>{address.name}</Text>
      <Text style={styles.addressLine}>{address.street}</Text>
      <Text style={styles.addressLine}>{address.city} {address.postalCode}, {address.country}</Text>
      {!address.isDefault && (
        <TouchableOpacity style={styles.setDefaultBtn} onPress={() => { void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onSetDefault(address.id); }}>
          <Text style={styles.setDefaultText}>Set as default</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}

export default function AddressesScreen() {
  const [addresses, setAddresses] = useState<Address[]>(INITIAL_ADDRESSES);

  const handleSetDefault = (id: string) => {
    setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
  };

  const handleDelete = (id: string) => {
    Alert.alert('Remove Address', 'Are you sure you want to remove this address?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        setAddresses(prev => prev.filter(a => a.id !== id));
      }},
    ]);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: 'Addresses', headerStyle: { backgroundColor: Colors.black }, headerTintColor: Colors.white, headerTitleStyle: { fontFamily: Typography.serifFamily, fontSize: 18, fontWeight: '400' as const } }} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {addresses.map((address, index) => (
          <AddressCard key={address.id} address={address} index={index} onSetDefault={handleSetDefault} onDelete={handleDelete} />
        ))}
        <TouchableOpacity
          style={styles.addButton}
          activeOpacity={0.7}
          onPress={() => { void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); Alert.alert('Add Address', 'Address form would open here.'); }}
        >
          <Plus color={Colors.gold} size={18} strokeWidth={1.5} />
          <Text style={styles.addButtonText}>Add New Address</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.black },
  scrollContent: { padding: 20, paddingBottom: 40 },
  addressCard: { borderRadius: 14, backgroundColor: Colors.charcoalMedium, borderWidth: 0.5, borderColor: Colors.whiteAlpha05, padding: 18, marginBottom: 14, overflow: 'hidden' as const },
  addressCardDefault: { borderColor: Colors.goldAlpha20 },
  cardHeader: { flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'center' as const, marginBottom: 14 },
  cardHeaderLeft: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 10 },
  typeIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.whiteAlpha05, justifyContent: 'center' as const, alignItems: 'center' as const },
  typeIconDefault: { backgroundColor: Colors.goldAlpha10 },
  cardLabel: { fontFamily: Typography.sansFamily, color: Colors.whiteAlpha60, fontSize: 14, fontWeight: '500' as const },
  cardLabelDefault: { color: Colors.gold },
  defaultBadge: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 4, backgroundColor: Colors.goldAlpha10, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  defaultText: { fontFamily: Typography.sansFamily, color: Colors.gold, fontSize: 10, fontWeight: '500' as const, letterSpacing: 0.5 },
  addressName: { fontFamily: Typography.sansFamily, color: Colors.whiteAlpha80, fontSize: 15, fontWeight: '400' as const, marginBottom: 4 },
  addressLine: { fontFamily: Typography.sansFamily, color: Colors.whiteAlpha30, fontSize: 13, fontWeight: '300' as const, lineHeight: 20 },
  setDefaultBtn: { marginTop: 14, paddingTop: 12, borderTopWidth: 0.5, borderTopColor: Colors.whiteAlpha05 },
  setDefaultText: { fontFamily: Typography.sansFamily, color: Colors.goldAlpha40, fontSize: 12, fontWeight: '500' as const, letterSpacing: 0.5 },
  addButton: { flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'center' as const, gap: 10, marginTop: 8, paddingVertical: 18, borderRadius: 14, borderWidth: 1, borderColor: Colors.goldAlpha15, borderStyle: 'dashed' as const },
  addButtonText: { fontFamily: Typography.sansFamily, color: Colors.gold, fontSize: 14, fontWeight: '500' as const, letterSpacing: 0.5 },
});
