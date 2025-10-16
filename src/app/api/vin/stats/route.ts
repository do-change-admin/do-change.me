import { NextResponse } from "next/server";

export async function GET() {
    try {
        const url = `${process.env.REPORT_ENDPOINT!}/stats`;
        const key = process.env.REPORT_KEY!;

        const response = await fetch(
            url,
            {
                headers: {
                    "X-API-Key": key,
                    "Content-Type": "application/json",
                },
            }
        );
        if (!response.ok) {
            return NextResponse.json(
                { error: `Remote API error: ${response.status}` },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (err: any) {
        return NextResponse.json(
            { error: err.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
