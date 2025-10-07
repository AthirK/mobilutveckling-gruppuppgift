import { useEffect, useState } from 'react';
import Constants from 'expo-constants';

export const useMushroomDetails = (accessToken?: string) => {
  const mushroomApiKey = Constants.expoConfig?.extra?.mushroomApiKey;
  const [loading, setLoading] = useState(true);
  const [description, setDescription] = useState<string | null>(null);
  const [wikipediaUrl, setWikipediaUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!accessToken || !mushroomApiKey) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `https://mushroom.kindwise.com/api/v1/identification/${accessToken}?details=description,wikipedia_url&language=en`,
          {
            headers: {
              'Api-Key': mushroomApiKey,
            },
          }
        );

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        setDescription(data.description || null);
        setWikipediaUrl(data.wikipedia_url || null);
      } catch (err) {
        console.error('Error fetching mushroom info:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [accessToken, mushroomApiKey]);

  return { loading, description, wikipediaUrl, error };
};
