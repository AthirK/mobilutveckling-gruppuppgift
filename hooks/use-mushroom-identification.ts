import { MushroomSuggestion } from '@/types/mushroom.types';
import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system/legacy';
import { useState } from 'react';
import { Platform } from 'react-native';

const mushroomApiKey = Constants.expoConfig?.extra?.mushroomApiKey;

export const useMushroomIdentification = () => {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<MushroomSuggestion[]>([]);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const identifyMushroom = async (imageUri: string) => {
    if (!mushroomApiKey) {
      console.log('Problem with API key');
      return;
    }

    setLoading(true);

    try {
      if (Platform.OS === 'web') {
        // For web
        const response = await fetch(imageUri);
        const blob = await response.blob();

        const formData = new FormData();
        formData.append('images', blob, 'photo.jpg');

        const apiResponse = await fetch('https://mushroom.kindwise.com/api/v1/identification', {
          method: 'POST',
          headers: {
            'Api-Key': mushroomApiKey,
          },
          body: formData,
        });

        if (!apiResponse.ok) throw new Error(`API error: ${apiResponse.status}`);

        const data = await apiResponse.json();

        if (data.access_token) {
          setAccessToken(data.access_token);
          console.log('New accesstoken', accessToken);
        }

        if (data.result?.classification?.suggestions?.length > 0) {
          const mushroomSuggestions = data.result.classification.suggestions.map((s: any) => ({
            name: s.name,
            probability: s.probability,
          }));
          setSuggestions(mushroomSuggestions);
        } else {
          console.log('No mushroom identified');
        }
      } else {
        // For native (iOS/Android)
        const fileInfo = await FileSystem.getInfoAsync(imageUri);
        if (!fileInfo.exists) {
          console.log('File not found:', imageUri);
          return;
        }

        const extension = imageUri.split('.').pop() || 'jpg';
        const cachePath = FileSystem.cacheDirectory + `upload.${extension}`;
        await FileSystem.copyAsync({ from: imageUri, to: cachePath });

        const formData = new FormData();
        formData.append('images', {
          uri: cachePath,
          name: `photo.${extension}`,
          type: extension === 'png' ? 'image/png' : 'image/jpeg',
        } as any);

        const apiResponse = await fetch('https://mushroom.kindwise.com/api/v1/identification', {
          method: 'POST',
          headers: {
            'Api-Key': mushroomApiKey,
          },
          body: formData,
        });

        if (!apiResponse.ok) throw new Error(`API error: ${apiResponse.status}`);

        const data = await apiResponse.json();

          if (data.access_token) {
        setAccessToken(data.access_token);
      }

        if (data.result?.classification?.suggestions?.length > 0) {
          const mushroomSuggestions = data.result.classification.suggestions.map((s: any) => ({
            name: s.name,
            probability: s.probability,
          }));
          setSuggestions(mushroomSuggestions);
        } else {
          console.log('No mushroom identified');
        }
      }
    } catch (error) {
      console.log('Identification error:', error);
      alert('Could not identify the mushroom. Please try again!');
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setSuggestions([]);
  };

  return {
    loading,
    suggestions,
    accessToken,
    identifyMushroom,
    clearResults
  };
};