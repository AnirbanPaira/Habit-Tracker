import { useTheme } from '@/contexts/ThemeContext';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import React from 'react';
import { Dimensions, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function ThemeSelector() {
  const { theme, setTheme, availableThemes } = useTheme();

  const styles = useThemedStyles(theme => ({
    container: {
      alignItems: 'center',
      paddingVertical: 20,
    },
    title: {
      fontSize: 24,
      color: theme.colors.textDark,
      marginBottom: 20,
    },
    scrollContainer: {
      paddingHorizontal: 20,
    },
    themeCard: {
      width: width * 0.7,
      height: 120,
      marginHorizontal: 10,
      borderRadius: 12,
      padding: 20,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 3,
    },
    activeThemeCard: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.surface,
    },
    inactiveThemeCard: {
      borderColor: theme.colors.textLight,
      backgroundColor: theme.colors.surface,
    },
    themeName: {
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    themePreview: {
      flexDirection: 'row',
      marginTop: 10,
    },
    colorDot: {
      width: 20,
      height: 20,
      borderRadius: 10,
      marginHorizontal: 2,
    },
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your Theme</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        snapToInterval={width * 0.7 + 20}
        decelerationRate="fast"
      >
        {availableThemes.map((themeOption) => (
          <TouchableOpacity
            key={themeOption.name}
            style={[
              styles.themeCard,
              theme.name === themeOption.name
                ? styles.activeThemeCard
                : styles.inactiveThemeCard,
            ]}
            onPress={() => setTheme(themeOption)}
          >
            <Text
              style={[
                styles.themeName,
                { color: theme.name === themeOption.name ? theme.colors.primary : theme.colors.textDark }
              ]}
            >
              {themeOption.name}
            </Text>
            <View style={styles.themePreview}>
              <View style={[styles.colorDot, { backgroundColor: themeOption.colors.primary }]} />
              <View style={[styles.colorDot, { backgroundColor: themeOption.colors.secondary }]} />
              <View style={[styles.colorDot, { backgroundColor: themeOption.colors.accent }]} />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
