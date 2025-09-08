import { NextRequest, NextResponse } from 'next/server';
import z from 'zod';
import { getBaseData } from './logic';
import { ActionsHistoryService } from '@/services';

const queryParams = z.object({
    vin: z.string().min(17).max(17),
})
export async function GET(
    req: NextRequest
) {
    const { success, data, error } = queryParams.safeParse({ vin: req.nextUrl.searchParams.get('vin') })
    if (!success) {
        return NextResponse.json(error, { status: 400 })
    }
    try {
        const { vin } = data
        const baseData = await getBaseData(vin)
        try {
            if (baseData?.Model) {
                ActionsHistoryService.Register({ target: "base info", payload: { vin, result: baseData } })
            }
        } catch { }
        return NextResponse.json(baseData)
    }

    catch (e) {
        return NextResponse.json(e, { status: 500 })
    }
}
