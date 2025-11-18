import { businessError } from "@/lib-deprecated/errors";
import { VercelBlobFileSystemProvider } from "@/backend/providers/implementations";
import { ProfileService } from "@/backend/services";
import { EmailAddress } from "@/value-objects/email-address.vo";

export const noSubscriptionGuard = async ({ activeUser }: {
    activeUser: {
        id: string;
    }
}) => {
    // const service = new ProfileService(
    //     activeUser.id,
    //     // TODO - change with DI-ed version
    //     new VercelBlobFileSystemProvider()
    // )
    // const { subscription } = await service.profileData() || {}

    // if (!subscription) {
    //     throw businessError('No subscription was found', undefined, 402)
    // }

}