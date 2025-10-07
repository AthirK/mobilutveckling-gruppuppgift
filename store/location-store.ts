import { create } from 'zustand';

type Coordinates = {
  latitude: number;   // how far up or down (north/south)
  longitude: number;  // how far left or right (east/west)
};

type LocationState = {
  location: Coordinates | null;
  setLocation: (coords: Coordinates) => void;
};

export const useLocationStore = create<LocationState>((set) => ({
  location: null,
  setLocation: (coords) => set({ location: coords }),
}));