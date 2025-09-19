import z from "zod"
import {
    updateAuctionAccessRequestSchema,
    userAuctionAccessSchema
} from "./schemas"

export type UpdateAuctionAccessRequest = z.infer<typeof updateAuctionAccessRequestSchema>
export type UserAuctionAccessSchema = z.infer<typeof userAuctionAccessSchema>

export type UserAuctionAccessSchemaSteps = UserAuctionAccessSchema['step']