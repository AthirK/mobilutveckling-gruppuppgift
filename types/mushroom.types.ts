export interface MushroomSuggestion {
  name: string;
  probability: number;
  imageUri?: string;
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