import { useTheme } from '@/contexts/ThemeContext';
import { StyleSheet } from 'react-native';

export const useThemedStyles = <T extends StyleSheet.NamedStyles<T>>(
  styleCallback: (theme: ReturnType<typeof useTheme>['theme']) => T
) => {
  const { theme } = useTheme();
  return StyleSheet.create(styleCallback(theme));
};
