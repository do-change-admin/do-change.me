import z from "zod";

export class VIN {
    static schema = z.string().min(17).max(17)

    public constructor(private readonly value: string) {

    }

    static create = (rawValue: string) => {
        return new VIN(
            VIN.schema.parse(rawValue)
        )
    }

    model = (): VINModel => {
        return {
            value: this.value
        }
    }

    same = (vin: VIN) => {
        return this.value === vin.value
    }
}

export type VINModel = {
    value: string
};