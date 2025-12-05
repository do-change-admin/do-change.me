export const noSubscriptionGuard = async ({
    activeUser
}: {
    activeUser: {
        id: string;
        email: string;
    };
}) => {
    // const service = new ProfileService(EmailAddress.create(activeUser.email), new VercelBlobFileSystemProvider());
    // const { subscription } = (await service.profileData()) || {};
    // if (!subscription) {
    //     throw businessError('No subscription was found', undefined, 402);
    // }
};
