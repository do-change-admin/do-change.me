import { ZodAPIMethod, ZodAPISchemas } from "@/app/api/zod-api-methods";
import { carForSaleUserListSchema } from "@/entities";
import { Services } from "@/services";
import z from "zod";

export const GET_Schemas = {
    body: undefined,
    query: Services.CarSaleUser.findCarsPayloadSchema,
    response: z.object({
        items: z.array(carForSaleUserListSchema)
    })
} satisfies ZodAPISchemas

export const POST_Schemas = {
    body: undefined,
    query: Services.CarSaleUser.postCarPayloadSchema.omit({
        mileage: true,
        price: true,
        year: true
    }).extend({
        mileage: z.coerce.number(),
        price: z.coerce.number(),
        year: z.coerce.number()
    }),
    response: undefined
} satisfies ZodAPISchemas

export type API = {
    GET: ZodAPIMethod<typeof GET_Schemas>,
    POST: ZodAPIMethod<typeof POST_Schemas>
}

