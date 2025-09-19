import * as Delete from "./delete";
import * as Post from "./post";

export const DELETE = Delete.handler;
export const POST = Post.handler;

export type SubscriptionsAPI = { POST: Post.Method; DELETE: Delete.Method };
