import { useLocalSearchParams, useNavigation } from 'expo-router';
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  StyleSheet,
  Linking,
  Alert,
} from 'react-native';

import { useMushroomStore } from '@/stores/useMushroomStore';
import { useCollection } from '@/hooks/use-collection';
import { useLocation } from '@/hooks/use-location';
import { useImagePicker } from '@/hooks/use-image-picker';
import { SuccessToast } from '@/components/ui/successToast';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function InfoScreen() {
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  const { addToCollection, showSuccess, successMessage } = useCollection();
  const { currentLocation, isFallbackLocation } = useLocation();
  const { imageId } = useImagePicker();

  const mushroomId = params?.mushroomId as string;
  const mushroomName = params?.mushroomName as string;
  const showBasket = params?.showBasket === 'true';
  const imageUri = params?.imageUri as string | undefined;

  const { suggestions } = useMushroomStore();
  const mushroom = suggestions.find((s) => s.id === mushroomId);

  const handleAddToCollection = async () => {
    if (!imageUri || !currentLocation) return;

    try {
      await addToCollection(
        mushroomName,
        imageUri,
        currentLocation,
        imageId || '',
        isFallbackLocation
      );
    } catch (error) {
      console.error('Save to collection failed:', error);
      Alert.alert(
        'Error',
        'An error occurred - the mushroom could not be saved. Please try again!'
      );
    }
  };

  const handleOpenWiki = () => {
    if (mushroom?.url) {
      Linking.openURL(mushroom.url);
    }
  };

  if (!mushroom) {
    return (
      <View style={styles.fullScreen}>
        <Text style={{ padding: 20 }}>No mushroom data found. Please try again.</Text>
      </View>
    );
  }

  return (
    <View style={styles.fullScreen}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
      >
        <View style={styles.header}>
          <Text style={styles.title}>About {mushroom.name}</Text>
        </View>

        <Text style={styles.sectionTitle}>Common Names:</Text>
        <Text style={styles.text}>{mushroom.commonNames?.join(', ') || 'No common names available'}</Text>

        <Text style={styles.sectionTitle}>Description:</Text>
        {(mushroom.description || 'No description available')
          .split('\n')
          .map((para, index) => (
            <Text key={index} style={styles.text}>
              {para.trim()}
            </Text>
          ))}

        <Text style={styles.sectionTitle}>Edibility:</Text>
        <Text style={styles.text}>{mushroom.edibility || 'Unknown'}</Text>

        {mushroom.url && (
          <>
            <Text style={styles.sectionTitle}>More Info:</Text>
            <Pressable onPress={handleOpenWiki}>
              <Text style={styles.linkText}>{mushroom.url}</Text>
            </Pressable>
          </>
        )}
        <View style={styles.imageContainer}>
          {mushroom.image && (
            <>
              <Text style={styles.sectionTitle}>Reference Image:</Text>

              <View style={styles.imageWrapper}>
                <Image
                  source={{ uri: mushroom.image }}
                  style={styles.imageApi}
                  resizeMode="cover"
                />
              </View>

            </>
          )}
          {imageUri && (
            <>
              <Text style={styles.sectionTitle}>Your Photo:</Text>
              <Image
                source={{ uri: imageUri }}
                style={styles.imageUser}
                resizeMode="cover"
              />
            </>
          )}
        </View>

      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={[styles.footerButton, styles.footerButtonBack]} onPress={() => navigation.goBack()}>
          <Text style={styles.footerButtonText}>⬅ Go back</Text>
        </Pressable>

        {mushroom.url && (
          <Pressable style={[styles.footerButton, styles.footerButtonWiki]} onPress={handleOpenWiki}>
            <Text style={styles.footerButtonText}>Wikipedia</Text>
          </Pressable>
        )}

        {showBasket && (
          <Pressable
            onPress={handleAddToCollection}
            style={[
              styles.footerButton,
              styles.footerButtonPick,
              showSuccess && styles.footerButtonSuccess,
            ]}
          >
            <Text style={styles.footerButtonText}>Pick 🧺</Text>
          </Pressable>
        )}
      </View>

      <SuccessToast visible={showSuccess} message={successMessage} />
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
  sectionTitle: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
  },
  text: {
    marginTop: 8,
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
  },
  linkText: {
    marginTop: 4,
    fontSize: 14,
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  imageUser: {
    width: 300,
    height: 300,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 8,
  },
  imageWrapper: {
    position: 'relative',
  },
  imageApi: {
    width: 300,
    height: 300,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 60,
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: 28,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  footerButton: {
    padding: 12,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
    flex: 1,
    maxWidth: 95,
  },

  footerButtonBack: {
    backgroundColor: '#4CAF50',
  },

  footerButtonWiki: {
    backgroundColor: '#FFA500',
  },

  footerButtonPick: {
    backgroundColor: '#007AFF',
  },

  footerButtonSuccess: {
    backgroundColor: '#4CAF50',
  },

  footerButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
