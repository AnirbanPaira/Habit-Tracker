import { themes } from '@/constants/themes';
import { useTheme } from '@/contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    interpolate,
    runOnJS,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withSpring,
    withTiming
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.7;
const CARD_HEIGHT = 140;
const SPACING = 25;
const SIDE_CARD_SCALE = 0.85;
const CURVE_RADIUS = 200;

interface ThemeOption {
    id: string;
    name: string;
    colors: string[];
    icon: string;
    description: string;
}

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

export default function AnimatedThemeSelector() {
    const { theme, setTheme } = useTheme();
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useSharedValue(0);
    const opacity = useSharedValue(0);
    const containerScale = useSharedValue(0.9);
    const scrollViewRef = useRef<ScrollView>(null);

    const getIconForTheme = (key: string) => {
        switch (key) {
            case "modernBlue": return "🌊";   // Ocean / water vibe
            case "forestGreen": return "🌲";  // Forest tree
            case "sunsetOrange": return "🌅"; // Sunset horizon
            case "purpleGalaxy": return "⭐";  // Galaxy star
            case "darkMode": return "🌙";     // Moon for dark theme
            case "oceanBreeze": return "🐚";  // Seashell (ocean calm)
            case "roseBlush": return "🌸";    // Flower blossom
            case "goldenSands": return "🏜️";  // Desert/sand dune
            case "charcoalGray": return "🪨"; // Rock / stone
            case "mintFresh": return "🍃";    // Fresh mint leaf
            default: return "🎨";             // Generic palette
        }
    };


    const getDescriptionForTheme = (key: string) => {
        switch (key) {
            case 'modernBlue': return 'Clean & Professional';
            case 'forestGreen': return 'Natural & Refreshing';
            case 'sunsetOrange': return 'Warm & Energetic';
            case 'purpleGalaxy': return 'Mystical & Creative';
            case 'darkMode': return 'Sleek & Modern';
            default: return 'Beautiful Theme';
        }
    };

    const THEME_OPTIONS: ThemeOption[] = Object.entries(themes).map(([key, themeObj]) => ({
        id: key,
        name: themeObj.name,
        colors: [themeObj.colors.primary, themeObj.colors.secondary],
        icon: getIconForTheme(key),
        description: getDescriptionForTheme(key),
    }));

    function handleIndexChange(newIndex: number) {
        if (newIndex !== currentIndex && newIndex >= 0 && newIndex < THEME_OPTIONS.length) {
            setCurrentIndex(newIndex);
            const selectedThemeKey = Object.keys(themes)[newIndex];
            setTheme(themes[selectedThemeKey]);
        }
    }

    useEffect(() => {
        // Initial entrance animation
        opacity.value = withDelay(300, withTiming(1, { duration: 1000 }));
        containerScale.value = withSequence(
            withDelay(400, withSpring(1.05, { damping: 8 })),
            withSpring(1, { damping: 15 })
        );
    }, []);

    useEffect(() => {
        const currentKey = Object.keys(themes).find(key => themes[key] === theme);
        if (currentKey !== undefined) {
            const index = Object.keys(themes).indexOf(currentKey);
            if (index !== -1 && index !== currentIndex) {
                setCurrentIndex(index);
                // Auto scroll to current theme
                setTimeout(() => {
                    scrollViewRef.current?.scrollTo({
                        x: index * (CARD_WIDTH + SPACING),
                        animated: true,
                    });
                }, 100);
            }
        }
    }, [theme]);

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollX.value = event.contentOffset.x;
        },
        onMomentumEnd: (event) => {
            const newIndex = Math.round(event.contentOffset.x / (CARD_WIDTH + SPACING));
            runOnJS(handleIndexChange)(newIndex);
        },
    });

    const containerStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ scale: containerScale.value }],
        alignItems: 'center',
        width: '100%',
    }));

    interface ThemeCardProps {
        item: ThemeOption;
        index: number;
    }

    const ThemeCard: React.FC<ThemeCardProps> = ({ item, index }) => {
        const cardStyle = useAnimatedStyle(() => {
            const inputRange = [
                (index - 2) * (CARD_WIDTH + SPACING),
                (index - 1) * (CARD_WIDTH + SPACING),
                index * (CARD_WIDTH + SPACING),
                (index + 1) * (CARD_WIDTH + SPACING),
                (index + 2) * (CARD_WIDTH + SPACING),
            ];

            const scale = interpolate(
                scrollX.value,
                inputRange,
                [0.75, 0.85, 1, 0.85, 0.75],
                'clamp'
            );

            const rotateY = interpolate(
                scrollX.value,
                inputRange,
                [90, 45, 0, -45, -90],
                'clamp'
            );

            const opacity = interpolate(
                scrollX.value,
                inputRange,
                [0.6, 0.8, 1, 0.8, 0.6],
                'clamp'
            );

            // Curve effect - cards move up and down to create U-shape
            const translateY = interpolate(
                scrollX.value,
                inputRange,
                [40, 15, 0, 15, 40],
                'clamp'
            );

            const shadowOpacity = interpolate(
                scrollX.value,
                inputRange,
                [0.1, 0.25, 0.4, 0.25, 0.1],
                'clamp'
            );

            return {
                transform: [
                    { scale },
                    { perspective: 1000 },
                    { rotateY: `${rotateY}deg` },
                    { translateY },
                ],
                opacity,
                shadowOpacity,
                shadowRadius: scale * 15,
                elevation: scale * 8,
            };
        });

        const glowStyle = useAnimatedStyle(() => {
            const isActive = Math.round(scrollX.value / (CARD_WIDTH + SPACING)) === index;
            return {
                opacity: withSpring(isActive ? 0.3 : 0, { damping: 15 }),
            };
        });

        return (
            <View style={[styles.cardContainer, { width: CARD_WIDTH + SPACING }]}>
                <TouchableOpacity onPress={() => handleIndexChange(index)} activeOpacity={0.9}>
                    <Animated.View
                        style={[
                            styles.card,
                            cardStyle,
                            {
                                shadowColor: item.colors[0],
                                backgroundColor: 'white',
                            }
                        ]}
                    >
                        <LinearGradient
                            colors={[item.colors[0], item.colors[1], `${item.colors[1]}CC`]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.cardGradient}
                        >
                            <View style={styles.cardContent}>
                                <Text style={styles.themeIcon}>{item.icon}</Text>
                                <Text style={styles.themeName}>{item.name}</Text>
                                <Text style={styles.themeDescription}>{item.description}</Text>
                            </View>

                            {/* Glow effect for active card */}
                            <Animated.View style={[styles.glowOverlay, glowStyle]} />

                            {/* Shimmer effect */}
                            <Animated.View style={[styles.shimmer, glowStyle]} />
                        </LinearGradient>
                    </Animated.View>
                </TouchableOpacity>
            </View>
        );
    };

    // Create indicator animation
    const indicatorStyle = useAnimatedStyle(() => {
        const n = THEME_OPTIONS.length;
        // Calculate the total width of indicators (12 width + 12 margin per indicator, except no margin for the last one)
        const totalIndicatorWidth = 12 * n + 12 * (n - 1); // Width + margins
        const start = (SCREEN_WIDTH - totalIndicatorWidth) / 2; // Center the indicators
        const translateX = interpolate(
            scrollX.value,
            THEME_OPTIONS.map((_, i) => i * (CARD_WIDTH + SPACING)),
            THEME_OPTIONS.map((_, i) => start + i * 24), // 24 = 12 (width) + 12 (margin)
            'clamp'
        );

        return {
            transform: [{ translateX }],
        };
    });

    // Background particles animation
    const particleStyles = Array.from({ length: 8 }, (_, i) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const particleY = useSharedValue(Math.random() * 200);
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const particleX = useSharedValue(Math.random() * SCREEN_WIDTH);

        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
            particleY.value = withRepeat(
                withSequence(
                    withTiming(Math.random() * 200, { duration: 3000 + Math.random() * 2000 }),
                    withTiming(Math.random() * 200, { duration: 3000 + Math.random() * 2000 })
                ),
                -1,
                true
            );
            particleX.value = withRepeat(
                withSequence(
                    withTiming(Math.random() * SCREEN_WIDTH, { duration: 4000 + Math.random() * 2000 }),
                    withTiming(Math.random() * SCREEN_WIDTH, { duration: 4000 + Math.random() * 2000 })
                ),
                -1,
                true
            );
        }, []);

        // eslint-disable-next-line react-hooks/rules-of-hooks
        return useAnimatedStyle(() => ({
            transform: [
                { translateX: particleX.value },
                { translateY: particleY.value },
            ],
            opacity: 0.1 + Math.sin(particleY.value / 50) * 0.1,
        }));
    });

    return (
        <View style={styles.container}>
            {/* Background particles */}
            <View style={styles.particleContainer}>
                {particleStyles.map((style, i) => (
                    <Animated.View
                        key={i}
                        style={[
                            styles.particle,
                            style,
                            { backgroundColor: theme.colors.primary }
                        ]}
                    />
                ))}
            </View>

            <Animated.View style={containerStyle}>
                <AnimatedScrollView
                    ref={scrollViewRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={scrollHandler}
                    scrollEventThrottle={16}
                    contentContainerStyle={styles.scrollContent}
                    snapToInterval={CARD_WIDTH + SPACING}
                    decelerationRate="fast"
                    contentInsetAdjustmentBehavior="never"
                >
                    {THEME_OPTIONS.map((item, index) => (
                        <ThemeCard key={item.id} item={item} index={index} />
                    ))}
                </AnimatedScrollView>

                {/* Custom Indicators */}
                <View style={styles.indicatorContainer}>
                    <Animated.View
                        style={[
                            styles.activeIndicator,
                            indicatorStyle,
                            { backgroundColor: theme.colors.primary }
                        ]}
                    />
                    {THEME_OPTIONS.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.indicator,
                                {
                                    backgroundColor: `${theme.colors.textDark}20`,
                                    marginRight: index < THEME_OPTIONS.length - 1 ? 12 : 0,
                                }
                            ]}
                        />
                    ))}
                </View>

                {/* Swipe hint with enhanced styling */}
                <Animated.View style={[styles.swipeHint, { opacity: opacity.value }]}>
                    <View style={[styles.swipeHintBg, { backgroundColor: `${theme.colors.surface}90` }]}>
                        <Text style={[styles.swipeHintText, { color: theme.colors.textDark }]}>
                            ← Swipe to explore themes →
                        </Text>
                    </View>
                </Animated.View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 280,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    particleContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
    },
    particle: {
        position: 'absolute',
        width: 6,
        height: 6,
        borderRadius: 3,
        opacity: 0.1,
    },
    scrollContent: {
        paddingHorizontal: (SCREEN_WIDTH - CARD_WIDTH) / 2 - 30,
        alignItems: 'center',
    },
    cardContainer: {
        height: CARD_HEIGHT + 60, // Extra height for curve effect
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderRadius: 24,
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 10,
        overflow: 'hidden',
    },
    cardGradient: {
        flex: 1,
        borderRadius: 24,
        position: 'relative',
        overflow: 'hidden',
    },
    cardContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        zIndex: 2,
    },
    themeIcon: {
        fontSize: 36,
        marginBottom: 10,
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    themeName: {
        fontSize: 20,
        fontWeight: '800',
        color: 'white',
        marginBottom: 6,
        textAlign: 'center',
        textShadowColor: 'rgba(0,0,0,0.4)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
        letterSpacing: 0.5,
    },
    themeDescription: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'center',
        fontWeight: '500',
        textShadowColor: 'rgba(0,0,0,0.2)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    glowOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 24,
    },
    shimmer: {
        position: 'absolute',
        top: -50,
        left: -50,
        right: -50,
        height: '150%',
        backgroundColor: 'rgba(255,255,255,0.15)',
        transform: [{ skewX: '-20deg' }],
    },
    indicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 25,
        position: 'relative',
        height: 12,
    },
    indicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    activeIndicator: {
        // position: 'absolute',
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#667eea',
        // left: 0,
        shadowColor: '#667eea',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 5,

    },
    swipeHint: {
        marginTop: 18,
        alignItems: 'center',
    },
    swipeHintBg: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.9)',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    swipeHintText: {
        fontSize: 12,
        color: 'rgba(0,0,0,0.6)',
        fontWeight: '600',
        textAlign: 'center',
        letterSpacing: 0.3,
    },
});