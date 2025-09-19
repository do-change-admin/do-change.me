import { prismaClient } from "@/infrastructure";
import { EmailAddress } from "@/value-objects/email-address.vo";
import { ProfileData, UpdateProfilePayload } from "./profile.types";

export class ProfileService {
    constructor(private readonly email: EmailAddress) { }

    profileData = async (): Promise<ProfileData> => {
        const rawEmail = this.email.address()
        let profile = await prismaClient.user.findUnique({
            where: { email: rawEmail },
            include: {
                userPlan: {
                    where: { status: "active" },
                    include: { plan: true, price: true },
                },
            },
        });
        if (!profile) {
            // TODO - насколько вообще норм, что его тут может не быть? обсудить с Максом
            profile = await prismaClient?.user.create({
                data: { email: rawEmail }, include: {
                    userPlan: {
                        where: { status: "active" },
                        include: { plan: true, price: true },
                    },
                },
            })
        }

        const activePlan = profile.userPlan.at(0);


        return {
            bio: profile.bio ?? "",
            email: profile.email,
            firstName: profile.firstName ?? "",
            lastName: profile.lastName ?? "",
            phone: profile.phone ?? "",
            subscription: activePlan
                ? {
                    planName: activePlan.plan.name,
                    planSlug: activePlan.plan.slug,
                    priceSlug: activePlan.price.slug,
                    status: activePlan.status,
                    cancelAtPeriodEnd: activePlan.cancelAtPeriodEnd,
                    currentPeriodEnd: activePlan.currentPeriodEnd,
                    amount: activePlan.price.amount,
                    currency: activePlan.price.currency,
                }
                : null,

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