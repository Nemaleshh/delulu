import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
    Dimensions,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
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
        titleOpacity.value = withDelay(400, withTiming(1, { duration: 1000 }));
        titleScale.value = withDelay(400, withTiming(1, { duration: 900, easing: Easing.out(Easing.back(1.5)) }));

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

function AvatarOrb() {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(0);

    useEffect(() => {
        opacity.value = withDelay(200, withTiming(1, { duration: 800 }));
        scale.value = withDelay(
            800,
            withRepeat(
                withSequence(
                    withTiming(1.08, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
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
                    <Image source={require('../assets/delulu_avatar.jpg')} style={styles.orbImage} />
                </View>
            </View>
        </Animated.View>
    );
}

// ─── Custom T&C Modal ───────────────────────────────────────────
function TermsModal({ visible, onAccept, onDecline }) {
    return (
        <Modal transparent animationType="fade" visible={visible}>
            <View style={styles.modalOverlay}>
                <BlurView intensity={40} style={StyleSheet.absoluteFill} />
                <LinearGradient
                    colors={['rgba(10,0,20,0.96)', 'rgba(20,0,42,0.98)', 'rgba(10,0,20,0.96)']}
                    style={styles.modalCard}
                >
                    {/* Glow border accent */}
                    <View style={styles.modalGlowBar} />

                    <Text style={styles.modalTitle}>✦ Terms & Conditions ✦</Text>
                    <Text style={styles.modalSubtitle}>Read before entering the cosmos</Text>

                    <View style={styles.modalDivider} />

                    <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                        <View style={styles.termItem}>
                            <Text style={styles.termIcon}>🔋</Text>
                            <Text style={styles.termText}>
                                Every prediction drains the cosmic battery. Ask too many questions and the visions go dark.
                            </Text>
                        </View>

                        <View style={styles.termItem}>
                            <Text style={styles.termIcon}>⚠️</Text>
                            <Text style={styles.termText}>
                                Below 10% battery, predictions become unreliable and the app goes haywire. You have been warned.
                            </Text>
                        </View>

                        <View style={styles.termItem}>
                            <Text style={styles.termIcon}>🌀</Text>
                            <Text style={styles.termText}>
                                Over usage causes energy drain, wrong predictions, and cosmic confusion. Use wisely.
                            </Text>
                        </View>

                        <View style={styles.termItem}>
                            <Text style={styles.termIcon}>🔮</Text>
                            <Text style={styles.termText}>
                                Predictions are for entertainment only. The cosmos has the final say, not this app.
                            </Text>
                        </View>

                        <View style={styles.termItem}>
                            <Text style={styles.termIcon}>💜</Text>
                            <Text style={styles.termText}>
                                By accepting, you agree to receive cosmic truths — including ones you may not want to hear.
                            </Text>
                        </View>
                    </ScrollView>

                    <View style={styles.modalDivider} />

                    <View style={styles.modalBtnRow}>
                        <TouchableOpacity style={styles.declineBtn} onPress={onDecline}>
                            <Text style={styles.declineBtnText}>Decline</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.acceptBtn} onPress={onAccept}>
                            <LinearGradient
                                colors={['#FF2D9B', '#9B27FF']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.acceptGradient}
                            >
                                <Text style={styles.acceptBtnText}>Accept ✦</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </View>
        </Modal>
    );
}

export default function SplashScreen({ navigation }) {
    const buttonOpacity = useSharedValue(0);
    const [termsVisible, setTermsVisible] = useState(false);

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

            <AvatarOrb />

            <View style={styles.titleContainer}>
                <GlowTitle />
                <Subtitle />
                <Text style={styles.tagline}>Cosmic Prediction Engine</Text>
            </View>

            <Animated.View style={[styles.buttonContainer, buttonStyle]}>
                <NeonButton
                    title="Enter the Future"
                    onPress={() => setTermsVisible(true)}
                />
            </Animated.View>

            <Text style={styles.footer}>v1.0 • Cosmic Edition ✨</Text>

            <TermsModal
                visible={termsVisible}
                onAccept={() => {
                    setTermsVisible(false);
                    navigation.replace('Chat');
                }}
                onDecline={() => setTermsVisible(false)}
            />
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
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: 'rgba(155, 39, 255, 0.12)',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#9B27FF',
        shadowOpacity: 0.8,
        shadowRadius: 30,
        shadowOffset: { width: 0, height: 0 },
        borderWidth: 2,
        borderColor: 'rgba(201, 107, 255, 0.5)',
    },
    orbMid: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(201,107,255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#C96BFF',
        shadowOpacity: 0.7,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 0 },
        overflow: 'hidden',
    },
    orbImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
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
    // ─── Modal ────────────────────────────────────────
    modalOverlay: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    modalCard: {
        width: width * 0.88,
        maxHeight: height * 0.72,
        borderRadius: 24,
        paddingHorizontal: 24,
        paddingBottom: 28,
        borderWidth: 1.5,
        borderColor: 'rgba(155,39,255,0.5)',
        shadowColor: '#9B27FF',
        shadowOpacity: 0.6,
        shadowRadius: 30,
        shadowOffset: { width: 0, height: 0 },
        overflow: 'hidden',
    },
    modalGlowBar: {
        height: 3,
        borderRadius: 2,
        backgroundColor: '#FF2D9B',
        marginBottom: 20,
        marginHorizontal: -24,
        shadowColor: '#FF2D9B',
        shadowOpacity: 1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 0 },
    },
    modalTitle: {
        color: '#E8D0FF',
        fontSize: 20,
        fontWeight: '900',
        textAlign: 'center',
        letterSpacing: 1.5,
        textShadowColor: '#C96BFF',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 12,
    },
    modalSubtitle: {
        color: 'rgba(180,120,255,0.6)',
        fontSize: 12,
        textAlign: 'center',
        letterSpacing: 1,
        marginTop: 4,
        marginBottom: 16,
    },
    modalDivider: {
        height: 1,
        backgroundColor: 'rgba(155,39,255,0.3)',
        marginVertical: 14,
    },
    modalScroll: {
        maxHeight: height * 0.32,
    },
    termItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        marginBottom: 14,
    },
    termIcon: {
        fontSize: 20,
        marginTop: 1,
    },
    termText: {
        flex: 1,
        color: 'rgba(220,190,255,0.85)',
        fontSize: 13.5,
        lineHeight: 20,
        letterSpacing: 0.2,
    },
    modalBtnRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 6,
    },
    declineBtn: {
        flex: 1,
        paddingVertical: 13,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: 'rgba(155,39,255,0.45)',
        alignItems: 'center',
        backgroundColor: 'rgba(155,39,255,0.08)',
    },
    declineBtnText: {
        color: 'rgba(201,107,255,0.7)',
        fontSize: 15,
        fontWeight: '700',
    },
    acceptBtn: {
        flex: 1.6,
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#FF2D9B',
        shadowOpacity: 0.7,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 0 },
    },
    acceptGradient: {
        paddingVertical: 13,
        alignItems: 'center',
    },
    acceptBtnText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '900',
        letterSpacing: 0.5,
    },
});
