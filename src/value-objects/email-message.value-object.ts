import z from "zod";

export const schema = z.object({
    from: z.email(),
    to: z.email(),
    subject: z.string(),
    content: z.string()
})

export type Model = z.infer<typeof schema>

export const areSame = (a: Model, b: Model) => {
    return a.from === b.from
        && a.to === b.to
        && a.subject === b.subject
        && a.content === b.content
}