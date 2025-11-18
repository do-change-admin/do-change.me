import { UpdateAuctionAccessRequest } from "./types";
import { prismaClient } from "@/backend/infrastructure";
import { ProfileService } from "../../profile";
import { EmailAddress } from "@/value-objects/email-address.vo";
import { businessError } from "@/lib-deprecated/errors";
import { ProvidesFileUploading, ProvidesFileLink } from "@/backend/providers/contracts";
import { v4 } from "uuid";

export class AuctionAccessRequestsUserService {
    public constructor(
        private readonly fileUploader: ProvidesFileUploading & ProvidesFileLink
    ) { }

    create = async (id: string, rawEmail: string) => {
        const email = EmailAddress.create(rawEmail);
        const profileService = new ProfileService(id, this.fileUploader);
        const profileData = await profileService.profileData();

        await prismaClient.auctionAccessRequest.create({
            data: {
                applicationDate: new Date(),
                email: email.address(),
                firstName: profileData.firstName,
                birthDate: profileData.birthDate!,
                lastName: profileData.lastName,
                status: "review",
                photoLink: profileData.photoLink!,
                bio: profileData.bio,
            },
        });
    };

    update = async (payload: UpdateAuctionAccessRequest) => {
        const foundRequest = await prismaClient.auctionAccessRequest.findFirst({
            where: { email: payload.userMail },
        });
        if (!foundRequest) {
            throw businessError("No according request was found");
        }

        if (
            ![
                "awaiting documents upload",
                "awaiting user confirmation",
            ].includes(foundRequest.status)
        ) {
            throw businessError("Request is in admin awaiting status");
        }

        if (
            foundRequest.status === "awaiting user confirmation" &&
            !payload.selectedTimeSlotId
        ) {
            throw businessError("No time slot was selected");
        }

        await prismaClient.auctionAccessRequest.updateMany({
            // TODO - make email unique
            where: { email: payload.userMail },
            data: {
                activeSlotId: payload.selectedTimeSlotId ?? undefined,
                status:
                    foundRequest.status === "awaiting documents upload"
                        ? "documents under review"
                        : "call scheduling",
            },
        });
    };

    uploadFiles = async (
        agreement: File,
        driversLicense: File,
        auctionAccessNumber: string,
        email: string
    ) => {
        const request = await prismaClient.auctionAccessRequest.findFirst({
            where: { email },
        });

        if (!request) {
            throw businessError(
                "No according request was found",
                "BUSINESS_ERROR",
                404
            );
        }

        const agreementId = `${v4()}-${agreement.name}`;
        const driverLicenseId = `${v4()}-${driversLicense.name}`;

        await this.fileUploader.upload(agreement, agreementId, agreement.name);
        await this.fileUploader.upload(
            driversLicense,
            driverLicenseId,
            driversLicense.name
        );

        await prismaClient.auctionAccessRequest.update({
            where: { id: request.id },
            data: {
                auctionAccessNumber,
                driverLicenceFileId: driverLicenseId,
                agreementFileId: agreementId,
                status: "documents under review",
            },
        });
    };
}
