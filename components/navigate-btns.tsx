import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

export function IdentifyButton() {
    const handlePress = () => {
        router.push('/(tabs)/identify');
    };

    return (
        <TouchableOpacity style={styles.identifyButton} onPress={handlePress}>
            <Text style={styles.identifyButtonText}>Snap to Identify</Text>
        </TouchableOpacity>
    );
}

export function ViewFindsButton() {
    const handlePress = () => {
        // Navigate to finds tab
        router.push('/(tabs)/finds');
    };

    return (
        <TouchableOpacity style={styles.findsButton} onPress={handlePress}>
            <Text style={styles.findsButtonText}>📍 My Collection</Text>
        </TouchableOpacity>
    );
}

// Combined component if you want both buttons together
export function HeroButtons() {
    return (
        <View style={styles.buttonContainer}>
            <IdentifyButton />
            <ViewFindsButton />
        </View>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        alignItems: 'center',
        gap: 10,
        marginTop: 0,
    },
    identifyButton: {
        backgroundColor: '#873414',
        padding: 20,
        borderRadius: 20,
        alignItems: 'center',
        width: 300,
    },
    identifyButtonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: '600',
    },
    findsButton: {
        backgroundColor: '#873414',
        padding: 20,
        borderRadius: 20,
        alignItems: 'center',
        marginTop: 16,
        width: 300,
    },
    findsButtonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: '600',
    },
});