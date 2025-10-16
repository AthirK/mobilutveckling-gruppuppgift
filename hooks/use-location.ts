import { useEffect } from 'react';
import * as Location from 'expo-location';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { useLocationStore } from '@/stores/useLocationStore';

const FALLBACK_LOCATION = Constants.expoConfig?.extra?.fallbackLocation;

export const useLocation = () => {
  const {
    currentLocation,
    locationLoading,
    setLocation,
    setLocationLoading
  } = useLocationStore();

  const isFallbackLocation = currentLocation?.latitude === FALLBACK_LOCATION?.latitude &&
    currentLocation?.longitude === FALLBACK_LOCATION?.longitude;

  useEffect(() => {
    if (Platform.OS === 'web') {
      // Web
      setLocationLoading(true);

      if (!navigator.geolocation) {
        console.warn('Geolocation not supported on web');
        setLocation(FALLBACK_LOCATION);
        setLocationLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationLoading(false);
        },
        (error) => {
          console.log('Web location failed:', error);
          setLocation(FALLBACK_LOCATION);
          setLocationLoading(false);
        },
        {
          timeout: 10000,
          enableHighAccuracy: true
        }
      );

    } else {
      // Native
      let subscription: Location.LocationSubscription;

      (async () => {
        setLocationLoading(true);

        try {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            console.warn('Permission to location was denied');
            setLocation(FALLBACK_LOCATION);
            setLocationLoading(false);
            return;
          }

          // Start watching position
          subscription = await Location.watchPositionAsync(
            {
              accuracy: Location.Accuracy.High,
              timeInterval: 5000,
              distanceInterval: 5,
            },
            (location) => {
              const coords = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              };
              setLocation(coords);
              setLocationLoading(false);
            }
          );
        } catch (error) {
          console.log('Location setup failed:', error);
          setLocation(FALLBACK_LOCATION);
          setLocationLoading(false);
        }
      })();

      // Cleanup on unmount
      return () => {
        if (subscription) {
          subscription.remove();
        }
      };
    }
  }, [setLocation, setLocationLoading]);

  const refetchLocation = async () => {
    if (Platform.OS === 'web') {
      // Web
      setLocationLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationLoading(false);
        },
        (error) => {
          console.log('Web location refetch failed:', error);
          setLocationLoading(false);
        }
      );
    } else {
      // Native refetch - trigger a new position update
      console.log('Manual location refresh on native');
    }
  };

  return {
    currentLocation,
    locationLoading,
    isFallbackLocation,
    refetchLocation
  };
};