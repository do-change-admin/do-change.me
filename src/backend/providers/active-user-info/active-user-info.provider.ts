export type ActiveUserInfoProvider = {
    isLoggedIn: () => Promise<boolean>;
    userId: () => Promise<string | null>;
};
