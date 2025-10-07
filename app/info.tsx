import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MushroomDetails } from '@/components/identification/mushroomDetails';

export default function InfoScreen() {
  const navigation = useNavigation();
  const params = useLocalSearchParams();

  const mushroomName = params?.mushroomName as string;
  const showBasket = params?.showBasket === 'true';
  const imageUri = params?.imageUri as string | undefined;
  const accessToken = params?.accessToken as string | undefined;
  console.log('InfoScreen accessToken:', accessToken);

  return (
    <View style={styles.fullScreenContainer}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </Pressable>
        <Text style={styles.title}>About {mushroomName}</Text>

        {showBasket && (
          <Pressable style={styles.basketButton} onPress={null}>
            <Text style={styles.basketButtonText}>🧺</Text>
          </Pressable>
        )}
      </View>

      <ScrollView style={styles.content}>
        {imageUri && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: imageUri }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        )}

        <MushroomDetails mushroomName={mushroomName} accessToken={accessToken} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginRight: 32, // extra space so title doesn’t get pushed by basket icon
  },
  basketButton: {
    backgroundColor: '#000',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  basketButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 180,
    height: 180,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});




/*{showSuccess && (
        <View style={styles.successToast}>
          <Text style={styles.successText}>{successMessage}</Text>
        </View>
      )}
        
      
        {showBasket && (
          <Pressable style={styles.basketButton} onPress={null}>
            <Text style={styles.basketButtonText}>🧺</Text>
          </Pressable>
        )}


        {imageUri && (
          <View style={styles.imageContainer}>
             <Image
            source={{ uri: imageUri }}
            style={styles.image}
            resizeMode="cover"
          />
          </View>
        )}
      */