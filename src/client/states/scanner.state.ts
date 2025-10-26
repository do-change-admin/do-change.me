import { create } from 'zustand'

type ScannerStore = {
    open: boolean;
    result: string | null;
    start: () => void;
    stop: () => void;
    setResult: (result: string | null) => void;
}

export const useScannerState = create<ScannerStore>((set) => {
    return {
        open: false,
        result: null,
        setResult: (result) => {
            set({ result })
        },
        start: () => {
            set({ open: true, result: null })
        },
        stop: () => {
            set({ open: false })
        }
    }
})