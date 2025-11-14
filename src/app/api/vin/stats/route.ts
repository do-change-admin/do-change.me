import { DIContainer } from "@/backend/di-containers";
import { ErrorFactory } from "@/value-objects/errors.value-object";
import { NextResponse } from "next/server";

const errorFactory = ErrorFactory.forController("vin / stats");

export async function GET() {
    try {
        const url = `${process.env.REPORT_ENDPOINT!}/stats`;
        const key = process.env.REPORT_KEY!;

        const response = await fetch(url, {
            headers: {
                "X-API-Key": key,
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            return NextResponse.json(
                { error: `Remote API error: ${response.status}` },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (err: any) {
        const loggerProvider = DIContainer().LoggerProvider();

        const newError = errorFactory.inMethod("GET").newError(
            {
                error: "Could not obtain stats",
                statusCode: 500,
            },
            err
        );

        loggerProvider.error(newError);

        return NextResponse.json(
            { error: err.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
