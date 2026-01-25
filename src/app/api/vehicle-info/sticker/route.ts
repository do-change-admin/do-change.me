import { DIContainer } from '@/backend/di-containers';

const controller = DIContainer().VehicleInfoController();

export const GET = controller.sticker_GET;
