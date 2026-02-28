import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';
import FloatingParticles from '../components/FloatingParticles';
import NeonButton from '../components/NeonButton';

const { width, height } = Dimensions.get('window');

function GlowTitle() {
    const glowOpacity = useSharedValue(0.5);
    const glitchX = useSharedValue(0);
    const titleOpacity = useSharedValue(0);
    const titleScale = useSharedValue(0.7);

    useEffect(() => {
        // Fade + scale in
        titleOpacity.value = withDelay(400, withTiming(1, { duration: 1000 }));
        titleScale.value = withDelay(400, withTiming(1, { duration: 900, easing: Easing.out(Easing.back(1.5)) }));

        // Glow pulse
        glowOpacity.value = withDelay(
            1200,
            withRepeat(
                withSequence(
                    withTiming(1, { duration: 900, easing: Easing.inOut(Easing.sin) }),
                    withTiming(0.4, { duration: 900, easing: Easing.inOut(Easing.sin) }),
                ),
                -1,
                false
            )
        );

        // Glitch loop
        const startGlitch = () => {
            glitchX.value = withSequence(
                withTiming(4, { duration: 60 }),
                withTiming(-4, { duration: 60 }),
                withTiming(3, { duration: 50 }),
                withTiming(0, { duration: 80 }),
            );
        };
        const glitchInterval = setInterval(startGlitch, 3500);
        return () => clearInterval(glitchInterval);
    }, []);

    const titleAnim = useAnimatedStyle(() => ({
        opacity: titleOpacity.value,
        transform: [{ scale: titleScale.value }, { translateX: glitchX.value }],
        textShadowOpacity: glowOpacity.value,
    }));

    return (
        <Animated.Text style={[styles.title, titleAnim]}>
            DELULU
        </Animated.Text>
    );
}

function Subtitle() {
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(20);

    useEffect(() => {
        opacity.value = withDelay(1300, withTiming(1, { duration: 800 }));
        translateY.value = withDelay(1300, withTiming(0, { duration: 700, easing: Easing.out(Easing.quad) }));
    }, []);

    const anim = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ translateY: translateY.value }],
    }));

    return (
        <Animated.Text style={[styles.subtitle, anim]}>
            Smart Josiyar 🔮
        </Animated.Text>
    );
}

function GlowOrb() {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(0);

    useEffect(() => {
        opacity.value = withDelay(200, withTiming(1, { duration: 800 }));
        scale.value = withDelay(
            800,
            withRepeat(
                withSequence(
                    withTiming(1.15, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
                    withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
                ),
                -1,
                false
            )
        );
    }, []);

    const orbStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    return (
        <Animated.View style={[styles.orbContainer, orbStyle]}>
            <View style={styles.orbOuter}>
                <View style={styles.orbMid}>
                    <View style={styles.orbInner} />
                </View>
            </View>
        </Animated.View>
    );
}

export default function SplashScreen({ navigation }) {
    const buttonOpacity = useSharedValue(0);

    useEffect(() => {
        buttonOpacity.value = withDelay(2000, withTiming(1, { duration: 800 }));
    }, []);

    const buttonStyle = useAnimatedStyle(() => ({ opacity: buttonOpacity.value }));

    return (
        <LinearGradient
            colors={['#0A0014', '#0D0D1A', '#14002A', '#0A0014']}
            style={styles.container}
        >
            <FloatingParticles />

            <GlowOrb />

            <View style={styles.titleContainer}>
                <GlowTitle />
                <Subtitle />
                <Text style={styles.tagline}>AI Love Prediction Engine</Text>
            </View>

            <Animated.View style={[styles.buttonContainer, buttonStyle]}>
                <NeonButton
                    title="Enter the Future"
                    onPress={() => navigation.replace('Chat')}
                />
            </Animated.View>

            <Text style={styles.footer}>v1.0 • Cosmic Edition ✨</Text>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    orbContainer: {
        marginBottom: 30,
    },
    orbOuter: {
        width: 130,
        height: 130,
        borderRadius: 65,
        backgroundColor: 'rgba(155, 39, 255, 0.12)',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#9B27FF',
        shadowOpacity: 0.8,
        shadowRadius: 30,
        shadowOffset: { width: 0, height: 0 },
        borderWidth: 1,
        borderColor: 'rgba(155, 39, 255, 0.4)',
    },
    orbMid: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: 'rgba(201,107,255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#C96BFF',
        shadowOpacity: 0.7,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 0 },
    },
    orbInner: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: '#C96BFF',
        shadowColor: '#C96BFF',
        shadowOpacity: 1,
        shadowRadius: 15,
        shadowOffset: { width: 0, height: 0 },
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: 60,
    },
    title: {
        fontSize: 68,
        fontWeight: '900',
        color: '#FF2D9B',
        letterSpacing: 8,
        textShadowColor: '#FF2D9B',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 30,
    },
    subtitle: {
        fontSize: 18,
        color: '#C96BFF',
        letterSpacing: 4,
        marginTop: 6,
        fontWeight: '600',
        textShadowColor: '#C96BFF',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 12,
    },
    tagline: {
        fontSize: 12,
        color: 'rgba(180, 120, 255, 0.6)',
        letterSpacing: 2,
        marginTop: 12,
        textTransform: 'uppercase',
    },
    buttonContainer: {
        marginTop: 20,
    },
    footer: {
        position: 'absolute',
        bottom: 36,
        color: 'rgba(155, 39, 255, 0.4)',
        fontSize: 11,
        letterSpacing: 1,
    },
});
