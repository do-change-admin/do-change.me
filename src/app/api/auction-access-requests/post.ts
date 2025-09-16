import { AuctionAccessRequestsService } from "@/services";
import { zodApiMethod, ZodAPIMethod } from "../zod-api-methods";

export type Method = ZodAPIMethod<undefined, undefined, undefined>

export const handler = zodApiMethod(undefined, undefined, undefined, async ({ activeUser }) => {
    const service = new AuctionAccessRequestsService()
    await service.create(activeUser.email)
})