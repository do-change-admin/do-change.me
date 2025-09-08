import presetData from "./presetData";
import { prismaClient } from "@/infrastructure/prisma/client";

export const getBaseData = async (vin: string) => {
    const baseInfoURL =
        process.env.BASE_INFO_API_URL
    if (!baseInfoURL) {
        return presetData;
    }

    const apiAnswer = await fetch(`${baseInfoURL}/${vin}?format=json`);
    const json = await apiAnswer.json();

    if (json?.Results?.[0]) {
        await prismaClient.vinCheckResult.deleteMany({
            where: { VIN: vin }
        })
        await prismaClient.vinCheckResult.create({ data: json?.Results?.[0] }) ?? [];
        return json?.Results?.[0];
    }

    return undefined;
};
