import { View, Text, StyleSheet, ActivityIndicator, Linking } from 'react-native';
import { useMushroomDetails } from '@/hooks/use-mushroom-details';

interface MushroomDetailsProps {
  mushroomName: string;
  accessToken?: string;
}

export const MushroomDetails = ({ mushroomName, accessToken }: MushroomDetailsProps) => {
  const { loading, description, wikipediaUrl, error } = useMushroomDetails(accessToken);


  console.log('MushroomDetails props:', mushroomName, accessToken);

  if (loading) {
    return <ActivityIndicator size="small" color="#666" />;
  }

  if (error) {
    return <Text style={styles.error}>Could not load details. Try again later.</Text>;
  }

  return (
    <View style={styles.container}>
      {description ? (
        <Text style={styles.description}>{description}</Text>
      ) : (
        <Text style={styles.noDescription}>No description found.</Text>
      )}

      {wikipediaUrl && (
        <Text
          style={styles.link}
          onPress={() => Linking.openURL(wikipediaUrl)}
        >
          View on Wikipedia ↗
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  noDescription: {
    fontSize: 14,
    color: '#999',
  },
  link: {
    marginTop: 12,
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  error: {
    color: 'red',
    fontSize: 14,
  },
});
