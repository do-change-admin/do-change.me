import z from "zod";
import { profileSchema, updateProfileSchema } from "./profile.schemas";

export type ProfileData = z.infer<typeof profileSchema>

export type UpdateProfilePayload = z.infer<typeof updateProfileSchema>