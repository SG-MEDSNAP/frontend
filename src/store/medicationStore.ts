import { create } from 'zustand';
import { MedicationData } from '../api/medication';

interface MedicationStore {
  medications: MedicationData[];
  addMedication: (medication: MedicationData) => void;
  removeMedication: (id: number) => void;
  clearMedications: () => void;
}

export const useMedicationStore = create<MedicationStore>((set) => ({
  medications: [],

  addMedication: (medication) =>
    set((state) => ({
      medications: [...state.medications, medication],
    })),

  removeMedication: (id) =>
    set((state) => ({
      medications: state.medications.filter((med) => med.id !== id),
    })),

  clearMedications: () => set({ medications: [] }),
}));

