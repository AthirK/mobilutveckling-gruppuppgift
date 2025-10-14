import { StyleSheet, Text, TextStyle, View } from 'react-native';

interface LocationDisplayProps {
  locationLoading: boolean;
  currentLocation: { latitude: number; longitude: number } | null;
  isFallbackLocation: boolean;
  style?: TextStyle;
}

export const LocationDisplay = ({
  locationLoading,
  currentLocation,
  isFallbackLocation,
  style
}: LocationDisplayProps) => {
  return (
    <View style={styles.locationContainer}>
      {locationLoading ? (
        <Text style={[styles.locationText, style]}>📍 Getting location...</Text>
      ) : currentLocation ? (
        <View style={styles.locationColumn}>
          <Text style={[styles.locationText, style]}>📍</Text>
          <Text style={[styles.locationText, style]}>
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
  locationColumn: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7eebaa4',
    borderColor: '#944504ab',
    borderWidth: 2,
    borderRadius: 20,
    maxWidth: '100%',
    padding: 8,
    alignSelf: 'center',
  },
  locationText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
});
