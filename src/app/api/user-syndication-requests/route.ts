import { DIContainer } from '@/backend/di-containers';

const controller = DIContainer().UserSyndicationRequestsController();

export const GET = controller.GET;
export const POST = controller.POST;
