import { businessError } from "@/lib-deprecated/errors";
import { VercelBlobFileSystemProvider } from "@/backend/providers/implementations";
import { ProfileService } from "@/backend/services";
import { EmailAddress } from "@/value-objects/email-address.value-object";

export const noSubscriptionGuard = async ({
    activeUser,
}: {
    activeUser: {
        id: string;
        email: string;
    };
}) => {
    const service = new ProfileService(
        EmailAddress.create(activeUser.email),
        new VercelBlobFileSystemProvider()
    );
    const { subscription } = (await service.profileData()) || {};

    if (!subscription) {
        throw businessError("No subscription was found", undefined, 402);
    }
};
