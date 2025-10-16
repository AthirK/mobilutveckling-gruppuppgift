export interface MushroomSuggestion {
  id: string; //For second api request
  name: string;
  probability: number;
  imageUri?: string;
  accessToken?: string; //Added for mushroom info screen to fetch detailed info or future use
  commonNames?: string[];
  edibility?: string | null;
  url?: string | null;
  description?: string | null;
  image?: string | null;
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
  isFallbackLocation?: boolean;
}