export interface MushroomSuggestion {
  name: string;
  probability: number;
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