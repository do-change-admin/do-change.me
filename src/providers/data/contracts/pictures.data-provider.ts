import { ValueObjects } from "@/value-objects";
import z from "zod";

export const itemSchema = ValueObjects.Picture.schema.extend({
    id: z.string().nonempty()
}).omit({
    alt: true
})

export type Item = z.infer<typeof itemSchema>

export type Interface = {
    add: (pictureFile: File) => Promise<{ id: string, success: true } | { id: null, success: false }>,
    findOne: (id: string) => Promise<Item | null>,
}