import { useThemeColor } from '@/hooks/use-theme-color';
import { Text, type TextProps } from 'react-native';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? { fontSize: 16 } : undefined,
        type === 'title' ? { fontSize: 32, fontWeight: 'bold' } : undefined,
        type === 'defaultSemiBold' ? { fontSize: 16, fontWeight: '600' } : undefined,
        type === 'subtitle' ? { fontSize: 20, fontWeight: 'bold' } : undefined,
        type === 'link' ? { lineHeight: 30, fontSize: 16, color: '#0a7ea4' } : undefined,
        style,
      ]}
      {...rest}
    />
  );
}
