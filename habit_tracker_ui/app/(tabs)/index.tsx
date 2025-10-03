import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { IconSymbol } from '@/components/ui/icon-symbol';
import React, { useEffect, useState } from 'react';
import { FlatList, TextInput, TouchableOpacity, View, Modal, ScrollView } from 'react-native';
import Toast from 'react-native-toast-message';

interface Habit {
  _id: string;
  name: string;
  description: string;
  frequency: string;
  completed: boolean;
}

export default function HomeScreen() {
  const { user, token } = useAuth();
  const { theme } = useTheme();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitDescription, setNewHabitDescription] = useState('');
  const [newHabitFrequency, setNewHabitFrequency] = useState('daily');
  const [isLoading, setIsLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'todo' | 'completed'>('todo');

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/habits`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setHabits(data);
      } else {
        Toast.show({ type: 'error', text1: 'Error', text2: data.message || 'Failed to fetch habits' });
      }
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Network error' });
    }
  };

  const addHabit = async () => {
    if (!newHabitName.trim()) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Please enter a habit name' });
      return;
    }
    if (!token) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/habits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newHabitName,
          description: newHabitDescription,
          frequency: newHabitFrequency,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setHabits([...habits, data]);
        setNewHabitName('');
        setNewHabitDescription('');
        setShowAddModal(false);
        Toast.show({ type: 'success', text1: 'Success', text2: 'Habit added!' });
      } else {
        Toast.show({ type: 'error', text1: 'Error', text2: data.message || 'Failed to add habit' });
      }
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Network error' });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleHabit = async (habit: Habit) => {
    if (!token) return;
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/habits/${habit._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          completed: !habit.completed,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setHabits(habits.map(h => h._id === habit._id ? data : h));
      } else {
        Toast.show({ type: 'error', text1: 'Error', text2: data.message || 'Failed to update habit' });
      }
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Network error' });
    }
  };

  const deleteHabit = async (habitId: string) => {
    if (!token) return;
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/habits/${habitId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setHabits(habits.filter(h => h._id !== habitId));
        Toast.show({ type: 'success', text1: 'Success', text2: 'Habit deleted!' });
      } else {
        const data = await response.json();
        Toast.show({ type: 'error', text1: 'Error', text2: data.message || 'Failed to delete habit' });
      }
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Network error' });
    }
  };

  const styles = useThemedStyles(theme => ({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      padding: 20,
      paddingBottom: 10,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: theme.colors.textDark,
      marginBottom: 5,
    },
    subtitle: {
      fontSize: 14,
      color: theme.colors.textLight,
    },
    filterContainer: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      paddingVertical: 15,
      gap: 10,
    },
    filterButton: {
      paddingHorizontal: 20,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: theme.colors.surface,
    },
    filterButtonActive: {
      backgroundColor: theme.colors.primary,
    },
    filterText: {
      fontSize: 14,
      color: theme.colors.textDark,
      fontWeight: '500',
    },
    filterTextActive: {
      color: '#FFFFFF',
    },
    listContainer: {
      flex: 1,
      paddingHorizontal: 20,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingBottom: 100,
    },
    emptyIcon: {
      marginBottom: 20,
    },
    emptyText: {
      fontSize: 16,
      color: theme.colors.textLight,
    },
    habitItem: {
      backgroundColor: theme.colors.surface,
      padding: 15,
      borderRadius: 12,
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: theme.colors.textLight,
      marginRight: 15,
      justifyContent: 'center',
      alignItems: 'center',
    },
    checkboxChecked: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    habitContent: {
      flex: 1,
    },
    habitName: {
      fontSize: 16,
      color: theme.colors.textDark,
      fontWeight: '500',
    },
    habitNameCompleted: {
      textDecorationLine: 'line-through',
      opacity: 0.5,
    },
    habitDescription: {
      fontSize: 14,
      color: theme.colors.textLight,
      marginTop: 2,
    },
    deleteButton: {
      padding: 8,
    },
    fab: {
      position: 'absolute',
      bottom: 80,
      right: 20,
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: theme.colors.background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      paddingBottom: 40,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    modalTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.textDark,
    },
    closeButton: {
      padding: 5,
    },
    input: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.textLight,
      borderRadius: 12,
      padding: 15,
      marginBottom: 15,
      color: theme.colors.textDark,
      fontSize: 16,
    },
    inputMultiline: {
      minHeight: 80,
      textAlignVertical: 'top',
    },
    addButton: {
      backgroundColor: theme.colors.primary,
      padding: 15,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 10,
    },
    addButtonText: {
      color: '#FFFFFF',
      fontWeight: 'bold',
      fontSize: 16,
    },
    addButtonDisabled: {
      opacity: 0.6,
    },
  }));

  const filteredHabits = habits.filter(habit => {
    if (filter === 'todo') return !habit.completed;
    if (filter === 'completed') return habit.completed;
    return true;
  });

  const completedCount = habits.filter(h => h.completed).length;

  const renderHabit = ({ item }: { item: Habit }) => (
    <TouchableOpacity 
      style={styles.habitItem}
      onPress={() => toggleHabit(item)}
      activeOpacity={0.7}
    >
      <View style={[styles.checkbox, item.completed && styles.checkboxChecked]}>
        {item.completed && (
          <IconSymbol name="checkmark" size={16} color="#FFFFFF" />
        )}
      </View>
      <View style={styles.habitContent}>
        <ThemedText style={[styles.habitName, item.completed && styles.habitNameCompleted]}>
          {item.name}
        </ThemedText>
        {item.description ? (
          <ThemedText style={styles.habitDescription}>{item.description}</ThemedText>
        ) : null}
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteHabit(item._id)}
      >
        <IconSymbol name="trash" size={20} color={theme.colors.textLight} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIcon}>
        <IconSymbol name="list.bullet" size={80} color={theme.colors.textLight} />
      </View>
      <ThemedText style={styles.emptyText}>Add Something</ThemedText>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Tasks</ThemedText>
        <ThemedText style={styles.subtitle}>{completedCount} completed</ThemedText>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'todo' && styles.filterButtonActive]}
          onPress={() => setFilter('todo')}
        >
          <ThemedText style={[styles.filterText, filter === 'todo' && styles.filterTextActive]}>
            To do
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
          onPress={() => setFilter('all')}
        >
          <ThemedText style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
            All
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'completed' && styles.filterButtonActive]}
          onPress={() => setFilter('completed')}
        >
          <ThemedText style={[styles.filterText, filter === 'completed' && styles.filterTextActive]}>
            Completed
          </ThemedText>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredHabits}
        keyExtractor={(item) => item._id}
        renderItem={renderHabit}
        contentContainerStyle={[styles.listContainer, filteredHabits.length === 0 && { flex: 1 }]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmpty}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowAddModal(true)}
        activeOpacity={0.8}
      >
        <IconSymbol name="plus" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={{ flex: 1 }} 
            activeOpacity={1} 
            onPress={() => setShowAddModal(false)}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>New Habit</ThemedText>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowAddModal(false)}
              >
                <IconSymbol name="xmark" size={24} color={theme.colors.textDark} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Habit name"
              placeholderTextColor={theme.colors.textLight}
              value={newHabitName}
              onChangeText={setNewHabitName}
            />
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              placeholder="Description (optional)"
              placeholderTextColor={theme.colors.textLight}
              value={newHabitDescription}
              onChangeText={setNewHabitDescription}
              multiline
            />
            <TouchableOpacity 
              style={[styles.addButton, isLoading && styles.addButtonDisabled]} 
              onPress={addHabit} 
              disabled={isLoading}
            >
              <ThemedText style={styles.addButtonText}>
                {isLoading ? 'Adding...' : 'Add Habit'}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}