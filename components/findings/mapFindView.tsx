import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { MushroomCatch } from '@/types/mushroom.types';
import { MushroomFindModal } from '@/components/findings/mushroomFindModal';
import { storageService } from '@/services/storageService';
import { useCollection } from '@/hooks/use-collection';


interface MapFindViewProps {
  mushrooms: MushroomCatch[];
  loading?: boolean; // For fixing initial render issue with map
}

export interface MapFindViewRef {
  focusOnMushroom: (mushroom: MushroomCatch) => void;
}

export const MapFindView = forwardRef<MapFindViewRef, MapFindViewProps>(({ mushrooms, loading = false }, ref) => {
  const [selectedMushroom, setSelectedMushroom] = useState<MushroomCatch | null>(null);
  const mapRef = useRef<MapView>(null);
  const { refreshCollection } = useCollection();

  const handleMarkerPress = (mushroom: MushroomCatch) => {
    setSelectedMushroom(mushroom);
  };

  const handleCloseModal = () => {
    setSelectedMushroom(null);
  };

  // Make method availabe to parent component
  useImperativeHandle(ref, () => ({
    focusOnMushroom(mushroom: MushroomCatch) {
      if (!mushroom?.location || !mapRef.current) return;

      mapRef.current.animateToRegion({
        latitude: mushroom.location.latitude,
        longitude: mushroom.location.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }, 500);
    },
  }));

  if (loading) {
    return (
      <View style={styles.emptyContainer}>
        <Text>Loading map...</Text>
      </View>
    );
  }

  if (mushrooms.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text>No mushrooms with GPS-position</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={getInitialRegion(mushrooms)}
        showsUserLocation
      >
        {mushrooms.map((mushroom) => (
          <Marker
            key={mushroom.id}
            coordinate={mushroom.location}
            onPress={() => handleMarkerPress(mushroom)}
          >
            <View pointerEvents="none" style={styles.marker}>
              <Text style={styles.markerText}>📍</Text>
            </View>
          </Marker>
        ))}
      </MapView>

      <MushroomFindModal
        visible={!!selectedMushroom}
        mushroom={selectedMushroom}
        onClose={handleCloseModal}
        onDelete={async (id) => {
          await storageService.removeFromCollection(id);
          await refreshCollection();
          handleCloseModal();
        }}
      />
    </View>

  );
});

MapFindView.displayName = 'MapFindView';

const getInitialRegion = (mushrooms: MushroomCatch[]): Region => {
  const firstMushroom = mushrooms[0];
  return {
    latitude: firstMushroom.location.latitude,
    longitude: firstMushroom.location.longitude,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  marker: { padding: 5 },
  markerText: {
    fontSize: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MapFindView;