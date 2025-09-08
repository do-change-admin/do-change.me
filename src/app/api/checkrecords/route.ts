import { prismaClient } from "@/infrastructure";
import { ActionsHistoryService } from "@/services";
import { NextResponse } from "next/server";
import { Buffer } from "node:buffer";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const vin = searchParams.get("vin") || "1C6RD6FT1CS310366";
    const service = searchParams.get("service") || "carfax";

    const reportsData = await prismaClient.carReport.findFirst({
        where: { vin, source: service === "carfax" ? 'CARFAX' : "AUTOCHECK"},
    })

    if (reportsData) {
        return NextResponse.json({
            type: reportsData.type,
            data: reportsData.data,
        })
    }


    const url = `${process.env.REPORT_ENDPOINT}/${service}/${vin}`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "API-KEY": process.env.REPORT_KEY!,
                "API-SECRET": process.env.REPORT_SECRET!,
            },
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: true, message: `API Error: ${response.status} ${response.statusText}` },
                { status: response.status }
            );
        }

        const contentType = response.headers.get("content-type") || "";
        const text = await response.text();

        // Если это PDF
        if (contentType.includes("application/pdf")) {
            const arrayBuffer = await response.arrayBuffer();
            const base64 = Buffer.from(arrayBuffer).toString("base64");
            try {
                await prismaClient.carReport.deleteMany({
                    where: {
                        vin,
                        source: service === 'carfax' ? 'CARFAX' : 'AUTOCHECK',
                    }
                })
                await prismaClient.carReport.create({
                    data: {
                        data: base64,
                        type: "pdf",
                        generatedAt: new Date(),
                        source: service === 'carfax' ? 'CARFAX' : 'AUTOCHECK',
                        vin
                    }
                })
                ActionsHistoryService.Register({
                    target: "report", payload: {
                        vin, service: service as 'carfax' | 'autocheck', result: {
                            type: "pdf",
                            data: base64,
                        }
                    }
                })
            }
            catch { }
            return NextResponse.json({
                error: false,
                type: "pdf",
                data: base64,
                message: "PDF report received in Base64",
            });
        }

        // Если это Base64 HTML (в текстовом виде)
        try {
            const html = Buffer.from(text, "base64").toString("utf-8");
            try {
                await prismaClient.carReport.deleteMany({
                    where: {
                        vin,
                        source: service === 'carfax' ? 'CARFAX' : 'AUTOCHECK',
                    }
                })
                await prismaClient.carReport.create({
                    data: {
                        data: html,
                        type: "html",
                        generatedAt: new Date(),
                        source: service === 'carfax' ? 'CARFAX' : 'AUTOCHECK',
                        vin
                    }
                })

                ActionsHistoryService.Register({
                    target: "report", payload: {
                        vin, service: service as 'carfax' | 'autocheck', result: {
                            type: "html",
                            data: html,
                        }
                    }
                })
            }
            catch { }
            return NextResponse.json({
                error: false,
                type: "html",
                data: html,
                message: "HTML report decoded from Base64",
            });
        } catch {
            await prismaClient.carReport.deleteMany({
                where: {
                    vin,
                    source: service === 'carfax' ? 'CARFAX' : 'AUTOCHECK',
                }
            })
            await prismaClient.carReport.create({
                data: {
                    data: text,
                    type: "text",
                    generatedAt: new Date(),
                    source: service === 'carfax' ? 'CARFAX' : 'AUTOCHECK',
                    vin
                }
            })

            // Если не Base64, просто возвращаем текст
            ActionsHistoryService.Register({
                target: "report", payload: {
                    vin, service: service as 'carfax' | 'autocheck', result: {
                        type: "text",
                        data: text,
                    }
                }
            })

            return NextResponse.json({
                error: false,
                type: "text",
                data: text,
            });
        }
    } catch (err: any) {
        return NextResponse.json(
            { error: true, message: `Network error: ${err.message}` },
            { status: 500 }
        );
    }
}
