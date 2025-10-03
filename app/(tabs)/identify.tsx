import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Crypto from 'expo-crypto';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';


interface MushroomSuggestion {
  name: string;
  probability: number;
}

interface MushroomCatch {
  id: string;
  name: string;
  imageUri: string;
  location: {
    latitude: number;
    longitude: number;
  };
  timestamp: number;
}

const FALLBACK_LOCATION = Constants.expoConfig?.extra?.fallbackLocation;

export default function IdentifyAndSave() {
  const mushroomApiKey = Constants.expoConfig?.extra?.mushroomApiKey;
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<MushroomSuggestion[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [imageId, setImageId] = useState<string | null>(null)

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    setLocationLoading(true);
    try {
      let coords;
      if (Platform.OS === 'web') {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          if (!navigator.geolocation) {
            reject(new Error('Geolocation not supported'));
            return;
          }
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 5000,
            maximumAge: 300000
          });
        });
        coords = position.coords;
      } else {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          throw new Error('Location permission denied');
        }
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        coords = location.coords;
      }
      setCurrentLocation({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
    } catch (error) {
      console.log('Location failed (using fallback): ', error);
      setCurrentLocation(FALLBACK_LOCATION);
    } finally {
      setLocationLoading(false);
    }
  };

  const isFallbackLocation = currentLocation?.latitude === FALLBACK_LOCATION.latitude &&
    currentLocation?.longitude === FALLBACK_LOCATION.longitude;

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Need access to photos');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0].uri) {
        const originalUri = result.assets[0].uri;

        // UUID for the image (will be used when saving to collection)
        const id = Crypto.randomUUID();;
         if (Platform.OS !== 'web') {
        // Only copy image to app directory for native platforms, to avoid problem if the image is deleted from gallery
        const extension = originalUri.split('.').pop() || 'jpg';
        const newUri = FileSystem.documentDirectory + `mushroom-${id}.${extension}`;

        await FileSystem.copyAsync({
          from: originalUri,
          to: newUri,
        });

        setSelectedImage(newUri);
      } else {
        // For web / testing
        setSelectedImage(originalUri);
      }
      
      setImageId(id); // Save UUID for all platforms
      setSuggestions([]);
    }
  } catch (error) {
    console.log('Error picking image: ', error);
  }
};

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Need access to camera');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0].uri) {
        const originalUri = result.assets[0].uri;
        const id = Crypto.randomUUID();
        if (Platform.OS !== 'web') {

        const extension = originalUri.split('.').pop() || 'jpg';
        const newUri = FileSystem.documentDirectory + `mushroom-${id}.${extension}`;

        await FileSystem.copyAsync({
          from: originalUri,
          to: newUri,
        });

        setSelectedImage(newUri);
      } else {
        setSelectedImage(originalUri);
      }
      
      setImageId(id);
      setSuggestions([]);
    }
  } catch (error) {
    console.log('Error taking photo: ', error);
  }
};

  const identifyMushroom = async (imageUri: string) => {
    if (!mushroomApiKey) {
      console.log('Problem with API key');
      return;
    }

    setLoading(true);

    try {
      // With method for native - and web for development/testing
      if (Platform.OS === 'web') {
        // For web
        const response = await fetch(imageUri);
        const blob = await response.blob();

        const formData = new FormData();
        formData.append('images', blob, 'photo.jpg');

        const apiResponse = await fetch('https://mushroom.kindwise.com/api/v1/identification', {
          method: 'POST',
          headers: {
            'Api-Key': mushroomApiKey,
          },
          body: formData,
        });

        if (!apiResponse.ok) throw new Error(`API error: ${apiResponse.status}`);

        const data = await apiResponse.json();

        if (data.result?.classification?.suggestions?.length > 0) {
          const mushroomSuggestions = data.result.classification.suggestions.map((s: any) => ({
            name: s.name,
            probability: s.probability,
          }));
          setSuggestions(mushroomSuggestions);
        } else {
          console.log('No mushroom identified');
        }
      } else {
        // For native (iOS/Android)
        const fileInfo = await FileSystem.getInfoAsync(imageUri);
        if (!fileInfo.exists) {
          console.log('File not found:', imageUri);
          return;
        }

        const extension = imageUri.split('.').pop() || 'jpg';
        const cachePath = FileSystem.cacheDirectory + `upload.${extension}`;
        await FileSystem.copyAsync({ from: imageUri, to: cachePath });

        const formData = new FormData();
        formData.append('images', {
          uri: cachePath,
          name: `photo.${extension}`,
          type: extension === 'png' ? 'image/png' : 'image/jpeg',
        } as any);

        const apiResponse = await fetch('https://mushroom.kindwise.com/api/v1/identification', {
          method: 'POST',
          headers: {
            'Api-Key': mushroomApiKey,
          },
          body: formData,
        });

        if (!apiResponse.ok) throw new Error(`API error: ${apiResponse.status}`);

        const data = await apiResponse.json();

        if (data.result?.classification?.suggestions?.length > 0) {
          const mushroomSuggestions = data.result.classification.suggestions.map((s: any) => ({
            name: s.name,
            probability: s.probability,
          }));
          setSuggestions(mushroomSuggestions);
        } else {
          console.log('No mushroom identified');
        }
      }
    } catch (error) {
      console.log('Identification error:', error);
      Alert.alert('Error', 'Could not identify the mushroom.');
    } finally {
      setLoading(false);
    }
  };

  const addToCollection = async (mushroomName: string) => {
  if (!selectedImage) return;

  let locationToUse = currentLocation;
  if (!locationToUse) {
    await getCurrentLocation();
    locationToUse = currentLocation;
  }


  const id = imageId || Crypto.randomUUID();

  try {
    const newCatch: MushroomCatch = {
      id,
      name: mushroomName,
      imageUri: selectedImage,
      location: locationToUse!,
      timestamp: Date.now(),
    };

    const existingCollection = await AsyncStorage.getItem('mushroomCollection');
    const collection = existingCollection ? JSON.parse(existingCollection) : [];

    collection.push(newCatch);
    await AsyncStorage.setItem('mushroomCollection', JSON.stringify(collection));

    const locationInfo = isFallbackLocation
      ? ' (GPS not available)'
      : ' (with GPS location)';

    setSuccessMessage(`${mushroomName} added to your basket! 🍄${locationInfo}`);
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
    }, 2000);
  } catch (error) {
    console.log('Error saving mushroom:', error);
    Alert.alert('Error', 'Could not save mushroom to collection.');
  }
};

  // Placeholder image
  const placeholderImage = require('../../assets/images/placeholder.jpg');

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Identify and collect mushrooms</Text>

        <View style={styles.locationContainer}>
          {locationLoading ? (
            <Text style={styles.locationText}>📍 Getting location...</Text>
          ) : currentLocation ? (
            <Text style={styles.locationText}>
              📍 {isFallbackLocation
                ? 'GPS position not available'
                : `Location: ${currentLocation.latitude.toFixed(4)}, ${currentLocation.longitude.toFixed(4)}`}
            </Text>
          ) : null}
        </View>
      </View>

      <View style={styles.imageContainer}>
        <Image
          source={selectedImage ? { uri: selectedImage } : placeholderImage}
          style={styles.selectedImage}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Pressable style={[styles.button, styles.cameraButton]} onPress={takePhoto}>
          <Text style={styles.buttonText}>📸 Camera</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.galleryButton]} onPress={pickImage}>
          <Text style={styles.buttonText}>🖼️ Gallery</Text>
        </Pressable>
        <Pressable //Disable identify button if loading or no image, and change style for this
          style={({ pressed }) => [
            styles.button,
            styles.identifyButton,
            (loading || !selectedImage) && styles.disabledButton
          ]}
          onPress={() => selectedImage && identifyMushroom(selectedImage)}
          disabled={loading || !selectedImage}
        >
          <Text style={styles.buttonText}>🔍 Identify</Text>
        </Pressable>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text>Identifying...</Text>
        </View>
      )}

      {suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>Top Matches:</Text>
          {suggestions.map((mushroom, index) => (
            <Pressable
              key={index}
              style={styles.mushroomButton}
              onPress={() => addToCollection(mushroom.name)}
            >
              <Text style={styles.mushroomName}>{mushroom.name}</Text>
              <Text style={styles.mushroomProbability}>
                {Math.round(mushroom.probability * 100)}%
              </Text>
              <Text style={styles.basketIcon}>🧺</Text>
            </Pressable>
          ))}
        </View>
      )}

      {showSuccess && (
        <View style={styles.successToast}>
          <Text style={styles.successText}>{successMessage}</Text>
        </View>
      )}
    </ScrollView>
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
  locationContainer: {
    marginTop: 8,
  },
  locationText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  selectedImage: {
    width: 300,
    height: 300,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  button: {
    padding: 12,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
    flex: 1,
    maxWidth: 95,
  },
  cameraButton: {
    backgroundColor: '#4CAF50',
  },
  galleryButton: {
    backgroundColor: '#2196F3',
  },
  identifyButton: {
    backgroundColor: '#FF9800',
  },
  disabledButton: {
    opacity: 0.4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  suggestionsContainer: {
    marginTop: 20,
  },
  suggestionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  mushroomButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  mushroomName: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  mushroomProbability: {
    fontSize: 14,
    color: '#666',
    marginRight: 12,
  },
  basketIcon: {
    fontSize: 18,
  },
  successToast: {
    position: 'absolute',
    bottom: 10,
    left: 20,
    right: 20,
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  successText: {
    color: '#fff',
    fontWeight: '600',
  },
});