import { VehicleBaseInfoDTO } from "@/app/api/vin/base-info/models";
import { PricesResultDTO } from "@/app/api/vin/market-value/models";
import { getServerSession } from "next-auth";
import { prismaClient } from "@/backend/infrastructure/prisma/client";

export type Item = { registeredAt: Date } & (
    | {
        target: "report";
        payload: {
            vin: string;
            service: "carfax" | "autocheck";
            result: { type: string; data: string };
        };
    }
    | {
        target: "base info";
        payload: { vin: string; result: VehicleBaseInfoDTO };
    }
    | {
        target: "market value";
        payload: { vin: string; mileage: number; result: PricesResultDTO };
    }
    | {
        target: "salvage";
        payload: { vin: string; result: boolean };
    }
);

export type VinAnalysisResult = Record<
    string,
    {
        registeredAt: Date;
        mileage: number;
        baseInfo: VehicleBaseInfoDTO;
        marketValue: PricesResultDTO;
        carfax?: {
            type: string;
            data: string;
        };
        autocheck?: {
            type: string;
            data: string;
        };
        salvage: boolean;
    }
>;

export const getCurrentUserMail = async () => {
    const session = await getServerSession();
    if (!session) {
        throw new Error("No server session was found");
    }
    return session.user.email;
};

/**
 * Must be used with try/catch.
 */
export const Register = async (item: Omit<Item, "registeredAt">) => {
    const userMail = await getCurrentUserMail();
    const action = await prismaClient.action.create({
        data: {
            userMail,
            target: item.target,
            payload: JSON.stringify(item.payload),
            registeredAt: new Date(),
        },
    });
    return action.id;
};

/**
 * Must be used with try/catch.
 */
export const ShowCurrentHistory = async (): Promise<VinAnalysisResult> => {
    const userMail = await getCurrentUserMail();
    const data = await prismaClient.action.findMany({
        where: { userMail },
        orderBy: { registeredAt: "desc" },
    });
    const result = data.map(
        ({ target, payload, registeredAt }) =>
        ({
            target,
            payload: payload.startsWith("{")
                ? JSON.parse(payload)
                : payload,
            registeredAt,
        } as Item)
    );

    const toReturn = result.reduce((accumulator, currentItem) => {
        const vin = currentItem.payload.vin;
        if (!accumulator[vin]) {
            // @ts-ignore
            accumulator[vin] = {};
        }

        if (currentItem.target === "base info") {
            accumulator[vin].baseInfo = currentItem.payload.result;
            accumulator[vin].registeredAt = currentItem.registeredAt;
        }

        if (currentItem.target === "market value") {
            accumulator[vin].marketValue = currentItem.payload.result;
            accumulator[vin].mileage = currentItem.payload.mileage;
        }

        if (currentItem.target === "report") {
            accumulator[vin][currentItem.payload.service] =
                currentItem.payload.result;
        }

        if (currentItem.target === "salvage") {
            accumulator[vin].salvage = currentItem.payload.result;
        }

        return accumulator;
    }, {} as VinAnalysisResult);

    return toReturn;
};
