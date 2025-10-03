import React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/contexts/ThemeContext';
import { useThemedStyles } from '@/hooks/useThemedStyles';

interface FooterProps {
  state: any;
  descriptors: any;
  navigation: any;
}

export default function Footer({ state, descriptors, navigation }: FooterProps) {
  const { theme } = useTheme();

  const styles = useThemedStyles(theme => ({
    container: {
      flexDirection: 'row',
      backgroundColor: theme.colors.surface,
      borderTopWidth: 1,
      borderTopColor: theme.colors.textLight,
      paddingVertical: 10,
      paddingHorizontal: 20,
    },
    tab: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 5,
    },
    label: {
      fontSize: 12,
      marginTop: 4,
    },
  }));

  return (
    <View style={styles.container}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const iconElement = options.tabBarIcon
          ? options.tabBarIcon({ focused: isFocused, color: isFocused ? theme.colors.primary : theme.colors.textLight })
          : null;

        return (
          <TouchableOpacity key={route.key} onPress={onPress} style={styles.tab}>
            {iconElement}
            <ThemedText style={[styles.label, { color: isFocused ? theme.colors.primary : theme.colors.textLight }]}>
              {options.title}
            </ThemedText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
