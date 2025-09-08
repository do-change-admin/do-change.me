import z from "zod";

export const PaginationSchema = z.object({
    skip: z.coerce.number(),
    take: z.coerce.number(),
})

export type PaginationSchemaType = z.infer<typeof PaginationSchema>

export const VinSchema = z.string().min(17).max(17)
