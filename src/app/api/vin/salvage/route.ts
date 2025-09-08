import { prismaClient } from "@/infrastructure";
import { ActionsHistoryService } from "@/services";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const vin = url.searchParams.get("vin");
        if (!vin) {
            return NextResponse.json({ error: "VIN не указан" }, { status: 400 });
        }

        const response = await fetch(`${process.env.SALVAGE_ENDPOINT}/?vin=${vin}`, {
            method: "GET",
            headers: {
                "Referer": "rapidAPI",
                "User-Agent": "rapidAPI",
                "x-rapidapi-host": process.env.SALVAGE_HOST!,
                "x-rapidapi-key": process.env.RAPID_API_KEY!,
            },
        });

        const data = await response.json();
        try {
            await prismaClient.salvageInfo.deleteMany({ where: { vin } })
            await prismaClient.salvageInfo.create({
                data: { salvageWasFound: data, vin }
            })
            ActionsHistoryService.Register({ target: "salvage", payload: { vin, result: data } })
        }
        catch { }

        return NextResponse.json(data, { status: response.status });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
