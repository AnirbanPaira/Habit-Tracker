import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/contexts/ThemeContext';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

interface AddCategoryModalProps {
  visible: boolean;
  onClose: () => void;
  newCategoryName: string;
  setNewCategoryName: (name: string) => void;
  addCategory: () => void;
  isLoading: boolean;
}

export default function AddCategoryModal({
  visible,
  onClose,
  newCategoryName,
  setNewCategoryName,
  addCategory,
  isLoading,
}: AddCategoryModalProps) {
  const { theme } = useTheme();
  
  const styles = useThemedStyles(theme => ({
    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    modalContent: {
      backgroundColor: theme.colors.surface,
      borderRadius: 24,
      padding: 25,
      width: '100%',
      maxWidth: 400,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 20,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
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
    addButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 16,
      padding: 18,
      alignItems: 'center',
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    addButtonDisabled: {
      opacity: 0.6,
    },
    addButtonText: {
      fontSize: 16,
      fontWeight: '800',
      color: 'white',
    },
  }));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          activeOpacity={1}
          onPress={onClose}
        />
        <Animated.View
          entering={FadeIn}
          style={styles.modalContent}
          onStartShouldSetResponder={() => true}
        >
          <View style={styles.modalHeader}>
            <ThemedText style={styles.modalTitle}>New Category</ThemedText>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={20} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.inputLabel}>Category Name *</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="Enter category name"
              placeholderTextColor={`${theme.colors.textDark}40`}
              value={newCategoryName}
              onChangeText={setNewCategoryName}
              autoFocus
            />
          </View>

          <TouchableOpacity
            style={[styles.addButton, isLoading && styles.addButtonDisabled]}
            onPress={addCategory}
            disabled={isLoading}
          >
            <ThemedText style={styles.addButtonText}>
              {isLoading ? 'Adding...' : 'Add Category'}
            </ThemedText>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}