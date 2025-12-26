import type { ActiveUserInfoProvider } from './active-user-info.provider';

export class MockActiveUserInfoProvider implements ActiveUserInfoProvider {
    static activeUserId = 'ACTIVE-USER-ID';

    isLoggedIn: ActiveUserInfoProvider['isLoggedIn'] = async () => true;
    userId: ActiveUserInfoProvider['userId'] = async () => MockActiveUserInfoProvider.activeUserId;
}
