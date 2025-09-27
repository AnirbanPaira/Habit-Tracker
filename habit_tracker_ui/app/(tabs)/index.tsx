import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import Toast from 'react-native-toast-message';

interface Habit {
  _id: string;
  name: string;
  description: string;
  frequency: string;
  completed: boolean;
}

export default function HomeScreen() {
  const { user, token, logout } = useAuth();
  console.log('User in HomeScreen:', user);
  const { theme } = useTheme();
  const router = useRouter();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitDescription, setNewHabitDescription] = useState('');
  const [newHabitFrequency, setNewHabitFrequency] = useState('daily');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    if (!token) return;
    try {
      const response = await fetch('http://192.168.1.35:5000/api/habits', {
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
      const response = await fetch('http://192.168.1.35:5000/api/habits', {
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
      const response = await fetch(`http://192.168.1.35:5000/api/habits/${habit._id}`, {
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
      const response = await fetch(`http://192.168.1.35:5000/api/habits/${habitId}`, {
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

  const handleSignOut = async () => {
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

  const styles = useThemedStyles(theme => ({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: 20,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    welcome: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.textDark,
    },
    signOutButton: {
      padding: 10,
      backgroundColor: '#ff4444',
      borderRadius: 8,
    },
    signOutText: {
      color: 'white',
      fontWeight: 'bold',
    },
    addHabitContainer: {
      backgroundColor: theme.colors.surface,
      padding: 20,
      borderRadius: 12,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    input: {
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.textLight,
      borderRadius: 8,
      padding: 12,
      marginBottom: 10,
      color: theme.colors.textDark,
    },
    addButton: {
      backgroundColor: theme.colors.primary,
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    addButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    habitItem: {
      backgroundColor: theme.colors.surface,
      padding: 15,
      borderRadius: 12,
      marginBottom: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    habitName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.textDark,
    },
    habitDescription: {
      fontSize: 14,
      color: theme.colors.textDark,
      opacity: 0.7,
      marginTop: 5,
    },
    habitActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
    },
    toggleButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: theme.colors.primary,
    },
    toggleText: {
      color: 'white',
      fontWeight: 'bold',
    },
    deleteButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: '#ff4444',
    },
    deleteText: {
      color: 'white',
      fontWeight: 'bold',
    },
  }));

  const renderHabit = ({ item }: { item: Habit }) => (
    <View style={styles.habitItem}>
      <ThemedText style={styles.habitName}>{item.name}</ThemedText>
      <ThemedText style={styles.habitDescription}>{item.description}</ThemedText>
      <View style={styles.habitActions}>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => toggleHabit(item)}
        >
          <ThemedText style={styles.toggleText}>
            {item.completed ? 'Mark Incomplete' : 'Mark Complete'}
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteHabit(item._id)}
        >
          <ThemedText style={styles.deleteText}>Delete</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.welcome}>Welcome, {user?.name}!</ThemedText>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <ThemedText style={styles.signOutText}>Sign Out</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.addHabitContainer}>
        <TextInput
          style={styles.input}
          placeholder="Habit name"
          placeholderTextColor={`${theme.colors.textDark}50`}
          value={newHabitName}
          onChangeText={setNewHabitName}
        />
        <TextInput
          style={styles.input}
          placeholder="Description (optional)"
          placeholderTextColor={`${theme.colors.textDark}50`}
          value={newHabitDescription}
          onChangeText={setNewHabitDescription}
        />
        <TouchableOpacity style={styles.addButton} onPress={addHabit} disabled={isLoading}>
          <ThemedText style={styles.addButtonText}>
            {isLoading ? 'Adding...' : 'Add Habit'}
          </ThemedText>
        </TouchableOpacity>
      </View>

      <FlatList
        data={habits}
        keyExtractor={(item) => item._id}
        renderItem={renderHabit}
        showsVerticalScrollIndicator={false}
      />
    </ThemedView>
  );
}
