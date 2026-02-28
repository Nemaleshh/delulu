import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
    Dimensions,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';

import BatteryIndicator from '../components/BatteryIndicator';
import ChatBubble from '../components/ChatBubble';
import FloatingParticles from '../components/FloatingParticles';
import TypingIndicator from '../components/TypingIndicator';
import { getAIResponse } from '../utils/chatLogic';

const { width, height } = Dimensions.get('window');

// ─── AI Avatar Orb ─────────────────────────────────────────────
function AvatarOrb({ isThinking }) {
    const pulse = useSharedValue(1);
    const glow = useSharedValue(0.5);

    useEffect(() => {
        pulse.value = withRepeat(
            withSequence(
                withTiming(isThinking ? 1.25 : 1.1, { duration: 800, easing: Easing.inOut(Easing.sin) }),
                withTiming(1, { duration: 800, easing: Easing.inOut(Easing.sin) }),
            ),
            -1,
            false
        );
        glow.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 900, easing: Easing.inOut(Easing.sin) }),
                withTiming(isThinking ? 0.3 : 0.5, { duration: 900, easing: Easing.inOut(Easing.sin) }),
            ),
            -1,
            false
        );
    }, [isThinking]);

    const orbStyle = useAnimatedStyle(() => ({
        transform: [{ scale: pulse.value }],
        shadowOpacity: glow.value,
    }));

    return (
        <Animated.View style={[styles.avatarOuter, orbStyle]}>
            <View style={styles.avatarMid}>
                <View style={styles.avatarInner}>
                    <Text style={styles.avatarEmoji}>🔮</Text>
                </View>
            </View>
        </Animated.View>
    );
}

// ─── Heart Particle (Love Insight) ─────────────────────────────
function HeartParticle({ x, delay }) {
    const translateY = useSharedValue(0);
    const opacity = useSharedValue(0);
    const scale = useSharedValue(0.5);

    useEffect(() => {
        opacity.value = withDelay(delay, withSequence(
            withTiming(1, { duration: 300 }),
            withTiming(1, { duration: 1200 }),
            withTiming(0, { duration: 600 }),
        ));
        translateY.value = withDelay(delay, withTiming(-height * 0.5, { duration: 2100, easing: Easing.out(Easing.quad) }));
        scale.value = withDelay(delay, withSequence(
            withTiming(1.2, { duration: 400 }),
            withTiming(0.8, { duration: 400 }),
            withTiming(1, { duration: 400 }),
        ));
    }, []);

    const style = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }, { scale: scale.value }],
        opacity: opacity.value,
    }));

    return (
        <Animated.Text style={[styles.heart, { left: x }, style]}>
            💗
        </Animated.Text>
    );
}

// ─── Cinematic End Screen ───────────────────────────────────────
function CinematicEnd() {
    const opacity = useSharedValue(0);
    const textOpacity1 = useSharedValue(0);
    const textOpacity2 = useSharedValue(0);
    const textOpacity3 = useSharedValue(0);

    useEffect(() => {
        opacity.value = withTiming(1, { duration: 1500 });
        textOpacity1.value = withDelay(800, withTiming(1, { duration: 1000 }));
        textOpacity2.value = withDelay(2000, withTiming(1, { duration: 900 }));
        textOpacity3.value = withDelay(3200, withTiming(1, { duration: 1000 }));
    }, []);

    const bgStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
    const t1 = useAnimatedStyle(() => ({ opacity: textOpacity1.value }));
    const t2 = useAnimatedStyle(() => ({ opacity: textOpacity2.value }));
    const t3 = useAnimatedStyle(() => ({ opacity: textOpacity3.value }));

    return (
        <Animated.View style={[StyleSheet.absoluteFill, styles.cinematic, bgStyle]}>
            <FloatingParticles />
            <Animated.Text style={[styles.cinText1, t1]}>Live the Present.</Animated.Text>
            <Animated.Text style={[styles.cinText2, t1]}>There's no hurry.</Animated.Text>
            <View style={styles.cinDivider} />
            <Animated.Text style={[styles.cinEnd, t2]}>THE END</Animated.Text>
            <Animated.Text style={[styles.cinX, t2]}>✦</Animated.Text>
            <Animated.Text style={[styles.cinBegin, t3]}>THE BEGINNING</Animated.Text>
        </Animated.View>
    );
}

// ─── INITIAL MESSAGES ──────────────────────────────────────────
const INITIAL_MESSAGES = [
    {
        id: '0',
        text: 'Vanakkam da! I am DELULU AI 🔮\nAsk me anything about your future, love, or destiny...',
        isUser: false,
        isLoveInsight: false,
    },
];

