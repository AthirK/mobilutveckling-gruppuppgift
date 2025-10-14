import { useState } from 'react';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import { mushroomApiService } from '@/services/mushroomApiService';
//import { MushroomSuggestion } from '@/types/mushroom.types';
import { useMushroomStore } from '@/stores/useMushroomStore';

export const useMushroomIdentification = () => {
 const [loading, setLoading] = useState(false);
  const setSuggestions = useMushroomStore((state) => state.setSuggestions);
  const setAccessToken = useMushroomStore((state) => state.setAccessToken);
  const clearStore = useMushroomStore((state) => state.clear);

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
  clearStore();
  };

  const suggestions = useMushroomStore((state) => state.suggestions);
  const accessToken = useMushroomStore((state) => state.accessToken);

  return {
    loading,
    suggestions,
    accessToken,
    identifyMushroom,
    clearResults,
  };
};
