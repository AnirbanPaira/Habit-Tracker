import { Theme, themes } from '@/constants/themes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  availableThemes: Theme[];
}

const ThemeContext = createContext<ThemeContextType>({
  theme: themes.modernBlue,
  setTheme: () => {},
  availableThemes: Object.values(themes),
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(themes.modernBlue);

  useEffect(() => {
    // Load saved theme on startup
    const loadSavedTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme && themes[savedTheme]) {
          setTheme(themes[savedTheme]);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };

    loadSavedTheme();
  }, []);

  const handleSetTheme = async (newTheme: Theme) => {
    try {
      await AsyncStorage.setItem('theme', Object.keys(themes).find(
        key => themes[key] === newTheme
      ) || 'modernBlue');
      setTheme(newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const value = {
    theme,
    setTheme: handleSetTheme,
    availableThemes: Object.values(themes),
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