// ─── MAIN CHAT SCREEN ──────────────────────────────────────────
export default function ChatScreen() {
    const [messages, setMessages] = useState(INITIAL_MESSAGES);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [battery, setBattery] = useState(100);
    const [loveInsightActive, setLoveInsightActive] = useState(false);
    const [showCinematic, setShowCinematic] = useState(false);
    const [heartParticles, setHeartParticles] = useState([]);
    const listRef = useRef(null);
    const heartTimeout = useRef(null);
    const loveOverlayOpacity = useSharedValue(0);

    // Love Insight overlay animation
    const loveOverlayStyle = useAnimatedStyle(() => ({
        opacity: loveOverlayOpacity.value,
    }));

    const triggerLoveInsight = useCallback(() => {
        setLoveInsightActive(true);
        loveOverlayOpacity.value = withTiming(1, { duration: 600 });

        // Generate heart particles
        const hearts = Array.from({ length: 14 }, (_, i) => ({
            id: i,
            x: Math.random() * (width - 60) + 20,
            delay: i * 160,
        }));
        setHeartParticles(hearts);

        heartTimeout.current = setTimeout(() => {
            loveOverlayOpacity.value = withTiming(0, { duration: 800 });
            setTimeout(() => {
                setLoveInsightActive(false);
                setHeartParticles([]);
            }, 900);
        }, 4200);
    }, []);

    useEffect(() => () => heartTimeout.current && clearTimeout(heartTimeout.current), []);

    const handleSend = useCallback(async () => {
        const text = inputText.trim();
        if (!text || isTyping || battery < 10) return;

        // Haptic
        try { await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); }
        catch (_) { }

        const userMsg = { id: Date.now().toString(), text, isUser: true, isLoveInsight: false };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsTyping(true);

        setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);

        setTimeout(() => {
            const response = getAIResponse(text);
            const aiMsg = {
                id: (Date.now() + 1).toString(),
                text: response.text,
                isUser: false,
                isLoveInsight: response.isLoveInsight,
            };

            setMessages(prev => [...prev, aiMsg]);
            setIsTyping(false);

            // Battery drain
            setBattery(prev => {
                const next = Math.max(0, prev - 3);
                return next;
            });

            if (response.isLoveInsight) {
                triggerLoveInsight();
            }

            setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
        }, 1600);
    }, [inputText, isTyping, battery, triggerLoveInsight]);

    const handleCharge = useCallback(() => {
        setBattery(28);
        setIsTyping(false);

        // Show final cinematic message first
        const finalMsg = {
            id: 'final-' + Date.now(),
            text: '⚡ Power restored. One last message from the cosmos...',
            isUser: false,
            isLoveInsight: false,
        };
        setMessages(prev => [...prev, finalMsg]);

        setTimeout(() => {
            setShowCinematic(true);
        }, 2000);
    }, []);

    const isBatteryDead = battery < 10;

    const renderItem = ({ item }) => (
        <ChatBubble
            message={item.text}
            isUser={item.isUser}
            isLoveInsight={item.isLoveInsight}
        />
    );

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 25}
        >
            <LinearGradient
                colors={['#0A0014', '#0D0D1A', '#10001F']}
                style={styles.container}
            >
                <StatusBar barStyle="light-content" />
                <FloatingParticles />

                {/* ── Header ── */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <AvatarOrb isThinking={isTyping} />
                        <View style={styles.headerInfo}>
                            <Text style={styles.aiName}>DELULU AI</Text>
                            <Text style={styles.aiStatus}>
                                {isBatteryDead ? '⚠️ Power Critical' : isTyping ? '🌀 Predicting...' : '🟢 Online | Future Predicting…'}
                            </Text>
                        </View>
                    </View>
                    <BatteryIndicator battery={battery} onCharge={handleCharge} />
                </View>

                {/* ── Dead battery overlay ── */}
                {isBatteryDead && (
                    <View style={styles.deadBanner}>
                        <Text style={styles.deadText}>⚠️ App won't work below 10% charge. Tap "Charge" to restore.</Text>
                    </View>
                )}

                {/* ── Chat List ── */}
                <View style={{ flex: 1 }}>
                    <FlatList
                        ref={listRef}
                        data={messages}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        contentContainerStyle={styles.list}
                        onLayout={() => listRef.current?.scrollToEnd({ animated: false })}
                        showsVerticalScrollIndicator={false}
                        ListFooterComponent={isTyping ? <TypingIndicator /> : null}
                    />
                </View>

                {/* ── Input ── */}
                <View style={styles.inputRow}>
                    <TextInput
                        style={[styles.input, isBatteryDead && styles.inputDisabled]}
                        value={inputText}
                        onChangeText={setInputText}
                        placeholder={isBatteryDead ? 'No power... 🔋' : 'Ask the cosmos...'}
                        placeholderTextColor={isBatteryDead ? 'rgba(255,45,45,0.4)' : 'rgba(180,120,255,0.5)'}
                        multiline
                        maxLength={200}
                        editable={!isBatteryDead && !isTyping}
                        onSubmitEditing={handleSend}
                    />
                    <TouchableOpacity
                        style={[styles.sendBtn, (isBatteryDead || isTyping || !inputText.trim()) && styles.sendDisabled]}
                        onPress={handleSend}
                        disabled={isBatteryDead || isTyping || !inputText.trim()}
                    >
                        <LinearGradient
                            colors={['#FF2D9B', '#9B27FF']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.sendGradient}
                        >
                            <Text style={styles.sendIcon}>✦</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                {/* ── Love Insight Overlay ── */}
                {loveInsightActive && (
                    <Animated.View style={[StyleSheet.absoluteFill, styles.loveOverlay, loveOverlayStyle]} pointerEvents="none">
                        <BlurView intensity={20} style={StyleSheet.absoluteFill} />
                        <LinearGradient
                            colors={['rgba(255,45,155,0.3)', 'rgba(80,0,80,0.5)', 'rgba(255,109,222,0.2)']}
                            style={StyleSheet.absoluteFill}
                        />
                        {heartParticles.map(p => (
                            <HeartParticle key={p.id} x={p.x} delay={p.delay} />
                        ))}
                    </Animated.View>
                )}

                {showCinematic && <CinematicEnd />}
            </LinearGradient>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'ios' ? 60 : 44,
        paddingBottom: 14,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(155, 39, 255, 0.2)',
        backgroundColor: 'rgba(10, 0, 20, 0.85)',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatarOuter: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(155, 39, 255, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: 'rgba(201, 107, 255, 0.6)',
        shadowColor: '#9B27FF',
        shadowOpacity: 0.8,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 0 },
    },
    avatarMid: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: 'rgba(201, 107, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarInner: {
        width: 28,
        height: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarEmoji: {
        fontSize: 20,
    },
    headerInfo: {
        justifyContent: 'center',
    },
    aiName: {
        color: '#E8D0FF',
        fontWeight: '800',
        fontSize: 15,
        letterSpacing: 2,
    },
    aiStatus: {
        color: 'rgba(180, 120, 255, 0.7)',
        fontSize: 11,
        marginTop: 1,
        letterSpacing: 0.3,
    },
    deadBanner: {
        backgroundColor: 'rgba(255, 30, 30, 0.12)',
        borderBottomWidth: 1,
        borderColor: 'rgba(255, 45, 45, 0.4)',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    deadText: {
        color: '#FF6B6B',
        fontSize: 12,
        textAlign: 'center',
        letterSpacing: 0.3,
    },
    list: {
        paddingTop: 14,
        paddingBottom: 14,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        paddingBottom: Platform.OS === 'ios' ? 30 : 14,
        borderTopWidth: 1,
        borderTopColor: 'rgba(155, 39, 255, 0.25)',
        backgroundColor: 'rgba(10, 0, 20, 0.9)',
    },
    input: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 22,
        borderWidth: 1.5,
        borderColor: 'rgba(155, 39, 255, 0.5)',
        color: '#FFFFFF',
        paddingHorizontal: 18,
        paddingVertical: 12,
        fontSize: 15,
        maxHeight: 100,
        shadowColor: '#9B27FF',
        shadowOpacity: 0.3,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 0 },
    },
    inputDisabled: {
        borderColor: 'rgba(255, 45, 45, 0.4)',
        backgroundColor: 'rgba(255, 45, 45, 0.05)',
    },
    sendBtn: {
        width: 48,
        height: 48,
        borderRadius: 24,
        overflow: 'hidden',
        shadowColor: '#FF2D9B',
        shadowOpacity: 0.8,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 0 },
    },
    sendDisabled: {
        opacity: 0.35,
    },
    sendGradient: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendIcon: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: '900',
    },
    loveOverlay: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: 120,
    },
    heart: {
        position: 'absolute',
        bottom: 80,
        fontSize: 26,
    },
    // Cinematic
    cinematic: {
        backgroundColor: '#000000',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999,
    },
    cinText1: {
        color: '#E8D0FF',
        fontSize: 28,
        fontWeight: '300',
        letterSpacing: 4,
        textAlign: 'center',
    },
    cinText2: {
        color: '#C96BFF',
        fontSize: 20,
        fontWeight: '300',
        letterSpacing: 3,
        marginTop: 10,
        textShadowColor: '#C96BFF',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 12,
    },
    cinDivider: {
        width: 120,
        height: 1,
        backgroundColor: 'rgba(155, 39, 255, 0.5)',
        marginVertical: 40,
    },
    cinEnd: {
        color: '#FF2D9B',
        fontSize: 42,
        fontWeight: '900',
        letterSpacing: 10,
        textShadowColor: '#FF2D9B',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 24,
    },
    cinX: {
        color: 'rgba(255, 45, 155, 0.5)',
        fontSize: 28,
        marginTop: 12,
        marginBottom: 12,
    },
    cinBegin: {
        color: '#9B27FF',
        fontSize: 20,
        fontWeight: '600',
        letterSpacing: 6,
        textShadowColor: '#9B27FF',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 16,
    },
});
