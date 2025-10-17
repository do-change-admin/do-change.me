import { DIContainer } from '@/di-containers'

const controller = DIContainer().CarSaleUserController()

export const GET = controller.GET
export const POST = controller.POST