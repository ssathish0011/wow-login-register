import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Dev-only on-screen FPS counter (JavaScript thread, target ~60)
export default function FpsMonitor() {
    const insets = useSafeAreaInsets();
    const [fps, setFps] = useState(60);

    const frames = useRef(0);
    const lastTime = useRef(Date.now());
    const rafId = useRef<number | null>(null);

    useEffect(() => {
        const loop = () => {
            frames.current += 1;

            const now = Date.now();
            const elapsed = now - lastTime.current;

            if (elapsed >= 500) {
                setFps(Math.round((frames.current * 1000) / elapsed));
                frames.current = 0;
                lastTime.current = now;
            }

            rafId.current = requestAnimationFrame(loop);
        };

        rafId.current = requestAnimationFrame(loop);

        return () => {
            if (rafId.current !== null) cancelAnimationFrame(rafId.current);
        };
    }, []);

    if (!__DEV__) return null;

    const color = fps >= 55 ? "#22C55E" : fps >= 40 ? "#F59E0B" : "#EF4444";

    return (
        <View pointerEvents="none" style={[styles.badge, { top: insets.top + 6 }]}>
            <Text style={[styles.text, { color }]}>{fps} FPS</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    badge: {
        position: "absolute",
        right: 10,
        zIndex: 999,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
        backgroundColor: "rgba(0,0,0,0.75)",
    },
    text: {
        fontSize: 11,
        fontWeight: "700",
    },
});