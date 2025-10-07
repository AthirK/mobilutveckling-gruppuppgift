import { useEffect } from 'react';
import * as Location from 'expo-location';
import { useLocationStore } from '../store/location-store';

export function useGetLocation() {
  const setLocation = useLocationStore((state) => state.setLocation);

  useEffect(() => {
    let subscription: Location.LocationSubscription;

    (async () => {
      // Request permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Permission to access location was denied');
        return;
      }

      // Start watching position
      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // update every 5 seconds
          distanceInterval: 5, // or every 5 meters
        },
        (location) => {
          const coords = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          };
          setLocation(coords);
        }
      );
    })();

    // Cleanup on unmount
    return () => {
      subscription?.remove();
    };
  }, [setLocation]);
}
