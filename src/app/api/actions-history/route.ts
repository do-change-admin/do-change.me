import { ActionsHistoryService } from "@/services"
import { PaginationSchema } from "@/schemas"
import { NextRequest, NextResponse } from "next/server"

export const GET = async (req: NextRequest) => {
    const rawData = { skip: req.nextUrl.searchParams.get('skip'), take: req.nextUrl.searchParams.get('take') }
    const { success, data, error } = PaginationSchema.safeParse(rawData)
    if (!success) {
        return NextResponse.json(error, { status: 400 })
    }
    try {
        const result = await ActionsHistoryService.ShowCurrentHistory(data)
        return NextResponse.json({ data: result })
    } catch (e) {
        return NextResponse.json(e, { status: 500 })
    }
}