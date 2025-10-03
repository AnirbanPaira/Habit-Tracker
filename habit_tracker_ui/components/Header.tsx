import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Alert, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  useAnimatedGestureHandler,
  runOnJS,
  interpolate,
  Extrapolate,
  withSequence,
  Easing,
  withRepeat,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import UserProfileModal from './modals/UserProfileModal';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const HEADER_HEIGHT = 100;
const COLLAPSED_HEIGHT = 20;

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function Header() {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Animation values
  const profileScale = useSharedValue(1);
  const signOutScale = useSharedValue(1);
  const profileRotate = useSharedValue(0);

  const handleSignOut = async () => {
     await logout();
            router.replace('/login');
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/login');
          },
        },
      ]
    );
  };

  const handleProfilePress = () => {
    profileScale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    profileRotate.value = withTiming(profileRotate.value + 360, { duration: 500 });
    setShowProfileModal(true);
  };

  const handleSignOutPress = () => {
    signOutScale.value = withSequence(
      withTiming(0.9, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    setTimeout(() => handleSignOut(), 150);
  };

  const profileAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: profileScale.value },
      { rotate: `${profileRotate.value}deg` }
    ],
  }));

  const signOutAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: signOutScale.value }],
  }));

  const styles = useThemedStyles(theme => ({
    container: {
      backgroundColor: theme.colors.surface,
      paddingHorizontal: 20,
      paddingVertical: 15,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 3,
      borderBottomWidth: 1,
      borderBottomColor: `${theme.colors.textLight}20`,
    },
    leftSection: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    greeting: {
      marginLeft: 15,
    },
    greetingText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.textDark,
      opacity: 0.8,
    },
    userName: {
      fontSize: 20,
      fontWeight: '800',
      color: theme.colors.primary,
      marginTop: 2,
    },
    rightSection: {
      alignItems: 'center',
    },
    profileContainer: {
      position: 'relative',
    },
    profileButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
      overflow: 'hidden',
      shadowColor: theme.colors.primary,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    profileGradient: {
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: `${theme.colors.primary}40`,
      borderRadius: 25,
    },
    profileImage: {
      width: 46,
      height: 46,
      borderRadius: 23,
    },
    profilePlaceholder: {
      width: 46,
      height: 46,
      borderRadius: 23,
      backgroundColor: `${theme.colors.primary}20`,
      alignItems: 'center',
      justifyContent: 'center',
    },
    profileInitial: {
      fontSize: 18,
      fontWeight: '800',
      color: theme.colors.primary,
    },
    onlineIndicator: {
      position: 'absolute',
      bottom: 2,
      right: 2,
      width: 14,
      height: 14,
      borderRadius: 7,
      backgroundColor: '#4CAF50',
      borderWidth: 2,
      borderColor: theme.colors.surface,
    },
    signOutButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: `${theme.colors.surface}`,
      borderWidth: 1.5,
      borderColor: '#ff4444',
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 15,
      shadowColor: '#ff4444',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
    },
    headerTitle: {
      flex: 1,
      alignItems: 'center',
    },
    appTitle: {
      fontSize: 22,
      fontWeight: '900',
      color: theme.colors.primary,
      letterSpacing: -0.5,
    },
    dateContainer: {
      backgroundColor: `${theme.colors.primary}10`,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      marginTop: 4,
    },
    dateText: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.colors.primary,
      opacity: 0.8,
    },
  }));

  const getUserInitial = () => {
    return user?.name ? user.name.charAt(0).toUpperCase() : 'U';
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <>
      <View style={styles.container}>
        {/* Left Section - Greeting */}
        <View style={styles.leftSection}>
          <AnimatedTouchableOpacity
            style={[styles.profileContainer]}
            onPress={handleProfilePress}
            activeOpacity={0.9}
          >
            <Animated.View style={[styles.profileButton, profileAnimatedStyle]}>
              <LinearGradient
                colors={[`${theme.colors.primary}30`, `${theme.colors.secondary}20`]}
                style={styles.profileGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                {user?.profileImage ? (
                  <Image
                    source={{ uri: user.profileImage }}
                    style={styles.profileImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.profilePlaceholder}>
                    <ThemedText style={styles.profileInitial}>
                      {getUserInitial()}
                    </ThemedText>
                  </View>
                )}
              </LinearGradient>
              <View style={styles.onlineIndicator} />
            </Animated.View>
          </AnimatedTouchableOpacity>

          <View style={styles.greeting}>
            <ThemedText style={styles.greetingText}>{getGreeting()}</ThemedText>
            <ThemedText style={styles.userName}>
              {user?.name?.split(' ')[0] || 'User'}
            </ThemedText>
          </View>
        </View>

        {/* Center Section - App Title */}
        <View style={styles.headerTitle}>
          <ThemedText style={styles.appTitle}>Habit Tracker</ThemedText>
          <View style={styles.dateContainer}>
            <ThemedText style={styles.dateText}>{getCurrentDate()}</ThemedText>
          </View>
        </View>

        {/* Right Section - Sign Out */}
        <View style={styles.rightSection}>
          <AnimatedTouchableOpacity
            style={[styles.signOutButton, signOutAnimatedStyle]}
            onPress={handleSignOutPress}
            activeOpacity={0.8}
          >
            <Ionicons name="log-out-outline" size={20} color="#ff4444" />
          </AnimatedTouchableOpacity>
        </View>
      </View>

      {/* User Profile Modal */}
      <UserProfileModal
        visible={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={user}
      />
    </>
  );
}