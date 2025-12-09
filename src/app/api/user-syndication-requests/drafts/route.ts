import { DIContainer } from '@/backend/di-containers';

const controller = DIContainer().UserSyndicationRequestDraftsController();

export const GET = controller.GET;
export const POST = controller.POST;
export const PATCH = controller.PATCH;
