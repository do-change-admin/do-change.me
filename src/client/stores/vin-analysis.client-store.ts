import { create } from "zustand";

type VINAnalysisStore = {
    vin: string | null;
    setVIN: (value: string) => void;
}

export const useVINAnalysisStore = create<VINAnalysisStore>((set) => {
    return {
        vin: null,
        setVIN: (vin) => {
            set({ vin })
        }
    }
})