import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface TabsProps {
  activeView: 'map' | 'list';
  onViewChange: (view: 'map' | 'list') => void;
  mapCount: number;
  listCount: number;
}

export const Tabs = ({ activeView, onViewChange, mapCount, listCount }: TabsProps) => {
  return (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[styles.tab, activeView === 'map' && styles.activeTab]}
        onPress={() => onViewChange('map')}
      >
        <Text style={[styles.tabText, activeView === 'map' && styles.activeTabText]}>
          Map ({mapCount})
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.tab, activeView === 'list' && styles.activeTab]}
        onPress={() => onViewChange('list')}
      >
        <Text style={[styles.tabText, activeView === 'list' && styles.activeTabText]}>
          List ({listCount})
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    marginTop: 0,
    margin: 16,
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#000',
    fontWeight: '600',
  },
});