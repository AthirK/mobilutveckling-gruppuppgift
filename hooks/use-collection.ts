import { useState } from 'react';
import { MushroomCatch } from '@/types/mushroom.types';
import { storageService } from '@/services/storageService';

export const useCollection = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

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
      };

      await storageService.saveToCollection(newCatch);

      const locationInfo = isFallbackLocation
        ? ' (GPS not available)'
        : ' (with GPS location)';

      setSuccessMessage(`${mushroomName} added to your basket! 🍄${locationInfo}`);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
    } catch (error) {
      console.log('Error saving mushroom:', error);
      throw new Error('Could not save mushroom to collection');
    }
  };

  return {
    showSuccess,
    successMessage,
    addToCollection
  };
};