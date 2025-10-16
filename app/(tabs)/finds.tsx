import { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Tabs } from '@/components/findings/tabs';
import { MapFindView, MapFindViewRef } from '@/components/findings/mapFindView';
import { ListView } from '@/components/findings/listView';
import { useCollectionStore } from '@/stores/useCollectionStore';
import { useCollection } from '@/hooks/use-collection';
import { storageService } from '@/services/storageService';

type ViewMode = 'map' | 'list';

export default function Finds() {
  const { refreshCollection, loading } = useCollection();
  const collection = useCollectionStore((state) => state.collection);
  const [activeView, setActiveView] = useState<ViewMode>('map');
  const insets = useSafeAreaInsets();
  const [menuOpen, setMenuOpen] = useState(false);
  const mapRef = useRef<MapFindViewRef>(null); // ref for position from list to map
  const mushroomsWithGPS = collection.filter((m) => !m.isFallbackLocation);
  const mushroomsForList = collection;

  useEffect(() => {
    refreshCollection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEmptyBasket = () => {
    Alert.alert(
      'Empty basket?',
      'Are you sure you want to remove all fungi finds?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove all',
          style: 'destructive',
          onPress: async () => {
            try {
              await storageService.clearCollection();
              await refreshCollection();
            } catch (error) {
              Alert.alert('Error', 'Could not clear the basket');
              console.log('Error clearing collection:', error);
            }
          },
        },
      ]
    );
  };


  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#666" />
        <Text style={styles.emptyText}>Loading your fungi finds...</Text>
      </SafeAreaView>
    );
  }

  if (collection.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.emptyText}>No mushrooms collected yet</Text>
        <Text style={styles.emptySubtext}>Start by identifying some mushrooms!</Text>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
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
      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + 70 }]}
        onPress={() => setMenuOpen(!menuOpen)}
      >
        <Text style={styles.fabIcon}>☰</Text>
      </TouchableOpacity>

      {menuOpen && (
        <View style={[styles.menu, { bottom: insets.bottom + 130 }]}>
          <TouchableOpacity onPress={handleEmptyBasket} style={styles.menuItem}>
            <Text style={styles.menuItemText}>Empty Basket 🗑️</Text>
          </TouchableOpacity>
          {/* More objects in menu? */}
        </View>
      )}
    </SafeAreaView>
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
  fab: {
    position: 'absolute',
    right: 20,
    backgroundColor: 'white',
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  fabIcon: {
    color: '#873414',
    fontSize: 24,
  },
  menu: {
    position: 'absolute',
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
    zIndex: 11,
    minWidth: 160,
  },
  menuItem: {
    paddingVertical: 8,
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
  },
});