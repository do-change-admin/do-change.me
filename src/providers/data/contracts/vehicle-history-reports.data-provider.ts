import { VinSchema } from "@/schemas";
import z from "zod";

export const itemSchema = z.object({
    htmlMarkup: z.string().nonempty()
})

export const findOnePayloadSchema = z.object({
    vin: VinSchema
})

export type Item = z.infer<typeof itemSchema>
export type FindOnePayload = z.infer<typeof findOnePayloadSchema>

export type Interface = {
    findOne: (payload: FindOnePayload) => Promise<Item>
}