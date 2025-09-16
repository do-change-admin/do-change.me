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

/**
 * Possible time slots
 */
export const timeSlotSchema = z.object({
    id: z.string(),
    date: z.date()
})

/**
 * Payload for admin's updates for auction access.
 */
export const adminUpdateAuctionAccessRequestSchema = z.object({
    progress: z.enum(['next approve step', 'reject']).optional(),
    availableTimeSlots: z.array(timeSlotSchema).optional(),
})

/**
 * Payload for user's updates for auction access.
 */
export const updateAuctionAccessRequestSchema = z.object({
    selectedTimeSlotId: z.string().optional()
})