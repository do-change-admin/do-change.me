import * as Get from './get'
import * as Patch from './patch'

export const GET = Get.method
export const PATCH = Patch.method

export type CarSaleSellsAPI = {
    GET: Get.Method,
    PATCH: Patch.Method
}