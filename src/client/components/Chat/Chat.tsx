"use client";

import { useEffect } from "react";

export const Chat = () => {
    useEffect(() => {
        (window as any).CRISP_WEBSITE_ID = "7e40e337-f165-48b0-9c38-80b64099396f";
        (window as any).$crisp = [];

        (function () {
            const d = document;
            const s = d.createElement("script");
            s.src = "https://client.crisp.chat/l.js";
            s.async = true;
            d.getElementsByTagName("head")[0].appendChild(s);
        })();
    }, []);

    return null;
};
