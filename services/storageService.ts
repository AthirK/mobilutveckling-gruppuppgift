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
  }
};