import z from "zod";

export const schema = z.object({
    src: z.url(),
    alt: z.string().optional()
})

export type Model = z.infer<typeof schema>

export const areSame = (a: Model, b: Model) => {
    return a.src === b.src
}