import { Image } from 'expo-image';
import { Platform, StyleSheet, View } from 'react-native';
import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';
import { LocationDisplay } from '@/components/location/locationDisplay';
import { useLocation } from '@/hooks/use-location';
import { Hero } from '@/components/hero';
import { ReadMoreBtn } from '@/components/read-more-btn';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
const { currentLocation, locationLoading, isFallbackLocation } = useLocation();

  return (
    <SafeAreaView style={styles.safeArea}>
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
         <LocationDisplay
            locationLoading={locationLoading}
            currentLocation={currentLocation}
            isFallbackLocation={isFallbackLocation}
            style={{ fontSize: 18, margin: 20}}
          />
        <ReadMoreBtn />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  // Nytt importerat
   /* logoContainer: {
    height: 100,
    position: 'relative',
    overflow: 'hidden',
    //backgroundColor: '#7cac72ff'
  },*/
  /*grassImage: {
    height: 195, 
    width: '100%',
    position: 'absolute',
    bottom: 0,
    resizeMode: 'cover',
  },*/
 /* logoImage: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    resizeMode: 'contain',
  },*/
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
});
