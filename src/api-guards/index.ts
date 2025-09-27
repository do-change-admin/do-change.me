import { businessError } from "@/lib/errors";
import { VercelBlobFileSystemProvider } from "@/providers/implementations";
import { ProfileService } from "@/services";
import { EmailAddress } from "@/value-objects/email-address.vo";

export const noSubscriptionsGuard = async ({ activeUser }: {
    activeUser: {
        id: string;
        email: string;
    }
}) => {
    const service = new ProfileService(
        EmailAddress.create(activeUser.email),
        new VercelBlobFileSystemProvider()
    )
    const { subscription } = await service.profileData() || {}

    if (!subscription) {
        throw businessError('No subscription was found', undefined, 402)
    }

}