import { View, Text, Pressable, ScrollView, StyleSheet} from 'react-native';
import { useNavigation, useLocalSearchParams } from 'expo-router';

export default function InfoScreen() {
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const mushroomName = params.mushroomName as string;
  const showBasket = params.showBasket === 'true';


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
        <Text style={styles.infoText}>
          Information about {mushroomName}: Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
          Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
          quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
        </Text>
      </ScrollView>

      {/*{showSuccess && (
        <View style={styles.successToast}>
          <Text style={styles.successText}>{successMessage}</Text>
        </View>
      )}*/}
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
    padding: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  basketButton: {
    padding: 12,
    backgroundColor: 'black',
    borderRadius: 8,
    marginLeft: 8,
  },
  basketButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  infoText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  successToast: {
    position: 'absolute',
    bottom: 10,
    left: 20,
    right: 20,
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  successText: {
    color: '#fff',
    fontWeight: '600',
  },
});