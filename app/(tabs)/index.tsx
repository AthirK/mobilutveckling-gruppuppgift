import { Hero } from '@/components/hero';
import { LocationDisplay } from '@/components/location/locationDisplay';
import { ReadMoreBtn } from '@/components/read-more-btn';
import { useLocation } from '@/hooks/use-location';
import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { currentLocation, locationLoading, isFallbackLocation } = useLocation();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.homeContainer}>
        <Image
          source={require('@/assets/images/grass4.jpg')}
          style={styles.grassBackground}
        />
        <View style={styles.logoContainer}>

          <Image
            source={require('@/assets/images/fungifind2.png')}
            style={styles.logoImage}
          />
        </View>

        <Hero />

        <View style={styles.contentContainer}>
          <View style={styles.locationWrapper}>
            <LocationDisplay
            locationLoading={locationLoading}
            currentLocation={currentLocation}
            isFallbackLocation={isFallbackLocation}
            style={styles.location}
            />
          </View>
          
          <View style={styles.buttonWrapper}>
            <ReadMoreBtn />
          </View>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
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
  },
  content: {
    flex: 1,
    zIndex: 1,
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
  location: {
    flexDirection: 'row',
    alignContent: 'flex-end',
    fontSize: 18,
    margin: 20,
  },
  contentContainer: {
    flex: 1,
    //flexWrap: 'wrap',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
   // alignContent: 'center',
    gap: 10,
  },
  buttonWrapper: {
    paddingBottom: 25,
  },
  locationWrapper: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 120,
  }
});
