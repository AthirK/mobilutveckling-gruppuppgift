export interface MushroomSuggestion {
  name: string;
  probability: number;
  imageUri?: string;
  accessToken?: string; //Added for mushroom info screen to fetch detailed info
}

export interface MushroomCatch {
  id: string;
  name: string;
  imageUri: string;
  location: {
    latitude: number;
    longitude: number;
  };
  timestamp: number;
}