import { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';

export default function NeonButton({ title, onPress, style, textStyle }) {
    const glow = useSharedValue(0.5);
    const scale = useSharedValue(1);

    useEffect(() => {
        glow.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.sin) }),
                withTiming(0.4, { duration: 1200, easing: Easing.inOut(Easing.sin) }),
            ),
            -1,
            false
        );
    }, []);

    const glowStyle = useAnimatedStyle(() => ({
        shadowOpacity: glow.value,
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        scale.value = withTiming(0.94, { duration: 100 });
    };
    const handlePressOut = () => {
        scale.value = withTiming(1, { duration: 150, easing: Easing.out(Easing.back(2)) });
    };

    return (
        <Animated.View style={[styles.wrapper, glowStyle, style]}>
            <TouchableOpacity
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={styles.button}
                activeOpacity={0.9}
            >
                <Text style={[styles.text, textStyle]}>{title}</Text>
            </TouchableOpacity>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        borderRadius: 30,
        shadowColor: '#FF2D9B',
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 20,
        elevation: 12,
    },
    button: {
        backgroundColor: 'rgba(255, 45, 155, 0.15)',
        borderWidth: 1.5,
        borderColor: '#FF2D9B',
        borderRadius: 30,
        paddingHorizontal: 44,
        paddingVertical: 16,
        alignItems: 'center',
    },
    text: {
        color: '#FF2D9B',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
});
