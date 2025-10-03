import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, SectionList, StatusBar, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp, Layout } from 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import AddCategoryModal from '../../components/modals/AddCategoryModal';
import AddTaskModal from '../../components/modals/AddTaskModal';
import ManageCategoriesModal from '../../components/modals/ManageCategoriesModal';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Task {
  _id: string;
  name: string;
  description: string;
  frequency: string;
  category: { _id: string; name: string } | null;
  completed: boolean;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function HomeScreen() {
  const { user, token } = useAuth();
  const { theme } = useTheme();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitDescription, setNewHabitDescription] = useState('');
  const [newHabitFrequency, setNewHabitFrequency] = useState('daily');
  const [selectedCategory, setSelectedCategory] = useState<{ _id: string | null; name: string }>({ _id: null, name: 'todo' });
  const [isLoading, setIsLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'todo' | 'completed'>('todo');
  const [categories, setCategories] = useState<{ _id: string | null; name: string }[]>([{ _id: null, name: 'todo' }]);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showManageCategoriesModal, setShowManageCategoriesModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    fetchTasks();
    fetchCategories();
  }, []);

  const fetchTasks = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/tasks`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setTasks(data);
      } else {
        Toast.show({ type: 'error', text1: 'Error', text2: data.message || 'Failed to fetch tasks' });
      }
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Network error' });
    }
  };

  const fetchCategories = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/categories`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        const categoryObjects = data.map((c: any) => ({ _id: c._id, name: c.name }));
        setCategories([{ _id: null, name: 'todo' }, ...categoryObjects.filter((c: any) => c.name !== 'todo')]);
      } else {
        Toast.show({ type: 'error', text1: 'Error', text2: data.message || 'Failed to fetch categories' });
      }
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Network error' });
    }
  };

  const addTask = async () => {
    if (!newHabitName.trim()) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Please enter a task name' });
      return;
    }
    if (!token) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newHabitName,
          description: newHabitDescription,
          frequency: newHabitFrequency,
          category: selectedCategory.name,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setTasks([...tasks, data]);
        setNewHabitName('');
        setNewHabitDescription('');
        setShowAddModal(false);
        Toast.show({ type: 'success', text1: 'Success', text2: 'Task added!' });
      } else {
        Toast.show({ type: 'error', text1: 'Error', text2: data.message || 'Failed to add task' });
      }
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Network error' });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTask = async (task: Task) => {
    if (!token) return;
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/tasks/${task._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          completed: !task.completed,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setTasks(tasks.map(t => t._id === task._id ? data : t));
        fetchTasks(); // Refetch to ensure data consistency
      } else {
        Toast.show({ type: 'error', text1: 'Error', text2: data.message || 'Failed to update task' });
      }
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Network error' });
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!token) return;
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setTasks(tasks.filter(t => t._id !== taskId));
        Toast.show({ type: 'success', text1: 'Success', text2: 'Task deleted!' });
      } else {
        const data = await response.json();
        Toast.show({ type: 'error', text1: 'Error', text2: data.message || 'Failed to delete task' });
      }
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Network error' });
    }
  };

  const addCategory = async () => {
    if (!newCategoryName.trim()) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Please enter a category name' });
      return;
    }
    if (categories.some(c => c.name.toLowerCase() === newCategoryName.toLowerCase())) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Category already exists' });
      return;
    }
    if (!token) return;
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newCategoryName,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setCategories([...categories, { _id: data._id, name: newCategoryName }]);
        setNewCategoryName('');
        setShowAddCategoryModal(false);
        Toast.show({ type: 'success', text1: 'Success', text2: 'Category added!' });
      } else {
        Toast.show({ type: 'error', text1: 'Error', text2: data.message || 'Failed to add category' });
      }
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Network error' });
    }
  };

  const deleteCategory = async (categoryName: string) => {
    if (categoryName === 'todo') {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Cannot delete default category' });
      return;
    }
    if (!token) return;
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/categories`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      const category = data.find((c: any) => c.name === categoryName);
      if (!category) return;
      const deleteResponse = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/categories/${category._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (deleteResponse.ok) {
        setCategories(categories.filter(c => c.name !== categoryName));
        if (selectedCategory.name === categoryName) {
          setSelectedCategory({ _id: null, name: 'todo' });
        }
        Toast.show({ type: 'success', text1: 'Success', text2: 'Category deleted!' });
      } else {
        const deleteData = await deleteResponse.json();
        Toast.show({ type: 'error', text1: 'Error', text2: deleteData.message || 'Failed to delete category' });
      }
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Network error' });
    }
  };

  const editCategory = async (id: string, newName: string) => {
    if (!newName.trim()) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Category name cannot be empty' });
      return;
    }
    if (categories.some(c => c._id !== id && c.name.toLowerCase() === newName.toLowerCase())) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Category name already exists' });
      return;
    }
    if (!token) return;
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newName }),
      });
      if (response.ok) {
        const updatedCategory = await response.json();
        setCategories(categories.map(c => c._id === id ? { ...c, name: updatedCategory.name } : c));
        if (selectedCategory._id === id) {
          setSelectedCategory({ ...selectedCategory, name: updatedCategory.name });
        }
        Toast.show({ type: 'success', text1: 'Success', text2: 'Category updated!' });
      } else {
        const data = await response.json();
        Toast.show({ type: 'error', text1: 'Error', text2: data.message || 'Failed to update category' });
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
    statsRow: {
      flexDirection: 'row',
      gap: 12,
      paddingHorizontal: 20,
      paddingTop: 20,
      marginBottom: 20,
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
    categoriesSection: {
      paddingHorizontal: 20,
      paddingVertical: 15,
    },
    categoriesHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 15,
    },
    categoriesTitle: {
      fontSize: 20,
      fontWeight: '800',
      color: theme.colors.textDark,
    },
    categoriesActions: {
      flexDirection: 'row',
      gap: 12,
    },
    actionButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: `${theme.colors.primary}15`,
      alignItems: 'center',
      justifyContent: 'center',
    },
    categoriesChipsContainer: {
      flexDirection: 'row',
      gap: 10,
    },
    categoryChip: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 20,
      backgroundColor: theme.colors.surface,
      borderWidth: 2,
      borderColor: 'transparent',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    categoryChipSelected: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
      shadowColor: theme.colors.primary,
      shadowOpacity: 0.3,
    },
    categoryChipText: {
      fontSize: 14,
      color: theme.colors.textDark,
      fontWeight: '600',
      textTransform: 'capitalize',
    },
    categoryChipTextSelected: {
      color: '#FFFFFF',
    },
    filterContainer: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      paddingVertical: 15,
      gap: 10,
    },
    filterButton: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 16,
      backgroundColor: theme.colors.surface,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    filterButtonActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    filterText: {
      fontSize: 14,
      color: theme.colors.textDark,
      fontWeight: '600',
    },
    filterTextActive: {
      color: '#FFFFFF',
    },
    listContainer: {
      paddingHorizontal: 20,
      paddingBottom: 100,
    },
    sectionHeader: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: theme.colors.surface,
      marginBottom: 12,
      marginTop: 8,
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    sectionHeaderText: {
      fontSize: 18,
      fontWeight: '800',
      color: theme.colors.textDark,
      textTransform: 'capitalize',
    },
    taskCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    taskCardCompleted: {
      opacity: 0.6,
    },
    checkbox: {
      width: 28,
      height: 28,
      borderRadius: 14,
      borderWidth: 2,
      borderColor: theme.colors.primary,
      marginRight: 15,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'transparent',
    },
    checkboxChecked: {
      backgroundColor: theme.colors.primary,
    },
    taskContent: {
      flex: 1,
    },
    taskName: {
      fontSize: 16,
      color: theme.colors.textDark,
      fontWeight: '700',
      marginBottom: 4,
    },
    taskNameCompleted: {
      textDecorationLine: 'line-through',
    },
    taskDescription: {
      fontSize: 14,
      color: theme.colors.textDark,
      opacity: 0.7,
      lineHeight: 20,
    },
    taskFrequency: {
      fontSize: 12,
      color: theme.colors.primary,
      fontWeight: '600',
      marginTop: 4,
      textTransform: 'capitalize',
    },
    deleteButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: '#FEE2E2',
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 8,
    },
    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 80,
    },
    emptyText: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.textDark,
      opacity: 0.5,
      textAlign: 'center',
      marginTop: 20,
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
  }));

  const filteredTasks = tasks.filter(task => {
    if (filter === 'todo') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const completedCount = tasks.filter(t => t.completed).length;
  const activeCount = tasks.filter(t => !t.completed).length;

  const sections = categories.map(cat => ({
    title: cat.name,
    data: filteredTasks.filter(t => (t.category && t.category._id === cat._id) || (!t.category && cat._id === null))
  })).filter(section => section.data.length > 0);

  const renderSectionHeader = ({ section }: any) => (
    <Animated.View entering={FadeInUp} layout={Layout.springify()}>
      <View style={styles.sectionHeader}>
        <ThemedText style={styles.sectionHeaderText}>{section.title}</ThemedText>
      </View>
    </Animated.View>
  );

  const renderTask = ({ item, index }: { item: Task; index: number }) => (
    <Animated.View 
      entering={FadeInUp.delay(index * 50)} 
      layout={Layout.springify()}
    >
      <TouchableOpacity
        style={[styles.taskCard, item.completed && styles.taskCardCompleted]}
        onPress={() => toggleTask(item)}
        activeOpacity={0.7}
      >
        <View style={[styles.checkbox, item.completed && styles.checkboxChecked]}>
          {item.completed && (
            <Ionicons name="checkmark" size={18} color="#FFFFFF" />
          )}
        </View>
        <View style={styles.taskContent}>
          <ThemedText style={[styles.taskName, item.completed && styles.taskNameCompleted]}>
            {item.name}
          </ThemedText>
          {item.description ? (
            <ThemedText style={styles.taskDescription}>{item.description}</ThemedText>
          ) : null}
          <ThemedText style={styles.taskFrequency}>{item.frequency}</ThemedText>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteTask(item._id)}
        >
          <Ionicons name="trash-outline" size={18} color="#EF4444" />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderEmpty = () => (
    <Animated.View entering={FadeInUp.delay(300)} style={styles.emptyContainer}>
      <Ionicons name="list-circle" size={80} color={theme.colors.textLight} />
      <ThemedText style={styles.emptyText}>
        {filter === 'completed' ? 'No completed tasks yet' : 'Tap + to add your first task'}
      </ThemedText>
    </Animated.View>
  );

  return (
    <ThemedView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.secondary]}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Animated.View entering={FadeInUp.delay(100)}>
          <ThemedText style={styles.headerTitle}>My Tasks</ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            Stay productive and organized
          </ThemedText>
        </Animated.View>
      </LinearGradient>

      <Animated.View entering={FadeInUp.delay(200)} style={styles.statsRow}>
        <View style={styles.statCard}>
          <ThemedText style={styles.statValue}>{activeCount}</ThemedText>
          <ThemedText style={styles.statLabel}>Active</ThemedText>
        </View>
        <View style={styles.statCard}>
          <ThemedText style={styles.statValue}>{completedCount}</ThemedText>
          <ThemedText style={styles.statLabel}>Completed</ThemedText>
        </View>
        <View style={styles.statCard}>
          <ThemedText style={styles.statValue}>{tasks.length}</ThemedText>
          <ThemedText style={styles.statLabel}>Total</ThemedText>
        </View>
      </Animated.View>

      <View style={styles.categoriesSection}>
        <View style={styles.categoriesHeader}>
          <ThemedText style={styles.categoriesTitle}>Categories</ThemedText>
          <View style={styles.categoriesActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setShowAddCategoryModal(true)}
            >
              <Ionicons name="add-circle" size={20} color={theme.colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setShowManageCategoriesModal(true)}
            >
              <Ionicons name="settings-outline" size={20} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesChipsContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category._id ?? category.name}
              style={[
                styles.categoryChip,
                selectedCategory.name === category.name && styles.categoryChipSelected
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <ThemedText
                style={[
                  styles.categoryChipText,
                  selectedCategory.name === category.name && styles.categoryChipTextSelected
                ]}
              >
                {category.name}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'todo' && styles.filterButtonActive]}
          onPress={() => setFilter('todo')}
        >
          <ThemedText style={[styles.filterText, filter === 'todo' && styles.filterTextActive]}>
            To Do
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

      <SectionList
        sections={sections}
        keyExtractor={(item) => item._id}
        renderItem={renderTask}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmpty}
      />

      <AnimatedTouchableOpacity
        entering={FadeInUp.delay(700).springify()}
        style={styles.fabButton}
        onPress={() => setShowAddModal(true)}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </AnimatedTouchableOpacity>

      <AddCategoryModal
        visible={showAddCategoryModal}
        onClose={() => setShowAddCategoryModal(false)}
        newCategoryName={newCategoryName}
        setNewCategoryName={setNewCategoryName}
        addCategory={addCategory}
        isLoading={isLoading}
      />

      <ManageCategoriesModal
        visible={showManageCategoriesModal}
        onClose={() => setShowManageCategoriesModal(false)}
        categories={categories}
        deleteCategory={deleteCategory}
        editCategory={editCategory}
      />

      <AddTaskModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        newHabitName={newHabitName}
        setNewHabitName={setNewHabitName}
        newHabitDescription={newHabitDescription}
        setNewHabitDescription={setNewHabitDescription}
        newHabitFrequency={newHabitFrequency}
        setNewHabitFrequency={setNewHabitFrequency}
        selectedCategory={selectedCategory}
        addTask={addTask}
        isLoading={isLoading}
      />
    </ThemedView>
  );
}