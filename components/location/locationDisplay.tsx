import { View, Text, StyleSheet } from 'react-native';

interface LocationDisplayProps {
  locationLoading: boolean;
  currentLocation: { latitude: number; longitude: number } | null;
  isFallbackLocation: boolean;
}

export const LocationDisplay = ({
  locationLoading,
  currentLocation,
  isFallbackLocation
}: LocationDisplayProps) => {
  return (
    <View style={styles.locationContainer}>
      {locationLoading ? (
        <Text style={styles.locationText}>📍 Getting location...</Text>
      ) : currentLocation ? (
        <View style={styles.locationRow}>
          <Text style={styles.locationText}>📍 </Text>
          <Text style={styles.locationText}>
            {isFallbackLocation
              ? 'GPS position not available'
              : `Location: ${currentLocation.latitude.toFixed(4)}, ${currentLocation.longitude.toFixed(4)}`}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  locationContainer: {
    marginTop: 8,
  },
  locationRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
});