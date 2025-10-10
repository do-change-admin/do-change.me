import * as Get from './get'
import * as Post from './post'
import * as Patch from './patch'

export const GET = Get.method
export const POST = Post.method
export const PATCH = Patch.method

export type CarSaleUserDraftDetailsAPI = {
    GET: Get.Method,
    POST: Post.Method,
    PATCH: Patch.Method
}