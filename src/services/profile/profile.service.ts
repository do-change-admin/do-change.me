import { prismaClient } from "@/infrastructure";
import { EmailAddress } from "@/value-objects/email-address.vo";
import { ProfileData, UpdateProfilePayload } from "./profile.types";
import { ProvidesFileLink, ProvidesFileUploading } from "@/providers/contracts";
import { v4 } from "uuid";
import { RequestsMeteringService } from "../requests-metering/requests-metering.service";
import { FeatureKey } from "@/value-objects/feature-key.vo";

export class ProfileService {
    constructor(private readonly email: EmailAddress, private readonly fileProvider: ProvidesFileUploading & ProvidesFileLink) { }

    profileData = async (): Promise<ProfileData> => {
        const rawEmail = this.email.address()
        let profile = await prismaClient.user.findUnique({
            where: { email: rawEmail },
            include: {
                userPlan: {
                    where: { status: "active" },
                    include: { plan: { include: { userPlan: true } }, price: true },
                },
            },
        });
        if (!profile) {
            // TODO - насколько вообще норм, что его тут может не быть? обсудить с Максом
            profile = await prismaClient?.user.create({
                data: { email: rawEmail }, include: {
                    userPlan: {
                        where: { status: "active" },
                        include: { plan: { include: { userPlan: true } }, price: true },
                    },
                },
            })
        }

        const activePlan = profile.userPlan.at(0);

        let photoLink: string | null = null
        if (profile.photoFileId) {
            photoLink = await this.fileProvider.obtainDownloadLink(profile.photoFileId)
        }

        let auctionAccessQRLink: string | null = null
        if (profile.auctionAccessQRFileId) {
            auctionAccessQRLink = await this.fileProvider.obtainDownloadLink(profile.auctionAccessQRFileId)
        }

        const service = new RequestsMeteringService(profile.id)
        const usedReports = await service.getUsage(FeatureKey.Report)
        return {
            bio: profile.bio ?? "",
            email: profile.email,
            firstName: profile.firstName ?? "",
            lastName: profile.lastName ?? "",
            phone: profile.phone ?? "",
            auctionAccessNumber: profile.auctionAccessNumber || null,
            address: profile.address || null,
            auctionAccessQRLink,
            zipCode: profile.zipCode || null,
            state: profile.state || null,

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
                    id: String(activePlan.stripeSubscriptionId),
                }
                : null,
            photoLink,
            birthDate: profile.birthDate,
            subscriptionDetails: {
                reportsLeft: (activePlan?.plan.reportsCount ?? 0) - usedReports
            }
        }
    }

    update = async (payload: UpdateProfilePayload) => {
        const rawEmail = this.email.address()
        const { bio, firstName, lastName, phone, birthDate, address, zipCode, state } = payload
        await prismaClient.user.update({
            where: { email: rawEmail },
            data: {
                bio, firstName, lastName, phone, birthDate, address, zipCode, state
            },
        })
    }

    uploadPhoto = async (file: File) => {
        const id = `${v4()}-${file.name}`;
        await this.fileProvider.upload(file, id, file.name)
        await prismaClient.user.update({
            data: { photoFileId: id },
            where: { email: this.email.address() }
        })
    }
}