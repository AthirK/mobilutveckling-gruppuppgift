import Constants from 'expo-constants';
import { Platform } from 'react-native';

const mushroomApiKey = Constants.expoConfig?.extra?.mushroomApiKey;
const IDENTIFICATION_URL = 'https://mushroom.kindwise.com/api/v1/identification';

export const mushroomApiService = {
  async identifyMushroom(imageUri: string): Promise<{
    suggestions: {
      id: string;
      name: string;
      probability: number;
      accessToken: string;
      commonNames?: string[];
      edibility?: string;
      url?: string | null;
      description?: string | null;
      image?: string | null;
    }[];
    accessToken: string;
  }> {
    if (!mushroomApiKey) throw new Error('Mushroom API key not configured');

    console.log('Platform:', Platform.OS);
    console.log('Image URI:', imageUri);

    const formData = new FormData();

    if (Platform.OS === 'web') {
      // Web
      const response = await fetch(imageUri);
      const blob = await response.blob();
      formData.append('images', blob, 'photo.jpg');
    } else {
      // Native
      const filename = imageUri.split('/').pop() || 'photo.jpg';

      // @ts-ignore - React Native FormData format
      formData.append('images', {
        uri: imageUri,
        name: filename,
        type: 'image/jpeg',
      });
    }

    // First request for identification
    console.log('Sending request to API...');
    const response = await fetch(IDENTIFICATION_URL, {
      method: 'POST',
      headers: {
        'Api-Key': mushroomApiKey,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const accessToken = data.access_token;
    const suggestionsRaw = data.result?.classification?.suggestions || [];

    console.log('First request successful');

    // Second request for detailed info
    let detailedResults: any[] = [];
    try {
      const detailsUrl = `${IDENTIFICATION_URL}/${accessToken}?details=common_names,url,description,edibility,image&language=en`;
      const detailsResponse = await fetch(detailsUrl, {
        headers: {
          'Api-Key': mushroomApiKey,
        },
      });

      if (detailsResponse.ok) {
        const detailsData = await detailsResponse.json();
        detailedResults = detailsData.result?.classification?.suggestions || [];
      }
    } catch (error) {
      console.log('Details fetch failed, using basic data', error);
    }

    // Combine basic and detailed info
    const suggestions = suggestionsRaw.map((s: any) => {
      const matchingDetail = detailedResults.find((d: any) => d.id === s.id);

      return {
        id: s.id,
        name: s.name,
        probability: s.probability,
        accessToken,
        commonNames: matchingDetail?.details?.common_names || [],
        edibility: matchingDetail?.details?.edibility || null,
        url: matchingDetail?.details?.url || null,
        description: matchingDetail?.details?.description?.value || null,
        image: matchingDetail?.details?.image?.value || null,
      };
    });

    return { suggestions, accessToken };
  },
};