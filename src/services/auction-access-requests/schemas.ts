import z from "zod";

/**
 * All possible statuses for auction access request.
 */
export const auctionAccessRequestStatusSchema = z.enum([
    'review',
    'approved',
    'rejected',
    'awaiting user confirmation',
    'call scheduling',
    'call completed',
    'awaiting documents upload',
    'documents under review',
    'corrections required',
    'ready for auction access'
])


/**
 * Auction access request without detailed information.
 */
export const auctionAccessRequestListSchema = z.object({
    id: z.string(),
    firstName: z.string(),
    email: z.email(),
    applicationDate: z.date(),
    lastName: z.string(),
    birthDate: z.date(),
    photoLink: z.url(),
    status: auctionAccessRequestStatusSchema
})