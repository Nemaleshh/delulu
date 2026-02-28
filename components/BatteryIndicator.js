import { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';

export default function BatteryIndicator({ battery, onCharge }) {
    const glitch = useSharedValue(0);
    const fillAnim = useSharedValue(battery);

    useEffect(() => {
        fillAnim.value = withTiming(battery, { duration: 600, easing: Easing.out(Easing.quad) });
        if (battery < 10) {
            glitch.value = withRepeat(
                withSequence(
                    withTiming(1, { duration: 80 }),
                    withTiming(0, { duration: 60 }),
                    withTiming(1, { duration: 120 }),
                    withTiming(0, { duration: 200 }),
                ),
                -1,
                false
            );
        } else {
            glitch.value = withTiming(0, { duration: 300 });
        }
    }, [battery]);

    const glitchStyle = useAnimatedStyle(() => ({
        opacity: battery < 10 ? 0.4 + glitch.value * 0.6 : 1,
        transform: [{ translateX: glitch.value * (Math.random() > 0.5 ? 2 : -2) }],
    }));

    const fillWidth = Math.max(0, Math.min(100, battery));
    const barColor = battery > 20 ? '#9B27FF' : battery > 10 ? '#FF8C00' : '#FF2D2D';

    return (
        <Animated.View style={[styles.container, glitchStyle]}>
            <Text style={styles.label}>⚡ {battery}%</Text>
            <View style={styles.batteryOuter}>
                <View style={styles.batteryInner}>
                    <View
                        style={[
                            styles.fill,
                            {
                                width: `${fillWidth}%`,
                                backgroundColor: barColor,
                                shadowColor: barColor,
                            },
                        ]}
                    />
                </View>
                <View style={styles.batteryNub} />
            </View>
            {battery < 15 && (
                <TouchableOpacity onPress={onCharge} style={styles.chargeBtn}>
                    <Text style={styles.chargeBtnText}>🔌 Charge</Text>
                </TouchableOpacity>
            )}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    label: {
        color: '#D4AAFF',
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    batteryOuter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    batteryInner: {
        width: 48,
        height: 16,
        borderRadius: 4,
        borderWidth: 1.5,
        borderColor: '#9B27FF',
        overflow: 'hidden',
        backgroundColor: 'rgba(155,39,255,0.1)',
    },
    fill: {
        height: '100%',
        borderRadius: 3,
        shadowOpacity: 0.9,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 0 },
    },
    batteryNub: {
        width: 4,
        height: 8,
        backgroundColor: '#9B27FF',
        borderRadius: 1,
        marginLeft: 1,
    },
    chargeBtn: {
        backgroundColor: 'rgba(255, 45, 155, 0.2)',
        borderWidth: 1,
        borderColor: '#FF2D9B',
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 3,
    },
    chargeBtnText: {
        color: '#FF2D9B',
        fontSize: 11,
        fontWeight: '700',
    },
});
