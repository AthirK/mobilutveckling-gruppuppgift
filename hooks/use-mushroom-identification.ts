// hooks/useMushroomIdentification.ts
import { useState } from 'react';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import { mushroomApiService } from '@/services/mushroomApiService';
import { MushroomSuggestion } from '@/types/mushroom.types';

export const useMushroomIdentification = () => {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<MushroomSuggestion[]>([]);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const identifyMushroom = async (imageUri: string) => {
    setLoading(true);

    try {
      let processedImageUri = imageUri;

      // Native (iOS/Android): copy image to cache
      if (Platform.OS !== 'web') {
        const fileInfo = await FileSystem.getInfoAsync(imageUri);
        if (!fileInfo.exists) {
          console.log('File not found:', imageUri);
          return;
        }

        const extension = imageUri.split('.').pop() || 'jpg';
        const cachePath = FileSystem.cacheDirectory + `upload.${extension}`;
        await FileSystem.copyAsync({ from: imageUri, to: cachePath });

        processedImageUri = cachePath;
      }

      const { suggestions, accessToken } = await mushroomApiService.identifyMushroom(processedImageUri);

      setSuggestions(suggestions);
      setAccessToken(accessToken);
    } catch (error) {
      console.log('Identification error:', error);
      alert('Could not identify the mushroom. Please try again!');
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setSuggestions([]);
    setAccessToken(null);
  };

  return {
    loading,
    suggestions,
    accessToken,
    identifyMushroom,
    clearResults,
  };
};
