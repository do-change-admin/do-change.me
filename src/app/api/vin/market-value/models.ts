import z from "zod";
import { marketPricesSchema } from "./get";

export type PricesResultDTO = z.infer<typeof marketPricesSchema>
