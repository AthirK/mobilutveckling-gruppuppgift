import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useMushroomDetails } from '@/hooks/use-mushroom-details';

interface MushroomDetailsProps {
  mushroomId: string;
}

export function MushroomDetails({ mushroomId }: MushroomDetailsProps) {
  const { details, loading, error } = useMushroomDetails(mushroomId);

  if (loading) return <ActivityIndicator />;
  if (error) return <Text>Error: {error.message}</Text>;
  if (!details) return <Text>No details found.</Text>;

  return (
    <View>
      <Text>Name: {details.name}</Text>
      <Text>Description: {details.description}</Text>
    </View>
  );
}
