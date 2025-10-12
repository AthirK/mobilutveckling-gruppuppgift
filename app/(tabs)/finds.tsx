import { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Tabs } from '@/components/findings/tabs';
import { MapFindView, MapFindViewRef } from '@/components/findings/mapFindView';
import { ListView } from '@/components/findings/listView';
import { useCollectionStore } from '@/stores/useCollectionStore';
import { useCollection } from '@/hooks/use-collection';

type ViewMode = 'map' | 'list';

export default function Finds() {
  const { refreshCollection, loading } = useCollection();
  const collection = useCollectionStore((state) => state.collection);
  const [activeView, setActiveView] = useState<ViewMode>('map');
  const insets = useSafeAreaInsets();

  const mapRef = useRef<MapFindViewRef>(null); // ref for position from list to map
  const mushroomsWithGPS = collection.filter((m) => !m.isFallbackLocation);
  const mushroomsForList = collection;

  useEffect(() => {
    refreshCollection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#666" />
        <Text style={styles.emptyText}>Loading your fungi finds...</Text>
      </View>
    );
  }

  if (collection.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No mushrooms collected yet</Text>
        <Text style={styles.emptySubtext}>Start by identifying some mushrooms!</Text>
      </View>
    );
  }
  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <Tabs
        activeView={activeView}
        onViewChange={setActiveView}
        mapCount={mushroomsWithGPS.length}
        listCount={mushroomsForList.length}
      />

      {activeView === 'map' ? (
        <MapFindView ref={mapRef} mushrooms={mushroomsWithGPS} loading={loading} />
      ) : (
        <ListView
          mushrooms={mushroomsForList}
          switchToMap={() => setActiveView('map')}
          mapRef={mapRef}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 100,
    color: '#666',
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    color: '#999',
  },
});