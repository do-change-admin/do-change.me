import z from "zod"
import {
    adminUpdateAuctionAccessRequestSchema,
    auctionAccessRequestFullSchema,
    auctionAccessRequestListSchema,
    auctionAccessRequestStatusSchema,
    updateAuctionAccessRequestSchema,
    userAuctionAccessSchema
} from "./schemas"

export type AuctionAccessRequestStatus = z.infer<typeof auctionAccessRequestStatusSchema>
export type AuctionAccessRequestListItem = z.infer<typeof auctionAccessRequestListSchema>
export type AuctionAccessRequestFullItem = z.infer<typeof auctionAccessRequestFullSchema>
export type UpdateAuctionAccessRequest = z.infer<typeof updateAuctionAccessRequestSchema>
export type AdminUpdateAuctionAccessRequest = z.infer<typeof adminUpdateAuctionAccessRequestSchema>
export type UserAuctionAccessSchema = z.infer<typeof userAuctionAccessSchema>

export type UserAuctionAccessSchemaSteps = UserAuctionAccessSchema['step']