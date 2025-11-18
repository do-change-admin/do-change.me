import { DIContainer } from '@/backend/di-containers'

const controller = DIContainer().VehicleAnalysisControler()

export const GET = controller.GET_Report