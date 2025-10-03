import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/contexts/ThemeContext';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, Modal, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface AddTaskModalProps {
  visible: boolean;
  onClose: () => void;
  newHabitName: string;
  setNewHabitName: (name: string) => void;
  newHabitDescription: string;
  setNewHabitDescription: (desc: string) => void;
  newHabitFrequency: string;
  setNewHabitFrequency: (freq: string) => void;
  selectedCategory: { _id: string | null; name: string };
  addTask: () => void;
  isLoading: boolean;
}

export default function AddTaskModal({
  visible,
  onClose,
  newHabitName,
  setNewHabitName,
  newHabitDescription,
  setNewHabitDescription,
  newHabitFrequency,
  setNewHabitFrequency,
  selectedCategory,
  addTask,
  isLoading,
}: AddTaskModalProps) {
  const { theme } = useTheme();
  
  const styles = useThemedStyles(theme => ({
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
    categoryBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      backgroundColor: `${theme.colors.primary}20`,
      marginLeft: 10,
    },
    categoryText: {
      fontSize: 12,
      fontWeight: '700',
      color: theme.colors.primary,
      textTransform: 'capitalize',
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
    inputFocused: {
      borderColor: theme.colors.primary,
    },
    textArea: {
      minHeight: 80,
      textAlignVertical: 'top',
    },
    frequencyContainer: {
      marginBottom: 20,
    },
    frequencyLabel: {
      fontSize: 14,
      fontWeight: '700',
      color: theme.colors.textDark,
      marginBottom: 10,
    },
    frequencyOptions: {
      flexDirection: 'row',
      gap: 10,
      flexWrap: 'wrap',
    },
    frequencyButton: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 16,
      borderWidth: 2,
      borderColor: `${theme.colors.primary}20`,
      backgroundColor: theme.colors.background,
    },
    frequencyButtonSelected: {
      borderColor: theme.colors.primary,
      backgroundColor: `${theme.colors.primary}15`,
    },
    frequencyText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.textDark,
    },
    frequencyTextSelected: {
      color: theme.colors.primary,
    },
    saveButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 16,
      padding: 18,
      alignItems: 'center',
      marginTop: 10,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    saveButtonDisabled: {
      opacity: 0.6,
    },
    saveButtonText: {
      fontSize: 16,
      fontWeight: '800',
      color: 'white',
    },
  }));

  const frequencies = ['daily', 'weekly', 'monthly'];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity 
          style={{ flex: 1 }}
          onPress={onClose}
          activeOpacity={1}
        />
        
        <Animated.View
          entering={FadeInUp.springify()}
          style={styles.modalContent}
          onStartShouldSetResponder={() => true}
        >
          <View style={styles.modalHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ThemedText style={styles.modalTitle}>New Task</ThemedText>
              <View style={styles.categoryBadge}>
                <ThemedText style={styles.categoryText}>{selectedCategory.name}</ThemedText>
              </View>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={20} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Task Name *</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="Enter task name"
                placeholderTextColor={`${theme.colors.textDark}40`}
                value={newHabitName}
                onChangeText={setNewHabitName}
                autoFocus
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Description</ThemedText>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Add description (optional)"
                placeholderTextColor={`${theme.colors.textDark}40`}
                value={newHabitDescription}
                onChangeText={setNewHabitDescription}
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.frequencyContainer}>
              <ThemedText style={styles.frequencyLabel}>Frequency</ThemedText>
              <View style={styles.frequencyOptions}>
                {frequencies.map((freq) => (
                  <TouchableOpacity
                    key={freq}
                    style={[
                      styles.frequencyButton,
                      newHabitFrequency === freq && styles.frequencyButtonSelected
                    ]}
                    onPress={() => setNewHabitFrequency(freq)}
                  >
                    <ThemedText
                      style={[
                        styles.frequencyText,
                        newHabitFrequency === freq && styles.frequencyTextSelected
                      ]}
                    >
                      {freq.charAt(0).toUpperCase() + freq.slice(1)}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
              onPress={addTask}
              disabled={isLoading}
            >
              <ThemedText style={styles.saveButtonText}>
                {isLoading ? 'Adding Task...' : 'Add Task'}
              </ThemedText>
            </TouchableOpacity>

            <View style={{ height: 30 }} />
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}