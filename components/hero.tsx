import { StyleSheet, Text, View } from "react-native";

export function Hero() {
    return (
        <View style={styles.heroContainer}>
            <Text style={styles.heroText1}>
                Discover fungi
            </Text>
            <Text style={styles.heroText1}>
                with a snap
            </Text>
            <Text style={styles.heroText2}>Identify any mushroom instantly with your camera. Build your collection and track where you found each species.</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    heroContainer: {
        marginTop: 20,
        padding: 8,
        paddingHorizontal: 22,
        alignItems: 'center',
        paddingBottom: 0,
    },
    heroText1: {
        color: 'white',
        fontSize: 33,
        fontWeight: '700',
        lineHeight: 38,
        textShadowColor: '#6a2910ff',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
        textAlign: 'center',
        shadowOpacity: 0.05,
    },
    heroText2: {
        color: 'white',
        fontSize: 20,
        fontWeight: '600',
        lineHeight: 28,
        marginTop: 10,
        textAlign: 'center',
        textShadowColor: '#b25e3dffff',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1,
        shadowOpacity: 0.05,
    },
});