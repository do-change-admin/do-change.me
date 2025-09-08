import { getCurrentUserMail } from "@/services/actions-history"
import { NextRequest, NextResponse } from "next/server"
import { Profile_GET_Response, Profile_PATCH_Payload } from "./models"

export const GET = async () => {
    try {
        const email = await getCurrentUserMail()
        let profile = await prisma?.user.findUnique({ where: { email } })
        if (!profile) {
            // TODO - насколько вообще норм, что его тут может не быть? обсудить с Максом
            profile = await prisma?.user.create({ data: { email } })
        }
        return NextResponse.json<Profile_GET_Response>({
            bio: profile?.bio ?? "",
            email: profile?.email ?? email,
            firstName: profile?.firstName ?? "",
            lastName: profile?.lastName ?? "",
            phone: profile?.phone ?? ""
        })
    }
    catch (e) {
        return NextResponse.json(e, { status: 500 })
    }
}

export const PATCH = async (req: NextRequest) => {
    try {
        const email = await getCurrentUserMail()
        // TODO - сделать zod-валидацию
        const data: Profile_PATCH_Payload = await req.json()
        await prisma?.user.update({
            where: { email },
            data,
        })
        return NextResponse.json({}, { status: 200 })
    } catch (e) {
        return NextResponse.json(e, { status: 500 })
    }
}