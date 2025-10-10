import { StyleSheet, Text, View } from "react-native";

export function Hero() {
    return (
        <View style={styles.heroContainer}>
            <Text style={styles.heroText1}>
                Discover fungi with a snap
            </Text>
            <Text style={styles.heroText2}>Identify any mushroom instantly with your camera. Build your collection and track where you found each species.</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    heroContainer: {
        backgroundColor: '#873414',
        padding: 8,
        paddingHorizontal: 20,
    },
    heroText1: {
        color: '#ffffffff',
        fontSize: 25
    },
    heroText2: {
        color: '#ffffffff',
        fontSize: 15
    },
});