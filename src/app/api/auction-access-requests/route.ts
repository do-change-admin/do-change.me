import * as Get from './get'
import * as Post from './post'
import * as Patch from './patch'

export const GET = Get.handler
export const POST = Post.handler
export const PATCH = Patch.handler

export type AuctionAccessRequestsAPI = {
    POST: Post.Method,
    GET: Get.Method,
    PATCH: Patch.Method
}