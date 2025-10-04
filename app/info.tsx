// app/info.tsx
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useNavigation, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';

export default function InfoScreen() {
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const mushroomName = params.mushroomName as string;

  useEffect(() => {
    console.log('Info screen opened for mushroom:', mushroomName);
    console.log('All params:', params);
  }, [mushroomName, params]);

  return (
    <View style={styles.fullScreenContainer}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </Pressable>
        <Text style={styles.title}>About {mushroomName}</Text>
      </View>
      
      <ScrollView style={styles.content}>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60, // Extra padding för status bar
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  }
});