import z from "zod";
import { baseVehicleInfoSchema } from "./schemas";

export type VehicleBaseInfoDTO = z.infer<typeof baseVehicleInfoSchema>