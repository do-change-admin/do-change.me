import z from "zod";

/**
 * All possible statuses for auction access request.
 */
export const auctionAccessRequestStatusSchema = z.enum([
    'review',
    'approved',
    'rejected',
    'scheduling',
    'onboarding'
])

/**
 * Auction access request without detailed information.
 */
export const auctionAccessRequestListSchema = z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    birthDate: z.date(),
    photoLink: z.url(),
    status: z.union([
        z.object({
            status: z.intersection(auctionAccessRequestStatusSchema, z.enum(['review', 'approved', 'rejected']))
        }),
        z.object({
            status: z.intersection(auctionAccessRequestStatusSchema, z.enum(['scheduling'])),
            substatus: z.enum([
                'awaiting user confirmation',
                'call scheduling',
                'call completed'
            ])
        }),
        z.object({
            status: z.intersection(auctionAccessRequestStatusSchema, z.enum(['onboarding'])),
            substatus: z.enum([
                'awaiting documents upload',
                'documents under review',
                'corrections required',
                'ready for auction access'
            ])
        })
    ])
})