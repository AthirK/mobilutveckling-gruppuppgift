import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

const FALLBACK_LOCATION = Constants.expoConfig?.extra?.fallbackLocation;

export const useLocation = () => {
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);

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

  const isFallbackLocation = currentLocation?.latitude === FALLBACK_LOCATION?.latitude &&
    currentLocation?.longitude === FALLBACK_LOCATION?.longitude;

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return {
    currentLocation,
    locationLoading,
    isFallbackLocation,
    refetchLocation: getCurrentLocation
  };
};