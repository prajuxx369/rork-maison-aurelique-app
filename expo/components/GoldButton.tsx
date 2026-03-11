import React, { useRef, useCallback } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  ViewStyle,
  View,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { Typography } from '@/constants/typography';

interface GoldButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  variant?: 'filled' | 'outline';
  disabled?: boolean;
}

export default React.memo(function GoldButton({
  title,
  onPress,
  style,
  variant = 'filled',
  disabled = false,
}: GoldButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = useCallback(() => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.97,
        duration: 100,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim, glowAnim]);

  const handlePressOut = useCallback(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 100,
        useNativeDriver: true,
      }),
      Animated.timing(glowAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim, glowAnim]);

  const handlePress = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  }, [onPress]);

  const isFilled = variant === 'filled';

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <TouchableOpacity
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        disabled={disabled}
        testID="gold-button"
      >
        <View style={[
          styles.button,
          isFilled ? styles.filled : styles.outline,
          disabled && styles.disabled,
        ]}>
          {isFilled && (
            <LinearGradient
              colors={[Colors.goldLight, Colors.gold, Colors.goldDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          )}
          <Animated.View
            style={[
              styles.glowOverlay,
              { opacity: glowAnim },
            ]}
          />
          <Text
            style={[
              styles.text,
              isFilled ? styles.filledText : styles.outlineText,
            ]}
          >
            {title}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  button: {
    paddingVertical: 17,
    paddingHorizontal: 36,
    borderRadius: 4,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    overflow: 'hidden' as const,
  },
  filled: {
    backgroundColor: Colors.gold,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 0.5,
    borderColor: Colors.goldAlpha40,
  },
  disabled: {
    opacity: 0.35,
  },
  glowOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  text: {
    fontFamily: Typography.sansFamily,
    fontSize: 13,
    fontWeight: '600' as const,
    letterSpacing: 3,
    textTransform: 'uppercase' as const,
  },
  filledText: {
    color: Colors.black,
  },
  outlineText: {
    color: Colors.gold,
  },
});
