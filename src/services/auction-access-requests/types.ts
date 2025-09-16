import z from "zod"
import {
    adminUpdateAuctionAccessRequestSchema,
    auctionAccessRequestListSchema,
    auctionAccessRequestStatusSchema,
    updateAuctionAccessRequestSchema
} from "./schemas"

export type AuctionAccessRequestStatus = z.infer<typeof auctionAccessRequestStatusSchema>
export type AuctionAccessRequestListItem = z.infer<typeof auctionAccessRequestListSchema>
export type UpdateAuctionAccessRequest = z.infer<typeof updateAuctionAccessRequestSchema>
export type AdminUpdateAuctionAccessRequest = z.infer<typeof adminUpdateAuctionAccessRequestSchema>