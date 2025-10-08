import z from "zod";

export const paginationSchema = z.object({
    zeroBasedIndex: z.coerce.number().nonnegative(),
    pageSize: z.coerce.number().positive()
})

export type PaginationModel = z.infer<typeof paginationSchema>