import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';

function Dot({ delay }) {
    const translateY = useSharedValue(0);
    const opacity = useSharedValue(0.4);

    useEffect(() => {
        translateY.value = withDelay(
            delay,
            withRepeat(
                withTiming(-8, { duration: 400, easing: Easing.inOut(Easing.quad) }),
                -1,
                true
            )
        );
        opacity.value = withDelay(
            delay,
            withRepeat(withTiming(1, { duration: 400 }), -1, true)
        );
    }, []);

    const animStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
        opacity: opacity.value,
    }));

    return <Animated.View style={[styles.dot, animStyle]} />;
}

export default function TypingIndicator() {
    return (
        <View style={styles.container}>
            <View style={styles.bubble}>
                <Dot delay={0} />
                <Dot delay={150} />
                <Dot delay={300} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginVertical: 6,
    },
    bubble: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(155, 39, 255, 0.18)',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(155, 39, 255, 0.4)',
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#C96BFF',
        shadowColor: '#C96BFF',
        shadowOpacity: 0.9,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 0 },
    },
});
