import { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const PARTICLE_COUNT = 22;

function generateParticle(index) {
    return {
        id: index,
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 5 + 2,
        color: index % 3 === 0 ? '#FF2D9B' : index % 3 === 1 ? '#9B27FF' : '#FF6BDE',
        duration: Math.random() * 4000 + 4000,
        delay: Math.random() * 3000,
        driftX: (Math.random() - 0.5) * 80,
        driftY: -(Math.random() * 120 + 60),
    };
}

const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => generateParticle(i));

function Particle({ config }) {
    const translateY = useSharedValue(0);
    const translateX = useSharedValue(0);
    const opacity = useSharedValue(0);

    useEffect(() => {
        translateY.value = withDelay(
            config.delay,
            withRepeat(
                withTiming(config.driftY, { duration: config.duration, easing: Easing.inOut(Easing.quad) }),
                -1,
                true
            )
        );
        translateX.value = withDelay(
            config.delay,
            withRepeat(
                withTiming(config.driftX, { duration: config.duration * 1.3, easing: Easing.inOut(Easing.sin) }),
                -1,
                true
            )
        );
        opacity.value = withDelay(
            config.delay,
            withRepeat(
                withTiming(0.8, { duration: config.duration / 2, easing: Easing.inOut(Easing.quad) }),
                -1,
                true
            )
        );
    }, []);

    const animStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
        opacity: opacity.value,
    }));

    return (
        <Animated.View
            style={[
                {
                    position: 'absolute',
                    left: config.x,
                    top: config.y,
                    width: config.size,
                    height: config.size,
                    borderRadius: config.size / 2,
                    backgroundColor: config.color,
                    shadowColor: config.color,
                    shadowOpacity: 0.9,
                    shadowRadius: config.size * 2,
                    shadowOffset: { width: 0, height: 0 },
                },
                animStyle,
            ]}
        />
    );
}

export default function FloatingParticles() {
    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
            {particles.map((p) => (
                <Particle key={p.id} config={p} />
            ))}
        </View>
    );
}
