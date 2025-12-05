import { DIContainer } from '@/backend/di-containers';

const controller = DIContainer().UserSyndicationRequestDraftsController();

export const GET = controller.Details_GET;
