import React, { useEffect } from 'react';
import { 
  View, 
  Modal, 
  TouchableOpacity, 
  Image, 
  Dimensions, 
  ScrollView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  runOnJS,
  FadeIn,
  FadeInUp,
  FadeInDown,
  SlideInUp,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useTheme } from '@/contexts/ThemeContext';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface User {
  name?: string;
  email?: string;
  profileImage?: string;
  joinedDate?: string;
  currentStreak?: number;
  longestStreak?: number;
  totalHabits?: number;
  completedHabits?: number;
}

interface UserProfileModalProps {
  visible: boolean;
  onClose: () => void;
  user?: User | null;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function UserProfileModal({ visible, onClose, user }: UserProfileModalProps) {
  const { theme } = useTheme();
  const modalScale = useSharedValue(0);
  const modalOpacity = useSharedValue(0);
  const backdropOpacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      backdropOpacity.value = withTiming(1, { duration: 300 });
      modalOpacity.value = withTiming(1, { duration: 300 });
      modalScale.value = withSequence(
        withTiming(1.1, { duration: 200 }),
        withSpring(1, { damping: 15 })
      );
    } else {
      backdropOpacity.value = withTiming(0, { duration: 200 });
      modalOpacity.value = withTiming(0, { duration: 200 });
      modalScale.value = withTiming(0.9, { duration: 200 });
    }
  }, [visible]);

  const modalAnimatedStyle = useAnimatedStyle(() => ({
    opacity: modalOpacity.value,
    transform: [{ scale: modalScale.value }],
  }));

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const styles = useThemedStyles(theme => ({
    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    modalContent: {
      backgroundColor: theme.colors.surface,
      borderRadius: 24,
      width: '100%',
      maxWidth: 400,
      maxHeight: SCREEN_HEIGHT * 0.8,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 20,
      },
      shadowOpacity: 0.3,
      shadowRadius: 25,
      elevation: 25,
    },
    modalHeader: {
      position: 'relative',
      height: 120,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      overflow: 'hidden',
    },
    headerGradient: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 20,
    },
    closeButton: {
      position: 'absolute',
      top: 15,
      right: 15,
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10,
    },
    profileSection: {
      alignItems: 'center',
      paddingHorizontal: 30,
      paddingVertical: 25,
    },
    profileImageContainer: {
      marginTop: -40,
      marginBottom: 15,
    },
    profileImage: {
      width: 80,
      height: 80,
      borderRadius: 40,
      borderWidth: 4,
      borderColor: theme.colors.surface,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 12,
    },
    profilePlaceholder: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: `${theme.colors.primary}20`,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 4,
      borderColor: theme.colors.surface,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 12,
    },
    profileInitial: {
      fontSize: 32,
      fontWeight: '900',
      color: theme.colors.primary,
    },
    userName: {
      fontSize: 24,
      fontWeight: '800',
      color: theme.colors.textDark,
      marginBottom: 5,
      textAlign: 'center',
    },
    userEmail: {
      fontSize: 16,
      color: theme.colors.textDark,
      opacity: 0.7,
      textAlign: 'center',
      marginBottom: 5,
    },
    joinedDate: {
      fontSize: 14,
      color: theme.colors.primary,
      fontWeight: '600',
      textAlign: 'center',
    },
    statsContainer: {
      paddingHorizontal: 30,
      paddingBottom: 30,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 15,
    },
    statCard: {
      flex: 1,
      minWidth: '45%',
      backgroundColor: `${theme.colors.primary}05`,
      borderRadius: 16,
      padding: 20,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: `${theme.colors.primary}15`,
    },
    statIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },
    statValue: {
      fontSize: 24,
      fontWeight: '900',
      color: theme.colors.primary,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      color: theme.colors.textDark,
      opacity: 0.7,
      textAlign: 'center',
      fontWeight: '600',
    },
    achievementsSection: {
      paddingHorizontal: 30,
      paddingBottom: 30,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '800',
      color: theme.colors.textDark,
      marginBottom: 15,
    },
    achievementsList: {
      gap: 12,
    },
    achievementItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
      borderRadius: 12,
      padding: 15,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.primary,
    },
    achievementIcon: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    achievementText: {
      flex: 1,
    },
    achievementTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: theme.colors.textDark,
      marginBottom: 2,
    },
    achievementDescription: {
      fontSize: 12,
      color: theme.colors.textDark,
      opacity: 0.6,
    },
    divider: {
      height: 1,
      backgroundColor: `${theme.colors.textLight}20`,
      marginVertical: 20,
      marginHorizontal: 30,
    },
  }));

  // Mock data - replace with actual user data
  const userData = {
    name: user?.name || 'John Doe',
    email: user?.email || 'john.doe@example.com',
    joinedDate: user?.joinedDate || 'January 2024',
    currentStreak: user?.currentStreak || 15,
    longestStreak: user?.longestStreak || 42,
    totalHabits: user?.totalHabits || 8,
    completedHabits: user?.completedHabits || 156,
    profileImage: user?.profileImage,
  };

  const getUserInitial = () => {
    return userData.name.charAt(0).toUpperCase();
  };

  const achievements = [
    {
      title: 'Streak Master',
      description: 'Maintained a 30-day streak',
      icon: '🔥',
    },
    {
      title: 'Early Bird',
      description: 'Completed morning routine 20 times',
      icon: '🌅',
    },
    {
      title: 'Consistency King',
      description: 'Completed all habits for 7 days straight',
      icon: '👑',
    },
  ];

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <StatusBar backgroundColor="rgba(0,0,0,0.5)" barStyle="light-content" />
      
      <Animated.View style={[styles.modalContainer, backdropAnimatedStyle]}>
        <TouchableOpacity 
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          onPress={onClose}
          activeOpacity={1}
        />
        
        <Animated.View style={[styles.modalContent, modalAnimatedStyle]}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header with gradient */}
            <View style={styles.modalHeader}>
              <LinearGradient
                colors={[theme.colors.primary, theme.colors.secondary]}
                style={styles.headerGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                  <Ionicons name="close" size={20} color="white" />
                </TouchableOpacity>
              </LinearGradient>
            </View>

            {/* Profile Section */}
            <Animated.View entering={FadeInUp.delay(200)} style={styles.profileSection}>
              <View style={styles.profileImageContainer}>
                {userData.profileImage ? (
                  <Image
                    source={{ uri: userData.profileImage }}
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
              </View>

              <ThemedText style={styles.userName}>{userData.name}</ThemedText>
              <ThemedText style={styles.userEmail}>{userData.email}</ThemedText>
              <ThemedText style={styles.joinedDate}>
                Member since {userData.joinedDate}
              </ThemedText>
            </Animated.View>

            <View style={styles.divider} />

            {/* Stats Section */}
            <Animated.View entering={FadeInUp.delay(400)} style={styles.statsContainer}>
              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <View style={styles.statIcon}>
                    <ThemedText style={{ color: 'white', fontSize: 20 }}>🔥</ThemedText>
                  </View>
                  <ThemedText style={styles.statValue}>{userData.currentStreak}</ThemedText>
                  <ThemedText style={styles.statLabel}>Current Streak</ThemedText>
                </View>

                <View style={styles.statCard}>
                  <View style={styles.statIcon}>
                    <ThemedText style={{ color: 'white', fontSize: 20 }}>🏆</ThemedText>
                  </View>
                  <ThemedText style={styles.statValue}>{userData.longestStreak}</ThemedText>
                  <ThemedText style={styles.statLabel}>Longest Streak</ThemedText>
                </View>

                <View style={styles.statCard}>
                  <View style={styles.statIcon}>
                    <ThemedText style={{ color: 'white', fontSize: 20 }}>📋</ThemedText>
                  </View>
                  <ThemedText style={styles.statValue}>{userData.totalHabits}</ThemedText>
                  <ThemedText style={styles.statLabel}>Total Habits</ThemedText>
                </View>

                <View style={styles.statCard}>
                  <View style={styles.statIcon}>
                    <ThemedText style={{ color: 'white', fontSize: 20 }}>✅</ThemedText>
                  </View>
                  <ThemedText style={styles.statValue}>{userData.completedHabits}</ThemedText>
                  <ThemedText style={styles.statLabel}>Completed</ThemedText>
                </View>
              </View>
            </Animated.View>

            {/* Achievements Section */}
            <Animated.View entering={FadeInUp.delay(600)} style={styles.achievementsSection}>
              <ThemedText style={styles.sectionTitle}>Recent Achievements</ThemedText>
              <View style={styles.achievementsList}>
                {achievements.map((achievement, index) => (
                  <Animated.View 
                    key={index}
                    entering={FadeInUp.delay(800 + index * 100)}
                    style={styles.achievementItem}
                  >
                    <View style={styles.achievementIcon}>
                      <ThemedText style={{ fontSize: 16 }}>{achievement.icon}</ThemedText>
                    </View>
                    <View style={styles.achievementText}>
                      <ThemedText style={styles.achievementTitle}>
                        {achievement.title}
                      </ThemedText>
                      <ThemedText style={styles.achievementDescription}>
                        {achievement.description}
                      </ThemedText>
                    </View>
                  </Animated.View>
                ))}
              </View>
            </Animated.View>
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}