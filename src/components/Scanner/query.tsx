"use client";

import { useMutation } from "@tanstack/react-query";

export const useRecognize = () => {
    return useMutation<{ status: "SUCCESS" | "ERROR"; vin_captured?: string }, Error, Blob>({
        mutationFn: async (file) => {
            const formData = new FormData();
            formData.append("file", file, "frame.jpg");

            const res = await fetch("/api/vin/recognize", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Ошибка распознавания");

            return res.json()
        }
    });
}
