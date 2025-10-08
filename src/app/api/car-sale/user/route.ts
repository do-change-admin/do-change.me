import * as Get from './get'
import * as Post from './post'

export const GET = Get.method
export const POST = Post.method

export type CarSaleUserAPI = {
    GET: Get.Method,
    POST: Post.Method
}