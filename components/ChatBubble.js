import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';

function LetterByLetter({ text }) {
    const [displayed, setDisplayed] = useState('');
    useEffect(() => {
        setDisplayed('');
        let i = 0;
        const interval = setInterval(() => {
            i++;
            setDisplayed(text.slice(0, i));
            if (i >= text.length) clearInterval(interval);
        }, 40);
        return () => clearInterval(interval);
    }, [text]);
    return <Text style={styles.loveText}>{displayed}</Text>;
}

export default function ChatBubble({ message, isUser, isLoveInsight }) {
    const translateX = useSharedValue(isUser ? 60 : -60);
    const opacity = useSharedValue(0);
    const scale = useSharedValue(0.85);

    useEffect(() => {
        translateX.value = withTiming(0, { duration: 350, easing: Easing.out(Easing.back(1.3)) });
        opacity.value = withTiming(1, { duration: 300 });
        scale.value = withTiming(1, { duration: 350, easing: Easing.out(Easing.back(1.2)) });
    }, []);

    const animStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }, { scale: scale.value }],
        opacity: opacity.value,
    }));

    return (
        <Animated.View
            style={[
                styles.wrapper,
                isUser ? styles.userWrapper : styles.aiWrapper,
                animStyle,
            ]}
        >
            <View
                style={[
                    styles.bubble,
                    isUser ? styles.userBubble : styles.aiBubble,
                    isLoveInsight && styles.loveBubble,
                ]}
            >
                {isLoveInsight ? (
                    <LetterByLetter text={message} />
                ) : (
                    <Text style={isUser ? styles.userText : styles.aiText}>{message}</Text>
                )}
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        marginVertical: 5,
        paddingHorizontal: 14,
    },
    userWrapper: {
        alignItems: 'flex-end',
    },
    aiWrapper: {
        alignItems: 'flex-start',
    },
    bubble: {
        maxWidth: '80%',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    userBubble: {
        backgroundColor: 'rgba(155, 39, 255, 0.65)',
        borderTopRightRadius: 4,
        borderWidth: 1,
        borderColor: 'rgba(200, 100, 255, 0.4)',
        shadowColor: '#9B27FF',
        shadowOpacity: 0.6,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 0 },
    },
    aiBubble: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderTopLeftRadius: 4,
        borderWidth: 1,
        borderColor: 'rgba(255, 45, 155, 0.5)',
        shadowColor: '#FF2D9B',
        shadowOpacity: 0.5,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 0 },
    },
    loveBubble: {
        backgroundColor: 'rgba(255, 45, 155, 0.12)',
        borderColor: 'rgba(255, 109, 222, 0.7)',
        shadowColor: '#FF6BDE',
        shadowOpacity: 0.8,
        shadowRadius: 20,
    },
    userText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '500',
        letterSpacing: 0.3,
    },
    aiText: {
        color: '#E8D0FF',
        fontSize: 15,
        letterSpacing: 0.3,
        lineHeight: 22,
    },
    loveText: {
        color: '#FFB3E6',
        fontSize: 15,
        letterSpacing: 0.4,
        lineHeight: 23,
        fontStyle: 'italic',
    },
});
