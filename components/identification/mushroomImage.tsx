import { Image, View, StyleSheet, Pressable, Text } from 'react-native';

interface MushroomImageProps {
    imageUri: string | null;
    placeholderImage: any;
    onClearImage?: () => void;
}

export const MushroomImage = ({
    imageUri,
    placeholderImage,
    onClearImage
}: MushroomImageProps) => {
    return (
        <View style={styles.imageContainer}>
            <View style={styles.imageWrapper}>
                <Image
                    source={imageUri ? { uri: imageUri } : placeholderImage}
                    style={styles.selectedImage}
                />
                {imageUri && onClearImage && (
                    <Pressable style={styles.clearButton} onPress={onClearImage}>
                        <Text style={styles.clearButtonText}>✕</Text>
                    </Pressable>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    imageContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    imageWrapper: {
        position: 'relative',
    },
    selectedImage: {
        width: 300,
        height: 300,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    clearButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        width: 24,
        height: 24,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    clearButtonText: {
        fontSize: 12,
        color: '#fff',
    },
});