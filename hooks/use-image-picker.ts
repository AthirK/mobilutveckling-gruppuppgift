import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Alert, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as Crypto from 'expo-crypto';

export const useImagePicker = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageId, setImageId] = useState<string | null>(null);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Need access to photos');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0].uri) {
        await processImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log('Error picking image: ', error);
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Need access to camera');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0].uri) {
        await processImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log('Error taking photo: ', error);
    }
  };

  const processImage = async (uri: string) => {
    const id = Crypto.randomUUID();
    let processedUri = uri;

    if (Platform.OS !== 'web') {
      const extension = uri.split('.').pop() || 'jpg';
      const newUri = FileSystem.documentDirectory + `mushroom-${id}.${extension}`;
      await FileSystem.copyAsync({ from: uri, to: newUri });
      processedUri = newUri;
    }  /*else {
    // Web: Convert to base64 - so page reloads don't lose the image (since we can't save to filesystem)
    const response = await fetch(uri);
    const blob = await response.blob();

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result as string;
      setSelectedImage(base64data);
    };
    reader.readAsDataURL(blob);
    setImageId(id);
    return;
  }*/
    setSelectedImage(processedUri);
    setImageId(id);
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImageId(null);
  };

  return {
    selectedImage,
    imageId,
    pickImage,
    takePhoto,
    clearImage
  };
};