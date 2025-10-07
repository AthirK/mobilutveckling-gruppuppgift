import { MushroomSuggestion } from '@/types/mushroom.types';
import Constants from 'expo-constants';

const mushroomApiKey = Constants.expoConfig?.extra?.mushroomApiKey;
const API_URL = 'https://mushroom.kindwise.com/api/v1/identification';

export const mushroomApiService = {
  async identifyMushroom(imageUri: string): Promise<MushroomSuggestion[]> {
    if (!mushroomApiKey) {
      throw new Error('Mushroom API key not configured');
    }

    try {
      const formData = new FormData();
      
      // For web
      if (typeof window !== 'undefined') {
        const response = await fetch(imageUri);
        const blob = await response.blob();
        formData.append('images', blob, 'photo.jpg');
      } 
      
      else {
        // Native (Android/iOS)
        const extension = imageUri.split('.').pop() || 'jpg';
      
        formData.append('images', {
          uri: imageUri,
          name: `photo.${extension}`,
          type: extension === 'png' ? 'image/png' : 'image/jpeg',
        } as any);
      }

      const apiResponse = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Api-Key': mushroomApiKey,
        },
        body: formData,
      });

      if (!apiResponse.ok) {
        throw new Error(`API error: ${apiResponse.status}`);
      }

      const data = await apiResponse.json();

      if (data.result?.classification?.suggestions?.length > 0) {
        return data.result.classification.suggestions.map((s: any) => ({
          name: s.name,
          probability: s.probability,
        }));
      } else {
        throw new Error('No mushroom identified');
      }
    } catch (error) {
      console.log('Identification error:', error);
      throw new Error('Could not identify the mushroom');
    }
  }
};