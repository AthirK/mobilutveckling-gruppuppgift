// app.config.ts
import { ExpoConfig, ConfigContext } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "mobilutveckling-gruppuppgift",
  slug: "mobilutveckling-gruppuppgift",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "mobilutvecklinggruppuppgift",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  extra: {
    mushroomApiKey: process.env.MUSHROOM_API_KEY, // From .env file
    fallbackLocation: { // From .env file
      latitude: parseFloat(process.env.FALLBACK_LAT),
      longitude: parseFloat(process.env.FALLBACK_LON),
    }
  },
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      backgroundColor: "#E6F4FE",
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png"
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false
  },
  web: {
    output: "static",
    favicon: "./assets/images/favicon.png"
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        "image": "./assets/images/splash-icon.png",
        "imageWidth": 200,
        "resizeMode": "contain",
        "backgroundColor": "#ffffff",
        "dark": {
          "backgroundColor": "#000000"
        }
      }
    ],
    [
      "expo-image-picker",
      {
        "photosPermission": "The app needs access to your photos to identify mushrooms.",
        "cameraPermission": "The app needs access to your camera to take pictures of mushrooms.",
        "microphonePermission": false
      }
    ]
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true
  }
});