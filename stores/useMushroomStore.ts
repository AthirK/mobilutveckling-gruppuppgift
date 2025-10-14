import {create} from 'zustand';
import { MushroomSuggestion } from '@/types/mushroom.types';

interface MushroomStore {
  suggestions: MushroomSuggestion[];
  accessToken: string | null;
  setSuggestions: (suggestions: MushroomSuggestion[]) => void;
  setAccessToken: (token: string | null) => void;
  clear: () => void;
}

export const useMushroomStore = create<MushroomStore>((set) => ({
  suggestions: [],
  accessToken: null,
  setSuggestions: (suggestions) => set({ suggestions }),
  setAccessToken: (accessToken) => set({ accessToken }),
  clear: () => set({ suggestions: [], accessToken: null }),
}));
