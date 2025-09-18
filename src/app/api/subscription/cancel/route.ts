import * as Delete from "./delete";

export const DELETE = Delete.handler;

export type SubscriptionCancelAPI = { DELETE: Delete.Method };
