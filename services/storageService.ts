import AsyncStorage from '@react-native-async-storage/async-storage';
import { MushroomCatch } from '@/types/mushroom.types';

const COLLECTION_KEY = 'mushroomCollection';

export const storageService = {
  async saveToCollection(catchItem: MushroomCatch): Promise<void> {
    try {
      const existingCollection = await AsyncStorage.getItem(COLLECTION_KEY);
      const collection = existingCollection ? JSON.parse(existingCollection) : [];
      collection.push(catchItem);
      await AsyncStorage.setItem(COLLECTION_KEY, JSON.stringify(collection));
    } catch (error) {
      console.log('Error saving to collection:', error);
      throw new Error('Could not save mushroom to collection');
    }
  },

  async getCollection(): Promise<MushroomCatch[]> {
    try {
      const collection = await AsyncStorage.getItem(COLLECTION_KEY);
      return collection ? JSON.parse(collection) : [];
    } catch (error) {
      console.log('Error loading collection:', error);
      return [];
    }
  },

  async removeFromCollection(id: string): Promise<void> {
    try {
      const collection = await this.getCollection();
      const filteredCollection = collection.filter(item => item.id !== id);
      await AsyncStorage.setItem(COLLECTION_KEY, JSON.stringify(filteredCollection));
    } catch (error) {
      console.log('Error removing from collection:', error);
      throw new Error('Could not remove mushroom from collection');
    }
  },

  async clearCollection(): Promise<void> {
    try {
      await AsyncStorage.removeItem(COLLECTION_KEY);
    } catch (error) {
      console.log('Error clearing collection:', error);
      throw new Error('Could not clear collection');
    }
  }
};