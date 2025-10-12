import { useState, useEffect } from 'react';
import { MushroomCatch } from '@/types/mushroom.types';
import { storageService } from '@/services/storageService';
import { useCollectionStore } from '@/stores/useCollectionStore';

export const useCollection = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const { setCollection, collection } = useCollectionStore();

  useEffect(() => {
    loadCollection();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadCollection = async () => {
    try {
      const storedCollection = await storageService.getCollection();
      setCollection(storedCollection);
    } catch (error) {
      console.error('Error loading collection:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCollection = async (
    mushroomName: string,
    imageUri: string,
    location: { latitude: number; longitude: number },
    imageId: string,
    isFallbackLocation: boolean
  ) => {
    if (!imageUri) return;

    try {
      const newCatch: MushroomCatch = {
        id: imageId,
        name: mushroomName,
        imageUri,
        location,
        timestamp: Date.now(),
        isFallbackLocation,
      };

      await storageService.saveToCollection(newCatch);
      await loadCollection();

      const locationInfo = isFallbackLocation
        ? ' (GPS not available)'
        : ' (with GPS location)';

      setSuccessMessage(`${mushroomName} added to your basket! 🍄${locationInfo}`);
      setShowSuccess(true);

      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.log('Error saving mushroom:', error);
      throw new Error('Could not save mushroom to collection');
    }
  };

  return {
    showSuccess,
    successMessage,
    addToCollection,
    collection,
    loading,
    refreshCollection: loadCollection,
  };
};