import { create } from 'zustand';
import { MushroomCatch } from '@/types/mushroom.types';

interface CollectionStore {
  collection: MushroomCatch[];
  setCollection: (items: MushroomCatch[]) => void;
  addCatch: (newCatch: MushroomCatch) => void;
  removeCatch: (id: string) => void;
}

export const useCollectionStore = create<CollectionStore>((set) => ({
  collection: [],
  setCollection: (items) => set({ collection: items }),

  addCatch: (newCatch) => set((state) => {
    const alreadyExists = state.collection.some(item => item.id === newCatch.id);
    if (alreadyExists) return state;
    return {
      collection: [...state.collection, newCatch]
    };
  }),

  removeCatch: (id) => set((state) => ({
    collection: state.collection.filter((item) => item.id !== id)
  })),
}));