import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/contexts/ThemeContext';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    Modal,
    ScrollView,
    StatusBar,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, {
    FadeInUp,
    FadeOutDown,
    Layout,
    useSharedValue
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Reminder {
  id: string;
  title: string;
  description: string;
  time: string;
  date: string;
  category: 'work' | 'personal' | 'health' | 'other';
  isCompleted: boolean;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function ReminderScreen() {
  const { theme } = useTheme();
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: '1',
      title: 'Morning Workout',
      description: '30 minutes cardio and stretching',
      time: '06:00 AM',
      date: 'Today',
      category: 'health',
      isCompleted: false,
    },
    {
      id: '2',
      title: 'Team Meeting',
      description: 'Discuss Q4 project goals',
      time: '10:00 AM',
      date: 'Today',
      category: 'work',
      isCompleted: false,
    },
    {
      id: '3',
      title: 'Grocery Shopping',
      description: 'Buy vegetables and fruits',
      time: '05:00 PM',
      date: 'Tomorrow',
      category: 'personal',
      isCompleted: true,
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    time: '',
    date: '',
    category: 'personal' as Reminder['category'],
  });

  const modalScale = useSharedValue(0);
  const modalOpacity = useSharedValue(0);

  const styles = useThemedStyles(theme => ({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      paddingTop: 60,
      paddingBottom: 30,
      paddingHorizontal: 20,
    },
    headerGradient: {
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
      paddingTop: 60,
      paddingBottom: 30,
      paddingHorizontal: 20,
    },
    headerTitle: {
      fontSize: 32,
      fontWeight: '900',
      color: 'white',
      marginBottom: 8,
    },
    headerSubtitle: {
      fontSize: 16,
      color: 'rgba(255, 255, 255, 0.9)',
      fontWeight: '500',
    },
    contentContainer: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 20,
    },
    statsRow: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 25,
    },
    statCard: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: 16,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    statValue: {
      fontSize: 28,
      fontWeight: '900',
      color: theme.colors.primary,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      color: theme.colors.textDark,
      opacity: 0.7,
      fontWeight: '600',
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 15,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '800',
      color: theme.colors.textDark,
    },
    reminderCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 20,
      padding: 20,
      marginBottom: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 8,
      borderLeftWidth: 5,
    },
    reminderCardCompleted: {
      opacity: 0.6,
    },
    reminderHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    reminderContent: {
      flex: 1,
      marginRight: 10,
    },
    reminderTitle: {
      fontSize: 18,
      fontWeight: '800',
      color: theme.colors.textDark,
      marginBottom: 6,
    },
    reminderDescription: {
      fontSize: 14,
      color: theme.colors.textDark,
      opacity: 0.7,
      lineHeight: 20,
    },
    reminderActions: {
      flexDirection: 'row',
      gap: 8,
    },
    actionButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: `${theme.colors.primary}15`,
      alignItems: 'center',
      justifyContent: 'center',
    },
    reminderFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: `${theme.colors.textLight}15`,
    },
    timeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    timeText: {
      fontSize: 14,
      fontWeight: '700',
      color: theme.colors.primary,
    },
    categoryBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      backgroundColor: `${theme.colors.primary}20`,
    },
    categoryText: {
      fontSize: 12,
      fontWeight: '700',
      color: theme.colors.primary,
      textTransform: 'capitalize',
    },
    fabButton: {
      position: 'absolute',
      bottom: 30,
      right: 20,
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 12,
    },
    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: theme.colors.surface,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      maxHeight: SCREEN_HEIGHT * 0.85,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -10 },
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 20,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 25,
      paddingTop: 25,
      paddingBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: `${theme.colors.textLight}15`,
    },
    modalTitle: {
      fontSize: 24,
      fontWeight: '900',
      color: theme.colors.textDark,
    },
    closeButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: `${theme.colors.primary}15`,
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalBody: {
      padding: 25,
    },
    inputGroup: {
      marginBottom: 20,
    },
    inputLabel: {
      fontSize: 14,
      fontWeight: '700',
      color: theme.colors.textDark,
      marginBottom: 8,
    },
    input: {
      backgroundColor: theme.colors.background,
      borderRadius: 12,
      padding: 15,
      fontSize: 16,
      color: theme.colors.textDark,
      borderWidth: 2,
      borderColor: `${theme.colors.primary}15`,
    },
    textArea: {
      minHeight: 80,
      textAlignVertical: 'top',
    },
    categorySelector: {
      flexDirection: 'row',
      gap: 10,
      flexWrap: 'wrap',
    },
    categoryOption: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: `${theme.colors.primary}20`,
      backgroundColor: theme.colors.background,
    },
    categoryOptionSelected: {
      borderColor: theme.colors.primary,
      backgroundColor: `${theme.colors.primary}15`,
    },
    categoryOptionText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.textDark,
      textTransform: 'capitalize',
    },
    saveButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 16,
      padding: 18,
      alignItems: 'center',
      marginTop: 10,
    },
    saveButtonText: {
      fontSize: 16,
      fontWeight: '800',
      color: 'white',
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 60,
    },
    emptyStateIcon: {
      fontSize: 64,
      marginBottom: 16,
    },
    emptyStateText: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.textDark,
      opacity: 0.5,
      textAlign: 'center',
    },
  }));

  const getCategoryColor = (category: string) => {
    const colors = {
      work: '#3B82F6',
      personal: '#8B5CF6',
      health: '#10B981',
      other: '#F59E0B',
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  const openModal = (reminder?: Reminder) => {
    if (reminder) {
      setEditingReminder(reminder);
      setFormData({
        title: reminder.title,
        description: reminder.description,
        time: reminder.time,
        date: reminder.date,
        category: reminder.category,
      });
    } else {
      setEditingReminder(null);
      setFormData({
        title: '',
        description: '',
        time: '',
        date: '',
        category: 'personal',
      });
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingReminder(null);
  };

  const saveReminder = () => {
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }

    if (editingReminder) {
      setReminders(reminders.map(r => 
        r.id === editingReminder.id 
          ? { ...r, ...formData }
          : r
      ));
    } else {
      const newReminder: Reminder = {
        id: Date.now().toString(),
        ...formData,
        isCompleted: false,
      };
      setReminders([newReminder, ...reminders]);
    }
    closeModal();
  };

  const deleteReminder = (id: string) => {
    Alert.alert(
      'Delete Reminder',
      'Are you sure you want to delete this reminder?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => setReminders(reminders.filter(r => r.id !== id)),
        },
      ]
    );
  };

  const toggleComplete = (id: string) => {
    setReminders(reminders.map(r =>
      r.id === id ? { ...r, isCompleted: !r.isCompleted } : r
    ));
  };

  const activeReminders = reminders.filter(r => !r.isCompleted);
  const completedReminders = reminders.filter(r => r.isCompleted);

  return (
    <ThemedView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header with Gradient */}
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.secondary]}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Animated.View entering={FadeInUp.delay(100)}>
          <ThemedText style={styles.headerTitle}>My Reminders</ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            Stay on track with your tasks
          </ThemedText>
        </Animated.View>
      </LinearGradient>

      <ScrollView 
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Cards */}
        <Animated.View entering={FadeInUp.delay(200)} style={styles.statsRow}>
          <View style={styles.statCard}>
            <ThemedText style={styles.statValue}>{activeReminders.length}</ThemedText>
            <ThemedText style={styles.statLabel}>Active</ThemedText>
          </View>
          <View style={styles.statCard}>
            <ThemedText style={styles.statValue}>{completedReminders.length}</ThemedText>
            <ThemedText style={styles.statLabel}>Completed</ThemedText>
          </View>
          <View style={styles.statCard}>
            <ThemedText style={styles.statValue}>{reminders.length}</ThemedText>
            <ThemedText style={styles.statLabel}>Total</ThemedText>
          </View>
        </Animated.View>

        {/* Active Reminders */}
        {activeReminders.length > 0 && (
          <>
            <Animated.View entering={FadeInUp.delay(300)} style={styles.sectionHeader}>
              <ThemedText style={styles.sectionTitle}>Active Reminders</ThemedText>
            </Animated.View>

            {activeReminders.map((reminder, index) => (
              <Animated.View
                key={reminder.id}
                entering={FadeInUp.delay(400 + index * 100)}
                layout={Layout.springify()}
              >
                <View 
                  style={[
                    styles.reminderCard,
                    { borderLeftColor: getCategoryColor(reminder.category) }
                  ]}
                >
                  <View style={styles.reminderHeader}>
                    <View style={styles.reminderContent}>
                      <ThemedText style={styles.reminderTitle}>
                        {reminder.title}
                      </ThemedText>
                      <ThemedText style={styles.reminderDescription}>
                        {reminder.description}
                      </ThemedText>
                    </View>
                    <View style={styles.reminderActions}>
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => toggleComplete(reminder.id)}
                      >
                        <Ionicons 
                          name="checkmark-circle-outline" 
                          size={20} 
                          color={theme.colors.primary} 
                        />
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => openModal(reminder)}
                      >
                        <Ionicons 
                          name="pencil" 
                          size={18} 
                          color={theme.colors.primary} 
                        />
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => deleteReminder(reminder.id)}
                      >
                        <Ionicons 
                          name="trash-outline" 
                          size={18} 
                          color="#EF4444" 
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  
                  <View style={styles.reminderFooter}>
                    <View style={styles.timeContainer}>
                      <Ionicons name="time-outline" size={16} color={theme.colors.primary} />
                      <ThemedText style={styles.timeText}>
                        {reminder.time} • {reminder.date}
                      </ThemedText>
                    </View>
                    <View 
                      style={[
                        styles.categoryBadge,
                        { backgroundColor: `${getCategoryColor(reminder.category)}20` }
                      ]}
                    >
                      <ThemedText 
                        style={[
                          styles.categoryText,
                          { color: getCategoryColor(reminder.category) }
                        ]}
                      >
                        {reminder.category}
                      </ThemedText>
                    </View>
                  </View>
                </View>
              </Animated.View>
            ))}
          </>
        )}

        {/* Completed Reminders */}
        {completedReminders.length > 0 && (
          <>
            <Animated.View entering={FadeInUp.delay(500)} style={styles.sectionHeader}>
              <ThemedText style={styles.sectionTitle}>Completed</ThemedText>
            </Animated.View>

            {completedReminders.map((reminder, index) => (
              <Animated.View
                key={reminder.id}
                entering={FadeInUp.delay(600 + index * 100)}
                layout={Layout.springify()}
              >
                <View 
                  style={[
                    styles.reminderCard,
                    styles.reminderCardCompleted,
                    { borderLeftColor: getCategoryColor(reminder.category) }
                  ]}
                >
                  <View style={styles.reminderHeader}>
                    <View style={styles.reminderContent}>
                      <ThemedText style={[styles.reminderTitle, { textDecorationLine: 'line-through' }]}>
                        {reminder.title}
                      </ThemedText>
                      <ThemedText style={styles.reminderDescription}>
                        {reminder.description}
                      </ThemedText>
                    </View>
                    <View style={styles.reminderActions}>
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => toggleComplete(reminder.id)}
                      >
                        <Ionicons 
                          name="checkmark-circle" 
                          size={20} 
                          color={theme.colors.primary} 
                        />
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => deleteReminder(reminder.id)}
                      >
                        <Ionicons 
                          name="trash-outline" 
                          size={18} 
                          color="#EF4444" 
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Animated.View>
            ))}
          </>
        )}

        {/* Empty State */}
        {reminders.length === 0 && (
          <Animated.View entering={FadeInUp.delay(300)} style={styles.emptyState}>
            <ThemedText style={styles.emptyStateIcon}>📝</ThemedText>
            <ThemedText style={styles.emptyStateText}>
              No reminders yet.{'\n'}Tap the + button to create one!
            </ThemedText>
          </Animated.View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FAB Button */}
      <AnimatedTouchableOpacity
        entering={FadeInUp.delay(700).springify()}
        style={styles.fabButton}
        onPress={() => openModal()}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color="white" />
      </AnimatedTouchableOpacity>

      {/* Add/Edit Modal */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity 
            style={{ flex: 1 }}
            onPress={closeModal}
            activeOpacity={1}
          />
          
          <Animated.View 
            entering={FadeInUp.springify()}
            exiting={FadeOutDown}
            style={styles.modalContent}
          >
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>
                {editingReminder ? 'Edit Reminder' : 'New Reminder'}
              </ThemedText>
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Ionicons name="close" size={20} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel}>Title *</ThemedText>
                <TextInput
                  style={styles.input}
                  placeholder="Enter reminder title"
                  placeholderTextColor={`${theme.colors.textDark}40`}
                  value={formData.title}
                  onChangeText={(text) => setFormData({ ...formData, title: text })}
                />
              </View>

              <View style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel}>Description</ThemedText>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Add description"
                  placeholderTextColor={`${theme.colors.textDark}40`}
                  value={formData.description}
                  onChangeText={(text) => setFormData({ ...formData, description: text })}
                  multiline
                  numberOfLines={4}
                />
              </View>

              <View style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel}>Time</ThemedText>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 09:00 AM"
                  placeholderTextColor={`${theme.colors.textDark}40`}
                  value={formData.time}
                  onChangeText={(text) => setFormData({ ...formData, time: text })}
                />
              </View>

              <View style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel}>Date</ThemedText>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Today, Tomorrow, Oct 10"
                  placeholderTextColor={`${theme.colors.textDark}40`}
                  value={formData.date}
                  onChangeText={(text) => setFormData({ ...formData, date: text })}
                />
              </View>

              <View style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel}>Category</ThemedText>
                <View style={styles.categorySelector}>
                  {(['work', 'personal', 'health', 'other'] as const).map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.categoryOption,
                        formData.category === cat && styles.categoryOptionSelected,
                        formData.category === cat && { 
                          borderColor: getCategoryColor(cat),
                          backgroundColor: `${getCategoryColor(cat)}15`
                        }
                      ]}
                      onPress={() => setFormData({ ...formData, category: cat })}
                    >
                      <ThemedText 
                        style={[
                          styles.categoryOptionText,
                          formData.category === cat && { color: getCategoryColor(cat) }
                        ]}
                      >
                        {cat}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity style={styles.saveButton} onPress={saveReminder}>
                <ThemedText style={styles.saveButtonText}>
                  {editingReminder ? 'Update Reminder' : 'Create Reminder'}
                </ThemedText>
              </TouchableOpacity>

              <View style={{ height: 30 }} />
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>
    </ThemedView>
  );
}