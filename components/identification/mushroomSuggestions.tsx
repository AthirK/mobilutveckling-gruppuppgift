import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { MushroomSuggestion } from '@/types/mushroom.types';

interface MushroomSuggestionsProps {
    suggestions: MushroomSuggestion[];
    onAddToCollection: (mushroomName: string) => void;
    imageUri?: string;
    accessToken?: string;
}

export const MushroomSuggestions = ({
    suggestions,
    onAddToCollection,
    imageUri,
    accessToken,
}: MushroomSuggestionsProps) => {
    const router = useRouter();

    if (suggestions.length === 0) return null;

    return (
        <View style={styles.suggestionsContainer}>
            <Text style={styles.suggestionsTitle}>Top Matches:</Text>
            {suggestions.map((mushroom, index) => (
                <View key={index} style={styles.mushroomItem}>
                    <View style={styles.mushroomInfo}>
                        <Text style={styles.mushroomName}>{mushroom.name}</Text>
                        <Text style={styles.mushroomProbability}>
                            {Math.round(mushroom.probability * 100)}%
                        </Text>
                    </View>

                    <View style={styles.iconsContainer}>
                        <Pressable
                            style={styles.infoIcon}
                            onPress={() => router.push({
                                pathname: '/info',
                                params: {
                                    mushroomName: mushroom.name,
                                    showBasket: 'true', // Prop for showing basket icon in info screen
                                    imageUri: imageUri || '', // Prop for image from camera/gallery
                                    accessToken: accessToken || '',
                                }
                            })}
                        >
                            <Text style={styles.infoIconText}>i</Text>
                        </Pressable>
                        <Pressable
                            style={styles.basketIcon}
                            onPress={() => onAddToCollection(mushroom.name)}
                        >
                            <Text style={styles.basketIconText}>🧺</Text>
                        </Pressable>
                    </View>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    suggestionsContainer: {
        marginTop: 20,
    },
    suggestionsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    mushroomItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f5f5f5',
        padding: 16,
        borderRadius: 8,
        marginBottom: 8,
    },
    mushroomInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    mushroomName: {
        fontSize: 16,
        fontWeight: '500',
        flex: 1,
    },
    mushroomProbability: {
        fontSize: 14,
        color: '#666',
        marginRight: 18,
    },
    iconsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    basketIcon: {
        padding: 8,
    },
    basketIconText: {
        fontSize: 18,
    },
    infoIcon: {
        width: 18,
        height: 18,
        borderRadius: 3,
        borderWidth: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        transform: [{ translateY: 1 }],
    },
    infoIconText: {
        color: '#666',
        fontWeight: 'bold',
        fontSize: 12,
    },
});