import { create } from 'zustand';

interface LocationState {
  currentLocation: { latitude: number; longitude: number } | null;
  locationLoading: boolean;
  isFallbackLocation: boolean;
  setLocation: (location: { latitude: number; longitude: number } | null) => void;
  setLocationLoading: (loading: boolean) => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  currentLocation: null,
  locationLoading: false,
  isFallbackLocation: false,

  setLocation: (location) => set({ currentLocation: location }),
  setLocationLoading: (loading) => set({ locationLoading: loading }),
}));