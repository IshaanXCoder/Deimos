import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Image } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface SplashScreenProps {
  onFinish: () => void;
}

const { width, height } = Dimensions.get('window');

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    const animationSequence = Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(1500),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]);

    animationSequence.start(() => {
      onFinish();
    });
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { translateY: slideAnim },
            ],
          },
        ]}
      >
        <View style={styles.logoContainer}>
          <Image
            source={require('@/assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        
        <Text style={[styles.title, { color: colors.text }]}>Deimos</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          zkVM Mobile Benchmarking Tool
        </Text>
        
        <View style={styles.taglineContainer}>
          <Text style={[styles.tagline, { color: colors.accent }]}>
            SHA256 • Keccak • Poseidon
          </Text>
          <Text style={[styles.tagline, { color: colors.secondary }]}>
            Circom • Halo2 • Noir
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: 32,
  },
  logo: {
    width: 200,
    height: 200,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 32,
    textAlign: 'center',
  },
  taglineContainer: {
    alignItems: 'center',
    gap: 8,
  },
  tagline: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
  },
});