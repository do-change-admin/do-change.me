import z from "zod";

export const CreateCheckoutRequest = z.object({
    priceId: z.string().nonempty(),
});

export type CreateCheckoutSchema = z.infer<typeof CreateCheckoutRequest>;

export const CreateCheckoutResponce = z.object({
    url: z.string().nonempty(),
});

export type CreateCheckoutResponceSchema = z.infer<
    typeof CreateCheckoutResponce
>;
