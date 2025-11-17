import { prismaClient } from "@/backend/infrastructure";
import { EmailAddress } from "@/value-objects/email-address.vo";
import { ProfileData, UpdateProfilePayload } from "./profile.types";
import { ProvidesFileLink, ProvidesFileUploading } from "@/backend/providers/contracts";
import { v4 } from "uuid";
import { RequestsMeteringService } from "../requests-metering/requests-metering.service";
import { FeatureKey } from "@/value-objects/feature-key.vo";
import { businessError } from "@/lib-deprecated/errors";

export class ProfileService {
    constructor(
        private readonly email: EmailAddress,
        private readonly fileProvider: ProvidesFileUploading & ProvidesFileLink
    ) { }

    profileData = async (): Promise<ProfileData> => {
        const rawEmail = this.email.address();
        const profile = await prismaClient.user.findUnique({
            where: { email: rawEmail },
            include: {
                userPlan: {
                    where: { status: "active" },
                    include: {
                        plan: { include: { userPlan: true } },
                        price: true,
                    },
                },
            },
        });

        if (!profile) {
            throw businessError("profile was not found", undefined, 404);
        }

        const activePlan = profile.userPlan.at(0);

        let photoLink: string | null = null;
        if (profile.photoFileId) {
            try {
                photoLink = await this.fileProvider.obtainDownloadLink(
                    profile.photoFileId
                );
            } catch {

            }
        }

        let auctionAccessQRLink: string | null = null;
        if (profile.auctionAccessQRFileId) {
            auctionAccessQRLink = await this.fileProvider.obtainDownloadLink(
                profile.auctionAccessQRFileId
            );
        }

        const service = new RequestsMeteringService(profile.id);
        const usedReports = await service.getUsage(FeatureKey.Report);
        return {
            id: profile.id,
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
                    canceledAt: activePlan.canceledAt,
                    currentPeriodEnd: activePlan.currentPeriodEnd,
                    amount: activePlan.price.amount,
                    currency: activePlan.price.currency,
                    id: activePlan.id,
                }
                : null,
            photoLink,
            birthDate: profile.birthDate,
            subscriptionDetails: {
                reportsLeft: (activePlan?.plan.reportsCount ?? 0) - usedReports,
            },
        };
    };

    update = async (payload: UpdateProfilePayload) => {
        const rawEmail = this.email.address();
        const {
            bio,
            firstName,
            lastName,
            phone,
            birthDate,
            address,
            zipCode,
            state,
        } = payload;
        await prismaClient.user.update({
            where: { email: rawEmail },
            data: {
                bio,
                firstName,
                lastName,
                phone,
                birthDate,
                address,
                zipCode,
                state,
            },
        });
    };

    uploadPhoto = async (file: File) => {
        const id = `${v4()}-${file.name}`;
        await this.fileProvider.upload(file, id, file.name);
        await prismaClient.user.update({
            data: { photoFileId: id },
            where: { email: this.email.address() },
        });
    };
}
