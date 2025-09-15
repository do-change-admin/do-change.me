import z from "zod"
import { auctionAccessRequestListSchema, auctionAccessRequestStatusSchema } from "./schemas"

export type AuctionAccessRequestStatus = z.infer<typeof auctionAccessRequestStatusSchema>
export type AuctionAccessRequestListItem = z.infer<typeof auctionAccessRequestListSchema>
