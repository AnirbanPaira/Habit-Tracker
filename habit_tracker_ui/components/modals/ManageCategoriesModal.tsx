import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/contexts/ThemeContext';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Dimensions, FlatList, Modal, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp, Layout } from 'react-native-reanimated';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Category {
  _id: string | null;
  name: string;
}

interface ManageCategoriesModalProps {
  visible: boolean;
  onClose: () => void;
  categories: Category[];
  deleteCategory: (name: string) => void;
  editCategory: (id: string, newName: string) => void;
}

export default function ManageCategoriesModal({
  visible,
  onClose,
  categories,
  deleteCategory,
  editCategory,
}: ManageCategoriesModalProps) {
  const { theme } = useTheme();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const startEdit = (category: Category) => {
    if (category._id) {
      setEditingId(category._id);
      setEditName(category.name);
    }
  };

  const saveEdit = () => {
    if (editingId && editName.trim()) {
      editCategory(editingId, editName.trim());
      setEditingId(null);
      setEditName('');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

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
    closeButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: `${theme.colors.primary}15`,
      alignItems: 'center',
      justifyContent: 'center',
    },
    listContainer: {
      padding: 25,
    },
    categoryCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      backgroundColor: theme.colors.background,
      marginBottom: 12,
      borderRadius: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    categoryCardDefault: {
      opacity: 0.6,
    },
    categoryIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: `${theme.colors.primary}15`,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    categoryContent: {
      flex: 1,
    },
    categoryName: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.textDark,
      textTransform: 'capitalize',
    },
    defaultLabel: {
      fontSize: 12,
      color: theme.colors.textLight,
      marginTop: 2,
    },
    editInput: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      borderWidth: 2,
      borderColor: theme.colors.primary,
      borderRadius: 12,
      padding: 12,
      marginRight: 10,
      color: theme.colors.textDark,
      fontSize: 16,
      fontWeight: '600',
    },
    actionButtons: {
      flexDirection: 'row',
      gap: 8,
    },
    actionButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
    },
    editButton: {
      backgroundColor: `${theme.colors.primary}15`,
    },
    deleteButton: {
      backgroundColor: '#FEE2E2',
    },
    saveButton: {
      backgroundColor: `${theme.colors.primary}15`,
    },
    cancelButton: {
      backgroundColor: '#F3F4F6',
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 40,
    },
    emptyText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.textDark,
      opacity: 0.5,
      marginTop: 12,
    },
  }));

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
            <ThemedText style={styles.modalTitle}>Manage Categories</ThemedText>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={20} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={categories}
            keyExtractor={(item) => item._id ?? item.name}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <Animated.View
                entering={FadeInUp.delay(index * 50)}
                layout={Layout.springify()}
              >
                <View style={[
                  styles.categoryCard,
                  item.name === 'todo' && styles.categoryCardDefault
                ]}>
                  {editingId !== item._id && (
                    <View style={styles.categoryIcon}>
                      <Ionicons 
                        name="pricetag" 
                        size={20} 
                        color={theme.colors.primary} 
                      />
                    </View>
                  )}
                  
                  {editingId === item._id ? (
                    <>
                      <TextInput
                        style={styles.editInput}
                        value={editName}
                        onChangeText={setEditName}
                        autoFocus
                        selectTextOnFocus
                      />
                      <View style={styles.actionButtons}>
                        <TouchableOpacity 
                          style={[styles.actionButton, styles.saveButton]} 
                          onPress={saveEdit}
                        >
                          <Ionicons name="checkmark" size={20} color={theme.colors.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={[styles.actionButton, styles.cancelButton]} 
                          onPress={cancelEdit}
                        >
                          <Ionicons name="close" size={20} color={theme.colors.textLight} />
                        </TouchableOpacity>
                      </View>
                    </>
                  ) : (
                    <>
                      <View style={styles.categoryContent}>
                        <ThemedText style={styles.categoryName}>{item.name}</ThemedText>
                        {item.name === 'todo' && (
                          <ThemedText style={styles.defaultLabel}>Default category</ThemedText>
                        )}
                      </View>
                      
                      {item.name !== 'todo' && (
                        <View style={styles.actionButtons}>
                          <TouchableOpacity
                            style={[styles.actionButton, styles.editButton]}
                            onPress={() => startEdit(item)}
                          >
                            <Ionicons name="pencil" size={18} color={theme.colors.primary} />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.actionButton, styles.deleteButton]}
                            onPress={() => deleteCategory(item.name)}
                          >
                            <Ionicons name="trash-outline" size={18} color="#EF4444" />
                          </TouchableOpacity>
                        </View>
                      )}
                    </>
                  )}
                </View>
              </Animated.View>
            )}
            ListEmptyComponent={() => (
              <View style={styles.emptyState}>
                <Ionicons name="folder-open-outline" size={60} color={theme.colors.textLight} />
                <ThemedText style={styles.emptyText}>No categories yet</ThemedText>
              </View>
            )}
          />
        </Animated.View>
      </View>
    </Modal>
  );
}