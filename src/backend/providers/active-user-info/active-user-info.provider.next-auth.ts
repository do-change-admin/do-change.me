import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import type { ActiveUserInfoProvider } from './active-user-info.provider';

export class NextAuthActiveUserInfoProvider implements ActiveUserInfoProvider {
    private async getCurrentUser() {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return null;
        }

        return {
            id: session.user.id,
            email: session.user.email
        };
    }

    isLoggedIn: ActiveUserInfoProvider['isLoggedIn'] = async () => {
        const user = await this.getCurrentUser();

        return !!user;
    };

    userId: ActiveUserInfoProvider['userId'] = async () => {
        const user = await this.getCurrentUser();

        return user?.id ?? null;
    };
}
