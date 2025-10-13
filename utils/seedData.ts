import { storageService } from '@/services/storageService';
import { MushroomCatch } from '@/types/mushroom.types';
import { Asset } from 'expo-asset';
import * as Crypto from 'expo-crypto';
import * as FileSystem from 'expo-file-system/legacy';

const SAMPLE_CATCHES = [
  {
    name: 'Imleria badia',
    location: { latitude: 56.8796, longitude: 14.8092 },
    assetPath: require('@/assets/images/mushroom1.jpg'),
  },
  {
    name: 'Leucoagaricus leucothites',
    location: { latitude: 56.8896, longitude: 14.8192 },
    assetPath: require('@/assets/images/mushroom2.jpg'),
  },
  {
    name: 'Boletus reticulatus',
    location: { latitude: 56.8696, longitude: 14.7992 },
    assetPath: require('@/assets/images/mushroom3.jpg'),
  },
  {
    name: 'Russula turci',
    location: { latitude: 56.8596, longitude: 14.8292 },
    assetPath: require('@/assets/images/mushroom4.jpg'),
  },
  {
    name: 'Gyromitra esculenta',
    location: { latitude: 56.8996, longitude: 14.7892 },
    assetPath: require('@/assets/images/mushroom5.jpg'),
  },
];

async function copyAssetToDocuments(assetModule: number): Promise<string> {
  try {
    const asset = Asset.fromModule(assetModule);
    await asset.downloadAsync();

    if (!asset.localUri) {
      throw new Error('Could not load asset');
    }

    const id = Crypto.randomUUID();
    const extension = asset.localUri.split('.').pop() || 'jpg';
    const newUri = `${FileSystem.documentDirectory}mushroom-${id}.${extension}`;

    // Copy to filesystem
    await FileSystem.copyAsync({
      from: asset.localUri,
      to: newUri,
    });

    return newUri;
  } catch (error) {
    console.error('Error copying asset:', error);
    throw error;
  }
}

//Creates data seed for mushroom test data
export async function seedMushroomCatches(): Promise<number> {
  try {
    console.log('Start seeding data...');

    let createdCount = 0;
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    for (let i = 0; i < SAMPLE_CATCHES.length; i++) {
      const sample = SAMPLE_CATCHES[i];

      // Copy image from assets to documents
      console.log(`Copy images ${i + 1}/${SAMPLE_CATCHES.length}...`);
      const imageUri = await copyAssetToDocuments(sample.assetPath);

      const id = Crypto.randomUUID();
      const randomDaysAgo = Math.floor(Math.random() * 7);
      const timestamp = now - (randomDaysAgo * oneDay + Math.random() * oneDay);

      const newCatch: MushroomCatch = {
        id,
        name: sample.name,
        imageUri,
        location: sample.location,
        timestamp,
        isFallbackLocation: false,
      };

      // Save to AsyncStorage via storageService
      await storageService.saveToCollection(newCatch);
      createdCount++;

      console.log(`Created fungi find: ${sample.name}`);
    }

    console.log(`✅ Seed-data ready! Picked ${createdCount} mushrooms.`);
    return createdCount;
  } catch (error) {
    console.error('Error creating seed-data:', error);
    throw error;
  }
}

export async function hasSeedData(): Promise<boolean> {
  try {
    const collection = await storageService.getCollection();
    return collection.length > 0;
  } catch (error) {
    console.error('Error checking seed data:', error);
    return false;
  }
}