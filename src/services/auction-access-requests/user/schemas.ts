import z from "zod";



/**
 * Payload for user's updates for auction access.
 */
export const updateAuctionAccessRequestSchema = z.object({
    selectedTimeSlotId: z.string().optional(),
    userMail: z.email()
})

export const userAuctionAccessSchema = z.object({
    step: z.enum(['application', 'call', 'documents', 'awaiting for payment', 'approved', 'rejected']),
    status: z.enum(['active', 'pending']),
    timeSlots: z.array(
        z.object({
            id: z.string(),
            date: z.date()
        })
    ),
    activeTimeSlot: z.object({
        id: z.string(),
        date: z.date()
    }).nullable()
})

