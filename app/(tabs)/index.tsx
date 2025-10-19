import { Hero } from '@/components/hero';
import { ReadMoreBtn } from '@/components/read-more-btn';
import { IdentifyButton, ViewFindsButton } from '@/components/navigate-btns';
import { hasSeedData, seedMushroomCatches } from '@/utils/seedData';
import { Image } from 'expo-image';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function HomeScreen() {
  useEffect(() => {
    initializeSeedData();
  }, []);

  // Add mushroom test data
  const initializeSeedData = async () => {
    try {
      const hasData = await hasSeedData();

      if (!hasData) {
        console.log('No test mushroom catches , creating test catch...');
        await seedMushroomCatches();
        console.log('Test catch created!');
      }
    } catch (error) {
      console.error('Error initializing test catches:', error);
    }
  };


  return (
      <View style={styles.container}>
      {/* Background image outside SafeAreaView to get background on statusBar */}
      <Image
        source={require('@/assets/images/grass4.jpg')}
        style={styles.grassBackground}
      />

      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.homeContainer}>
          <View style={styles.logoContainer}>
            <Image
              source={require('@/assets/images/fungifind2.png')}
              style={styles.logoImage}
            />
          </View>

          <Hero />

          <View style={styles.contentContainer}>
            <View style={styles.locationWrapper}>
              <IdentifyButton />
              <ViewFindsButton />
              <ReadMoreBtn />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    position: 'relative',
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  homeContainer: {
    flex: 1,
    position: 'relative',
  },
  grassBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    zIndex: -1,
  },
  logoContainer: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },

  contentContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    gap: 10,
  },
  locationWrapper: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 120,
  }
});