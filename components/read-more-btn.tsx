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
            <Text style={styles.buttonText}>Learn More</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#fae9bc',
        padding: 20,
        borderRadius: 20,
        alignSelf: 'center',
        paddingHorizontal: 30,
        marginTop: 16,
        width: 300,
    },
    buttonText: {
        color: '#873414',
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'center',
    },
});