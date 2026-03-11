import React, { useEffect, useRef, useMemo } from 'react';
import { View, StyleSheet, Animated, Dimensions, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import Colors from '@/constants/colors';
import { Typography } from '@/constants/typography';

const { width, height } = Dimensions.get('window');
const PARTICLE_COUNT = 24;

interface Particle {
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

function createParticles(): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const startX = Math.random() * width;
    const startY = height * 0.3 + Math.random() * height * 0.5;
    particles.push({
      x: new Animated.Value(0),
      y: new Animated.Value(0),
      opacity: new Animated.Value(0),
      size: 1.5 + Math.random() * 3,
      startX,
      startY,
      endX: startX + (Math.random() - 0.5) * 80,
      endY: startY - 60 - Math.random() * 120,
      duration: 2500 + Math.random() * 2000,
      delay: Math.random() * 1800,
    });
  }
  return particles;
}

export default function SplashScreen() {
  const router = useRouter();
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.92)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const taglineSlide = useRef(new Animated.Value(12)).current;
  const lineWidth = useRef(new Animated.Value(0)).current;
  const estOpacity = useRef(new Animated.Value(0)).current;
  const shimmerPos = useRef(new Animated.Value(-1)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;
  const screenFade = useRef(new Animated.Value(1)).current;

  const particles = useMemo(() => createParticles(), []);

  useEffect(() => {
    Animated.sequence([
      Animated.delay(200),
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 1400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 1600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(glowOpacity, {
          toValue: 1,
          duration: 2000,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    Animated.sequence([
      Animated.delay(800),
      Animated.parallel([
        Animated.timing(lineWidth, {
          toValue: 1,
          duration: 900,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
        Animated.timing(taglineOpacity, {
          toValue: 1,
          duration: 1000,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(taglineSlide, {
          toValue: 0,
          duration: 1000,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    Animated.sequence([
      Animated.delay(1200),
      Animated.timing(estOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.timing(shimmerPos, {
        toValue: 1,
        duration: 2800,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      })
    ).start();

    particles.forEach((p) => {
      const animateParticle = () => {
        p.x.setValue(0);
        p.y.setValue(0);
        p.opacity.setValue(0);

        Animated.sequence([
          Animated.delay(p.delay),
          Animated.parallel([
            Animated.timing(p.x, {
              toValue: 1,
              duration: p.duration,
              easing: Easing.out(Easing.quad),
              useNativeDriver: true,
            }),
            Animated.timing(p.y, {
              toValue: 1,
              duration: p.duration,
              easing: Easing.out(Easing.quad),
              useNativeDriver: true,
            }),
            Animated.sequence([
              Animated.timing(p.opacity, {
                toValue: 0.6,
                duration: p.duration * 0.3,
                useNativeDriver: true,
              }),
              Animated.timing(p.opacity, {
                toValue: 0,
                duration: p.duration * 0.7,
                useNativeDriver: true,
              }),
            ]),
          ]),
        ]).start(() => animateParticle());
      };
      animateParticle();
    });

    const timer = setTimeout(() => {
      Animated.timing(screenFade, {
        toValue: 0,
        duration: 500,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start(() => {
        router.replace('/(tabs)/home');
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [logoOpacity, logoScale, taglineOpacity, taglineSlide, lineWidth, estOpacity, shimmerPos, glowOpacity, screenFade, particles, router]);

  const animatedLineWidth = lineWidth.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width * 0.28],
  });

  const shimmerTranslate = shimmerPos.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [-width * 0.6, 0, width * 0.6],
  });

  return (
    <Animated.View style={[styles.container, { opacity: screenFade }]}>
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=1200&q=60' }}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
      />
      <LinearGradient
        colors={['rgba(5,5,5,0.88)', 'rgba(10,8,6,0.92)', 'rgba(5,5,5,0.88)']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      {particles.map((p, i) => (
        <Animated.View
          key={i}
          style={[
            styles.particle,
            {
              width: p.size,
              height: p.size,
              borderRadius: p.size / 2,
              opacity: p.opacity,
              transform: [
                {
                  translateX: p.x.interpolate({
                    inputRange: [0, 1],
                    outputRange: [p.startX, p.endX],
                  }),
                },
                {
                  translateY: p.y.interpolate({
                    inputRange: [0, 1],
                    outputRange: [p.startY, p.endY],
                  }),
                },
              ],
            },
          ]}
        />
      ))}

      <Animated.View
        style={[
          styles.glowOrb,
          { opacity: glowOpacity },
        ]}
      />

      <View style={styles.content}>
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <Animated.Text style={styles.brandName}>
            MAISON
          </Animated.Text>
          <View style={styles.accentNameContainer}>
            <Animated.Text style={styles.brandNameAccent}>
              Aurélique
            </Animated.Text>
            <Animated.View
              style={[
                styles.shimmerOverlay,
                { transform: [{ translateX: shimmerTranslate }] },
              ]}
            >
              <LinearGradient
                colors={['transparent', Colors.goldAlpha30, 'transparent']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.shimmerGradient}
              />
            </Animated.View>
          </View>
        </Animated.View>

        <View style={styles.lineContainer}>
          <Animated.View style={[styles.line, { width: animatedLineWidth }]} />
        </View>

        <Animated.View
          style={[
            styles.taglineContainer,
            {
              opacity: taglineOpacity,
              transform: [{ translateY: taglineSlide }],
            },
          ]}
        >
          <Animated.Text style={styles.tagline}>
            Timeless Scents for the Discerning
          </Animated.Text>
        </Animated.View>
      </View>

      <Animated.Text style={[styles.established, { opacity: estOpacity }]}>
        EST. MMXXIV
      </Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.blackDeep,
    justifyContent: 'center',
    alignItems: 'center',
  },
  particle: {
    position: 'absolute' as const,
    backgroundColor: Colors.gold,
  },
  glowOrb: {
    position: 'absolute' as const,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: Colors.goldAlpha08,
    top: '38%',
    alignSelf: 'center',
  },
  content: {
    alignItems: 'center',
    zIndex: 2,
  },
  logoContainer: {
    alignItems: 'center',
  },
  brandName: {
    fontFamily: Typography.serifFamily,
    color: Colors.gold,
    fontSize: 34,
    letterSpacing: 14,
    fontWeight: '200' as const,
  },
  accentNameContainer: {
    overflow: 'hidden' as const,
    marginTop: -2,
  },
  brandNameAccent: {
    fontFamily: Typography.serifFamily,
    color: Colors.gold,
    fontSize: 50,
    fontStyle: 'italic',
    fontWeight: '300' as const,
    letterSpacing: 2,
  },
  shimmerOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  shimmerGradient: {
    flex: 1,
    width: 120,
  },
  lineContainer: {
    height: 1,
    marginVertical: 28,
    alignItems: 'center',
  },
  line: {
    height: 1,
    backgroundColor: Colors.goldAlpha40,
  },
  taglineContainer: {
    alignItems: 'center',
  },
  tagline: {
    fontFamily: Typography.sansFamily,
    color: Colors.whiteAlpha40,
    letterSpacing: 4,
    fontSize: 10,
    fontWeight: '300' as const,
    textTransform: 'uppercase' as const,
  },
  established: {
    fontFamily: Typography.sansFamily,
    color: Colors.whiteAlpha15,
    position: 'absolute' as const,
    bottom: 56,
    letterSpacing: 6,
    fontSize: 9,
    fontWeight: '300' as const,
    textTransform: 'uppercase' as const,
  },
});
