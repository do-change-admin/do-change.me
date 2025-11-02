import { create } from "zustand";

type VINAnalysisStore = {
    vin: string | null;
    requestVIN: string | null;
    setVIN: (value: string) => void;
    setRequestVIN: (value: string) => void;
}

export const useVINAnalysisState = create<VINAnalysisStore>((set, get) => {
    return {
        vin: null,
        requestVIN: null,
        setVIN: (vin) => {
            set({ vin })
        },
        setRequestVIN: (value) => {
            set({
                requestVIN: value,
                vin: value
            })
        }
    }
})