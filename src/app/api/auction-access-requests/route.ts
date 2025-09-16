import * as Get from './get'
import * as Post from './post'

export const GET = Get.handler
export const POST = Post.handler

export type AuctionAccessRequestsAPI = {
    POST: Post.Method,
    GET: Get.Method
}