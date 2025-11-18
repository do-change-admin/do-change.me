import { ZodControllerMetadata } from "@/backend/utils/zod-controller.utils";
import { VIN } from "@/value-objects/vin.value-object";
import z from "zod";

export default {
    name: 'Vehicle analysis',
    schemas: {
        /**
         * Obtains HTML markup for vehicle by VIN number.
         */
        GET_Report: {
            body: undefined,
            query: z.object({
                vin: VIN.schema
            }),
            response: z.object({
                htmlMarkup: z.string()
            }),
        }
    }
} satisfies ZodControllerMetadata