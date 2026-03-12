import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Animated,
  Easing,
  Alert,
} from 'react-native';
import { Stack } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Camera, Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { Typography } from '@/constants/typography';

interface FormField {
  label: string;
  value: string;
  key: string;
  placeholder: string;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
}

const INITIAL_FIELDS: FormField[] = [
  { label: 'First Name', value: 'Isabelle', key: 'firstName', placeholder: 'Enter first name' },
  { label: 'Last Name', value: 'Moreau', key: 'lastName', placeholder: 'Enter last name' },
  { label: 'Email', value: 'isabelle.moreau@maison.com', key: 'email', placeholder: 'Enter email', keyboardType: 'email-address' },
  { label: 'Phone', value: '+33 6 12 34 56 78', key: 'phone', placeholder: 'Enter phone number', keyboardType: 'phone-pad' },
  { label: 'Date of Birth', value: '15 March 1992', key: 'dob', placeholder: 'Enter date of birth' },
];

export default function PersonalDetailsScreen() {
  const [fields, setFields] = useState<FormField[]>(INITIAL_FIELDS);
  const [isEditing, setIsEditing] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  }, [fadeAnim]);

  const handleFieldChange = (key: string, value: string) => {
    setFields(prev => prev.map(f => f.key === key ? { ...f, value } : f));
  };

  const handleSave = () => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setIsEditing(false);
    Alert.alert('Saved', 'Your details have been updated.');
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: 'Personal Details', headerStyle: { backgroundColor: Colors.black }, headerTintColor: Colors.white, headerTitleStyle: { fontFamily: Typography.serifFamily, fontSize: 18, fontWeight: '400' as const }, headerRight: () => (
        <TouchableOpacity onPress={isEditing ? handleSave : () => { setIsEditing(true); void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }} style={styles.headerAction}>
          {isEditing ? <Check color={Colors.gold} size={20} strokeWidth={1.5} /> : <Text style={styles.editText}>Edit</Text>}
        </TouchableOpacity>
      ) }} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80' }}
                style={styles.avatar}
                contentFit="cover"
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.6)']}
                style={styles.avatarOverlay}
              />
              <TouchableOpacity style={styles.cameraBtn} onPress={() => void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
                <Camera color={Colors.white} size={16} strokeWidth={1.5} />
              </TouchableOpacity>
            </View>
            <Text style={styles.avatarName}>{fields[0].value} {fields[1].value}</Text>
            <Text style={styles.avatarMembership}>Gold Member since 2024</Text>
          </View>

          <View style={styles.formSection}>
            {fields.map((field) => (
              <View key={field.key} style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>{field.label}</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.fieldInput}
                    value={field.value}
                    onChangeText={(v) => handleFieldChange(field.key, v)}
                    placeholder={field.placeholder}
                    placeholderTextColor={Colors.whiteAlpha15}
                    keyboardType={field.keyboardType ?? 'default'}
                    autoCapitalize="none"
                    testID={`input-${field.key}`}
                  />
                ) : (
                  <Text style={styles.fieldValue}>{field.value}</Text>
                )}
              </View>
            ))}
          </View>

          <View style={styles.infoCard}>
            <LinearGradient
              colors={[Colors.goldAlpha08, Colors.goldAlpha05, 'transparent']}
              style={StyleSheet.absoluteFill}
            />
            <Text style={styles.infoTitle}>Privacy & Security</Text>
            <Text style={styles.infoText}>Your personal data is encrypted and stored securely. We never share your information with third parties.</Text>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.black },
  scrollContent: { paddingBottom: 40 },
  headerAction: { paddingHorizontal: 16 },
  editText: { fontFamily: Typography.sansFamily, color: Colors.gold, fontSize: 14, fontWeight: '500' as const },
  avatarSection: { alignItems: 'center' as const, paddingTop: 24, paddingBottom: 32 },
  avatarContainer: { width: 100, height: 100, borderRadius: 50, overflow: 'hidden' as const, marginBottom: 16, borderWidth: 1, borderColor: Colors.goldAlpha20 },
  avatar: { width: 100, height: 100 },
  avatarOverlay: { position: 'absolute' as const, bottom: 0, left: 0, right: 0, height: 40 },
  cameraBtn: { position: 'absolute' as const, bottom: 6, right: 6, width: 30, height: 30, borderRadius: 15, backgroundColor: Colors.goldAlpha40, justifyContent: 'center' as const, alignItems: 'center' as const },
  avatarName: { fontFamily: Typography.serifFamily, color: Colors.white, fontSize: 24, fontWeight: '400' as const, letterSpacing: 0.5 },
  avatarMembership: { fontFamily: Typography.sansFamily, color: Colors.goldAlpha40, fontSize: 12, fontWeight: '300' as const, letterSpacing: 1, marginTop: 4 },
  formSection: { marginHorizontal: 20, marginBottom: 32 },
  fieldContainer: { borderBottomWidth: 0.5, borderBottomColor: Colors.whiteAlpha05, paddingVertical: 16 },
  fieldLabel: { fontFamily: Typography.sansFamily, color: Colors.whiteAlpha30, fontSize: 11, fontWeight: '300' as const, letterSpacing: 2, textTransform: 'uppercase' as const, marginBottom: 6 },
  fieldValue: { fontFamily: Typography.sansFamily, color: Colors.whiteAlpha80, fontSize: 16, fontWeight: '400' as const },
  fieldInput: { fontFamily: Typography.sansFamily, color: Colors.white, fontSize: 16, fontWeight: '400' as const, paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: Colors.goldAlpha20 },
  infoCard: { marginHorizontal: 20, borderRadius: 14, padding: 20, borderWidth: 0.5, borderColor: Colors.goldAlpha10, overflow: 'hidden' as const },
  infoTitle: { fontFamily: Typography.sansFamily, color: Colors.gold, fontSize: 14, fontWeight: '500' as const, marginBottom: 8 },
  infoText: { fontFamily: Typography.sansFamily, color: Colors.whiteAlpha30, fontSize: 13, fontWeight: '300' as const, lineHeight: 20 },
});
