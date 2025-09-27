import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
  SlideInLeft,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Animation values
  const floatAnimation = useSharedValue(0);
  const pulseAnimation = useSharedValue(1);

  useEffect(() => {
    floatAnimation.value = withRepeat(
      withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
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
    transform: [{ translateY: floatAnimation.value * 10 }],
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnimation.value }],
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
      height: SCREEN_HEIGHT * 0.5,
      opacity: 0.1,
    },
    decorativeCircle: {
      position: 'absolute',
      borderRadius: 100,
      backgroundColor: `${theme.colors.primary}15`,
    },
    decorativeCircle1: {
      width: 200,
      height: 200,
      top: -100,
      right: -50,
    },
    decorativeCircle2: {
      width: 150,
      height: 150,
      bottom: 100,
      left: -75,
    },
    decorativeCircle3: {
      width: 80,
      height: 80,
      top: SCREEN_HEIGHT * 0.3,
      right: 30,
      backgroundColor: `${theme.colors.secondary}20`,
    },
    header: {
      paddingTop: 60,
      paddingHorizontal: 30,
      paddingBottom: 40,
      alignItems: 'center',
    },
    welcomeContainer: {
      alignItems: 'center',
      marginBottom: 30,
    },
    title: {
      fontSize: 36,
      fontWeight: '900',
      color: theme.colors.primary,
      textAlign: 'center',
      marginBottom: 10,
      letterSpacing: -1,
    },
    subtitle: {
      fontSize: 18,
      color: theme.colors.textDark,
      textAlign: 'center',
      opacity: 0.7,
      fontWeight: '400',
      maxWidth: 280,
      lineHeight: 24,
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: 20,
    },
    logo: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: `${theme.colors.primary}20`,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 15,
      shadowColor: theme.colors.primary,
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 10,
    },
    logoIcon: {
      justifyContent: 'center',
      alignItems: 'center',
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.primary,
    },
    formContainer: {
      flex: 1,
      paddingHorizontal: 30,
      paddingBottom: 40,
    },
    inputContainer: {
      marginBottom: 25,
    },
    inputWrapper: {
      position: 'relative',
      marginBottom: 20,
    },
    inputLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.textDark,
      marginBottom: 8,
      opacity: 0.8,
    },
    input: {
      backgroundColor: theme.colors.surface,
      borderWidth: 2,
      borderColor: theme.colors.textLight,
      borderRadius: 16,
      paddingHorizontal: 20,
      paddingVertical: 18,
      fontSize: 16,
      color: theme.colors.textDark,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 3,
    },
    inputFocused: {
      borderColor: theme.colors.primary,
      shadowColor: theme.colors.primary,
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 6,
    },
    inputIcon: {
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
      right: 18,
      top: 48,
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: theme.colors.primary,
      opacity: 0.6,
    },
    button: {
      backgroundColor: theme.colors.primary,
      paddingVertical: 20,
      borderRadius: 50,
      alignItems: 'center',
      marginTop: 10,
      marginBottom: 25,
      shadowColor: theme.colors.primary,
      shadowOffset: {
        width: 0,
        height: 12,
      },
      shadowOpacity: 0.4,
      shadowRadius: 16,
      elevation: 15,
      position: 'relative',
      overflow: 'hidden',
    },
    buttonGlow: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderRadius: 50,
    },
    buttonText: {
      color: theme.colors.surface,
      fontSize: 18,
      fontWeight: '800',
      letterSpacing: 0.5,
    },
    linkContainer: {
      alignItems: 'center',
      paddingTop: 20,
    },
    linkText: {
      color: theme.colors.primary,
      fontSize: 16,
      fontWeight: '600',
    },
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 30,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: `${theme.colors.textLight}40`,
    },
    dividerText: {
      marginHorizontal: 15,
      color: theme.colors.textDark,
      opacity: 0.6,
      fontWeight: '500',
    },
    socialContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 20,
      marginBottom: 30,
    },
    socialButton: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: theme.colors.surface,
      borderWidth: 2,
      borderColor: `${theme.colors.textLight}30`,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    socialIcon: {
      justifyContent: 'center',
      alignItems: 'center',
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: theme.colors.primary,
    },
  }));

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Please fill in all fields' });
      return;
    }
    setIsLoading(true);
    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Error', text2: error.message || 'Login failed' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = () => {
    router.push('/signup');
  };

  return (
    <ThemedView style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={[`${theme.colors.primary}`, `${theme.colors.secondary}`, 'transparent']}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Decorative Elements */}
      <Animated.View style={[styles.decorativeCircle, styles.decorativeCircle1, floatingStyle]} />
      <Animated.View style={[styles.decorativeCircle, styles.decorativeCircle2]} />
      <Animated.View style={[styles.decorativeCircle, styles.decorativeCircle3, pulseStyle]} />

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
                  <Ionicons name="person" size={24} color="white" />
                </View>
              </View>
            </Animated.View>

            <View style={styles.welcomeContainer}>
              <ThemedText style={styles.title}>Welcome Back</ThemedText>
              <ThemedText style={styles.subtitle}>
                Sign in to continue your habit journey
              </ThemedText>
            </View>
          </Animated.View>

          {/* Form */}
          <View style={styles.formContainer}>
            <Animated.View entering={SlideInLeft.delay(400)} style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
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
                <View style={styles.inputIcon} >
                  <Ionicons name="mail-outline" size={16} color="white" />
                </View>
              </View>

              <View style={styles.inputWrapper}>
                <ThemedText style={styles.inputLabel}>Password</ThemedText>
                <TextInput
                  style={[
                    styles.input,
                    passwordFocused && styles.inputFocused
                  ]}
                  placeholder="Enter your password"
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
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(600)}>
              <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Animated.View style={[styles.buttonGlow, pulseStyle]} />
                <ThemedText style={styles.buttonText}>Sign In</ThemedText>
              </TouchableOpacity>
            </Animated.View>

            {/* Social Login */}
            <Animated.View entering={FadeIn.delay(800)}>
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <ThemedText style={styles.dividerText}>Or continue with</ThemedText>
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

            <Animated.View entering={FadeInDown.delay(1000)} style={styles.linkContainer}>
              <TouchableOpacity onPress={handleSignUp}>
                <ThemedText style={styles.linkText}>
                  Don&apos;t have an account? Create one
                </ThemedText>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}