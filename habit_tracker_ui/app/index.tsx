import AnimatedThemeSelector from '@/components/AnimatedThemeSelector';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import React from 'react';
import { Dimensions, ScrollView, TouchableOpacity, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
  SlideInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated';

export default function LandingPage() {
  const { theme } = useTheme();
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const floatAnimation = useSharedValue(0);
  const pulseAnimation = useSharedValue(1);

  React.useEffect(() => {
    if (!isLoading && user) {
      router.push('/(tabs)');
    }
  }, [user, isLoading]);

  React.useEffect(() => {
    floatAnimation.value = withRepeat(
      withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );

    pulseAnimation.value = withRepeat(
      withTiming(1.05, { duration: 2000, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    );
  }, []);

  const floatingStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatAnimation.value * 15 }],
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnimation.value }],
  }));

  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

  const scaleFontSize = (size: number) => Math.min(size, SCREEN_WIDTH * (size / 375));
  const scalePadding = (size: number) => Math.min(size, SCREEN_WIDTH * (size / 375));
  const scaleMargin = (size: number) => Math.min(size, SCREEN_WIDTH * (size / 375));

  const styles = useThemedStyles(theme => ({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContainer: {
      flexGrow: 1,
    },
    heroSection: {
      minHeight: SCREEN_HEIGHT * 0.45,
      position: 'relative',
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: scalePadding(60),
    },
    gradientOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '100%',
      opacity: 0.08,
    },
    backgroundPattern: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0.03,
    },
    heroContent: {
      alignItems: 'center',
      paddingHorizontal: scalePadding(30),
      zIndex: 2,
    },
    titleContainer: {
      alignItems: 'center',
      marginBottom: scaleMargin(25),
    },
    title: {
      fontSize: scaleFontSize(52),
      fontWeight: '900',
      color: theme.colors.primary,
      textAlign: 'center',
      letterSpacing: -2,
      marginBottom: scaleMargin(12),
      textShadowColor: `${theme.colors.primary}20`,
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 8,
    },
    subtitle: {
      fontSize: scaleFontSize(22),
      color: theme.colors.textDark,
      textAlign: 'center',
      opacity: 0.8,
      fontWeight: '400',
      lineHeight: scaleFontSize(32),
      maxWidth: scaleMargin(320),
      marginBottom: scaleMargin(20),
    },
    decorativeElements: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: scalePadding(12),
      marginTop: scaleMargin(10),
    },
    decorativeDot: {
      width: scalePadding(8),
      height: scalePadding(8),
      borderRadius: scalePadding(4),
      backgroundColor: theme.colors.primary,
      opacity: 0.6,
    },
    decorativeLine: {
      width: scalePadding(40),
      height: 2,
      backgroundColor: theme.colors.primary,
      borderRadius: 1,
      opacity: 0.4,
    },
    themeSection: {
      paddingVertical: scalePadding(40),
      paddingHorizontal: scalePadding(20),
      alignItems: 'center',
    },
    themeSectionTitle: {
      fontSize: scaleFontSize(24),
      color: theme.colors.textDark,
      fontWeight: '700',
      marginBottom: scaleMargin(15),
      textAlign: 'center',
      opacity: 0.9,
    },
    themeSectionSubtitle: {
      fontSize: scaleFontSize(16),
      color: theme.colors.textDark,
      opacity: 0.6,
      textAlign: 'center',
      marginBottom: scaleMargin(35),
      fontWeight: '400',
    },
    featuresSection: {
      paddingHorizontal: scalePadding(30),
      paddingVertical: scalePadding(25),
    },
    featureGrid: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: scaleMargin(35),
    },
    featureItem: {
      flex: 1,
      alignItems: 'center',
      paddingHorizontal: scalePadding(8),
    },
    featureIconContainer: {
      width: scalePadding(50),
      height: scalePadding(50),
      borderRadius: scalePadding(25),
      backgroundColor: `${theme.colors.primary}15`,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: scaleMargin(12),
      borderWidth: 2,
      borderColor: `${theme.colors.primary}30`,
    },
    featureIcon: {
      justifyContent: 'center',
      alignItems: 'center',
      width: scalePadding(20),
      height: scalePadding(20),
      borderRadius: scalePadding(10),
      backgroundColor: theme.colors.primary,
    },
    featureText: {
      fontSize: scaleFontSize(14),
      color: theme.colors.textDark,
      opacity: 0.8,
      textAlign: 'center',
      fontWeight: '600',
      marginBottom: scaleMargin(4),
    },
    featureDescription: {
      fontSize: scaleFontSize(11),
      color: theme.colors.textDark,
      opacity: 0.5,
      textAlign: 'center',
      fontWeight: '400',
    },
    buttonSection: {
      paddingHorizontal: scalePadding(30),
      paddingVertical: scalePadding(30),
      paddingBottom: scalePadding(50),
      gap: scalePadding(18),
    },
    primaryButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: scalePadding(60),
      paddingVertical: scalePadding(20),
      borderRadius: 60,
      alignItems: 'center',
      shadowColor: theme.colors.primary,
      shadowOffset: {
        width: 0,
        height: scalePadding(12),
      },
      shadowOpacity: 0.4,
      shadowRadius: scalePadding(16),
      elevation: 15,
      position: 'relative',
      overflow: 'hidden',
    },
    secondaryButton: {
      backgroundColor: theme.colors.surface,
      borderWidth: 2.5,
      borderColor: theme.colors.primary,
      paddingHorizontal: scalePadding(60),
      paddingVertical: scalePadding(20),
      borderRadius: 60,
      alignItems: 'center',
      shadowColor: theme.colors.textDark,
      shadowOffset: {
        width: 0,
        height: scalePadding(6),
      },
      shadowOpacity: 0.1,
      shadowRadius: scalePadding(12),
      elevation: 8,
    },
    primaryButtonText: {
      color: theme.colors.surface,
      fontSize: scaleFontSize(19),
      fontWeight: '800',
      letterSpacing: 0.5,
    },
    secondaryButtonText: {
      color: theme.colors.primary,
      fontSize: scaleFontSize(19),
      fontWeight: '700',
      letterSpacing: 0.5,
    },
    buttonGlow: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderRadius: 60,
    },
    statsSection: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: scalePadding(30),
      paddingVertical: scalePadding(20),
      gap: scalePadding(30),
    },
    statItem: {
      alignItems: 'center',
    },
    statNumber: {
      fontSize: scaleFontSize(18),
      fontWeight: '800',
      color: theme.colors.primary,
      marginBottom: scaleMargin(2),
    },
    statLabel: {
      fontSize: scaleFontSize(12),
      color: theme.colors.textDark,
      opacity: 0.6,
      fontWeight: '500',
    },
  }));

  const handleLogin = () => {
    router.push('/login');
  };

  const handleSignUp = () => {
    router.push('/signup');
  };

  if (isLoading) {
    return (
      <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ThemedText style={styles.title}>Loading...</ThemedText>
      </ThemedView>
    );
  }

  if (user) {
    return null; // Will redirect via useEffect
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <LinearGradient
            colors={[`${theme.colors.primary}`, `${theme.colors.secondary}`, 'transparent']}
            style={styles.gradientOverlay}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />

          <Animated.View entering={FadeInUp.delay(200)} style={styles.heroContent}>
            <Animated.View style={[styles.titleContainer, floatingStyle]}>
              <ThemedText style={styles.title}>Habit Tracker</ThemedText>
              <View style={styles.decorativeElements}>
                <View style={styles.decorativeLine} />
                <View style={styles.decorativeDot} />
                <View style={styles.decorativeLine} />
              </View>
            </Animated.View>

            <Animated.View entering={FadeIn.delay(600)}>
              <ThemedText style={styles.subtitle}>
                Transform your daily routines into powerful habits that shape your future self
              </ThemedText>
            </Animated.View>
          </Animated.View>
        </View>

        {/* Theme Selection Section */}
        <Animated.View entering={FadeIn.delay(800)} style={styles.themeSection}>
          <ThemedText style={styles.themeSectionTitle}>
            Choose Your Style ✨
          </ThemedText>
          <ThemedText style={styles.themeSectionSubtitle}>
            Pick a theme that inspires your journey
          </ThemedText>
          <AnimatedThemeSelector />
        </Animated.View>

        {/* Features Section */}
        <Animated.View entering={FadeInUp.delay(1000)} style={styles.featuresSection}>
          <View style={styles.featureGrid}>
            <Animated.View entering={FadeIn.delay(1200)} style={styles.featureItem}>
              <View style={styles.featureIconContainer}>
                <View style={styles.featureIcon}>
                  <Ionicons name="checkmark-done" size={scalePadding(16)} color={theme.colors.surface} />
                </View>
              </View>
              <ThemedText style={styles.featureText}>Daily Tracking</ThemedText>
              <ThemedText style={styles.featureDescription}>Simple & intuitive</ThemedText>
            </Animated.View>

            <Animated.View entering={FadeIn.delay(1400)} style={styles.featureItem}>
              <View style={styles.featureIconContainer}>
                <View style={styles.featureIcon}>
                  <Ionicons name="flame" size={scalePadding(16)} color={theme.colors.surface} />
                </View>
              </View>
              <ThemedText style={styles.featureText}>Streak Building</ThemedText>
              <ThemedText style={styles.featureDescription}>Stay motivated</ThemedText>
            </Animated.View>

            <Animated.View entering={FadeIn.delay(1600)} style={styles.featureItem}>
              <View style={styles.featureIconContainer}>
                <View style={styles.featureIcon}>
                  <Ionicons name="bar-chart" size={scalePadding(16)} color={theme.colors.surface} />
                </View>
              </View>
              <ThemedText style={styles.featureText}>Progress Insights</ThemedText>
              <ThemedText style={styles.featureDescription}>Track your growth</ThemedText>
            </Animated.View>
          </View>

          {/* Stats Section */}
          <Animated.View entering={FadeInDown.delay(1800)} style={styles.statsSection}>
            <View style={styles.statItem}>
              <ThemedText style={styles.statNumber}>10K+</ThemedText>
              <ThemedText style={styles.statLabel}>Users</ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText style={styles.statNumber}>50M+</ThemedText>
              <ThemedText style={styles.statLabel}>Habits Tracked</ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText style={styles.statNumber}>95%</ThemedText>
              <ThemedText style={styles.statLabel}>Success Rate</ThemedText>
            </View>
          </Animated.View>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View entering={SlideInUp.delay(2000)} style={styles.buttonSection}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
            <Animated.View style={[styles.buttonGlow, pulseStyle]} />
            <ThemedText style={styles.primaryButtonText}>Sign In</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={handleSignUp}>
            <ThemedText style={styles.secondaryButtonText}>Create Account</ThemedText>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </ThemedView>
  );
}