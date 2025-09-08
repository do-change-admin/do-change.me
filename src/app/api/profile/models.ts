export type Profile_GET_Response = {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    bio: string;
}

export type Profile_PATCH_Payload = Partial<Omit<Profile_GET_Response, 'email'>>