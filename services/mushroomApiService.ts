import Constants from 'expo-constants';

const mushroomApiKey = Constants.expoConfig?.extra?.mushroomApiKey;
const API_URL = 'https://mushroom.kindwise.com/api/v1/identification';

export const mushroomApiService = {
  async identifyMushroom(imageUri: string): Promise<{
    suggestions: {
      id: string;
      name: string;
      probability: number;
      accessToken: string;
    }[];
    accessToken: string;
  }> {
    if (!mushroomApiKey) {
      throw new Error('Mushroom API key not configured');
    }

    const formData = new FormData();

    if (typeof window !== 'undefined') {
      // Web
      const response = await fetch(imageUri);
      const blob = await response.blob();
      formData.append('images', blob, 'photo.jpg');
    } else {
      // Native
      const extension = imageUri.split('.').pop() || 'jpg';
      formData.append('images', {
        uri: imageUri,
        name: `photo.${extension}`,
        type: extension === 'png' ? 'image/png' : 'image/jpeg',
      } as any);
    }

    const response = await fetch(API_URL, {
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

    const suggestions = (data.result?.classification?.suggestions || []).map((s: any) => ({
      id: s.id,
      name: s.name,
      probability: s.probability,
      accessToken,
    }));

    return { suggestions, accessToken };
  },

  async getMushroomDetails(id: string): Promise<any> {
    if (!mushroomApiKey) {
      throw new Error('Mushroom API key not configured');
    }

    if (!id) {
      throw new Error('Mushroom ID is required');
    }

    const url = `https://mushroom.kindwise.com/api/v1/identification/${id}?details=description,wikipedia_url&language=en`;

    const response = await fetch(url, {
      headers: {
        'Api-Key': mushroomApiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    return data.result;
  }
};