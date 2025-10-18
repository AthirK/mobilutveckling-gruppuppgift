import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity
} from 'react-native';
import { MushroomCatch } from '@/types/mushroom.types';
import { MushroomFindModal } from '@/components/findings/mushroomFindModal';
import { MapFindViewRef } from '@/components/findings/mapFindView';
import { storageService } from '@/services/storageService';
import { useCollection } from '@/hooks/use-collection';


interface ListViewProps {
  mushrooms: MushroomCatch[];
  switchToMap: () => void;
  mapRef: React.RefObject<MapFindViewRef | null>;
}

export const ListView = ({ mushrooms, switchToMap, mapRef }: ListViewProps) => {
  const [selectedMushroom, setSelectedMushroom] = React.useState<MushroomCatch | null>(null);
  const { refreshCollection } = useCollection();
  const sortedMushrooms = [...mushrooms].sort((a, b) => b.timestamp - a.timestamp);


  const handlePinPress = (mushroom: MushroomCatch) => {
    switchToMap();
    setTimeout(() => {
      mapRef.current?.focusOnMushroom(mushroom); // Focus with zoom in on mushroom
    }, 300); // Wait for map to render
  };

  const renderItem = ({ item }: { item: MushroomCatch }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        style={styles.infoTouchable}
        onPress={() => setSelectedMushroom(item)}
      >
        <Image source={{ uri: item.imageUri }} style={styles.thumbnail} />
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.date}>
            {new Date(item.timestamp).toLocaleDateString('sv-SE')} {new Date(item.timestamp).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </TouchableOpacity>

      {!item.isFallbackLocation && (
        <TouchableOpacity onPress={() => handlePinPress(item)} style={styles.pinTouchable}>
          <Text style={styles.gpsIcon}>📍</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={sortedMushrooms}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />

      <MushroomFindModal
        visible={!!selectedMushroom}
        mushroom={selectedMushroom}
        onClose={() => setSelectedMushroom(null)}
        onDelete={async (id) => {
          await storageService.removeFromCollection(id);
          await refreshCollection();
          setSelectedMushroom(null);
        }}
      />
    </View>

  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffffff', paddingBottom: 100},
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  infoTouchable: { flexDirection: 'row', flex: 1, alignItems: 'center' },
  pinTouchable: { padding: 10 },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 6,
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  date: {
    fontSize: 13,
    color: '#999',
  },
  gpsIcon: {
    fontSize: 18,
  },
});