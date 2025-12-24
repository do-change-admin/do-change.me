import { useMutation } from "@tanstack/react-query";

interface RemoveBgResponse {
    result_url: string;
    [key: string]: any;
}

interface RemoveBgRequest {
    url: string;
}

export function useRemoveBg() {

    return useMutation({
        mutationFn: async (params: RemoveBgRequest): Promise<{image: string}> => {
            console.log("params:::", params)
            const res = await fetch("/api/remove-bg", {
                method: "POST",
                body: JSON.stringify({ url: "https://aarp.widen.net/content/tymnmju41f/jpeg/AP24327632706324.jpg?crop=true&anchor=8,122&q=80&color=ffffffff&u=k2e9ec&w=2032&h=1168" }),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`RemoveBg API error: ${text}`);
            }

            // Так как бэкенд возвращает строку с Base64
            const base64Image = await res.json();
            console.log("base64Image", base64Image.image);

            return base64Image.image;
        },
    });
}
