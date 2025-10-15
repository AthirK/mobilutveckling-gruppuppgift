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
        paddingHorizontal: 20,
    },
    heroText1: {
        color: 'white',
        fontSize: 30,
        fontWeight: '700',
        lineHeight: 38,
    },
    heroText2: {
        color: 'white',
        fontSize: 20,
        fontWeight: '600',
        lineHeight: 28,
        marginTop: 10,
    },
});