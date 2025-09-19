import * as Get from './get'
import * as Patch from './patch'

export const GET = Get.handler
export const PATCH = Patch.handler

export type AuctionAccessRequestsAdminAPI = {
    GET: Get.Method,
    PATCH: Patch.Method
}
