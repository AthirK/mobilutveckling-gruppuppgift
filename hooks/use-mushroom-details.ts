import { useEffect, useState } from 'react';
import { MushroomDetailsType } from '@/types/mushroom.types';

export function useMushroomDetails(mushroomId: string) {
  const [details, setDetails] = useState<MushroomDetailsType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!mushroomId) return;

    setLoading(true);
    setError(null);

    fetch(`https://mushroom.kindwise.com/api/v1/mushrooms/${mushroomId}`)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch details: ${response.status}`);
        }
        const data = await response.json();
        setDetails(data);
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [mushroomId]);

  return { details, loading, error };
}
