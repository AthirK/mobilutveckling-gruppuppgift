import { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

const FALLBACK_LOCATION = Constants.expoConfig?.extra?.fallbackLocation || {
  latitude: 56.8777,
  longitude: 14.8094
};

export default function TabTwoScreen() {
  const mushroomApiKey = Constants.expoConfig?.extra?.mushroomApiKey;
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<MushroomSuggestion[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);

  // Get location on mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    setLocationLoading(true);

    try {
      let coords;

      if (Platform.OS === 'web') {
        // Web - use geolocation API
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          if (!navigator.geolocation) {
            reject(new Error('Geolocation not supported'));
            return;
          }

          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 5000,
            maximumAge: 300000 // Maximum age of 5 minutes
          });
        });
        coords = position.coords;
      } else {
        // Mobile - use expo-location
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
      // Use fallback location
      setCurrentLocation(FALLBACK_LOCATION);
    } finally {
      setLocationLoading(false);
    }
  };

  //Check if using fallback location
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
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0].uri) {
        setSelectedImage(result.assets[0].uri);
        setSuggestions([]);
        identifyMushroom(result.assets[0].uri);
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
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0].uri) {
        setSelectedImage(result.assets[0].uri);
        setSuggestions([]);
        identifyMushroom(result.assets[0].uri);
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
      const response = await fetch(imageUri);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append('images', blob);

      const apiResponse = await fetch('https://mushroom.kindwise.com/api/v1/identification', {
        method: 'POST',
        headers: {
          'Api-Key': mushroomApiKey,
        },
        body: formData,
      });

      if (!apiResponse.ok) throw new Error('API error');

      const data = await apiResponse.json();

      if (data.result?.classification?.suggestions?.length > 0) {
        const mushroomSuggestions = data.result.classification.suggestions.map((suggestion: any) => ({
          name: suggestion.name,
          probability: suggestion.probability,
        }));
        setSuggestions(mushroomSuggestions);
      } else {
        console.log('No mushroom identified');
      }
    } catch (error) {
      console.log('Identification error:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCollection = async (mushroomName: string) => {
    if (!selectedImage) return;

    // Use current location or get it if not available
    let locationToUse = currentLocation;
    if (!locationToUse) {
      await getCurrentLocation();
      locationToUse = currentLocation;
    }

    const newCatch: MushroomCatch = {
      id: Date.now().toString(),
      name: mushroomName,
      imageUri: selectedImage,
      location: locationToUse!, // It cant be null here, due to fallback
      timestamp: Date.now(),
    };

    try {
      const existingCollection = await AsyncStorage.getItem('mushroomCollection');
      const collection = existingCollection ? JSON.parse(existingCollection) : [];

      collection.push(newCatch);
      await AsyncStorage.setItem('mushroomCollection', JSON.stringify(collection));

      // Show success message
      const locationInfo = isFallbackLocation
        ? ' (GPS not available)'
        : ' (with GPS location)';

      setSuccessMessage(`${mushroomName} added to your basket! 🍄${locationInfo}`);
      setShowSuccess(true);

      // Hide after 2 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);

    } catch (error) {
      console.log('Error saving to collection: ', error);
    }
  };

  const resetSelection = () => {
    setSelectedImage(null);
    setSuggestions([]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mushroom Finder</Text>
        <Text style={styles.description}>Identify and collect mushrooms</Text>

        {/* Location status */}
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

      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={takePhoto}>
          <Text style={styles.buttonText}>📸 Camera</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>🖼️ Gallery</Text>
        </Pressable>
      </View>

      {selectedImage && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
          <Pressable style={styles.resetButton} onPress={resetSelection}>
            <Text style={styles.resetButtonText}>New Image</Text>
          </Pressable>
        </View>
      )}

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

      {/* Toast-like success message */}
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
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  locationContainer: {
    marginTop: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 12,
    minWidth: 120,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  selectedImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  resetButton: {
    backgroundColor: '#FF9800',
    padding: 12,
    borderRadius: 8,
  },
  resetButtonText: {
    color: '#fff',
    fontWeight: '600',
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