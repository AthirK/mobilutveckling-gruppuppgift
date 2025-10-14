import { Alert, Linking, StyleSheet, Text, TouchableOpacity } from "react-native";

export function ReadMoreBtn() {

    const handlePress = async () => {
        const url: string = 'https://en.wikipedia.org/wiki/Mushroom';

        const supported: boolean = await Linking.canOpenURL(url);

        if (supported) {
            await Linking.openURL(url);
        } else {
            Alert.alert(`Don't know how to open this URL: ${url}`)
        }
    }

    return (
        <TouchableOpacity style={styles.button} onPress={handlePress}>
            <Text style={styles.buttonText}>Read more about mushrooms</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#b4603eff',
        padding: 12,
        borderRadius: 20,
        alignSelf: 'center',
        paddingHorizontal: 18,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
});