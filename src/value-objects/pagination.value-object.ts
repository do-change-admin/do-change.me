import z from "zod";

export const schema = z.object({
    zeroBasedIndex: z.coerce.number().nonnegative(),
    pageSize: z.coerce.number().positive()
})

export type Model = z.infer<typeof schema>

export const areSame = (a: Model, b: Model) => {
    return a.pageSize === b.pageSize && a.zeroBasedIndex === b.zeroBasedIndex
}