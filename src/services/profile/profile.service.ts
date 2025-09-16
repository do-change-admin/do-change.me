import { prismaClient } from "@/infrastructure";
import { EmailAddress } from "@/value-objects/email-address.vo";
import { ProfileData, UpdateProfilePayload } from "./profile.types";

export class ProfileService {
    constructor(private readonly email: EmailAddress) { }

    profileData = async (): Promise<ProfileData> => {
        const rawEmail = this.email.address()
        let profile = await prismaClient?.user.findUnique({ where: { email: rawEmail } })
        if (!profile) {
            // TODO - насколько вообще норм, что его тут может не быть? обсудить с Максом
            profile = await prismaClient?.user.create({ data: { email: rawEmail } })
        }
        return {
            bio: profile.bio ?? "",
            email: profile.email,
            firstName: profile.firstName ?? "",
            lastName: profile.lastName ?? "",
            phone: profile.phone ?? ""
        }
    }

    update = async (payload: UpdateProfilePayload) => {
        const rawEmail = this.email.address()
        const { bio, firstName, lastName, phone } = payload
        await prismaClient.user.update({
            where: { email: rawEmail },
            data: { bio, firstName, lastName, phone },
        })

    }
}