import { VinSchema } from "@/schemas";
import z from "zod";

export const reportSchema = z.object({
    htmlMarkup: z.string().nonempty()
})

export const findReportPayloadSchema = z.object({
    vin: VinSchema
})

export type Report = z.infer<typeof reportSchema>
export type FindReportPayload = z.infer<typeof findReportPayloadSchema>

export type Interface = {
    findReport: (payload: FindReportPayload) => Promise<Report>
}