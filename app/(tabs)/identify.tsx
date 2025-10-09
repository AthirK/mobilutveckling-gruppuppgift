import { IdentificationResults } from '@/components/identification/identificationResults';
import { ImagePicker } from '@/components/identification/imagePicker';
import { MushroomImage } from '@/components/identification/mushroomImage';
import { MushroomSuggestions } from '@/components/identification/mushroomSuggestions';
import { LocationDisplay } from '@/components/location/locationDisplay';
import { SuccessToast } from '@/components/ui/successToast';
import { useCollection } from '@/hooks/use-collection';
import { useImagePicker } from '@/hooks/use-image-picker';
import { useLocation } from '@/hooks/use-location';
import { useMushroomIdentification } from '@/hooks/use-mushroom-identification';
import { useMushroomStore } from '@/stores/useMushroomStore';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';


const placeholderImage = require('../../assets/images/placeholder.jpg');

export default function IdentifyAndSave() {
  const { currentLocation, locationLoading, isFallbackLocation } = useLocation();
  const { selectedImage, imageId, pickImage, takePhoto, clearImage } = useImagePicker();
   const { loading, identifyMushroom, clearResults } = useMushroomIdentification();
  const { showSuccess, successMessage, addToCollection } = useCollection();

  const suggestions = useMushroomStore((state) => state.suggestions);

  const handlePickImage = async () => {
    await pickImage();
    clearResults();
  };

  const handleTakePhoto = async () => {
    await takePhoto();
    clearResults();
  };

  const handleClearImage = () => {
    clearImage();
    clearResults();
  };

  const handleIdentify = async () => {
    if (selectedImage) {
      await identifyMushroom(selectedImage);
    }
  };

  const handleAddToCollection = async (mushroomName: string) => {
    if (!selectedImage || !currentLocation) return;

    try {
      await addToCollection(mushroomName, selectedImage, currentLocation, imageId || '', isFallbackLocation);
    } catch (error) {
      console.error('Save to collection failed:', error);
      Alert.alert('An error occurred - the mushroom could not be saved to your collection. Please try again!');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Identify and collect mushrooms</Text>
          <LocationDisplay
            locationLoading={locationLoading}
            currentLocation={currentLocation}
            isFallbackLocation={isFallbackLocation}
          />
        </View>

        <MushroomImage
          imageUri={selectedImage}
          placeholderImage={placeholderImage}
          onClearImage={handleClearImage}
        />

        <ImagePicker
          onTakePhoto={handleTakePhoto}
          onPickImage={handlePickImage}
          onIdentify={handleIdentify}
          loading={loading}
          hasImage={!!selectedImage}
        />

        <IdentificationResults loading={loading}>
          <MushroomSuggestions
            suggestions={suggestions}
            onAddToCollection={handleAddToCollection}
              imageUri={selectedImage ?? undefined}
          />
        </IdentificationResults>
      </ScrollView>

      <SuccessToast
        visible={showSuccess}
        message={successMessage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
});