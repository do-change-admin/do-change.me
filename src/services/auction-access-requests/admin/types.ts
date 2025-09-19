import z from "zod"
import {
    adminUpdateAuctionAccessRequestSchema,
    auctionAccessRequestFullSchema,
    auctionAccessRequestListSchema,
    auctionAccessRequestStatusSchema,
} from "./schemas"

export type AuctionAccessRequestStatus = z.infer<typeof auctionAccessRequestStatusSchema>
export type AuctionAccessRequestListItem = z.infer<typeof auctionAccessRequestListSchema>
export type AuctionAccessRequestFullItem = z.infer<typeof auctionAccessRequestFullSchema>
export type AdminUpdateAuctionAccessRequest = z.infer<typeof adminUpdateAuctionAccessRequestSchema>
