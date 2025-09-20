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
    photoLink: z.string(),
    status: auctionAccessRequestStatusSchema
})

/**
 * Auction access request with detailed information.
 */
export const auctionAccessRequestFullSchema = z.object({
    id: z.string(),
    firstName: z.string(),
    email: z.email(),
    applicationDate: z.date(),
    lastName: z.string(),
    birthDate: z.date(),
    photoLink: z.string(),
    bio: z.string(),
    status: auctionAccessRequestStatusSchema,
    timeSlots: z.array(
        z.object({
            id: z.string(),
            date: z.date()
        })
    ),
    activeTimeSlot: z.object({
        id: z.string(),
        date: z.date()
    }).nullable(),
    links: z.object({
        agreement: z.string().nullable(),
        driverLicence: z.string().nullable()
    }),
    auctionAccessNumber: z.string().optional()
})

/**
 * Payload for admin's updates for auction access.
 */
export const adminUpdateAuctionAccessRequestSchema = z.object({
    id: z.string(),
    progress: z.enum(['next approve step', 'reject']).optional(),
    availableTimeSlots: z.array(z.object({ date: z.coerce.date() })).nonempty().optional(),
})


