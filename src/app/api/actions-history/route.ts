import { ActionsHistoryService } from "@/backend/services"
import { NextRequest, NextResponse } from "next/server"

export const GET = async (req: NextRequest) => {
    try {
        const result = await ActionsHistoryService.ShowCurrentHistory()
        return NextResponse.json({ data: result })
    } catch (e) {
        return NextResponse.json(e, { status: 500 })
    }
}