import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file" }, { status: 400 });
        }

        const payload = new FormData();
        payload.append("inputimage", file);
        payload.append("dchannel", "d0");

        const response = await fetch(process.env.VIN_SCANNER_ENDPOINT!, {
            method: "POST",
            headers: {
                "x-rapidapi-key": process.env.RAPID_API_KEY!,
                "x-rapidapi-host": process.env.VIN_SCANNER_HOST!
            },
            body: payload
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
