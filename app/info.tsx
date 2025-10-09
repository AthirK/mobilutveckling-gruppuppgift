import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, Text, View, Alert } from 'react-native';
import { useMushroomStore } from '@/stores/useMushroomStore';
import { useCollection } from '@/hooks/use-collection';
import { useLocation } from '@/hooks/use-location';
import { useImagePicker } from '@/hooks/use-image-picker';

export default function InfoScreen() {
  const navigation = useNavigation();
  const params = useLocalSearchParams();

  const { addToCollection, showSuccess, successMessage } = useCollection();
  const { currentLocation, isFallbackLocation } = useLocation();
  const { imageId } = useImagePicker();

  const mushroomId = params?.mushroomId as string;
  const mushroomName = params?.mushroomName as string;
  const showBasket = params?.showBasket === 'true';
  const imageUri = params?.imageUri as string | undefined;

  const { suggestions } = useMushroomStore();
  const mushroom = suggestions.find((s) => s.id === mushroomId);

  console.log('InfoScreen params:', {
  imageUri,
  imageId,
  mushroomId,
  mushroomName,
});


  const handleAddToCollection = async () => {
    if (!imageUri || !currentLocation) return;

    try {
      await addToCollection(
        mushroomName,
        imageUri,
        currentLocation,
        imageId || '',
        isFallbackLocation
      );
    } catch (error) {
      console.error('Save to collection failed:', error);
      Alert.alert(
        'Error',
        'An error occurred - the mushroom could not be saved. Please try again!'
      );
    }
  };

  if (!mushroom) {
    return (
      <View style={styles.fullScreenContainer}>
        <Text style={{ padding: 20 }}>
          No mushroom data found. Please try again.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.fullScreenContainer}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </Pressable>
        <Text style={styles.title}>About {mushroom.name}</Text>

        {showBasket && (
          <Pressable style={styles.basketButton} onPress={handleAddToCollection}>
            <Text style={styles.basketButtonText}>🧺</Text>
          </Pressable>
        )}
      </View>

      <ScrollView style={styles.content}>
        {/* User Image */}
        {imageUri && (
          <>
            <Text style={styles.sectionTitle}>Your Photo:</Text>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: imageUri }}
                style={styles.image}
                resizeMode="cover"
              />
            </View>
          </>
        )}

        {/* API Image */}
        {mushroom.image && (
          <>
            <Text style={styles.sectionTitle}>Reference Image:</Text>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: mushroom.image }}
                style={styles.image}
                resizeMode="cover"
              />
            </View>
          </>
        )}

        <Text style={styles.sectionTitle}>Common Names:</Text>
        <Text style={styles.text}>
          {mushroom.commonNames?.join(', ') || 'No common names available'}
        </Text>

        <Text style={styles.sectionTitle}>Edibility:</Text>
        <Text style={styles.text}>{mushroom.edibility || 'Unknown'}</Text>

        <Text style={styles.sectionTitle}>Description:</Text>
        <Text style={styles.text}>{mushroom.description || 'No description available'}</Text>

        {mushroom.url && (
          <>
            <Text style={styles.sectionTitle}>More Info:</Text>
            <Text style={[styles.text, { color: 'blue' }]}>{mushroom.url}</Text>
          </>
        )}
      </ScrollView>

      {showSuccess && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{successMessage}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginRight: 32,
  },
  basketButton: {
    backgroundColor: '#000',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  basketButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 8,
  },
  image: {
    width: 180,
    height: 180,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  sectionTitle: {
    marginTop: 16,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#444',
  },
  text: {
    marginTop: 4,
    fontSize: 14,
    color: '#333',
  },
  toast: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  toastText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
