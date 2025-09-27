import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Dimensions, KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
  SlideInLeft,
  SlideInRight,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function SignUpScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Animation values
  const floatAnimation = useSharedValue(0);
  const pulseAnimation = useSharedValue(1);
  const rotateAnimation = useSharedValue(0);

  useEffect(() => {
    floatAnimation.value = withRepeat(
      withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );

    pulseAnimation.value = withRepeat(
      withTiming(1.08, { duration: 2500, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    );

    rotateAnimation.value = withRepeat(
      withTiming(360, { duration: 20000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const floatingStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatAnimation.value * 12 }],
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnimation.value }],
  }));

  const rotateStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotateAnimation.value}deg` }],
  }));

  const styles = useThemedStyles(theme => ({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContainer: {
      flexGrow: 1,
    },
    backgroundGradient: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: SCREEN_HEIGHT * 0.6,
      opacity: 0.08,
    },
    decorativeShape: {
      position: 'absolute',
      backgroundColor: `${theme.colors.primary}12`,
    },
    decorativeTriangle: {
      width: 120,
      height: 120,
      top: 80,
      left: -30,
      transform: [{ rotate: '45deg' }],
      borderRadius: 20,
    },
    decorativeSquare: {
      width: 80,
      height: 80,
      top: SCREEN_HEIGHT * 0.25,
      right: -20,
      borderRadius: 40,
      backgroundColor: `${theme.colors.secondary}18`,
    },
    decorativeHexagon: {
      width: 60,
      height: 60,
      bottom: 150,
      left: 40,
      borderRadius: 30,
      backgroundColor: `${theme.colors.accent}15`,
    },
    decorativeCircle: {
      width: 180,
      height: 180,
      bottom: -90,
      right: -40,
      borderRadius: 90,
      backgroundColor: `${theme.colors.primary}08`,
    },
    header: {
      paddingTop: 50,
      paddingHorizontal: 30,
      paddingBottom: 30,
      alignItems: 'center',
    },
    welcomeContainer: {
      alignItems: 'center',
      marginBottom: 25,
    },
    title: {
      fontSize: 34,
      fontWeight: '900',
      color: theme.colors.primary,
      textAlign: 'center',
      marginBottom: 8,
      letterSpacing: -1,
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.textDark,
      textAlign: 'center',
      opacity: 0.7,
      fontWeight: '400',
      maxWidth: 300,
      lineHeight: 22,
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: 20,
    },
    logo: {
      width: 75,
      height: 75,
      borderRadius: 37.5,
      backgroundColor: `${theme.colors.primary}25`,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
      shadowColor: theme.colors.primary,
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.25,
      shadowRadius: 10,
      elevation: 8,
      borderWidth: 3,
      borderColor: `${theme.colors.primary}30`,
    },
    logoIcon: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 35,
      height: 35,
      borderRadius: 17.5,
      backgroundColor: theme.colors.primary,
    },
    formContainer: {
      flex: 1,
      paddingHorizontal: 30,
      paddingBottom: 30,
    },
    inputContainer: {
      marginBottom: 20,
    },
    inputRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 15,
    },
    inputWrapper: {
      position: 'relative',
      marginBottom: 18,
      flex: 1,
    },
    inputWrapperFull: {
      position: 'relative',
      marginBottom: 18,
    },
    inputLabel: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.colors.textDark,
      marginBottom: 6,
      opacity: 0.8,
    },
    input: {
      backgroundColor: theme.colors.surface,
      borderWidth: 2,
      borderColor: theme.colors.textLight,
      borderRadius: 14,
      paddingHorizontal: 18,
      paddingVertical: 16,
      fontSize: 15,
      color: theme.colors.textDark,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.04,
      shadowRadius: 6,
      elevation: 2,
    },
    inputFocused: {
      borderColor: theme.colors.primary,
      shadowColor: theme.colors.primary,
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    inputIcon: {
      position: 'absolute',
      right: 15,
      top: 35,
      width: 18,
      height: 18,
      borderRadius: 9,
      backgroundColor: theme.colors.primary,
      opacity: 0.5,
    },
    button: {
      backgroundColor: theme.colors.primary,
      paddingVertical: 18,
      borderRadius: 45,
      alignItems: 'center',
      marginTop: 15,
      marginBottom: 20,
      shadowColor: theme.colors.primary,
      shadowOffset: {
        width: 0,
        height: 10,
      },
      shadowOpacity: 0.35,
      shadowRadius: 14,
      elevation: 12,
      position: 'relative',
      overflow: 'hidden',
    },
    buttonGlow: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255,255,255,0.25)',
      borderRadius: 45,
    },
    buttonText: {
      color: theme.colors.surface,
      fontSize: 17,
      fontWeight: '800',
      letterSpacing: 0.8,
    },
    linkContainer: {
      alignItems: 'center',
      paddingTop: 15,
      paddingBottom: 20,
    },
    linkText: {
      color: theme.colors.primary,
      fontSize: 15,
      fontWeight: '600',
    },
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 25,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: `${theme.colors.textLight}35`,
    },
    dividerText: {
      marginHorizontal: 12,
      color: theme.colors.textDark,
      opacity: 0.6,
      fontWeight: '500',
      fontSize: 13,
    },
    socialContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 15,
      marginBottom: 25,
    },
    socialButton: {
      width: 55,
      height: 55,
      borderRadius: 27.5,
      backgroundColor: theme.colors.surface,
      borderWidth: 1.5,
      borderColor: `${theme.colors.textLight}25`,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 3,
    },
    socialIcon: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 22,
      height: 22,
      borderRadius: 11,
      backgroundColor: theme.colors.primary,
    },
    progressContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 25,
      gap: 8,
    },
    progressStep: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: `${theme.colors.primary}30`,
    },
    progressStepActive: {
      backgroundColor: theme.colors.primary,
      width: 24,
      height: 8,
    },
    featureList: {
      backgroundColor: `${theme.colors.primary}05`,
      borderRadius: 12,
      padding: 15,
      marginVertical: 15,
      borderWidth: 1,
      borderColor: `${theme.colors.primary}10`,
    },
    featureItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    featureIcon: {
      justifyContent: 'center',
      alignItems: 'center',
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: theme.colors.primary,
      marginRight: 10,
      opacity: 0.8,
    },
    featureText: {
      fontSize: 13,
      color: theme.colors.textDark,
      opacity: 0.7,
      fontWeight: '500',
    },
  }));

  const handleSignUp = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Please fill in all fields' });
      return;
    }
    if (password !== confirmPassword) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Passwords do not match' });
      return;
    }
    setIsLoading(true);
    try {
      await signup(name, email, password);
      router.replace('/(tabs)');
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Error', text2: error.message || 'Signup failed' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <ThemedView style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={[`${theme.colors.secondary}`, `${theme.colors.primary}`, 'transparent']}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Decorative Elements */}
      <Animated.View style={[styles.decorativeShape, styles.decorativeTriangle, floatingStyle]} />
      <Animated.View style={[styles.decorativeShape, styles.decorativeSquare, rotateStyle]} />
      <Animated.View style={[styles.decorativeShape, styles.decorativeHexagon, pulseStyle]} />
      <Animated.View style={[styles.decorativeShape, styles.decorativeCircle]} />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <Animated.View entering={FadeInUp.delay(200)} style={styles.header}>
            <Animated.View style={[styles.logoContainer, floatingStyle]}>
              <View style={styles.logo}>
                <View style={styles.logoIcon}>
                  <Ionicons name="person-add-outline" size={24} color="white" />
                </View>
              </View>
            </Animated.View>

            <View style={styles.welcomeContainer}>
              <ThemedText style={styles.title}>Create Account</ThemedText>
              <ThemedText style={styles.subtitle}>
                Join thousands building better habits every day
              </ThemedText>
            </View>

            {/* Progress Indicator */}
            <View style={styles.progressContainer}>
              <View style={[styles.progressStep, styles.progressStepActive]} />
              <View style={styles.progressStep} />
              <View style={styles.progressStep} />
            </View>
          </Animated.View>

          {/* Form */}
          <View style={styles.formContainer}>
            <Animated.View entering={SlideInLeft.delay(400)} style={styles.inputContainer}>
              <View style={styles.inputWrapperFull}>
                <ThemedText style={styles.inputLabel}>Full Name</ThemedText>
                <TextInput
                  style={[
                    styles.input,
                    nameFocused && styles.inputFocused
                  ]}
                  placeholder="Enter your full name"
                  placeholderTextColor={`${theme.colors.textDark}50`}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  onFocus={() => setNameFocused(true)}
                  onBlur={() => setNameFocused(false)}
                />
                <View style={styles.inputIcon}>
                  <Ionicons name="person-outline" size={16} color="white" />
                </View>
              </View>

              <View style={styles.inputWrapperFull}>
                <ThemedText style={styles.inputLabel}>Email Address</ThemedText>
                <TextInput
                  style={[
                    styles.input,
                    emailFocused && styles.inputFocused
                  ]}
                  placeholder="Enter your email"
                  placeholderTextColor={`${theme.colors.textDark}50`}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                />
                <View style={styles.inputIcon}>
                  <Ionicons name="mail-outline" size={16} color="white" />
                </View>
              </View>

              <View style={styles.inputRow}>
                <View style={styles.inputWrapper}>
                  <ThemedText style={styles.inputLabel}>Password</ThemedText>
                  <TextInput
                    style={[
                      styles.input,
                      passwordFocused && styles.inputFocused
                    ]}
                    placeholder="Create password"
                    placeholderTextColor={`${theme.colors.textDark}50`}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                  />
                  <View style={styles.inputIcon}>
                    <Ionicons name="lock-closed-outline" size={16} color="white" />
                  </View>
                </View>
              </View>
              <View style={styles.inputWrapper}>
                <ThemedText style={styles.inputLabel}>Confirm</ThemedText>
                <TextInput
                  style={[
                    styles.input,
                    confirmPasswordFocused && styles.inputFocused
                  ]}
                  placeholder="Confirm password"
                  placeholderTextColor={`${theme.colors.textDark}50`}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  onFocus={() => setConfirmPasswordFocused(true)}
                  onBlur={() => setConfirmPasswordFocused(false)}
                />
                <View style={styles.inputIcon}>
                  <Ionicons name="lock-closed-outline" size={16} color="white" />
                </View>
              </View>
            </Animated.View>

            {/* Feature Benefits */}
            <Animated.View entering={SlideInRight.delay(600)} style={styles.featureList}>
              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Ionicons name="checkmark" size={12} color="white" />
                </View>
                <ThemedText style={styles.featureText}>Track unlimited habits daily</ThemedText>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.featureIcon} >
                  <Ionicons name="checkmark" size={12} color="white" />
                </View>
                <ThemedText style={styles.featureText}>Build streaks and stay motivated</ThemedText>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.featureIcon} >
                  <Ionicons name="checkmark" size={12} color="white" />
                </View>
                <ThemedText style={styles.featureText}>Detailed progress analytics</ThemedText>
              </View>
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(800)}>
              <TouchableOpacity
                style={[
                  styles.button,
                  isLoading && { opacity: 0.7 }
                ]}
                onPress={handleSignUp}
                disabled={isLoading}
              >
                <Animated.View style={[styles.buttonGlow, pulseStyle]} />
                <ThemedText style={styles.buttonText}>
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </ThemedText>
              </TouchableOpacity>
            </Animated.View>

            {/* Social Login */}
            <Animated.View entering={FadeIn.delay(1000)}>
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <ThemedText style={styles.dividerText}>Or sign up with</ThemedText>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.socialContainer}>
                <TouchableOpacity style={styles.socialButton}>
                  <View style={styles.socialIcon}>
                    <Ionicons name="logo-google" size={16} color="white" />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                  <View style={styles.socialIcon}>
                    <Ionicons name="logo-github" size={16} color="white" />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                  <View style={styles.socialIcon}>
                    <Ionicons name="logo-linkedin" size={16} color="white" />
                  </View>
                </TouchableOpacity>
              </View>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(1200)} style={styles.linkContainer}>
              <TouchableOpacity onPress={handleLogin}>
                <ThemedText style={styles.linkText}>
                  Already have an account? Sign in
                </ThemedText>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView >
    </ThemedView >
  );
}